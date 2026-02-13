
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export function GreenDot() {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full ml-2 cursor-help align-middle mb-1" />
                </TooltipTrigger>
                <TooltipContent>
                    <p>Covered in Module 1</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
