import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardSummary } from "../utils/calc-monthly-amount";
import { formatCurrency } from "../utils/format-currency";

type Props = {
  oneTimeList: DashboardSummary["oneTimeList"];
};

export function OneTimeList({ oneTimeList }: Props) {
  if (oneTimeList.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>買い切り・一括払い</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y">
          {oneTimeList.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm">{item.name}</p>
                {item.expiresAt && (
                  <p className="text-xs text-muted-foreground">有効期限: {item.expiresAt}</p>
                )}
              </div>
              <span className="text-sm font-medium">{formatCurrency(item.amount)}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
