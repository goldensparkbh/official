export const statuses = ['awaiting_confirmation', 'awaiting_payment', 'paid', 'in_progress', 'completed', 'cancelled'];
export function validateRequest(data) {
  if (!data || !/^[a-f0-9-]{36}$/.test(data.id) || typeof data.customer !== 'string' || !data.customer.trim() || data.customer.length > 120 || typeof data.contact !== 'string' || !data.contact.trim() || data.contact.length > 120 || typeof data.notes !== 'string' || data.notes.length > 1000 || !Array.isArray(data.lines) || !data.lines.length || data.lines.length > 50) throw new Error('Please provide a name, contact and between 1 and 50 items.');
  const keys = new Set();
  for (const l of data.lines) {
    if (!l || typeof l.itemId !== 'string' || !l.itemId || l.itemId.length > 300 || l.itemId.includes('/') || !['assembled', 'kit', 'component', 'workshop'].includes(l.variant) || !Number.isInteger(l.quantity) || l.quantity < 1 || l.quantity > 99 || (l.variant === 'workshop' && l.quantity !== 1) || keys.has(`${l.itemId}:${l.variant}`)) throw new Error('Invalid cart item or quantity.');
    keys.add(`${l.itemId}:${l.variant}`);
  }
}
export function snapshotLine(line, item) {
  const allowed = item?.kind === 'project' ? ['assembled', 'kit'] : item?.kind === 'course' ? ['workshop'] : item?.kind === 'component' ? ['component'] : [];
  if (!item || !item.active || !allowed.includes(line.variant)) throw new Error('An item is no longer available. Please refresh your cart.');
  const price = line.variant === 'assembled' ? item.assembledPrice : item.price;
  if (price !== null && (typeof price !== 'number' || !Number.isFinite(price) || price < 0)) throw new Error('This item requires a pricing correction.');
  return { itemId: line.itemId, variant: line.variant, quantity: line.quantity, title: item.title, price };
}
export function canDownloadWorkshop(order, owner, courseId) {
  return order?.owner === owner && ['paid', 'in_progress', 'completed'].includes(order.status)
    && Array.isArray(order.lines) && order.lines.some(line => line.itemId === courseId && line.variant === 'workshop');
}
export function validateStatus(current, next, paidAmount) {
  const transitions = { awaiting_confirmation: ['awaiting_payment', 'paid', 'cancelled'], awaiting_payment: ['paid', 'cancelled'], paid: ['in_progress', 'completed'], in_progress: ['completed'], completed: [], cancelled: [] };
  if (!statuses.includes(next) || (current !== next && !transitions[current]?.includes(next))) throw new Error('This order cannot move to that status.');
  if (['paid', 'in_progress', 'completed'].includes(next) && (typeof paidAmount !== 'number' || !Number.isFinite(paidAmount) || paidAmount < 0)) throw new Error('Enter the confirmed payment amount first.');
}
