import { ImageZoom as FumadocsImageZoom, type ImageZoomProps } from 'fumadocs-ui/components/image-zoom';
import { cn } from '@/lib/utils';

export interface CustomImageZoomProps extends ImageZoomProps {
  /**
   * "dark": Image is natively light (e.g. black text on transparent), invert it in dark mode.
   * "light": Image is natively dark (e.g. white text on transparent), invert it in light mode.
   */
  invertIn?: 'dark' | 'light';
}

export function ImageZoom({ invertIn, className, ...props }: CustomImageZoomProps) {
  return (
    <FumadocsImageZoom
      className={cn(
        "my-6 mx-auto bg-transparent",
        invertIn === 'dark' && "invert-dark-mode",
        invertIn === 'light' && "invert-light-mode",
        className
      )}
      {...props}
    />
  );
}
