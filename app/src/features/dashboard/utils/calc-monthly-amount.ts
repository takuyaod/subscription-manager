export type SubscriptionForCalc = {
  amount: string;
  cycle: "monthly" | "yearly" | "once";
  cycleInterval: number;
};

/**
 * 月額換算金額を返す。cycle: "once" は null を返す（集計対象外）。
 */
export function calcMonthlyAmount(sub: SubscriptionForCalc): number | null {
  const amount = parseFloat(sub.amount);
  if (sub.cycle === "monthly") {
    return amount / sub.cycleInterval;
  }
  if (sub.cycle === "yearly") {
    return amount / (sub.cycleInterval * 12);
  }
  return null;
}

export type DashboardSummary = {
  monthlyTotal: number;
  yearlyTotal: number;
  monthlyBreakdown: { id: string; name: string; monthlyAmount: number }[];
  oneTimeList: { id: string; name: string; amount: number; expiresAt: string | null }[];
};

export type SubscriptionForSummary = {
  id: string;
  name: string;
  amount: string;
  cycle: "monthly" | "yearly" | "once";
  cycleInterval: number;
  expiresAt: string | null;
};

export function buildDashboardSummary(subscriptions: SubscriptionForSummary[]): DashboardSummary {
  const monthlyBreakdown: DashboardSummary["monthlyBreakdown"] = [];
  const oneTimeList: DashboardSummary["oneTimeList"] = [];

  for (const sub of subscriptions) {
    const monthly = calcMonthlyAmount(sub);
    if (monthly !== null) {
      monthlyBreakdown.push({ id: sub.id, name: sub.name, monthlyAmount: monthly });
    } else {
      oneTimeList.push({
        id: sub.id,
        name: sub.name,
        amount: parseFloat(sub.amount),
        expiresAt: sub.expiresAt,
      });
    }
  }

  const monthlyTotal = monthlyBreakdown.reduce((sum, s) => sum + s.monthlyAmount, 0);

  return {
    monthlyTotal,
    yearlyTotal: monthlyTotal * 12,
    monthlyBreakdown,
    oneTimeList,
  };
}
