import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardSummary } from "../utils/calc-monthly-amount";
import { formatCurrency } from "../utils/format-currency";

type Props = {
  summary: DashboardSummary;
};

export function MonthlySummary({ summary }: Props) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">月額換算合計</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(summary.monthlyTotal)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">年間換算合計</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(summary.yearlyTotal)}</p>
          </CardContent>
        </Card>
      </div>

      {summary.monthlyBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>月額内訳</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {summary.monthlyBreakdown.map((item) => (
                <li key={item.id} className="flex items-center justify-between py-3">
                  <span className="text-sm">{item.name}</span>
                  <span className="text-sm font-medium">{formatCurrency(item.monthlyAmount)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
