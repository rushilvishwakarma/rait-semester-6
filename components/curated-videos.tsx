import { Play, MonitorPlay, Globe, ExternalLink } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { CuratedResourcesWrapper, CarouselNav } from '@/components/curated-videos-client';
import { YouTubeSearchButton } from '@/components/youtube-search-button';
import { GfgSearchButton } from '@/components/gfg-search-button';
import { cn } from '@/lib/cn';
import Image from 'next/image';
import Link from 'next/link';

// --- Types ---

interface VideoData {
    type: 'video';
    url: string;
    title: string;
    author_name: string;
    thumbnail_url: string;
    provider_name?: string;
}

interface WebsiteData {
    type: 'website';
    url: string;
    title: string;
    description: string;
    image: string;
    favicon: string;
    siteName: string;
    domain: string;
}

type LinkData = VideoData | WebsiteData;

// --- Helpers ---

const VIDEO_HOSTS = [
    'youtube.com', 'youtu.be', 'www.youtube.com',
    'vimeo.com', 'www.vimeo.com',
    'dailymotion.com', 'www.dailymotion.com',
];

function isVideoUrl(url: string): boolean {
    try {
        const hostname = new URL(url).hostname;
        return VIDEO_HOSTS.some(h => hostname === h || hostname.endsWith('.' + h));
    } catch {
        return false;
    }
}

function getDomain(url: string): string {
    try {
        return new URL(url).hostname.replace(/^www\./, '');
    } catch {
        return url;
    }
}

// --- Data fetchers ---

async function getVideoData(url: string): Promise<VideoData | null> {
    try {
        const response = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`, {
            next: { revalidate: 3600 }
        });
        const data = await response.json();
        if (data.error) return null;
        return {
            type: 'video',
            url,
            title: data.title,
            author_name: data.author_name,
            thumbnail_url: data.thumbnail_url,
            provider_name: data.provider_name,
        };
    } catch (e) {
        console.error(`Failed to fetch video data for ${url}`, e);
        return null;
    }
}

function extractMetaContent(html: string, property: string): string {
    // Match both property="..." and name="..." attributes
    const patterns = [
        new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']*)["']`, 'i'),
        new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${property}["']`, 'i'),
    ];
    for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match?.[1]) return match[1];
    }
    return '';
}

function extractTitle(html: string): string {
    const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    return match?.[1]?.trim() ?? '';
}

function extractFavicon(html: string, baseUrl: string): string {
    // Look for <link rel="icon" href="..."> or rel="shortcut icon"
    const patterns = [
        /<link[^>]+rel=["'](?:shortcut )?icon["'][^>]+href=["']([^"']*)["']/i,
        /<link[^>]+href=["']([^"']*)["'][^>]+rel=["'](?:shortcut )?icon["']/i,
    ];
    for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match?.[1]) {
            const href = match[1];
            if (href.startsWith('http')) return href;
            if (href.startsWith('//')) return 'https:' + href;
            try {
                return new URL(href, baseUrl).href;
            } catch {
                return href;
            }
        }
    }
    // Fallback to Google's favicon service
    try {
        const domain = new URL(baseUrl).hostname;
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
        return '';
    }
}

function resolveUrl(src: string, baseUrl: string): string {
    if (!src) return '';
    if (src.startsWith('http')) return src;
    if (src.startsWith('//')) return 'https:' + src;
    try {
        return new URL(src, baseUrl).href;
    } catch {
        return src;
    }
}

async function getWebsiteData(url: string): Promise<WebsiteData | null> {
    try {
        const response = await fetch(url, {
            next: { revalidate: 3600 },
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
                'Accept': 'text/html',
            },
            signal: AbortSignal.timeout(8000),
        });

        if (!response.ok) return null;

        const html = await response.text();

        const ogTitle = extractMetaContent(html, 'og:title');
        const ogDescription = extractMetaContent(html, 'og:description');
        const ogImage = extractMetaContent(html, 'og:image');
        const ogSiteName = extractMetaContent(html, 'og:site_name');
        const metaDescription = extractMetaContent(html, 'description');
        const twitterTitle = extractMetaContent(html, 'twitter:title');
        const twitterDescription = extractMetaContent(html, 'twitter:description');
        const twitterImage = extractMetaContent(html, 'twitter:image');

        const title = ogTitle || twitterTitle || extractTitle(html) || getDomain(url);
        const description = ogDescription || twitterDescription || metaDescription || '';
        const image = resolveUrl(ogImage || twitterImage || '', url);
        const favicon = extractFavicon(html, url);
        const siteName = ogSiteName || getDomain(url);

        return {
            type: 'website',
            url,
            title,
            description,
            image,
            favicon,
            siteName,
            domain: getDomain(url),
        };
    } catch (e) {
        console.error(`Failed to fetch website data for ${url}`, e);
        // Return minimal fallback
        return {
            type: 'website',
            url,
            title: getDomain(url),
            description: '',
            image: '',
            favicon: `https://www.google.com/s2/favicons?domain=${getDomain(url)}&sz=64`,
            siteName: getDomain(url),
            domain: getDomain(url),
        };
    }
}

