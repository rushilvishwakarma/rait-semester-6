'use client';
import { FileText, ChevronDown, MessageCircleIcon, Presentation, GraduationCap, Info } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buttonVariants } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { cva } from 'class-variance-authority';
import { useMemo, useState, useCallback } from 'react';
import { rainbowButtonVariants } from './ui/rainbow-button';

const optionVariants = cva(
  'inline-flex items-center gap-2 rounded-full p-2 text-start text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground [&_svg]:size-4',
);

interface TheoryCardProps {
  title: string;
  description: string;
  href?: string;
  contextUrl?: string;
  curatedHref?: string;
  showAskAi?: boolean;
  presentationLabel?: string;
  curatedLabel?: string;
}

export function TheoryCard({ title, description, href, contextUrl, curatedHref, showAskAi = true, presentationLabel = 'Open Presentation', curatedLabel = 'Curated Notes' }: TheoryCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const handlePresentationClick = useCallback((url: string) => {
    setPendingHref(url);
    setShowModal(true);
  }, []);

  const handleContinue = useCallback(() => {
    if (pendingHref) {
      let finalHref = pendingHref;
      try {
        const url = new URL(pendingHref);
        if (url.hostname.includes('drive.google.com') || url.hostname.includes('docs.google.com')) {
          url.searchParams.set('authuser', '-1');
          finalHref = url.toString();
        }
      } catch (e) {
        // Fallback to original href if parsing fails
      }
      window.open(finalHref, '_blank', 'noopener,noreferrer');
    }
    setShowModal(false);
    setPendingHref(null);
  }, [pendingHref]);

  const handleClose = useCallback(() => {
    setShowModal(false);
    setPendingHref(null);
  }, []);

  const items = useMemo(() => {
    if (!contextUrl) return [];

    // Build the full URL for AI services to fetch
    const fullContextUrl = typeof window !== 'undefined'
      ? new URL(contextUrl, window.location.origin).href
      : contextUrl;

    const q = `Read the content from this URL and help me study it: ${fullContextUrl}

Topic: ${title}
Description: ${description}

Please fetch the content from the URL above and help me understand and study it.`;

    return [
      {
        title: 'View Raw Context',
        href: contextUrl,
        icon: <FileText className="size-4" />,
      },
      {
        title: 'Open in ChatGPT',
        href: `https://chatgpt.com/?${new URLSearchParams({
          hints: 'search',
          q,
        })}`,
        icon: (
          <svg
            role="img"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className="size-4"
          >
            <title>OpenAI</title>
            <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
          </svg>
        ),
      },
      {
        title: 'Open in Claude',
        href: `https://claude.ai/new?${new URLSearchParams({
          q,
        })}`,
        icon: (
          <svg
            fill="currentColor"
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="size-4"
          >
            <title>Anthropic</title>
            <path d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z" />
          </svg>
        ),
      },
      {
        title: 'Open in T3 Chat',
        href: `https://t3.chat/new?${new URLSearchParams({
          q,
        })}`,
        icon: <MessageCircleIcon className="size-4" />,
      },
    ];
  }, [contextUrl]);

  return (
    <>
      <div className="flex flex-col rounded-xl border bg-fd-card p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="rounded-md border bg-fd-muted p-2">
            <FileText className="size-5 text-fd-muted-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-fd-foreground">{title}</h3>
            <p className="text-sm text-fd-muted-foreground">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-auto pt-3 border-t">
          {href && (
            <button
              type="button"
              onClick={() => handlePresentationClick(href)}
              className={cn(
                buttonVariants({
                  color: 'secondary',
                  size: 'sm',
                  className: 'gap-2 text-xs',
                }),
                'no-underline cursor-pointer'
              )}
            >
              <Presentation className="size-3.5" />
              {presentationLabel}
            </button>
          )}
          {showAskAi && contextUrl && (
            <Popover>
              <PopoverTrigger
                className={cn(
                  rainbowButtonVariants({
                    size: 'sm',
                    className: 'gap-2 text-xs',
                  }),
                )}
              >
                Ask AI
                <ChevronDown className="size-3 text-fd-muted-foreground" />
              </PopoverTrigger>
              <PopoverContent className="flex flex-col w-48">
                {items.map((item, index) => (
                  <a
                    key={`${item.title}-${index}`}
                    href={item.href}
                    rel="noreferrer noopener"
                    target="_blank"
                    className={cn(optionVariants())}
                  >
                    {item.icon}
                    {item.title}
                  </a>
                ))}
              </PopoverContent>
            </Popover>
          )}
          {curatedHref && (
            <a
              href={curatedHref}
              className={cn(
                buttonVariants({
                  color: 'secondary',
                  size: 'sm',
                  className: 'gap-2 text-xs',
                }),
                'no-underline'
              )}
            >
              <FileText className="size-3.5" />
              {curatedLabel}
            </a>
          )}
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={(open) => { if (!open) handleClose(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-fd-primary/10 p-4">
                <GraduationCap className="size-9 text-fd-primary" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl">University Email Required</DialogTitle>
            <DialogDescription className="text-center text-sm mt-1 px-10 pb-3">
              On the next page, select your university email account to access this document.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-5">
            <div className="flex items-start gap-3 bg-fd-muted/50 rounded-xl p-4 text-sm text-fd-muted-foreground">
              <Info className="size-4 shrink-0 mt-0.5" />
              <p>If you see "Request Access", you selected the wrong account. Go back and switch to your university email.</p>
            </div>

            <div className="flex gap-3 w-full pt-1">
              <button
                type="button"
                onClick={handleClose}
                className={cn(
                  buttonVariants({
                    color: 'secondary',
                    className: 'flex-1 cursor-pointer',
                  }),
                )}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleContinue}
                className={cn(
                  buttonVariants({
                    className: 'flex-1 cursor-pointer bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/90',
                  }),
                )}
              >
                Open Presentation
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
