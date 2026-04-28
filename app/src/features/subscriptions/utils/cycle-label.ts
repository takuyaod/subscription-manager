export function getCycleLabel(cycle: string, cycleInterval: number): string {
  if (cycle === "once") return "買い切り";
  if (cycle === "monthly") {
    return cycleInterval === 1 ? "毎月" : `${cycleInterval}ヶ月ごと`;
  }
  if (cycle === "yearly") {
    return cycleInterval === 1 ? "毎年" : `${cycleInterval}年ごと`;
  }
  return cycle;
}

export function getBillingDayLabel(cycle: string, billingDay: number | null): string | null {
  if (!billingDay) return null;
  if (cycle === "monthly") return `毎月${billingDay}日`;
  if (cycle === "yearly") {
    const month = Math.floor(billingDay / 100);
    const day = billingDay % 100;
    return `毎年${month}月${day}日`;
  }
  return null;
}
