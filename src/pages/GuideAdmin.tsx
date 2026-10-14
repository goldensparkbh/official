import { useEffect, useState } from 'react';
import { guides as defaults } from '@/data/learning';
import type { Guide } from '@/data/learning';
import { saveGuide, watchGuides } from '@/lib/store';

export default function GuideAdmin() {
  const [guides, setGuides] = useState(defaults);
  const [edit, setEdit] = useState<Guide | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => watchGuides(setGuides, error => setMessage(error.message)), []);
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!edit) return;
    setBusy(true); setMessage('');
    try { await saveGuide({ ...edit, title: edit.title.trim() }); setEdit(null); setMessage('Article saved.'); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to save article.'); }
    finally { setBusy(false); }
  };
  return <>
    <div className="admin-actions"><button className="btn-primary" onClick={() => setEdit({ id: `guide-${crypto.randomUUID()}`, title: '', type: 'Tutorial', active: false, category: 'Fundamentals', minutes: 10, intro: '', projectIds: [], sections: [{ title: '', body: '' }], sources: [] })}>New article</button></div>
    {message && <p role="status" className="admin-message">{message}</p>}
    {edit && <form className="project-form admin-editor" onSubmit={event => void save(event)}>
      <h2>{edit.title || 'New article'}</h2>
      <label>Title<input required maxLength={160} value={edit.title} onChange={e => setEdit({ ...edit, title: e.target.value })} /></label>
      <label>Section<select value={edit.type} onChange={e => setEdit({ ...edit, type: e.target.value as Guide['type'] })}><option>Tutorial</option><option>Journal</option></select></label>
      <label>Category<input required value={edit.category} onChange={e => setEdit({ ...edit, category: e.target.value })} /></label>
      <label>Reading time (minutes)<input required type="number" min="1" max="999" value={edit.minutes} onChange={e => setEdit({ ...edit, minutes: Number(e.target.value) })} /></label>
      <label>Introduction<textarea required value={edit.intro} onChange={e => setEdit({ ...edit, intro: e.target.value })} /></label>
      <label>Linked project IDs (one per line)<textarea placeholder="FS-003" value={edit.projectIds.join('\n')} onChange={e => setEdit({ ...edit, projectIds: e.target.value.split('\n').map(id => id.trim()).filter(Boolean) })} /></label>
      {edit.sections.map((section, index) => <fieldset key={index}><legend>Content section {index + 1}</legend><label>Heading<input required value={section.title} onChange={e => setEdit({ ...edit, sections: edit.sections.map((s, i) => i === index ? { ...s, title: e.target.value } : s) })} /></label><label>Text<textarea required rows={7} value={section.body} onChange={e => setEdit({ ...edit, sections: edit.sections.map((s, i) => i === index ? { ...s, body: e.target.value } : s) })} /></label><label>Optional code<textarea rows={5} value={section.code ?? ''} onChange={e => setEdit({ ...edit, sections: edit.sections.map((s, i) => i === index ? { ...s, code: e.target.value } : s) })} /></label><button type="button" className="btn-secondary" disabled={edit.sections.length === 1} onClick={() => setEdit({ ...edit, sections: edit.sections.filter((_, i) => i !== index) })}>Remove section</button></fieldset>)}
      <button type="button" className="btn-secondary" onClick={() => setEdit({ ...edit, sections: [...edit.sections, { title: '', body: '' }] })}>Add content section</button>
      {edit.sources.map((source, index) => <fieldset key={index}><legend>Reference {index + 1}</legend><label>Reference title<input required value={source.title} onChange={e => setEdit({ ...edit, sources: edit.sources.map((s, i) => i === index ? { ...s, title: e.target.value } : s) })} /></label><label>Reference URL<input required type="url" pattern="https?://.*" value={source.url} onChange={e => setEdit({ ...edit, sources: edit.sources.map((s, i) => i === index ? { ...s, url: e.target.value } : s) })} /></label><button type="button" className="btn-secondary" onClick={() => setEdit({ ...edit, sources: edit.sources.filter((_, i) => i !== index) })}>Remove reference</button></fieldset>)}
      <button type="button" className="btn-secondary" onClick={() => setEdit({ ...edit, sources: [...edit.sources, { title: '', url: '' }] })}>Add reference</button>
      <label className="admin-checkbox"><input type="checkbox" checked={edit.active !== false} onChange={e => setEdit({ ...edit, active: e.target.checked })} />Published on the website</label>
      <div className="flex gap-4"><button className="btn-primary" disabled={busy}>Save article</button><button type="button" className="btn-secondary" onClick={() => setEdit(null)}>Cancel</button></div>
    </form>}
    <div className="admin-items">{guides.map(guide => <div key={guide.id}><div><b>{guide.title}</b><small>{guide.type} · {guide.active === false ? 'Hidden' : 'Published'}</small></div><button className="btn-secondary" onClick={() => { setEdit(guide); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Edit</button></div>)}</div>
  </>;
}
