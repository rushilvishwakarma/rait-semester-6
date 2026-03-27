import { NextRequest } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export const revalidate = false;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;

  // Sanitize each segment to prevent directory traversal
  const sanitizedSegments = segments.map((seg) => path.basename(seg));

  // Build path: content/docs/core/ocr-context/{Core|Labs}/{Subject}/{filename}.txt
  const filePath = path.join(
    process.cwd(),
    'content/docs/core/ocr-context',
    ...sanitizedSegments.slice(0, -1),
    `${sanitizedSegments[sanitizedSegments.length - 1]}.txt`
  );

  try {
    const content = await readFile(filePath, 'utf-8');
    return new Response(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
