
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export function RedDot() {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="inline-block w-3 h-3 bg-red-500 rounded-full ml-2 cursor-help align-middle mb-1" />
                </TooltipTrigger>
                <TooltipContent>
                    <p>Not covered in IA1 QB</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
