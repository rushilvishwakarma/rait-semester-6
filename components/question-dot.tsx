
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const colorMap: Record<string, string> = {
    green: "bg-gradient-to-br from-green-400 to-green-600 shadow-sm border border-green-300 dark:border-green-700",
    red: "bg-gradient-to-br from-red-400 to-red-600 shadow-sm border border-red-300 dark:border-red-700",
    blue: "bg-gradient-to-br from-blue-400 to-blue-600 shadow-sm border border-blue-300 dark:border-blue-700",
    yellow: "bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-sm border border-yellow-300 dark:border-yellow-700",
    orange: "bg-gradient-to-br from-orange-400 to-orange-600 shadow-sm border border-orange-300 dark:border-orange-700",
    purple: "bg-gradient-to-br from-purple-400 to-purple-600 shadow-sm border border-purple-300 dark:border-purple-700",
}

interface QuestionDotProps {
    color?: string;
    text?: string;
}

export function QuestionDot({ color = "green", text = "Marked" }: QuestionDotProps) {
    const bgClass = colorMap[color] ?? `bg-gradient-to-br from-${color}-400 to-${color}-600 shadow-sm`;
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className={`inline-block w-3 h-3 ${bgClass} rounded-full ml-2 cursor-help align-middle mb-1`} />
                </TooltipTrigger>
                <TooltipContent>
                    <p>{text}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
