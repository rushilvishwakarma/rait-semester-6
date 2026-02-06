'use client';

import { useState, useEffect } from 'react';
import { PlayCircle, Loader2, CheckCircle, XCircle, RefreshCw, BookOpen, Layers } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buttonVariants } from './ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from './ui/dialog';

const CREDENTIALS_KEY = 'mydy_credentials';

interface Subject {
    id: number;
    name: string;
}

interface Semester {
    name: string;
    subjects: Subject[];
}

interface Document {
    id: number;
    name: string;
    mod_type: string;
}

type Status = 'idle' | 'logging-in' | 'fetching-subjects' | 'fetching-docs' | 'processing' | 'done' | 'error';

function getStoredCredentials(): { email: string; password: string } | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(CREDENTIALS_KEY);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (parsed && typeof parsed.email === 'string' && typeof parsed.password === 'string') {
                return { email: parsed.email, password: parsed.password };
            }
            return null;
        } catch {
            return null;
        }
    }
    return null;
}

function storeCredentials(email: string, password: string) {
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify({ email, password }));
}

export function CourseProgressor() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Auth State
    const [status, setStatus] = useState<Status>('idle');
    const [error, setError] = useState<string | null>(null);
    const [cookie, setCookie] = useState<string | null>(null);

    // Data State
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null);

    // Progress State
    const [currentSubjectName, setCurrentSubjectName] = useState<string | null>(null);
    const [currentDocName, setCurrentDocName] = useState<string | null>(null);
    const [totalDocsInRun, setTotalDocsInRun] = useState(0);
    const [processedDocsInRun, setProcessedDocsInRun] = useState(0);
    const [completedInRun, setCompletedInRun] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        const creds = getStoredCredentials();
        if (creds) {
            setEmail(creds.email || '');
            setPassword(creds.password || '');
        }
    }, [isOpen]);

    const addLog = (msg: string) => {
        setLogs(prev => [...prev.slice(-4), msg]);
    };

    const reset = () => {
        setStatus('idle');
        setError(null);
        setSemesters([]);
        setSelectedSemester(null);
        setCookie(null);
        setLogs([]);
        setTotalDocsInRun(0);
        setProcessedDocsInRun(0);
        setCompletedInRun(0);
    };

    const handleStart = async () => {
        if (!email || !password) {
            setError('Please enter credentials');
            return;
        }

        storeCredentials(email, password);
        setError(null);
        setStatus('logging-in');

        try {
            // Login
            const loginRes = await fetch('/api/mydy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'login', email, password }),
            });
            const loginData = await loginRes.json();

            if (!loginData.success) {
                setError(loginData.error || 'Login failed');
                setStatus('error');
                return;
            }

            setCookie(loginData.cookie);
            setStatus('fetching-subjects');

            // Fetch subjects (semesters)
            const subjectsRes = await fetch('/api/mydy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'getSubjects', cookie: loginData.cookie }),
            });
            const subjectsData = await subjectsRes.json();

            if (!subjectsData.success || !subjectsData.semesters?.length) {
                setError('No subjects found');
                setStatus('error');
                return;
            }

            setSemesters(subjectsData.semesters);
            setStatus('idle');
        } catch (err) {
            setError(`Error: ${err}`);
            setStatus('error');
        }
    };

    const handleSelectSemester = async (semester: Semester) => {
        if (!cookie) return;

        setSelectedSemester(semester);
        setStatus('processing');
        setError(null);
        setLogs([]);
        setCompletedInRun(0);
        setProcessedDocsInRun(0);
        setTotalDocsInRun(0); // We don't know total until we scan each subject, so we'll just count up

        try {
            for (const subject of semester.subjects) {
                setCurrentSubjectName(subject.name);
                addLog(`Fetching: ${subject.name}`);

                // Fetch docs for this subject
                const docsRes = await fetch('/api/mydy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'getCourseDocuments', cookie, courseId: subject.id }),
                });
                const docsData = await docsRes.json();

                if (!docsData.success) {
                    addLog(`Failed to load ${subject.name} - skipping`);
                    continue;
                }

                const incomplete: Document[] = docsData.incomplete || [];
                if (incomplete.length === 0) {
                    addLog(`${subject.name}: All caught up!`);
                    continue;
                }

                addLog(`${subject.name}: ${incomplete.length} pending items`);

                // Process incomplete docs
                for (const doc of incomplete) {
                    setCurrentDocName(doc.name);

                    // Random delay
                    await new Promise(r => setTimeout(r, 2000 + Math.random() * 3000));

                    const visitRes = await fetch('/api/mydy', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'visitDocument', cookie, document: doc }),
                    });
                    const visitData = await visitRes.json();

                    if (visitData.success) {
                        setCompletedInRun(prev => prev + 1);
                    }

                    setProcessedDocsInRun(prev => prev + 1);
                }
            }

            setStatus('done');
            setCurrentSubjectName(null);
            setCurrentDocName(null);
            addLog('Finished processing all subjects!');
        } catch (err) {
            setError(`Error: ${err}`);
            setStatus('error');
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="group flex items-center gap-4 rounded-xl border bg-fd-card p-5 transition-colors hover:bg-fd-accent text-left w-full shadow-sm"
            >
                <div className="rounded-lg border bg-fd-background p-3">
                    <PlayCircle className="size-5 text-fd-muted-foreground" />
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-lg">Course Progressor</p>
                    <p className="text-sm text-fd-muted-foreground">
                        Auto-complete your entire semester's views
                    </p>
                </div>
            </button>

            <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) reset(); }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-full">
                                <Layers className="size-5 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <DialogTitle className="text-center text-xl">MyDY Progressor</DialogTitle>
                        <DialogDescription className="text-center">
                            Select a semester to auto-complete all materials
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 space-y-4">
                        {/* Error Display */}
                        {error && (
                            <div className="flex items-start gap-3 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-3 rounded-lg text-sm border border-red-100 dark:border-red-900/50">
                                <XCircle className="size-4 shrink-0 mt-0.5" />
                                <p>{error}</p>
                            </div>
                        )}

                        {/* Login Form */}
                        {semesters.length === 0 && status !== 'done' && (
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Student Email"
                                        className="w-full rounded-lg border bg-fd-secondary/30 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20"
                                        disabled={status !== 'idle' && status !== 'error'}
                                    />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password"
                                        className="w-full rounded-lg border bg-fd-secondary/30 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20"
                                        disabled={status !== 'idle' && status !== 'error'}
                                    />
                                </div>
                                <button
                                    onClick={handleStart}
                                    disabled={status === 'logging-in' || status === 'fetching-subjects'}
                                    className={cn(
                                        buttonVariants({ color: 'primary', className: 'w-full rounded-lg' }),
                                    )}
                                >
                                    {status === 'logging-in' || status === 'fetching-subjects' ? (
                                        <><Loader2 className="size-4 animate-spin mr-2" /> Connecting...</>
                                    ) : (
                                        'Connect to MyDY'
                                    )}
                                </button>
                                <p className="text-xs text-center text-fd-muted-foreground">
                                    Your credentials are stored locally.
                                </p>
                            </div>
                        )}

                        {/* Semester Selection */}
                        {semesters.length > 0 && !selectedSemester && status === 'idle' && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <p className="text-sm font-medium text-fd-foreground px-1">Select Semester:</p>
                                <div className="grid gap-2 max-h-[300px] overflow-y-auto pr-1">
                                    {semesters.map((sem, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSelectSemester(sem)}
                                            className="flex items-center justify-between w-full p-3 rounded-lg border bg-fd-secondary/20 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800 transition-all text-left group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <BookOpen className="size-4 text-fd-muted-foreground group-hover:text-blue-500" />
                                                <span className="font-medium text-sm">{sem.name}</span>
                                            </div>
                                            <div className="text-xs px-2 py-0.5 rounded-full bg-fd-secondary text-fd-muted-foreground">
                                                {sem.subjects.length} subjects
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Processing View */}
                        {(status === 'processing' || status === 'fetching-docs') && selectedSemester && (
                            <div className="space-y-4 animate-in fade-in zoom-in-95">
                                <div className="text-center space-y-1">
                                    <h3 className="font-semibold text-lg">{selectedSemester.name}</h3>
                                    <p className="text-sm text-fd-muted-foreground">Processing subjects...</p>
                                </div>

                                <div className="bg-fd-secondary/30 rounded-lg p-4 space-y-3 border">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-medium text-blue-600 dark:text-blue-400">
                                            {currentSubjectName || 'Preparing...'}
                                        </span>
                                        {currentDocName && <Loader2 className="size-3 animate-spin text-fd-muted-foreground" />}
                                    </div>

                                    {currentDocName ? (
                                        <div className="text-xs text-fd-muted-foreground truncate border-l-2 border-blue-500 pl-2">
                                            Visiting: {currentDocName}
                                        </div>
                                    ) : (
                                        <div className="h-4" />
                                    )}

                                    {/* Progress Stats */}
                                    <div className="grid grid-cols-2 gap-2 pt-2">
                                        <div className="bg-background rounded p-2 text-center border">
                                            <div className="text-xl font-bold">{processedDocsInRun}</div>
                                            <div className="text-[10px] uppercase tracking-wider text-fd-muted-foreground">Visited</div>
                                        </div>
                                        <div className="bg-background rounded p-2 text-center border">
                                            <div className="text-xl font-bold text-green-600">{completedInRun}</div>
                                            <div className="text-[10px] uppercase tracking-wider text-fd-muted-foreground">Completed</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Log output */}
                                <div className="bg-black/5 dark:bg-black/30 rounded p-2 text-xs font-mono h-24 overflow-hidden flex flex-col justify-end">
                                    {logs.map((log, i) => (
                                        <div key={i} className="truncate text-fd-muted-foreground">
                                            &gt; {log}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Done View */}
                        {status === 'done' && (
                            <div className="text-center space-y-4 animate-in zoom-in-95 duration-300">
                                <div className="mx-auto size-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                    <CheckCircle className="size-8 text-green-600 dark:text-green-500" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-lg">All Done!</h3>
                                    <p className="text-sm text-fd-muted-foreground">
                                        Successfully processed {selectedSemester?.name}
                                    </p>
                                </div>
                                <div className="p-3 bg-fd-secondary/20 rounded-lg border">
                                    <p className="text-sm font-medium">
                                        Marked <span className="text-green-600 font-bold">{completedInRun}</span> new items as complete.
                                    </p>
                                    <p className="text-xs text-fd-muted-foreground mt-1">
                                        Total {processedDocsInRun} documents scanned.
                                    </p>
                                </div>
                                <button
                                    onClick={reset}
                                    className={cn(buttonVariants({ color: 'secondary', size: 'sm' }), 'w-full gap-2')}
                                >
                                    <RefreshCw className="size-4" /> Start Over
                                </button>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
