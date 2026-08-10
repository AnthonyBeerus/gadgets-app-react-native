import { formatMoney } from '../utils/money';
describe('formatMoney',()=>{it('formats real charges with decimals',()=>expect(formatMoney(1750,'charge')).toBe('P1\u202f750.00'));it('formats pots without decimals',()=>expect(formatMoney(10000,'prize')).toBe('P10\u202f000'));it('owns the cash suffix',()=>expect(formatMoney(225,'payout')).toBe('P225 cash'));});
