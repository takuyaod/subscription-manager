import { describe, expect, it } from "vitest";
import { calcMonthlyAmount, buildDashboardSummary } from "./calc-monthly-amount";

describe("calcMonthlyAmount", () => {
  it("monthly cycleInterval=1 → amount そのまま", () => {
    expect(calcMonthlyAmount({ amount: "1200", cycle: "monthly", cycleInterval: 1 })).toBe(1200);
  });

  it("monthly cycleInterval=3 → amount ÷ 3", () => {
    expect(calcMonthlyAmount({ amount: "3000", cycle: "monthly", cycleInterval: 3 })).toBe(1000);
  });

  it("yearly cycleInterval=1 → amount ÷ 12", () => {
    expect(calcMonthlyAmount({ amount: "12000", cycle: "yearly", cycleInterval: 1 })).toBe(1000);
  });

  it("yearly cycleInterval=3 → amount ÷ 36", () => {
    expect(calcMonthlyAmount({ amount: "36000", cycle: "yearly", cycleInterval: 3 })).toBe(1000);
  });

  it("once → null（集計対象外）", () => {
    expect(calcMonthlyAmount({ amount: "9800", cycle: "once", cycleInterval: 1 })).toBeNull();
  });
});

describe("buildDashboardSummary", () => {
  it("activeなmonthly/yearlyを月額合計・年間合計に集計し、onceを別リストに分ける", () => {
    const subs = [
      { id: "1", name: "Netflix", amount: "1200", cycle: "monthly" as const, cycleInterval: 1, expiresAt: null },
      { id: "2", name: "iCloud+", amount: "12000", cycle: "yearly" as const, cycleInterval: 1, expiresAt: null },
      { id: "3", name: "買い切りソフト", amount: "9800", cycle: "once" as const, cycleInterval: 1, expiresAt: "2027-03-31" },
    ];

    const result = buildDashboardSummary(subs);

    expect(result.monthlyBreakdown).toHaveLength(2);
    expect(result.oneTimeList).toHaveLength(1);
    expect(result.monthlyTotal).toBe(1200 + 1000); // 1200 + 12000/12
    expect(result.yearlyTotal).toBe(result.monthlyTotal * 12);
    expect(result.oneTimeList[0].name).toBe("買い切りソフト");
    expect(result.oneTimeList[0].expiresAt).toBe("2027-03-31");
  });

  it("サブスクなし → すべて0・空リスト", () => {
    const result = buildDashboardSummary([]);
    expect(result.monthlyTotal).toBe(0);
    expect(result.yearlyTotal).toBe(0);
    expect(result.monthlyBreakdown).toHaveLength(0);
    expect(result.oneTimeList).toHaveLength(0);
  });

  it("onceのみ → monthlyTotal=0", () => {
    const subs = [
      { id: "1", name: "ライセンス", amount: "5000", cycle: "once" as const, cycleInterval: 1, expiresAt: null },
    ];
    const result = buildDashboardSummary(subs);
    expect(result.monthlyTotal).toBe(0);
    expect(result.yearlyTotal).toBe(0);
    expect(result.oneTimeList).toHaveLength(1);
  });
});
