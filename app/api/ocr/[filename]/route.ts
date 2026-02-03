import { NextRequest } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export const revalidate = false;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  
  // Sanitize filename to prevent directory traversal
  const sanitizedFilename = path.basename(filename);
  const filePath = path.join(process.cwd(), 'content/docs/core/ocr-context', `${sanitizedFilename}.txt`);
  
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
