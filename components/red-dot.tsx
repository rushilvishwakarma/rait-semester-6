
// Backwards-compatible wrapper — use QuestionDot directly for new files
import { QuestionDot } from "@/components/question-dot";

export function RedDot() {
    return <QuestionDot color="red" text="Not covered in IA1 QB" />;
}
