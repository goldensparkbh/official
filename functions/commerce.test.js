import test from 'node:test';
import assert from 'node:assert/strict';
import { validateRequest, snapshotLine, validateStatus, canDownloadWorkshop } from './commerce.js';
const data = { id: 'd9883c90-52c1-4eba-b2f7-b47125c61a90', customer: 'Maker', contact: '+97312345678', notes: '', lines: [{ itemId: 'FS-001', variant: 'assembled', quantity: 2 }] };
test('order validation rejects empty, duplicate and fractional cart quantities', () => {
  validateRequest(data);
  for (const lines of [[], [data.lines[0], data.lines[0]], [{ ...data.lines[0], quantity: 1.5 }], [{ ...data.lines[0], quantity: 100 }], [{ ...data.lines[0], itemId: '../private' }]]) assert.throws(() => validateRequest({ ...data, lines }));
});
test('only a paid owner can download the specific purchased workshop', () => {
  const order={owner:'customer-a',status:'paid',lines:[{itemId:'AI-101',variant:'workshop',quantity:1}]};
  assert.equal(canDownloadWorkshop(order,'customer-a','AI-101'),true);
  assert.equal(canDownloadWorkshop(order,'customer-b','AI-101'),false);
  assert.equal(canDownloadWorkshop(order,'customer-a','AI-102'),false);
  assert.equal(canDownloadWorkshop({...order,status:'awaiting_payment'},'customer-a','AI-101'),false);
  assert.equal(canDownloadWorkshop({...order,status:'cancelled'},'customer-a','AI-101'),false);
  assert.equal(canDownloadWorkshop({...order,lines:[{itemId:'AI-101',variant:'component'}]},'customer-a','AI-101'),false);
});
test('workshop purchase enforces one license and a course item', () => {
  const line={itemId:'AI-101',variant:'workshop',quantity:1};
  validateRequest({...data,lines:[line]});
  assert.throws(()=>validateRequest({...data,lines:[{...line,quantity:2}]}));
  assert.equal(snapshotLine(line,{kind:'course',active:true,title:'AI Essentials',price:12}).price,12);
  assert.throws(()=>snapshotLine(line,{kind:'component',active:true,title:'Board',price:12}));
});
test('server prices override client prices and respect variant and availability', () => {
  const item = { title: 'Robot', active: true, kind: 'project', price: null, assembledPrice: 15 };
  assert.equal(snapshotLine({ ...data.lines[0], price: 0 }, item).price, 15);
  assert.equal(snapshotLine({ ...data.lines[0], variant: 'kit' }, item).price, null);
  assert.throws(() => snapshotLine(data.lines[0], { ...item, active: false }));
  assert.throws(() => snapshotLine({ ...data.lines[0], variant: 'component' }, item));
});
test('payment is an admin-confirmed transition with a recorded amount', () => {
  assert.throws(() => validateStatus('awaiting_confirmation', 'completed', 10));
  assert.throws(() => validateStatus('awaiting_payment', 'paid', null));
  assert.throws(() => validateStatus('awaiting_payment', 'paid', -1));
  validateStatus('awaiting_payment', 'paid', 10);
  validateStatus('paid', 'in_progress', 10);
  assert.throws(() => validateStatus('completed', 'awaiting_payment', null));
});
