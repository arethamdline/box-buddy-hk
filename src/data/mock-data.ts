export const plans = [
  { id: 'box', name: 'Door-to-door boxes', zh: '上門迷你箱', price: 79, unit: 'box / month', note: 'We collect, store and return.' },
  { id: 'locker', name: 'Personal locker', zh: '私人儲物櫃', price: 328, unit: 'month', note: '24/7 self-access in Kwun Tong.' },
  { id: 'room', name: 'Storage room', zh: '迷你倉', price: 688, unit: 'month', note: 'From 12 sq ft, climate controlled.' },
];
export const slots = [
  { time: '09:00–11:00', available: true, label: '3 left' }, { time: '11:00–13:00', available: false, label: 'Fully booked' }, { time: '14:00–16:00', available: true, label: '1 left' }, { time: '16:00–18:00', available: true, label: 'Available' }, { time: '18:00–20:00', available: false, label: 'Fully booked' },
];
export const rentals = [
  { id: 'BH-24091', plan: 'Door-to-door boxes', detail: '6 boxes · 6 months', status: 'Active', start: '12 Aug 2026', next: 'Return delivery · 2 Oct, 14:00', paid: 'HK$474.00' },
  { id: 'BH-23802', plan: 'Personal locker', detail: 'Medium · 12 months', status: 'Active', start: '4 Jun 2026', next: 'No visit scheduled', paid: 'HK$3,936.00' },
];
export const bookings = [
  { id:'BK-1058', customer:'Mandy Ho', plan:'6 Storage boxes', date:'29 Sep', time:'09:00', status:'Confirmed', payment:'Paid', amount:'HK$690' }, { id:'BK-1059', customer:'Jason Wong', plan:'Small unit', date:'29 Sep', time:'11:00', status:'Pending Payment', payment:'Pending', amount:'HK$1,280' }, { id:'BK-1060', customer:'Ana Lee', plan:'12 Storage boxes', date:'29 Sep', time:'14:00', status:'Active', payment:'Paid', amount:'HK$1,038' }, { id:'BK-1061', customer:'Leo Chan', plan:'Medium unit', date:'30 Sep', time:'10:00', status:'Completed', payment:'Paid', amount:'HK$2,240' }, { id:'BK-1062', customer:'Nicole Tam', plan:'4 Storage boxes', date:'30 Sep', time:'16:00', status:'Cancelled', payment:'Refunded', amount:'HK$316' },
];
export const payments = [
  { id:'PAY-8821', date:'12 Aug 2026', item:'Rental BH-24091', method:'FPS', amount:'HK$474.00', status:'Paid' }, { id:'PAY-8504', date:'4 Jun 2026', item:'Rental BH-23802', method:'AlipayHK', amount:'HK$3,936.00', status:'Paid' }, { id:'PAY-8505', date:'4 Jun 2026', item:'Refundable deposit', method:'AlipayHK', amount:'HK$500.00', status:'Held' },
];
export const knowledge = [
  { category:'Storage Plans', title:'Door-to-door box sizes', summary:'Standard 60L boxes and XL 95L boxes.', enabled:true }, { category:'Pricing', title:'Monthly box pricing', summary:'From HK$79 per box each month.', enabled:true }, { category:'Rental Terms', title:'Minimum rental period', summary:'One month minimum; flexible extensions.', enabled:true }, { category:'Prohibited Items', title:'Items we cannot store', summary:'Food, liquids, plants, weapons and hazardous materials.', enabled:true }, { category:'Access Hours', title:'Self-storage opening times', summary:'Selected facilities offer 24/7 smart access.', enabled:false }, { category:'Pickup / Delivery', title:'Service areas', summary:'Hong Kong Island, Kowloon and New Territories.', enabled:true }, { category:'Deposit Policy', title:'Refund timeline', summary:'Reviewed within 3 business days after return.', enabled:true }, { category:'Frequently Asked Questions', title:'Can I add more boxes later?', summary:'Yes, subject to availability and a new pickup slot.', enabled:true },
];
export const boxItems = [
  { id: 'small', name: 'Small box', size: '35L', price: 30 },
  { id: 'medium', name: 'Medium box', size: '60L', price: 40 },
  { id: 'large', name: 'Large box', size: '95L', price: 60 },
  { id: 'xl', name: 'Extra-large box', size: '120L', price: 45, promo: true },
  { id: 'luggage', name: 'Large luggage', size: '≤ 32"', price: 60 },
];
export const unitSizes = { locker: [{ id: 'Small', area: 12, price: 328 }, { id: 'Medium', area: 20, price: 428 }, { id: 'Large', area: 32, price: 568 }], room: [{ id: 'Small', area: 12, price: 688 }, { id: 'Medium', area: 20, price: 988 }, { id: 'Large', area: 32, price: 1388 }] };
export const fees = { pickup: 100, parking: 80, promoDiscount: 0.05, promoMinTerm: 3 };
export const specialOffer = { items: { xl: 6, luggage: 1 } as Record<string, number>, term: 3 };
export const locations = [
  { id: 'kt', name: 'Kwun Tong Hub', type: 'Warehouse & lockers', district: 'Kwun Tong', address: '88 Hoi Bun Road, Kwun Tong', mtr: 'Kwun Tong', hours: 'Open 24/7', km: 1.2 },
  { id: 'np', name: 'North Point', type: 'Drop-off point', district: 'Eastern', address: '18 Java Road, North Point', mtr: 'North Point', hours: '09:00–21:00', km: 3.8 },
  { id: 'cw', name: 'Chai Wan', type: 'Storage rooms', district: 'Eastern', address: '12 Lee Chung Street, Chai Wan', mtr: 'Chai Wan', hours: 'Open 24/7', km: 6.4 },
  { id: 'ksl', name: 'Kwai Chung', type: 'Warehouse & lockers', district: 'Kwai Tsing', address: '223 Wo Yi Hop Road, Kwai Chung', mtr: 'Kwai Hing', hours: 'Open 24/7', km: 9.1 },
  { id: 'st', name: 'Sha Tin', type: 'Drop-off point', district: 'Sha Tin', address: '1 Yuen Shun Circuit, Sha Tin', mtr: 'Shek Mun', hours: '10:00–20:00', km: 11.5 },
  { id: 'tm', name: 'Tuen Mun', type: 'Storage rooms', district: 'Tuen Mun', address: '8 San On Street, Tuen Mun', mtr: 'Tuen Mun', hours: 'Open 24/7', km: 24.3 },
];
