const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(file));
        } else {
            if (file.endsWith('.mdx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walkDir('content/docs/labs');
let changedCount = 0;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Pattern for regular author cards
    const regexOutput = /<DocumentCard\s+title="([^"]+)"\s+href="([^"]+)"\s+authorName="([^"]+)"\s+authorLink="([^"]+)"\s*\/>/gs;
    
    if (regexOutput.test(content)) {
        content = content.replace(regexOutput, `<DocumentCard
      title="$1"
      href="$2"
    >
      View Document<br />
      Author: <AuthorLink href="$4">$3</AuthorLink>
    </DocumentCard>`);
        changed = true;
    }

    // Pattern for Peeyush Hota cards
    const regexPeeyush = /<DocumentCard\s+title="Journal Writing Part to refer \(Made easy\)"\s+href="([^"]+)"\s+authorName="Peeyush Hota"\s+authorLink="([^"]+)"\s+isPeeyush=\{true\}\s*\/>/gs;
    
    if (regexPeeyush.test(content)) {
        content = content.replace(regexPeeyush, `<DocumentCard
      title="Journal Writing Part to refer (Made easy)"
      href="$1"
    >
      View Document<br />
      Provided to us by <AuthorLink href="$2">Peeyush Hota</AuthorLink> for making writing part and programs easier. Ignore the Code while writing in your Journal.
    </DocumentCard>`);
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Applied generic component pattern to:', file);
        changedCount++;
    }
}
console.log('Total files updated:', changedCount);
