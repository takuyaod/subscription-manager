import { getDashboardSummary } from "@/features/dashboard/api/actions";
import { MonthlySummary } from "@/features/dashboard/components/monthly-summary";
import { OneTimeList } from "@/features/dashboard/components/one-time-list";

export default async function DashboardPage() {
  const summary = await getDashboardSummary();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">ダッシュボード</h1>
      <MonthlySummary summary={summary} />
      <OneTimeList oneTimeList={summary.oneTimeList} />
    </div>
  );
}
