'use client';
import { ChevronDown, MessageCircleIcon, FileText, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cva } from 'class-variance-authority';
import { useMemo } from 'react';
import { rainbowButtonVariants } from './ui/rainbow-button';

const optionVariants = cva(
  'inline-flex items-center gap-2 rounded-full p-2 text-start text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground [&_svg]:size-4',
);

interface QPCardProps {
  /** Google Drive file ID for the question paper */
  driveId: string;
  /** Short subject code e.g. "AML" */
  subject: string;
  /** Full subject name e.g. "Advanced Machine Learning" */
  subjectFull: string;
  /** Exam label e.g. "IA1" or "MSE" */
  exam: string;
  /** OCR context URL path e.g. "/api/ocr/Question-Papers/IA1-AML" */
  contextUrl: string;
  /** Syllabus API URL e.g. "/api/syllabus/AML" */
  syllabusUrl: string;
  /** Link to the full subject page e.g. "/docs/core/AML" */
  subjectHref: string;
}

export function QPCard({ driveId, subject, subjectFull, exam, contextUrl, syllabusUrl, subjectHref }: QPCardProps) {
  const items = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const fullContextUrl = origin ? new URL(contextUrl, origin).href : contextUrl;
    const fullSyllabusUrl = origin ? new URL(syllabusUrl, origin).href : syllabusUrl;
    const fullSubjectHref = origin ? new URL(subjectHref, origin).href : subjectHref;

    const examFullNames: Record<string, string> = {
      'IA1': 'Internal Assessment 1',
      'MSE': 'Mid-Semester Exam',
      'IA2': 'Internal Assessment 2',
      'ESE': 'End-Semester Exam'
    };
    const examFull = examFullNames[exam] || exam;

    const q = `I am studying ${subjectFull} (${subject}).

Here is the ${examFull} question paper: ${fullContextUrl}

Syllabus for this subject (fetch this for context on what each module covers): ${fullSyllabusUrl}

Full subject page for reference: ${fullSubjectHref}

Please fetch the question paper content from the first URL, use the syllabus URL for module/topic context, and help me prepare for this exam by explaining the questions and key concepts.`;

    return [
      {
        title: 'Open in ChatGPT',
        href: `https://chatgpt.com/?${new URLSearchParams({ hints: 'search', q })}`,
        icon: (
          <svg role="img" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="size-4">
            <title>OpenAI</title>
            <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
          </svg>
        ),
      },
      {
        title: 'Open in Gemini',
        href: `https://gemini.google.com/app?${new URLSearchParams({ q })}`,
        icon: (
          <svg fill="currentColor" role="img" viewBox="0 0 296 298" xmlns="http://www.w3.org/2000/svg" className="size-4">
            <title>Google Gemini</title>
            <path d="M141.201 4.886c2.282-6.17 11.042-6.071 13.184.148l5.985 17.37a184.004 184.004 0 0 0 111.257 113.049l19.304 6.997c6.143 2.227 6.156 10.91.02 13.155l-19.35 7.082a184.001 184.001 0 0 0-109.495 109.385l-7.573 20.629c-2.241 6.105-10.869 6.121-13.133.025l-7.908-21.296a184 184 0 0 0-109.02-108.658l-19.698-7.239c-6.102-2.243-6.118-10.867-.025-13.132l20.083-7.467A183.998 183.998 0 0 0 133.291 26.28l7.91-21.394Z" />
          </svg>
        ),
      },
      {
        title: 'Open in Le Chat',
        href: `https://chat.mistral.ai/chat?${new URLSearchParams({ q })}`,
        icon: (
          <svg fill="currentColor" role="img" viewBox="0 0 256 233" xmlns="http://www.w3.org/2000/svg" className="size-4">
            <title>Mistral AI</title>
            <path d="M186.18182 0h46.54545v46.54545h-46.54545z" />
            <path d="M209.45454 0h46.54545v46.54545h-46.54545z" />
            <path d="M0 0h46.54545v46.54545H0zM0 46.54545h46.54545V93.0909H0zM0 93.09091h46.54545v46.54545H0zM0 139.63636h46.54545v46.54545H0zM0 186.18182h46.54545v46.54545H0z" />
            <path d="M23.27273 0h46.54545v46.54545H23.27273z" />
            <path d="M209.45454 46.54545h46.54545V93.0909h-46.54545zM23.27273 46.54545h46.54545V93.0909H23.27273z" />
            <path d="M139.63636 46.54545h46.54545V93.0909h-46.54545z" />
            <path d="M162.90909 46.54545h46.54545V93.0909h-46.54545zM69.81818 46.54545h46.54545V93.0909H69.81818z" />
            <path d="M116.36364 93.09091h46.54545v46.54545h-46.54545zM162.90909 93.09091h46.54545v46.54545h-46.54545zM69.81818 93.09091h46.54545v46.54545H69.81818z" />
            <path d="M93.09091 139.63636h46.54545v46.54545H93.09091z" />
            <path d="M116.36364 139.63636h46.54545v46.54545h-46.54545z" />
            <path d="M209.45454 93.09091h46.54545v46.54545h-46.54545zM23.27273 93.09091h46.54545v46.54545H23.27273z" />
            <path d="M186.18182 139.63636h46.54545v46.54545h-46.54545z" />
            <path d="M209.45454 139.63636h46.54545v46.54545h-46.54545z" />
            <path d="M186.18182 186.18182h46.54545v46.54545h-46.54545z" />
            <path d="M23.27273 139.63636h46.54545v46.54545H23.27273z" />
            <path d="M209.45454 186.18182h46.54545v46.54545h-46.54545zM23.27273 186.18182h46.54545v46.54545H23.27273z" />
          </svg>
        ),
      },
      {
        title: 'Open in Claude',
        href: `https://claude.ai/new?${new URLSearchParams({ q })}`,
        icon: (
          <svg fill="currentColor" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="size-4">
            <title>Anthropic</title>
            <path d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z" />
          </svg>
        ),
      },
      {
        title: 'Open in Perplexity',
        href: `https://www.perplexity.ai/?${new URLSearchParams({ q })}`,
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="size-4">
            <title>Perplexity</title>
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M24 4.5v39M13.73 16.573v-9.99L24 16.573m0 14.5L13.73 41.417V27.01L24 16.573m0 0l10.27-9.99v9.99" />
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.73 31.396H9.44V16.573h29.12v14.823h-4.29" />
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M24 16.573L34.27 27.01v14.407L24 31.073" />
          </svg>
        ),
      },
      {
        title: 'Open in T3 Chat',
        href: `https://t3.chat/new?${new URLSearchParams({ q })}`,
        icon: <MessageCircleIcon className="size-4" />,
      },
      {
        title: 'View Raw Context',
        href: contextUrl,
        icon: <FileText className="size-4" />,
      },
    ];
  }, [contextUrl, syllabusUrl, subjectHref, subject, subjectFull, exam]);

  return (
    <div className="rounded-xl border bg-fd-card p-2 flex flex-col gap-1.5 h-full">
      <a
        href={`https://drive.google.com/file/d/${driveId}/view?usp=sharing`}
        target="_blank"
        rel="noopener noreferrer"
        className="no-underline group"
      >
        <img
          src={`https://drive.google.com/thumbnail?id=${driveId}&sz=w800`}
          alt={`${subject} ${exam}`}
          className="w-full aspect-[210/297] object-cover object-top rounded-lg border !m-0 !p-0 transition-opacity group-hover:opacity-90"
        />
      </a>
      <div className="flex flex-col gap-2.5 px-0.5 pt-0.5 pb-1 flex-1">
        <a href={subjectHref} className="no-underline group/link block">
          <div className="flex items-center justify-between gap-1 mb-0">
            <p className="font-semibold text-fd-foreground text-sm leading-none !my-2 group-hover/link:underline">
              {subject}
            </p>
            <ArrowRight className="size-4 shrink-0 text-fd-muted-foreground transition-transform group-hover/link:translate-x-0.5" />
          </div>
          <p className="text-xs text-fd-muted-foreground leading-none mt-0">{subjectFull}</p>
        </a>
        <div className="mt-auto">
          <Popover>
            <PopoverTrigger
              className={cn(
                rainbowButtonVariants({ size: 'sm', className: 'gap-1.5 text-xs w-full' }),
              )}
            >
              Ask AI for Solutions
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
        </div>
      </div>
    </div>
  );
}
