import { NextRequest } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export const revalidate = false;

// Map subject codes to their .mdx filenames
const SUBJECT_FILES: Record<string, string> = {
  AML: 'AML.mdx',
  BDA: 'BDA.mdx',
  DL: 'DL.mdx',
  DOE: 'DOE.mdx',
  NLP: 'NLP.mdx',
};

/**
 * Extracts only the syllabus table from a subject MDX file.
 * Looks for content between "## Syllabus" and the next "---" separator.
 */
function extractSyllabus(content: string): string {
  const lines = content.split('\n');
  const startIdx = lines.findIndex((l) => /^##\s+Syllabus/.test(l.trim()));
  if (startIdx === -1) return '';

  const result: string[] = [];
  let inTable = false;

  for (let i = startIdx + 1; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Stop at next section heading or HR
    if (trimmed.startsWith('## ') || trimmed === '---') break;

    // Collect table rows (lines starting with |)
    if (trimmed.startsWith('|')) {
      inTable = true;
      result.push(trimmed);
    } else if (inTable && trimmed === '') {
      // allow one blank line between table sections, but stop if it continues empty
      result.push('');
    } else if (inTable && !trimmed.startsWith('|')) {
      // Non-table content after table started = end of syllabus
      break;
    }
  }

  return result.join('\n').trim();
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ subject: string }> }
) {
  const { subject } = await params;
  const sanitized = path.basename(subject).toUpperCase();
  const filename = SUBJECT_FILES[sanitized];

  if (!filename) {
    return new Response('Subject not found', { status: 404 });
  }

  const filePath = path.join(process.cwd(), 'content/docs/core', filename);

  try {
    const raw = await readFile(filePath, 'utf-8');
    const syllabus = extractSyllabus(raw);
    if (!syllabus) return new Response('Syllabus not found', { status: 404 });

    return new Response(syllabus, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
