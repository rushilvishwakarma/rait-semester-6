import { NextRequest, NextResponse } from 'next/server';

const SESSION_TIMEOUT = 15000;
const BASE_URL = 'https://mydy.dypatil.edu/rait';

interface Subject {
    id: number;
    name: string;
}

interface Document {
    id: number;
    name: string;
    mod_type: string;
}

interface CourseDocuments {
    completed: Document[];
    incomplete: Document[];
}

interface Semester {
    name: string;
    subjects: Subject[];
}

// Helper to parse set-cookie headers
function parseCookies(headers: Headers): string[] {
    let cookies: string[] = [];
    if (typeof headers.getSetCookie === 'function') {
        cookies = headers.getSetCookie();
    } else {
        const setCookie = headers.get('set-cookie');
        if (setCookie) cookies.push(setCookie);
    }
    return cookies;
}

// Login to MyDY and return session cookie
async function loginToMyDY(email: string, password: string): Promise<{ success: boolean; cookie?: string; error?: string }> {
    try {
        console.log('Attempting login for:', email);
        let currentUrl = `${BASE_URL}/login/index.php`;
        let method = 'POST';
        let body: URLSearchParams | undefined = new URLSearchParams({
            username: email,
            password: password,
        });

        const cookieJar = new Map<string, string>();
        let redirectCount = 0;
        const maxRedirects = 5;

        while (redirectCount < maxRedirects) {
            const cookieHeader = Array.from(cookieJar.entries()).map(([k, v]) => `${k}=${v}`).join('; ');

            console.log(`Request [${method}] ${currentUrl}`);
            const response = await fetch(currentUrl, {
                method: method,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                    'Cookie': cookieHeader,
                },
                body: method === 'POST' ? body : undefined,
                redirect: 'manual',
            });

            // Harvest cookies
            const newCookies = parseCookies(response.headers);
            newCookies.forEach(c => {
                const parts = c.split(';');
                if (parts.length > 0) {
                    const [key, value] = parts[0].split('=');
                    if (key) cookieJar.set(key.trim(), value ? value.trim() : '');
                }
            });

            console.log('Status:', response.status);

            if (response.status >= 300 && response.status < 400) {
                const location = response.headers.get('location');
                if (!location) break;

                currentUrl = location;
                method = 'GET';
                body = undefined;
                redirectCount++;
                console.log('Redirecting to:', location);
                continue;
            }

            // If we are here, it's a final response (200 or error)
            const html = await response.text();

            if (html.includes('Invalid login')) {
                console.error('Login failed: Invalid credentials');
                return { success: false, error: 'Invalid credentials' };
            }

            // Success if we have MoodleSession
            if (cookieJar.has('MoodleSession')) {
                const finalCookieHeader = Array.from(cookieJar.entries()).map(([k, v]) => `${k}=${v}`).join('; ');
                console.log('Login success. Cookies:', finalCookieHeader);
                return { success: true, cookie: finalCookieHeader };
            }

            console.error('Login failed: No MoodleSession found after chain');
            return { success: false, error: 'No session cookie received' };
        }

        return { success: false, error: 'Too many redirects' };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: `Network error: ${error}` };
    }
}

// Fetch subjects grouped by semester
async function getSubjects(cookie: string): Promise<Semester[]> {
    try {
        const response = await fetch(`${BASE_URL}/my`, {
            headers: {
                Cookie: cookie, // Use the full cookie string
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            },
            signal: AbortSignal.timeout(SESSION_TIMEOUT),
        });

        const html = await response.text();

        // Debug: Check if we are on the login page
        if (html.includes('login/index.php') || html.includes('Log in to the site')) {
            console.error('getSubjects: Redirected to login page. Cookie might be invalid.');
            return [];
        }

        const semesters: Semester[] = [];
        const seenIds = new Set<number>();

        // Logic to parse semesters
        // Split HTML by 'type_course' class to approximate <li> blocks
        const parts = html.split('class="type_course');

        // Skip first part
        for (let i = 1; i < parts.length; i++) {
            const part = parts[i];

            // Extract semester name: looks for class="usdimmed_text" inside a span
            // Simplified regex to find the content of that span
            const nameMatch = part.match(/class="usdimmed_text"[^>]*>([\s\S]*?)<\/span>/);
            if (!nameMatch) continue;

            const semName = nameMatch[1].replace(/<[^>]+>/g, '').trim();
            const subjects: Subject[] = [];

            // Now find links in this part
            // We need to stop before the next block starts, but 'split' handles that roughly. 
            // However, nested lists might mean we catch too much if we aren't careful, 
            // but type_course is usually top level for categories.

            const anchorRegex = /<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
            let linkMatch;
            while ((linkMatch = anchorRegex.exec(part)) !== null) {
                const href = linkMatch[1];
                const content = linkMatch[2];

                if (href.includes('/course/view.php')) {
                    const idMatch = href.match(/[?&]id=(\d+)/);
                    if (idMatch) {
                        const id = parseInt(idMatch[1]);
                        const name = content.replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');

                        // Avoid duplicates if weird layout
                        if (id && name && !seenIds.has(id)) {
                            subjects.push({ id, name });
                            seenIds.add(id);
                        }
                    }
                }
            }

            if (subjects.length > 0) {
                semesters.push({ name: semName, subjects });
            }
        }

        // Fallback: If no semesters found (maybe different layout or 'All Courses'), try to find generic course list
        if (semesters.length === 0) {
            const allSubjects: Subject[] = [];
            // Scan whole HTML
            const anchorRegex = /<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
            let match;
            while ((match = anchorRegex.exec(html)) !== null) {
                const href = match[1];
                const content = match[2];
                if (href.includes('/course/view.php')) {
                    const idMatch = href.match(/[?&]id=(\d+)/);
                    if (idMatch) {
                        const id = parseInt(idMatch[1]);
                        const name = content.replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
                        if (id && name && !seenIds.has(id)) {
                            allSubjects.push({ id, name });
                            seenIds.add(id);
                        }
                    }
                }
            }
            if (allSubjects.length > 0) {
                semesters.push({ name: 'All Courses', subjects: allSubjects });
            }
        }

        return semesters;
    } catch (error) {
        console.error('Error fetching subjects:', error);
        return [];
    }
}

