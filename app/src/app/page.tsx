import { getDashboardSummary } from "@/features/dashboard/api/actions";
import { getAlerts } from "@/features/dashboard/api/get-alerts";
import { AlertList } from "@/features/dashboard/components/alert-list";
import { MonthlySummary } from "@/features/dashboard/components/monthly-summary";
import { OneTimeList } from "@/features/dashboard/components/one-time-list";

export default async function DashboardPage() {
  const [summary, alerts] = await Promise.all([getDashboardSummary(), getAlerts()]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">ダッシュボード</h1>
      <AlertList alerts={alerts} />
      <MonthlySummary summary={summary} />
      <OneTimeList oneTimeList={summary.oneTimeList} />
    </div>
  );
}
