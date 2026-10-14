import { readFileSync } from 'node:fs';
for (const subject of ['EL', 'AI']) {
  for (const level of ['101', '102', '201', '202', '301', '302']) {
    const id = `${subject}-${level}`;
    const path = new URL(`./workshops/${id}.pdf`, import.meta.url);
    let file;
    try { file = readFileSync(path); }
    catch { throw new Error(`Restore the private ${id}.pdf under functions/workshops before deployment. See PROJECTS-SETUP.md.`); }
    if (file.subarray(0, 5).toString() !== '%PDF-') throw new Error(`${id}.pdf is not a PDF file.`);
  }
}
console.log('All twelve private workshop PDFs are ready for deployment.');
