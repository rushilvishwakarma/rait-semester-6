import { getPageImage, source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';

export const revalidate = false;

const primaryColor = 'rgba(197, 29, 56, 0.75)';
const primaryTextColor = 'rgb(255, 160, 180)';

export async function GET(
  _req: Request,
  { params }: RouteContext<'/og/docs/[...slug]'>,
) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          color: 'white',
          padding: '4rem',
          backgroundColor: '#0c0c0c',
          backgroundImage: `linear-gradient(to top right, ${primaryColor}, transparent)`,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '12px',
            color: primaryTextColor,
          }}
        >
          <p style={{ fontSize: '56px', fontWeight: 600, margin: 0 }}>
            Semester 6
          </p>
        </div>
        <p style={{ fontWeight: 800, fontSize: '82px', margin: 0 }}>
          {page.data.title}
        </p>
        <p style={{ fontSize: '52px', color: 'rgba(240,240,240,0.8)', margin: 0 }}>
          {page.data.description}
        </p>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImage(page).segments,
  }));
}
