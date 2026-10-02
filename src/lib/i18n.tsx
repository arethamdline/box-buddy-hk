import { useSyncExternalStore } from 'react';

export type Lang = 'en' | 'zh-Hant' | 'zh-Hans';
export const languages: { id: Lang; label: string; short: string }[] = [
  { id: 'en', label: 'English', short: 'EN' },
  { id: 'zh-Hant', label: '繁體中文', short: '繁' },
  { id: 'zh-Hans', label: '简体中文', short: '简' },
];
const KEY = 'storage-lang';
let current: Lang = 'en';
const listeners = new Set<() => void>();
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem(KEY) as Lang | null;
  if (saved && languages.some((l) => l.id === saved)) current = saved;
}
export function setLang(l: Lang) {
  current = l;
  localStorage.setItem(KEY, l);
  document.documentElement.lang = l === 'en' ? 'en' : l;
  listeners.forEach((f) => f());
}
const subscribe = (f: () => void) => { listeners.add(f); return () => listeners.delete(f); };
export function useLang() {
  return useSyncExternalStore(subscribe, () => current, () => 'en' as Lang);
}

// [繁體, 简体] keyed by English source text
const dict: Record<string, [string, string]> = {
  Home: ['首頁', '首页'], 'Ask Bot': ['問 Bot', '问 Bot'], Book: ['預約', '预约'], 'My storage': ['我的倉', '我的仓'], Staff: ['職員', '职员'], Language: ['語言', '语言'],
  'Secure storage, local support': ['安全儲存・本地支援', '安全储存・本地支持'],
  'More room for life in Hong Kong.': ['為香港生活騰出更多空間。', '为香港生活腾出更多空间。'],
  'We collect, store and return your things—or give you a private unit you can visit anytime.': ['我們上門收取、儲存及送還你的物品，或提供可隨時到訪的私人倉位。', '我们上门收取、储存及送还你的物品，或提供可随时到访的私人仓位。'],
  'Book storage': ['預約儲存', '预约储存'], 'Get instant answers in English or Chinese': ['即時以中英文解答', '即时以中英文解答'],
  'STORAGE YOUR WAY': ['按你所需', '按你所需'], 'Choose what fits': ['選擇合適方案', '选择合适方案'], 'Compare all plans →': ['比較所有方案 →', '比较所有方案 →'], Popular: ['熱門', '热门'],
  'Door-to-door boxes': ['上門迷你箱', '上门迷你箱'], 'Personal locker': ['私人儲物櫃', '私人储物柜'], 'Storage room': ['迷你倉', '迷你仓'],
  'box / month': ['箱 / 月', '箱 / 月'], month: ['月', '月'], from: ['起', '起'],
  'We collect, store and return.': ['上門收取、儲存及送還。', '上门收取、储存及送还。'], '24/7 self-access in Kwun Tong.': ['觀塘 24 小時自助存取。', '观塘 24 小时自助存取。'], 'From 12 sq ft, climate controlled.': ['12 平方呎起，恆溫恆濕。', '12 平方尺起，恒温恒湿。'],
  'Need your boxes back?': ['需要取回箱子？', '需要取回箱子？'], 'Schedule a return delivery in under a minute.': ['一分鐘內安排送還。', '一分钟内安排送还。'], 'Open my storage': ['打開我的倉', '打开我的仓'],
  'We cover all 18 districts': ['服務全港十八區', '服务全港十八区'], 'Pickup and delivery across Hong Kong Island, Kowloon and the New Territories.': ['港島、九龍及新界均可上門收送。', '港岛、九龙及新界均可上门收送。'],
  'Prototype experience · No real payments are processed': ['原型展示・不會進行真實付款', '原型展示・不会进行真实付款'],
  // locations
  'Find a service point': ['尋找服務點', '寻找服务点'], 'Search your location': ['搜尋你的位置', '搜索你的位置'], 'District, street or MTR station': ['地區、街道或港鐵站', '地区、街道或港铁站'],
  'View all locations': ['查看所有地點', '查看所有地点'], 'All locations': ['所有地點', '所有地点'], Nearest: ['最近', '最近'], 'No matching locations': ['找不到相符地點', '找不到相符地点'], 'Use my location': ['使用我的位置', '使用我的位置'],
  'Warehouse & lockers': ['貨倉及儲物櫃', '货仓及储物柜'], 'Drop-off point': ['收件點', '收件点'], 'Storage rooms': ['迷你倉', '迷你仓'], 'Open 24/7': ['24 小時開放', '24 小时开放'], 'Directions': ['路線', '路线'],
  // booking
  Plan: ['方案', '方案'], Size: ['尺寸', '尺寸'], Items: ['物品', '物品'], Term: ['租期', '租期'], Start: ['開始', '开始'], Service: ['服務', '服务'], Time: ['時段', '时段'], Review: ['確認', '确认'], Payment: ['付款', '付款'], Done: ['完成', '完成'],
  'Booking confirmed': ['預約已確認', '预约已确认'], Step: ['步驟', '步骤'], of: ['/', '/'], Continue: ['繼續', '继续'], Back: ['返回', '返回'],
  'Choose your boxes': ['選擇箱子', '选择箱子'], 'Choose your size': ['選擇尺寸', '选择尺寸'], 'Prices per item, per month': ['每件每月價格', '每件每月价格'],
  'Small box': ['細箱', '小箱'], 'Medium box': ['中箱', '中箱'], 'Large box': ['大箱', '大箱'], 'Extra-large box': ['特大箱', '特大箱'], 'Large luggage': ['大型行李', '大型行李'],
  Small: ['細', '小'], Medium: ['中', '中'], Large: ['大', '大'],
  'Special offer': ['特別優惠', '特别优惠'], 'Apply offer': ['套用優惠', '套用优惠'], 'Offer applied': ['已套用優惠', '已套用优惠'],
  'Extra-large boxes ×6 + Large luggage ×1 · 3 months · 5% off': ['特大箱 ×6 + 大型行李 ×1・3 個月・95 折', '特大箱 ×6 + 大型行李 ×1・3 个月・95 折'],
  'Maximum flexibility': ['最具彈性', '最具弹性'], '5% off storage': ['儲存費 95 折', '储存费 95 折'], 'Best long-term value': ['長租最划算', '长租最划算'], months: ['個月', '个月'], 'month ': ['個月', '个月'],
  'Rental start date': ['租用開始日期', '租用开始日期'], 'The first available date is tomorrow.': ['最早可選明天。', '最早可选明天。'],
  Pickup: ['上門收取', '上门收取'], 'Drop-off': ['自行送倉', '自行送仓'], 'We collect from your address.': ['我們到你府上收取。', '我们到你府上收取。'], 'Bring items to our Kwun Tong hub.': ['將物品帶到觀塘中心。', '将物品带到观塘中心。'], Free: ['免費', '免费'], 'Included in offer': ['優惠已包', '优惠已包'],
  'Friday, 2 October 2026': ['2026年10月2日（星期五）', '2026年10月2日（星期五）'], 'Fully booked': ['已滿', '已满'], Available: ['有空位', '有空位'], left: ['個名額', '个名额'],
  'Everything look right?': ['資料正確嗎？', '资料正确吗？'], 'Confirm the details before proceeding to payment.': ['付款前請確認資料。', '付款前请确认资料。'], 'Proceed to payment': ['前往付款', '前往付款'],
  'Your reservation expires in': ['預留將於以下時間後失效', '预留将于以下时间后失效'], 'Secure checkout': ['安全付款', '安全付款'], 'Payment method': ['付款方式', '付款方式'], Pay: ['付款', '付款'], 'Simulation only — no payment will be taken': ['僅為模擬，不會扣款', '仅为模拟，不会扣款'],
  'PAYMENT RECEIVED': ['已收款', '已收款'], 'Your storage is booked.': ['你的儲存已預約。', '你的储存已预约。'], 'is confirmed. A sample confirmation has been added to your portal.': ['已確認，示範確認已加入你的帳戶。', '已确认，示范确认已加入你的账户。'], 'View my booking': ['查看我的預約', '查看我的预约'], 'Back home': ['返回首頁', '返回首页'],
  'Price breakdown': ['價格明細', '价格明细'], 'Booking summary': ['預約摘要', '预约摘要'], Selection: ['選擇', '选择'], Total: ['總額', '总额'], Subtotal: ['小計', '小计'], 'Storage per month': ['每月儲存費', '每月储存费'], Discount: ['折扣', '折扣'], 'Pickup service': ['上門收取服務', '上门收取服务'], 'Parking fee': ['泊車費', '停车费'], 'Choose at least one item': ['請最少選擇一件物品', '请最少选择一件物品'],
  'Offer conditions': ['優惠條款', '优惠条款'],
  'Special price includes initial delivery + final collection only.': ['特價只包首次送箱及最後收回。', '特价只包首次送箱及最后收回。'],
  'Interim access/final retrieval: $35 base + $15/box + $20 parking per trip.': ['中途存取／最終取回：每次 $35 基本費 + 每箱 $15 + $20 泊車費。', '中途存取／最终取回：每次 $35 基本费 + 每箱 $15 + $20 停车费。'],
  'Different final retrieval address: +$50 admin fee.': ['最終取回地址不同：另加 $50 行政費。', '最终取回地址不同：另加 $50 行政费。'],
  // portal
  'Good afternoon': ['午安', '下午好'], 'Mandy’s storage': ['Mandy 的儲存', 'Mandy 的储存'], 'Request return': ['要求送還', '要求送还'], Overview: ['概覽', '概览'], Rentals: ['租用', '租用'], Schedule: ['時間表', '时间表'], Payments: ['付款', '付款'], Deposits: ['按金', '押金'],
  'Request your boxes back': ['取回你的箱子', '取回你的箱子'], 'Choose an available return delivery window.': ['選擇可用的送還時段。', '选择可用的送还时段。'], 'Delivery requested': ['已要求送還', '已要求送还'], 'Delivery date': ['送還日期', '送还日期'], 'Confirm return': ['確認送還', '确认送还'],
  'Active rentals': ['租用中', '租用中'], 'Upcoming delivery': ['即將送還', '即将送还'], 'Deposit held': ['持有按金', '持有押金'], 'View all': ['查看全部', '查看全部'],
  'UPCOMING DELIVERY / PICKUP': ['即將送還／收取', '即将送还／收取'], 'Your 6 boxes are coming back': ['你的 6 個箱子即將送還', '你的 6 个箱子即将送还'], Date: ['日期', '日期'], Address: ['地址', '地址'], '2 October 2026': ['2026年10月2日', '2026年10月2日'],
  'Live status': ['即時狀態', '即时状态'], 'Scheduled for pickup': ['已安排收取', '已安排收取'], 'On the way to warehouse': ['正送往貨倉', '正送往货仓'], 'Arrived at warehouse': ['已抵達貨倉', '已抵达货仓'], 'Stored for 42 days': ['已儲存 42 日', '已储存 42 天'], 'Retrieval scheduled for Oct 2': ['已安排 10月2日 送還', '已安排 10月2日 送还'],
  'New pickup scheduled': ['新收取已安排', '新收取已安排'], '2 extra boxes · 5 Oct, 09:00–11:00': ['額外 2 箱・10月5日 09:00–11:00', '额外 2 箱・10月5日 09:00–11:00'], Confirmed: ['已確認', '已确认'], Active: ['使用中', '使用中'], Paid: ['已付', '已付'], Held: ['持有中', '持有中'], Refunded: ['已退款', '已退款'], 'Under Review': ['審核中', '审核中'],
  Started: ['開始於', '开始于'], 'Pickup & delivery schedule': ['收送時間表', '收送时间表'], 'Return delivery': ['送還', '送还'], '6 boxes to 18 Java Road, North Point': ['6 箱送往北角渣華道 18 號', '6 箱送往北角渣华道 18 号'],
  'Payment history': ['付款記錄', '付款记录'], Reference: ['參考編號', '参考编号'], Item: ['項目', '项目'], Method: ['方式', '方式'], Amount: ['金額', '金额'], Status: ['狀態', '状态'], 'Refundable deposit': ['可退按金', '可退押金'],
  'Deposit tracker': ['按金進度', '押金进度'], 'deposit': ['按金', '押金'], 'COMPLETED RENTAL EXAMPLE': ['已完成租用示例', '已完成租用示例'], 'Partial deposit refund': ['部分退還按金', '部分退还押金'], 'Original deposit': ['原本按金', '原本押金'], Deduction: ['扣除', '扣除'], 'Deduction reason': ['扣除原因', '扣除原因'], 'Replacement lid required after return inspection.': ['退還檢查後需更換箱蓋。', '退还检查后需更换箱盖。'], 'Final refund': ['最終退款', '最终退款'],
  // assistant
  'New conversation': ['新對話', '新对话'], 'Saved in this browser': ['儲存於此瀏覽器', '保存于此浏览器'], 'STORAGE assistant': ['STORAGE 儲存助手', 'STORAGE 储存助手'], 'Multilingual help': ['多語言支援', '多语言支持'], 'Ask about storage…': ['查詢儲存服務…', '查询储存服务…'], 'Sample answers for prototype use only': ['示範答案，僅供原型使用', '示范答案，仅供原型使用'],
  'Prices & sizes': ['價格及尺寸', '价格及尺寸'], 'Deposit policy': ['按金政策', '押金政策'], 'Pickup areas': ['收送範圍', '收送范围'], 'What can I store?': ['可以存放甚麼？', '可以存放什么？'],
};
export function translate(lang: Lang, s: string) {
  if (lang === 'en') return s;
  const e = dict[s];
  return e ? e[lang === 'zh-Hant' ? 0 : 1] : s;
}
export function useT() {
  const lang = useLang();
  return (s: string) => translate(lang, s);
}
