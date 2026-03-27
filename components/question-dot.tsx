"use client"

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

/* ──────────────────────────────────────────────
   Color mapping — dot gradients + badge styles
   ────────────────────────────────────────────── */

const dotColorMap: Record<string, string> = {
    // Exams
    green:  "bg-gradient-to-br from-green-400 to-green-600 border border-green-300 dark:border-green-700",
    blue:   "bg-gradient-to-br from-blue-400 to-blue-600 border border-blue-300 dark:border-blue-700",
    orange: "bg-gradient-to-br from-orange-400 to-orange-600 border border-orange-300 dark:border-orange-700",
    red:    "bg-gradient-to-br from-red-400 to-red-600 border border-red-300 dark:border-red-700",
    // Cross-QB
    yellow: "bg-gradient-to-br from-yellow-400 to-yellow-600 border border-yellow-300 dark:border-yellow-700",
    cyan:   "bg-gradient-to-br from-cyan-400 to-cyan-600 border border-cyan-300 dark:border-cyan-700",
    purple: "bg-gradient-to-br from-purple-400 to-purple-600 border border-purple-300 dark:border-purple-700",
    pink:   "bg-gradient-to-br from-pink-400 to-pink-600 border border-pink-300 dark:border-pink-700",
}

const badgeColorMap: Record<string, string> = {
    // Exams
    green:  "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/25",
    blue:   "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/25",
    orange: "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/25",
    red:    "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/25",
    // Cross-QB
    yellow: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/25",
    cyan:   "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/25",
    purple: "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/25",
    pink:   "bg-pink-500/15 text-pink-700 dark:text-pink-400 border-pink-500/25",
}

/* ──────────────────────────────────────────────
   QuestionDot — responsive Badge / Dot
   ────────────────────────────────────────────── */

interface QuestionDotProps {
    color?: string;
    text?: string;
}

export function QuestionDot({ color = "green", text = "Marked" }: QuestionDotProps) {
    const dotClass  = dotColorMap[color]  ?? `bg-gradient-to-br from-${color}-400 to-${color}-600`;
    const badgeClass = badgeColorMap[color] ?? `bg-${color}-500/15 text-${color}-700 dark:text-${color}-400 border-${color}-500/25`;

    return (
        <>
            {/* ── Large screens: Badge with text ── */}
            <Badge
                variant="outline"
                className={`question-dot-badge hidden lg:inline-flex ml-2 align-middle mb-0.5 text-[10px] leading-none font-semibold px-1.5 py-0.5 ${badgeClass}`}
            >
                {text}
            </Badge>

            {/* ── Small screens: Dot with tooltip ── */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <span
                        role="button"
                        tabIndex={0}
                        className={`question-dot-dot lg:hidden inline-block w-3 h-3 ${dotClass} rounded-full ml-2 shadow-sm cursor-help align-middle mb-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1`}
                        aria-label={text}
                    />
                </TooltipTrigger>
                <TooltipContent>
                    <p>{text}</p>
                </TooltipContent>
            </Tooltip>
        </>
    )
}