// Fetch course documents
async function getCourseDocuments(cookie: string, courseId: number): Promise<CourseDocuments> {
    try {
        const response = await fetch(`${BASE_URL}/course/customview.php?id=${courseId}`, {
            headers: {
                Cookie: cookie, // Use full cookie string
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            },
            signal: AbortSignal.timeout(SESSION_TIMEOUT),
        });

        const html = await response.text();
        const completed: Document[] = [];
        const incomplete: Document[] = [];
        const seenDocs = new Set<number>();

        // Regex to find all links, then filter for mod views
        const anchorRegex = /<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
        let match;

        while ((match = anchorRegex.exec(html)) !== null) {
            const href = match[1];
            const content = match[2];
            const fullTag = match[0];

            if (href.includes('/mod/') && href.includes('/view.php')) {
                const idMatch = href.match(/[?&]id=(\d+)/);
                const modMatch = href.match(/\/mod\/([^/]+)\//);

                if (idMatch && modMatch) {
                    const id = parseInt(idMatch[1]);
                    const mod_type = modMatch[1];
                    const name = content.replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');

                    if (!id || seenDocs.has(id)) continue;
                    seenDocs.add(id);

                    const doc = { mod_type, id, name };

                    // Check for completion class
                    if (fullTag.includes('class="') && fullTag.match(/class="[^"]*completed[^"]*"/)) {
                        completed.push(doc);
                    } else {
                        incomplete.push(doc);
                    }
                }
            }
        }

        return { completed, incomplete };
    } catch (error) {
        console.error('Error fetching course documents:', error);
        return { completed: [], incomplete: [] };
    }
}

// Visit a document to mark it as viewed
async function visitDocument(cookie: string, doc: Document): Promise<boolean> {
    try {
        const url = `${BASE_URL}/mod/${doc.mod_type}/view.php?id=${doc.id}`;
        const response = await fetch(url, {
            headers: {
                Cookie: cookie, // Use full cookie string
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                // Add Referer to match logic if needed
                'Referer': `${BASE_URL}/course/customview.php?id=${doc.id}`,
            },
            signal: AbortSignal.timeout(SESSION_TIMEOUT),
        });

        return response.ok && !response.url.includes('login');
    } catch (error) {
        console.error(`Error visiting document ${doc.id}:`, error);
        return false;
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, email, password, cookie, courseId, document } = body;

        switch (action) {
            case 'login': {
                const result = await loginToMyDY(email, password);
                return NextResponse.json(result);
            }

            case 'getSubjects': {
                if (!cookie) {
                    return NextResponse.json({ success: false, error: 'No cookie provided' });
                }
                const semesters = await getSubjects(cookie);
                return NextResponse.json({ success: true, semesters });
            }

            case 'getCourseDocuments': {
                if (!cookie || !courseId) {
                    return NextResponse.json({ success: false, error: 'Missing cookie or courseId' });
                }
                const docs = await getCourseDocuments(cookie, courseId);
                return NextResponse.json({ success: true, ...docs });
            }

            case 'visitDocument': {
                if (!cookie || !document) {
                    return NextResponse.json({ success: false, error: 'Missing cookie or document' });
                }
                const visited = await visitDocument(cookie, document);
                return NextResponse.json({ success: visited });
            }

            default:
                return NextResponse.json({ success: false, error: 'Unknown action' });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: `Server error: ${error}` });
    }
}
