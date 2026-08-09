export function containsPrototypeCheckoutItem(items: Array<{ id: number }>) {
  return items.some(item => item.id < 0);
}
