import { getPageImage, source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { ExportButton, ViewOptions, MyDYButton } from '@/components/page-actions';
import VerifiedIcon from '@/components/verified-icon';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  // Disable footer for specific pages (e.g., vm-setup)
  const slugPath = params.slug?.join('/') || '';
  const noFooterPages = ['labs/BDA/experiment-1/vm-setup', 'labs/BDA/experiment-1'];
  const showFooter = !noFooterPages.includes(slugPath);

  // Construct GitHub URL for the source file
  const githubBaseUrl = 'https://github.com/faraz-m-dev/rait-semester-6/blob/main/content';
  const githubUrl = `${githubBaseUrl}${page.url}.mdx`;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full} footer={{ enabled: showFooter }}>
      <DocsTitle>
        <TooltipProvider>
          <span className="flex items-center gap-2">
            {page.data.title}
            {page.data.verified && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex">
                    <VerifiedIcon size={24} color="#3b82f6" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>Submitted and Verified</TooltipContent>
              </Tooltip>
            )}
          </span>
        </TooltipProvider>
      </DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pt-2 pb-6">
        <ExportButton markdownUrl={`${page.url}.mdx`} />
        <ViewOptions markdownUrl={`${page.url}.mdx`} githubUrl={githubUrl} />
        <MyDYButton />
      </div>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<'/docs/[[...slug]]'>,
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}
