export type MoneyFormat = 'charge' | 'prize' | 'payout';
export function formatMoney(amount: number, format: MoneyFormat = 'charge'): string {
  const decimals = format === 'charge' ? 2 : 0;
  const numeric = Number.isFinite(amount) ? amount : 0;
  const [whole, fraction] = numeric.toFixed(decimals).split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f');
  return `P${grouped}${fraction ? `.${fraction}` : ''}${format === 'payout' ? ' cash' : ''}`;
}
