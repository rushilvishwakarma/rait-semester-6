import { Callout } from 'fumadocs-ui/components/callout';
import { Lightbulb } from 'lucide-react';
import type { ReactNode, ComponentProps } from 'react';

interface CustomCalloutProps extends Omit<ComponentProps<typeof Callout>, 'type'> {
    type?: 'info' | 'warn' | 'error' | 'idea';
    children: ReactNode;
}

export function CustomCallout({ type = 'info', icon, ...props }: CustomCalloutProps) {
    if (type === 'idea') {
        return (
            <Callout
                type="success"
                icon={icon || <Lightbulb className="h-5 w-5 text-green-500" />}
                {...props}
            />
        );
    }

    return <Callout type={type} icon={icon} {...props} />;
}
