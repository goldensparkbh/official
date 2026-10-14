import source from '@/data/fabrication.json';
import courses from '@/data/courses.json';

export type Variant = 'assembled' | 'kit' | 'component' | 'workshop';
export type Item = { id: string; title: string; description: string; price: number | null; active: boolean; image: string; kitImage?: string; assembledImage?: string; projectImage?: string; difficulty?: string; hours?: number; outcomes?: string[]; kind: 'project' | 'component' | 'course'; category: string; platform: string; parts: string[]; related: string[]; assembledPrice: number | null };
export type CartLine = { itemId: string; variant: Variant; quantity: number };
export type OrderLine = CartLine & { title: string; price: number | null };
export type Order = { id: string; owner: string; customer: string; contact: string; notes: string; status: string; lines: OrderLine[]; createdAt: number; updatedAt: number; paidAmount: number | null };
export const statuses = ['awaiting_confirmation', 'awaiting_payment', 'paid', 'in_progress', 'completed', 'cancelled'];
export const variantLabel = (v: Variant) => v === 'assembled' ? 'Assembled project' : v === 'kit' ? 'Unassembled kit' : v === 'workshop' ? 'Workshop PDF package' : 'Additional component';
export const money = (value: number | null) => value === null ? 'Price on request' : `BHD ${value.toFixed(3)}`;
export const partId = (name: string) => `part-${encodeURIComponent(name.toLowerCase().trim()).replaceAll('%', '_')}`;
const componentNames = [...new Set(source.projects.flatMap(p => p.parts))];
export const initialItems: Item[] = [
  ...source.projects.map(p => ({ id: p.id, title: p.title, description: p.description, price: null, assembledPrice: null, active: true, image: '/images/projects/Sparkbox001.jpeg', kitImage: '/images/projects/Sparkbox002.jpeg', assembledImage: '/images/projects/Sparkbox003.jpeg', projectImage: p.image.replace('/images/', '/images/projects/'), kind: 'project' as const, category: p.category, platform: p.platform, difficulty: p.difficulty, hours: p.hours, outcomes: p.outcomes, parts: p.parts, related: p.parts.map(partId) })),
  ...componentNames.map(name => ({ id: partId(name), title: name, description: `Additional ${name.toLowerCase()} for your project. Compatibility will be confirmed with Golden Spark.`, price: null, assembledPrice: null, active: true, image: '', kind: 'component' as const, category: 'Components', platform: '', parts: [], related: [] })),
  ...source.addons.map(a => ({ id: a.id, title: a.title, description: a.description, price: null, assembledPrice: null, active: true, image: '', kind: 'component' as const, category: 'Tools', platform: '', parts: [], related: [] })),
  ...courses.map(c => ({ id:c.id, title:c.title, description:c.description, price:null, assembledPrice:null, active:true, image:c.previewImage, kind:'course' as const, category:c.track, platform:c.level, hours:c.hours, outcomes:c.outcomes, parts:[], related:c.projectIds })),
];
export const priceFor = (item: Item, variant: Variant) => variant === 'assembled' ? item.assembledPrice : item.price;
export function mergeItems(remote: Item[]): Item[] {
  const merged = new Map(initialItems.map(item => [item.id, item]));
  remote.forEach(item => merged.set(item.id, item));
  return [...merged.values()];
}
export function whatsappMessage(order: Order) {
  return [`Hello Golden Spark, I would like to order:`, `Order reference: ${order.id}`, `Name: ${order.customer}`, `Contact: ${order.contact}`, ...order.lines.map(l => `${l.quantity} × ${l.title} (${variantLabel(l.variant)}) — ${money(l.price)} each`), order.notes && `Notes: ${order.notes}`, 'Please confirm availability, the final price, and payment instructions.'].filter(Boolean).join('\n');
}