async function getLinkData(url: string): Promise<LinkData | null> {
    if (isVideoUrl(url)) {
        return getVideoData(url);
    }
    return getWebsiteData(url);
}

// --- URL extraction ---

function extractUrls(children: React.ReactNode): string[] {
    if (typeof children === 'string') {
        return children.split(/\s+/).filter(url => url.startsWith('http'));
    }

    if (Array.isArray(children)) {
        return children.flatMap(child => extractUrls(child));
    }

    if (typeof children === 'object' && children !== null && 'props' in children) {
        // @ts-ignore
        return extractUrls(children.props.children);
    }

    return [];
}

function stripEmojis(text: string): string {
    return text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}\u200d\ufe0f]/gu, '').replace(/\s{2,}/g, ' ').trim();
}

// --- Card components ---

function VideoCard({ video, fullWidth }: { video: VideoData; fullWidth?: boolean }) {
    return (
        <Link
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "group flex flex-row gap-4 rounded-2xl border bg-card text-card-foreground p-2 text-left hover:bg-accent/5 transition-colors",
                fullWidth ? "w-full flex-1" : "w-[400px]",
            )}
        >
            <div className="relative aspect-video w-40 shrink-0 overflow-hidden rounded-xl bg-muted shadow-sm">
                {video.thumbnail_url ? (
                    <Image
                        src={video.thumbnail_url}
                        alt={video.title}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                        sizes="160px"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-muted">
                        <MonitorPlay className="size-8 text-muted-foreground" />
                    </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-transparent">
                    <div className="flex size-10 items-center justify-center rounded-full bg-background/20 backdrop-blur-md shadow-sm opacity-0 transform scale-75 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 ring-1 ring-white/30">
                        <Play className="size-4 fill-foreground text-foreground ml-0.5" />
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-center min-w-0 flex-1 py-1 whitespace-normal">
                <h3 className="font-medium text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-2" title={stripEmojis(video.title)}>
                    {stripEmojis(video.title)}
                </h3>
                <div className="flex items-center text-xs text-muted-foreground truncate">
                    <span>{video.author_name}</span>
                </div>
            </div>
        </Link>
    );
}

function WebsiteCard({ site, fullWidth }: { site: WebsiteData; fullWidth?: boolean }) {
    return (
        <Link
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "group flex flex-row gap-4 rounded-2xl border bg-card text-card-foreground p-2 text-left hover:bg-accent/5 transition-colors",
                fullWidth ? "w-full flex-1" : "w-[400px]",
            )}
        >
            <div className="relative aspect-video w-40 shrink-0 overflow-hidden rounded-xl bg-muted shadow-sm">
                {site.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                        src={site.image}
                        alt={site.title}
                        className="absolute inset-0 h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-muted">
                        <Globe className="size-8 text-muted-foreground" />
                    </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-transparent">
                    <div className="flex size-10 items-center justify-center rounded-full bg-background/20 backdrop-blur-md shadow-sm opacity-0 transform scale-75 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 ring-1 ring-white/30">
                        <ExternalLink className="size-4 text-foreground" />
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-center min-w-0 flex-1 py-1 whitespace-normal">
                <h3 className="font-medium text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-1.5" title={stripEmojis(site.title)}>
                    {stripEmojis(site.title)}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
                    {site.favicon && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={site.favicon} alt="" className="size-3.5 rounded-sm" />
                    )}
                    <span>{site.siteName}</span>
                </div>
            </div>
        </Link>
    );
}

// --- Main component ---

export async function CuratedResources({ children }: { children: React.ReactNode }) {
    const urls = extractUrls(children);
    const uniqueUrls = Array.from(new Set(urls));

    const links = (await Promise.all(
        uniqueUrls.map(url => getLinkData(url))
    )).filter((v): v is LinkData => v !== null);

    if (links.length === 0) return null;

    const fewItems = links.length <= 2;

    return (
        <CuratedResourcesWrapper>
        <div className="relative mt-4 not-prose mb-20">
            <CarouselNav>
            <div className="rounded-3xl border bg-background/50 p-1 overflow-hidden">
                {fewItems ? (
                <div className="flex flex-col md:flex-row gap-1">
                    {links.map((link) =>
                        link.type === 'video'
                            ? <VideoCard key={link.url} video={link} fullWidth />
                            : <WebsiteCard key={link.url} site={link} fullWidth />
                    )}
                </div>
                ) : (
                <ScrollArea className="w-full whitespace-nowrap rounded-md">
                <div className="flex w-max space-x-1">
                    {links.map((link) =>
                        link.type === 'video'
                            ? <VideoCard key={link.url} video={link} />
                            : <WebsiteCard key={link.url} site={link} />
                    )}
                </div>
                <ScrollBar orientation="horizontal" className="h-1.5 top-auto bottom-0 border-t-0" />
            </ScrollArea>
                )}
            </div>
            </CarouselNav>

            <SearchButtons />
        </div>
        </CuratedResourcesWrapper>
    );
}

function SearchButtons() {
    return (
        <div className="absolute -top-4.5 right-2 z-10 flex items-center gap-2">
            <YouTubeSearchButton />
            <GfgSearchButton />
        </div>
    );
}
