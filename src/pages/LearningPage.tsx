import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowUpRight, BookOpen, Check, Download, FileText, GraduationCap, Lock, Search, ShoppingBag } from 'lucide-react';
import { onAuthStateChanged, signInWithEmailAndPassword, linkWithCredential, EmailAuthProvider, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { courses, guides as defaultGuides } from '@/data/learning';
import { auth, configured, db, downloadWorkshop, watchGuides, watchItems } from '@/lib/store';
import { initialItems, mergeItems, money } from '@/lib/catalog';
import type { CartLine, Item, Order } from '@/lib/catalog';

export default function LearningPage({ route }: { route: string }) {
  const [allGuides, setGuides] = useState(defaultGuides);
  const guides = allGuides.filter(guide => guide.active !== false);
  useEffect(() => watchGuides(setGuides, e => setMessage(e.message)), []);
  const [items,setItems]=useState<Item[]>(initialItems);
  const [track,setTrack]=useState('All subjects');
  const [level,setLevel]=useState('All levels');
  const [search,setSearch]=useState('');
  const [message,setMessage]=useState('');
  const [busy,setBusy]=useState('');
  const [orders,setOrders]=useState<Order[]>([]);
  const [signedIn,setSignedIn]=useState(false);
  const [anonymous,setAnonymous]=useState(false);
  const [accountMode,setAccountMode]=useState<'signin'|'create'>('signin');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const catalog=courses.map(c=>{
    const item=items.find(i=>i.id===c.id&&i.kind==='course');
    return {...c,title:item?.title??c.title,description:item?.description??c.description,previewImage:item?.image||c.previewImage,outcomes:item?.outcomes??c.outcomes,hours:item?.hours??c.hours,level:item?.platform||c.level,track:item?.category||c.track};
  });
  const section=route.startsWith('#/learn/tutorials')?'Tutorials':route.startsWith('#/learn/journal')?'Journal':route.startsWith('#/learn/library')?'My library':'Workshops';
  const slug=route.split('/')[3];
  const article=section==='Tutorials'||section==='Journal'?guides.find(g=>g.id===slug):null;
  const course=section==='Workshops'?catalog.find(c=>c.slug===slug):null;
  useEffect(()=>watchItems(remote=>setItems(mergeItems(remote)),e=>setMessage(e.message)),[]);
  useEffect(()=>{
    if(!auth||!db)return;
    let stop=()=>{};
    const stopAuth=onAuthStateChanged(auth,user=>{
      stop();setOrders([]);setSignedIn(Boolean(user));setAnonymous(Boolean(user?.isAnonymous));
      if(user)stop=onSnapshot(query(collection(db!,'projectOrders'),where('owner','==',user.uid)),snap=>setOrders(snap.docs.map(d=>({...d.data(),id:d.id}) as Order)),e=>setMessage(e.message));
    });return()=>{stop();stopAuth();};
  },[]);
  const unlocked=new Set(orders.filter(o=>['paid','in_progress','completed'].includes(o.status)).flatMap(o=>o.lines.filter(l=>l.variant==='workshop').map(l=>l.itemId)));
  const currentItem=(id:string)=>items.find(i=>i.id===id&&i.kind==='course');
  const add=(id:string)=>{
    try {
      const stored:unknown=JSON.parse(localStorage.getItem('golden-spark-cart')??'[]');
      const cart:CartLine[]=Array.isArray(stored)?stored.filter(l=>l&&typeof l.itemId==='string'&&Number.isInteger(l.quantity)&&l.quantity>0&&l.quantity<=99&&['assembled','kit','component','workshop'].includes(l.variant)):[];
      if(!cart.some(l=>l.itemId===id&&l.variant==='workshop')){
        if(cart.length>=50){setMessage('Your cart is full. Please remove an item before adding a workshop.');return;}
        cart.push({itemId:id,variant:'workshop',quantity:1});
      }
      localStorage.setItem('golden-spark-cart',JSON.stringify(cart));window.location.hash='/projects/cart';
    }catch{setMessage('Unable to save the cart in this browser. Please allow site storage and try again.');}
  };
  const download=async(id:string)=>{setBusy(id);setMessage('');try{await downloadWorkshop(id);}catch(e){setMessage(e instanceof Error?e.message:'Unable to download.');}finally{setBusy('');}};
  const account=async(event:React.FormEvent)=>{
    event.preventDefault();setBusy('signin');setMessage('');
    try{
      if(!auth)throw new Error('Customer accounts are being connected.');
      if(accountMode==='signin' && !auth.currentUser?.isAnonymous)await signInWithEmailAndPassword(auth,email,password);
      else if(auth.currentUser?.isAnonymous)await linkWithCredential(auth.currentUser,EmailAuthProvider.credential(email,password));
      else await createUserWithEmailAndPassword(auth,email,password);
      setPassword('');setAnonymous(false);setSignedIn(true);
    }catch(e){setMessage(e instanceof Error?e.message:'Unable to save your account.');}finally{setBusy('');}
  };
  const display=catalog.filter(c=>currentItem(c.id)?.active&&(track==='All subjects'||c.track===track)&&(level==='All levels'||c.level===level)&&`${c.title} ${c.description} ${c.modules.join(' ')}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="projects-page learning-page">
    <div className="project-toolbar"><a className="project-subtle" href="#"><ArrowLeft size={15}/> Golden Spark</a><div className="flex gap-5"><a className="project-subtle" href="#/projects/admin">Control panel</a><a className="project-cart-button" href="#/projects/cart"><ShoppingBag size={18}/> Cart</a></div></div>
    <header className="learning-hero"><span className="micro-label text-gold">GOLDEN SPARK PROJECTS / LEARNING STUDIO</span><h1>UNDERSTAND IT.<br/><span className="text-gold">BUILD WITH IT.</span></h1><p>Project tutorials, practical workshop packages, and a clear path from your first circuit to advanced AI workflows.</p><div className="learning-stats"><span>12 standalone workshops</span><span>Beginner / intermediate / advanced</span><span>Practical work in every course</span></div></header>
    <nav className="learning-tabs" aria-label="Learning sections">{['Workshops','Tutorials','Journal','My library'].map(t=><a key={t} aria-current={section===t?'page':undefined} className={section===t?'active':''} href={`#/learn/${t==='My library'?'library':t.toLowerCase()}`}>{t==='Workshops'?<GraduationCap size={17}/>:t==='My library'?<Download size={17}/>:<BookOpen size={17}/>} {t}</a>)}</nav>
    {message&&<p role="status" className="project-alert">{message}</p>}
    {article?<article className="learning-article"><a href={`#/learn/${article.type==='Tutorial'?'tutorials':'journal'}`} className="project-subtle"><ArrowLeft size={16}/> All {article.type==='Tutorial'?'tutorials':'articles'}</a><span className="micro-label text-gold mt-8 block">{article.category} / {article.minutes} MIN READ</span><h2>{article.title}</h2><p className="article-intro">{article.intro}</p>{article.sections.map(s=><section key={s.title}><h3>{s.title}</h3><p>{s.body}</p>{s.code&&<pre><code>{s.code}</code></pre>}</section>)}{article.sources.length>0&&<section><h3>Further reading</h3>{article.sources.map(s=><a className="source-link" href={s.url} key={s.url} target="_blank" rel="noreferrer">{s.title}<ArrowUpRight size={16}/></a>)}</section>}{article.projectIds.length>0&&<section><h3>Explore the related projects</h3><div className="related-items">{initialItems.filter(i=>article.projectIds.includes(i.id)).map(i=><a className="source-link" key={i.id} href={`#/projects/item/${i.id}`}>{i.title}<ArrowUpRight size={16}/></a>)}</div></section>}</article>:course?<article className="course-detail"><a href="#/learn/workshops" className="project-subtle"><ArrowLeft size={16}/> All workshops</a><div className="course-detail-grid"><div><span className="micro-label text-gold">{course.track} / {course.level}</span><h2>{course.title}</h2><p>{course.description}</p><div className="course-facts"><span>{course.hours} workshop hours</span><span>{course.slideCount} slides</span><span>PDF workshop download</span></div><h3>What you’ll be able to do</h3>{course.outcomes.map(o=><p key={o} className="course-outcome"><Check size={18}/>{o}</p>)}<h3>Before you begin</h3><p>{course.prerequisites}</p></div><aside><img src={course.previewImage} alt={`${course.title} cover slide`} /><div className="course-buy"><strong>{money(currentItem(course.id)?.price??null)}</strong><p>The complete workshop PDF includes worked examples, practical activities, expected results, a capstone and answer keys.</p>{unlocked.has(course.id)?<button className="btn-primary" disabled={busy===course.id} onClick={()=>void download(course.id)}><Download size={18}/> {busy===course.id?'Preparing…':'Download workshop PDF'}</button>:<button className="btn-primary" disabled={!currentItem(course.id)?.active} onClick={()=>add(course.id)}>Add workshop to cart <ArrowUpRight size={18}/></button>}<small>Payment is arranged with Golden Spark on WhatsApp. Your PDF unlocks after payment is confirmed. Editable PowerPoint files are retained by Golden Spark.</small></div></aside></div><section className="course-outline"><h3>Inside the workshop</h3>{course.modules.map((module,index)=><div key={module}><span>0{index+1}</span><p>{module}</p><small>Concept / practical / review</small></div>)}</section></article>:section==='Workshops'?<section className="learning-collection"><div className="collection-heading"><div><span className="micro-label text-gold">READY-TO-USE TRAINING MATERIALS</span><h2>A workshop for your <span className="text-gold">next step.</span></h2></div><label className="project-search"><Search size={18}/><input aria-label="Search workshops" placeholder="Search workshops" value={search} onChange={e=>setSearch(e.target.value)}/></label></div><div className="learning-filter-row"><label>Subject<select value={track} onChange={e=>setTrack(e.target.value)}>{['All subjects','Electronics','AI & Automation'].map(t=><option key={t}>{t}</option>)}</select></label><label>Level<select value={level} onChange={e=>setLevel(e.target.value)}>{['All levels','Beginner','Intermediate','Advanced'].map(l=><option key={l}>{l}</option>)}</select></label></div><p className="text-white/50 text-sm mb-6">Two beginner, two intermediate, and two advanced courses in each subject. Buy any course separately.</p><div className="project-grid">{display.map(c=><article className="project-card course-card" key={c.id}><a href={`#/learn/workshops/${c.slug}`}><img loading="lazy" src={c.previewImage} alt={`${c.title} workshop preview`}/></a><div className="project-card-body"><span className="micro-label text-gold">{c.track} / {c.level}</span><h3><a href={`#/learn/workshops/${c.slug}`}>{c.title}</a></h3><p>{c.description}</p><div className="course-meta"><span>{c.hours} hours</span><span>{c.slideCount} slides</span><span>Practical work</span></div><div className="project-card-footer"><span>{money(currentItem(c.id)?.price??null)}</span><a aria-label={`View ${c.title}`} href={`#/learn/workshops/${c.slug}`}><ArrowUpRight size={23}/></a></div></div></article>)}</div>{!display.length&&<p className="py-12">No workshops match these filters.</p>}</section>:section==='My library'?<section className="learning-collection"><span className="micro-label text-gold">YOUR PURCHASED MATERIALS</span><h2>My workshop library</h2><p className="text-white/60 my-6">Confirmed paid workshops unlock here. Open the browser used for your purchase, or sign in to the account you used for the order.</p>{!configured?<p className="admin-message">Customer downloads are being connected. Your purchases will appear here when the shared store is enabled.</p>:!signedIn?<form className="project-form admin-login" onSubmit={account}><h3>{accountMode === 'signin' ? 'Purchasing account sign in' : 'Create your purchasing account'}</h3><label>Email<input required type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Password<input required minLength={6} type="password" autoComplete={accountMode==='create'?'new-password':'current-password'} value={password} onChange={e=>setPassword(e.target.value)}/></label><button disabled={busy==='signin'} className="btn-primary">{accountMode==='signin'?'Sign in':'Create account'}</button><button type="button" className="project-subtle" onClick={()=>setAccountMode(accountMode==='signin'?'create':'signin')}>{accountMode==='signin'?'Create an account before your next purchase':'Already have an account? Sign in'}</button></form>:<>{anonymous && <form className="project-form admin-login mb-8" onSubmit={e=>{setAccountMode('create'); void account(e);}}><h3>Keep your purchases across devices</h3><p className="text-white/60 text-sm">Add an email and password to this browser’s purchasing identity. Existing orders stay linked to the same account.</p><label>Email<input required type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Password<input required minLength={6} type="password" autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)}/></label><button disabled={busy==='signin'} className="btn-secondary">Save purchasing account</button></form>}{!unlocked.size&&<div className="library-empty"><Lock size={35}/><p>No paid workshop PDFs yet. Pending orders unlock after Golden Spark confirms payment.</p><a href="#/learn/workshops" className="btn-secondary">Explore workshops</a></div>}<div className="project-grid">{catalog.filter(c=>unlocked.has(c.id)).map(c=><article className="project-card" key={c.id}><div className="project-card-body"><FileText className="text-gold" size={32}/><h3>{c.title}</h3><p>{c.slideCount} workshop slides in PDF format.</p><button className="btn-primary" disabled={busy===c.id} onClick={()=>void download(c.id)}>{busy===c.id?'Preparing…':'Download PDF'}</button></div></article>)}</div></>}</section>:<section className="learning-collection"><span className="micro-label text-gold">{section==='Tutorials'?'LEARN THROUGH YOUR PROJECT':'NOTES FROM THE WORKBENCH'}</span><h2>{section==='Tutorials'?'Project tutorials':'The Golden Spark journal'}</h2><div className="project-grid mt-10">{guides.filter(g=>g.type===(section==='Tutorials'?'Tutorial':'Journal')).map(g=><article className="project-card" key={g.id}><div className="project-card-body"><BookOpen className="text-gold" size={30}/><span className="micro-label text-gold block mt-6">{g.category} / {g.minutes} MIN READ</span><h3>{g.title}</h3><p>{g.intro}</p><a className="source-link mt-6" href={`#/learn/${g.type==='Tutorial'?'tutorials':'journal'}/${g.id}`}>Read {g.type==='Tutorial'?'tutorial':'article'}<ArrowUpRight size={18}/></a></div></article>)}</div></section>}
    <footer className="projects-footer"><img src="/images/learning/golden-spark-projects.svg" alt="Golden Spark Projects"/><span>Practical knowledge. Thoughtful making.</span><a href="mailto:support@goldenspark.me">support@goldenspark.me</a></footer>
  </div>;
}
