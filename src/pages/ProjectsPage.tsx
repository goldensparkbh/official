import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowUpRight, Box, Check, ChevronRight, Clock, Cpu, Minus, Plus, Search, ShoppingBag, SlidersHorizontal, X } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db, configured, createOrder, watchGuides, watchItems, watchSettings } from '@/lib/store';
import { initialItems, mergeItems, money, priceFor, variantLabel, whatsappMessage } from '@/lib/catalog';
import type { CartLine, Item, Order, Variant } from '@/lib/catalog';
import ProjectsAdmin from './ProjectsAdmin';
import { guides as defaultGuides } from '@/data/learning';

function readCart(): CartLine[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem('golden-spark-cart') ?? '[]');
    return Array.isArray(value) ? value.filter(l => l && typeof l.itemId === 'string' && ['assembled', 'kit', 'component', 'workshop'].includes(l.variant) && Number.isInteger(l.quantity) && l.quantity > 0 && l.quantity <= 99).slice(0, 50) : [];
  } catch { return []; }
}
function ProductVisual({ item, large = false }: { item: Item; large?: boolean }) {
  return <div className={`project-visual ${large ? 'project-visual-large' : ''}`}>
    {item.image ? <img src={item.image} alt={`${item.title} project and components`} loading="lazy" onError={e => { e.currentTarget.style.display = 'none'; }} /> : <Cpu size={64} className="text-gold/40" />}
    <span className="visual-brand"><img src="/images/gsc-logo.svg" alt="Golden Spark" /></span>
    <span className="visual-code">{item.id.startsWith('FS-') ? item.id : 'COMPONENT'}</span>
  </div>;
}
export default function ProjectsPage({ route }: { route: string }) {
  const [allGuides, setGuides] = useState(defaultGuides);
  const guides = allGuides.filter(guide => guide.active !== false);
  useEffect(() => watchGuides(setGuides, e => setError(e.message)), []);
  const [items, setItems] = useState(initialItems);
  const [whatsapp, setWhatsapp] = useState(import.meta.env.VITE_GOLDEN_SPARK_WHATSAPP ?? 'XXXXXXXX');
  const [error, setError] = useState('');
  const [category, setCategory] = useState('All projects');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(() => route.split('/item/')[1] ?? null);
  const [variant, setVariant] = useState<Variant>('assembled');
  const [cart, setCart] = useState<CartLine[]>(readCart);
  const [cartOpen, setCartOpen] = useState(route.endsWith('/cart'));
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [customer, setCustomer] = useState('');
  const [contact, setContact] = useState('');
  const [notes, setNotes] = useState('');
  const [requestId, setRequestId] = useState(() => crypto.randomUUID());
  useEffect(() => {
    const stopItems = watchItems(remote => setItems(mergeItems(remote)), e => setError(e.message));
    const stopSettings = watchSettings(setWhatsapp, e => setError(e.message));
    return () => { stopItems(); stopSettings(); };
  }, []);
  useEffect(() => { try { localStorage.setItem('golden-spark-cart', JSON.stringify(cart)); } catch { /* Cart remains available in this session. */ } }, [cart]);
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(''), 3000); return () => clearTimeout(timer); }, [notice]);
  useEffect(() => {
    if (!selected && !cartOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busy) { if (cartOpen) setCartOpen(false); else setSelected(null); }
      if (event.key !== 'Tab') return;
      const dialogs = document.querySelectorAll('[role="dialog"]');
      const focusable = dialogs[dialogs.length - 1]?.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],input,textarea,select');
      if (!focusable?.length) return;
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !dialogs[dialogs.length - 1].contains(document.activeElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !dialogs[dialogs.length - 1].contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', keydown);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', keydown); previous?.focus(); };
  }, [selected, cartOpen, busy]);
  useEffect(() => {
    const id = route.split('/order/')[1];
    if (!id || !auth || !db) return;
    let stopOrder = () => {};
    const stopAuth = onAuthStateChanged(auth, user => {
      stopOrder();
      if (!user) { setError('Open this order in the browser used to place it.'); return; }
      stopOrder = onSnapshot(doc(db!, 'projectOrders', id), snap => {
        if (snap.exists()) setOrder({ ...snap.data(), id: snap.id } as Order);
        else setError('Order not found.');
      }, () => setError('This order is private. Open it in the browser used to place it.'));
    });
    return () => { stopAuth(); stopOrder(); };
  }, [route]);
  const projects = items.filter(i => i.kind === 'project' && i.active);
  const current = items.find(i => i.id === selected && i.active);
  const categories = ['All projects', ...new Set(projects.map(p => p.category)), 'Components'];
  const visible = items.filter(i => i.active && (category === 'Components' ? i.kind === 'component' : i.kind === 'project' && (category === 'All projects' || i.category === category)) && `${i.title} ${i.description} ${i.platform}`.toLowerCase().includes(search.toLowerCase()));
  const count = cart.reduce((sum, l) => sum + l.quantity, 0);
  const validWhatsapp = /^[1-9][0-9]{7,14}$/.test(whatsapp);
  const add = (item: Item, option: Variant) => {
    if (cart.length >= 50 && !cart.some(l => l.itemId === item.id && l.variant === option)) { setError('Please keep your cart to 50 different items.'); return; }
    setCart(previous => {
      const existing = previous.find(l => l.itemId === item.id && l.variant === option);
      return existing ? previous.map(l => l === existing ? { ...l, quantity: Math.min(99, l.quantity + 1) } : l) : [...previous, { itemId: item.id, variant: option, quantity: 1 }];
    });
    setRequestId(crypto.randomUUID());
    setNotice(`${item.title} added to your cart`);
  };
  const changeQuantity = (index: number, difference: number) => { setCart(previous => previous.map((l, i) => i === index ? { ...l, quantity: Math.min(l.variant === 'workshop' ? 1 : 99, l.quantity + difference) } : l).filter(l => l.quantity > 0)); setRequestId(crypto.randomUUID()); };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const saved = await createOrder(requestId, cart, customer, contact, notes);
      setOrder(saved); setCart([]); setCartOpen(false); window.location.hash = `/projects/order/${saved.id}`;
      // Navigate only after the order is durably saved. A retry reuses the same ID.
      window.location.assign(`https://wa.me/${whatsapp}?text=${encodeURIComponent(whatsappMessage(saved))}`);
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to save your order. Please try again.'); } finally { setBusy(false); }
  };
  if (route.startsWith('#/projects/admin')) return <ProjectsAdmin items={items} whatsapp={whatsapp} />;
  return <div className="projects-page">
    {notice && <div role="status" className="project-toast"><Check size={18} />{notice}</div>}
    <div className="project-toolbar"><a href="#" className="project-subtle"><ArrowLeft size={15} /> Golden Spark</a><div className="flex gap-5"><a href="#/projects/admin" className="project-subtle"><SlidersHorizontal size={15} /> Control panel</a><button className="project-cart-button" onClick={() => setCartOpen(true)}><ShoppingBag size={18} /> Cart <span>{count}</span></button></div></div>
    {route.includes('/order/') ? <section className="order-confirmation"><span className="micro-label text-gold">Your purchase request</span><h1 className="headline-lg mt-5 mb-8">LET’S BUILD <span className="text-gold">SOMETHING.</span></h1>{order ? <><p>Order reference: <strong className="break-all">{order.id}</strong></p><div className="order-status"><Clock size={18} />{order.status.replaceAll('_', ' ')}</div><p className="text-white/60 mb-6">Payment and availability are confirmed directly with Golden Spark on WhatsApp. Your order status updates here.</p>{order.lines.map(l => <div key={`${l.itemId}-${l.variant}`} className="order-line">{l.quantity} × {l.title}<span>{variantLabel(l.variant)}</span></div>)}{validWhatsapp && <a className="btn-primary inline-flex mt-8" href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(whatsappMessage(order))}`}>Open WhatsApp <ArrowUpRight size={18} /></a>}<a href="#/learn/library" className="project-subtle mt-6">My workshop PDFs <ChevronRight size={16} /></a><a href="#/projects" className="project-subtle mt-6">Continue exploring <ChevronRight size={16} /></a></> : <p role="status">{error || 'Loading your order…'}</p>}</section> : <>
    <header className="projects-hero"><div><span className="micro-label text-gold">THE GOLDEN SPARK PROJECT COLLECTION</span><h1>BIG IDEAS.<br /><span className="text-gold">BUILT BY YOU.</span></h1><p>From your first circuit to your next invention. Discover hands-on projects, ready-built systems, and the components that bring them to life.</p><a href="#project-collection" onClick={e => { e.preventDefault(); document.getElementById('project-collection')?.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary inline-flex items-center gap-4">Explore the collection <ArrowUpRight size={18} /></a></div><div className="project-hero-art"><ProductVisual item={projects[0] ?? initialItems[0]} large /><span className="hero-art-caption"><Box size={20} /> One project. Endless possibilities.</span></div></header>
    <div className="project-benefits"><span><Box size={18} /> Assembled or build it yourself</span><span><Cpu size={18} /> Components matched to your project</span><span><ShoppingBag size={18} /> Order directly on WhatsApp</span></div>
    <section id="project-collection" className="project-collection"><div className="collection-heading"><div><span className="micro-label text-gold">FABRICATION STATION PROJECTS</span><h2>FIND YOUR NEXT <span className="text-gold">SPARK.</span></h2></div><label className="project-search"><Search size={18} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects or components" aria-label="Search projects or components" /></label></div><div className="project-filters">{categories.map(c => <button key={c} onClick={() => setCategory(c)} aria-pressed={category === c} className={category === c ? 'active' : ''}>{c}</button>)}</div><p className="micro-label text-white/40 mb-6">{visible.length} {category === 'Components' ? 'components & tools' : 'projects'} · Prices confirmed with Golden Spark</p><div className="project-grid">{visible.map(item => <article key={item.id} className="project-card"><button className="project-image-button" aria-label={`View ${item.title}`} onClick={() => { setSelected(item.id); setVariant(item.kind === 'project' ? 'assembled' : 'component'); }}><ProductVisual item={item} /></button><div className="project-card-body"><span className="micro-label text-gold">{item.category}{item.platform && ` / ${item.platform}`}</span><h3>{item.title}</h3><p>{item.description}</p><div className="project-card-footer"><span>{money(item.kind === 'project' ? item.assembledPrice : item.price)}</span><button onClick={() => { setSelected(item.id); setVariant(item.kind === 'project' ? 'assembled' : 'component'); }} aria-label={`Explore ${item.title}`}><ArrowUpRight size={22} /></button></div></div></article>)}</div>{!visible.length && <p className="py-20 text-center text-white/60">No matches. Try a different search or category.</p>}</section>
    <section className="project-process"><span className="micro-label text-gold">A SIMPLE WAY TO GET STARTED</span><h2>Your idea. Our support.</h2><div><p><b>01 / Choose your project</b>Select a ready-built project, an unassembled kit, or additional components.</p><p><b>02 / Send your request</b>Review your cart and open WhatsApp with your items and order reference.</p><p><b>03 / We take it from there</b>We confirm your price and payment, then update your order as it’s prepared.</p></div></section>
    </>}
    {error && !route.includes('/order/') && <div role="alert" className="project-alert">{error}<button onClick={() => setError('')} aria-label="Dismiss error"><X size={16} /></button></div>}
    <footer className="projects-footer"><img src="/images/gsc-logo.svg" alt="Golden Spark" /><span>Built to inspire. Made to explore.</span><a href="mailto:support@goldenspark.me">support@goldenspark.me</a></footer>
    {current && <div className="project-modal-backdrop"><section role="dialog" aria-modal="true" aria-labelledby="product-title" className="project-detail"><button autoFocus className="project-close" onClick={() => setSelected(null)} aria-label="Close product"><X /></button><div className="product-media"><ProductVisual item={{ ...current, image: current.kind === 'project' ? (variant === 'assembled' ? current.assembledImage : current.kitImage) || current.image : current.image }} large /><p className="packaging-note">Spark box packaging preview. Contents are listed alongside the box.</p>{current.projectImage && <img className="project-reference-image" src={current.projectImage} alt={`${current.title} project reference`} loading="lazy" />}</div><div className="project-detail-content"><span className="micro-label text-gold">{current.category} / {current.platform || 'Accessories'}</span><h2 id="product-title">{current.title}</h2>{current.difficulty && <p className="micro-label text-gold mb-4">{current.difficulty} · {current.hours} hour build</p>}<p className="text-white/60 leading-relaxed">{current.description}</p>{current.kind === 'project' && <div className="variant-options">{(['assembled', 'kit'] as Variant[]).map(v => <button key={v} onClick={() => setVariant(v)} aria-pressed={variant === v} className={variant === v ? 'active' : ''}>{v === 'assembled' ? 'Assembled project' : 'Unassembled kit'}<small>{v === 'assembled' ? 'Ready to use' : 'Build it yourself'}</small></button>)}</div>}<div className="flex items-center justify-between gap-4 mt-6"><strong className="text-gold">{money(priceFor(current, variant))}</strong><button className="btn-primary" onClick={() => add(current, variant)}>Add to cart</button></div>{current.parts.length > 0 && <><h3 className="mt-8 mb-4">What’s in the project</h3><ul className="project-parts">{current.parts.map(p => <li key={p}><Check size={14} />{p}</li>)}</ul></>}{current.outcomes?.length ? <><h3 className="mt-8 mb-4">What you’ll learn</h3><ul className="project-parts">{current.outcomes.map(outcome => <li key={outcome}><Check size={14} />{outcome}</li>)}</ul></> : null}<h3 className="mt-8 mb-4">Project tutorials</h3><div className="related-items">{guides.filter(g => g.projectIds.includes(current.id)).map(g => <a className="source-link" key={g.id} href={`#/learn/tutorials/${g.id}`}>{g.title}<ArrowUpRight size={18} /></a>)}{!guides.some(g => g.projectIds.includes(current.id)) && <a className="source-link" href="#/learn/tutorials">Explore project guides<ArrowUpRight size={18} /></a>}</div><h3 className="mt-8 mb-4">Related components & tools</h3><div className="related-items">{items.filter(i => i.active && i.kind === 'component' && (current.related.includes(i.id) || ['multimeter', 'solder', 'hand-tools'].includes(i.id))).map(i => <div key={i.id}><Cpu size={22} className="text-gold" /><div><b>{i.title}</b><small>{money(i.price)}</small></div><button onClick={() => add(i, 'component')} aria-label={`Add ${i.title}`}><Plus size={18} /></button></div>)}</div>{current.kind === 'project' && <><h3 className="mt-8 mb-4">Similar projects</h3><div className="related-items">{projects.filter(p => p.id !== current.id && (p.category === current.category || current.related.includes(p.id))).slice(0, 3).map(p => <button key={p.id} onClick={() => { setSelected(p.id); setVariant('assembled'); }}>{p.title}<ArrowUpRight size={18} /></button>)}</div></>}</div></section></div>}
    {cartOpen && <div className="project-modal-backdrop"><section role="dialog" aria-modal="true" aria-labelledby="cart-title" className="project-cart"><button autoFocus className="project-close" onClick={() => setCartOpen(false)} aria-label="Close cart"><X /></button><span className="micro-label text-gold">YOUR NEXT BUILD STARTS HERE</span><h2 id="cart-title">Your cart <span className="text-gold">({count})</span></h2>{cart.length ? <><div>{cart.map((line, index) => { const item = items.find(i => i.id === line.itemId); return <div key={`${line.itemId}-${line.variant}`} className="cart-line"><div><b>{item?.title ?? 'Unavailable item'}</b><small>{variantLabel(line.variant)} · {item ? money(priceFor(item, line.variant)) : 'Please remove this item'}{item && !item.active && ' · Unavailable'}</small></div><div className="quantity-control"><button disabled={busy} onClick={() => changeQuantity(index, -1)} aria-label={`Reduce ${item?.title ?? 'item'} quantity`}><Minus size={14} /></button><span>{line.quantity}</span><button disabled={busy || line.variant === 'workshop' || line.quantity >= 99} onClick={() => changeQuantity(index, 1)} aria-label={`Increase ${item?.title ?? 'item'} quantity`}><Plus size={14} /></button></div></div>; })}</div><p className="text-sm text-white/50 my-6">Your request is saved before WhatsApp opens. Golden Spark will confirm the final price, availability, and payment instructions with you.</p><form onSubmit={submit} className="project-form"><label>Your name<input required maxLength={120} value={customer} onChange={e => setCustomer(e.target.value)} autoComplete="name" /></label><label>Phone or email<input required maxLength={120} value={contact} onChange={e => setContact(e.target.value)} autoComplete="tel" /></label><label>Notes (optional)<textarea maxLength={1000} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Tell us about any requirements" /></label>{(!configured || !validWhatsapp) && <p role="status" className="text-sm text-gold">WhatsApp ordering is being set up. Contact support@goldenspark.me for assistance.</p>}{error && <p role="alert" className="text-red-300">{error}</p>}<button className="btn-primary flex items-center justify-center gap-3" disabled={busy || !configured || !validWhatsapp || cart.some(l => !items.find(i => i.id === l.itemId && i.active))}>{busy ? 'Saving your request…' : 'Request order on WhatsApp'}<ArrowUpRight size={18} /></button></form></> : <div className="py-16 text-center"><ShoppingBag className="mx-auto text-gold mb-6" size={42} /><p className="text-white/60">Your cart is waiting for its first spark.</p><button className="btn-secondary mt-8" onClick={() => setCartOpen(false)}>Explore projects</button></div>}</section></div>}
  </div>;
}
