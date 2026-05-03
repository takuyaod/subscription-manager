import { getDashboardSummary } from "@/features/dashboard/api/actions";
import { getAlerts } from "@/features/dashboard/api/get-alerts";
import { AlertList } from "@/features/dashboard/components/alert-list";
import { MonthlySummary } from "@/features/dashboard/components/monthly-summary";
import { OneTimeList } from "@/features/dashboard/components/one-time-list";

export default async function DashboardPage() {
  const [summary, alerts] = await Promise.all([getDashboardSummary(), getAlerts()]);

  return (
    <div className="space-y-6">
      <div className="border-b border-[#222729] pb-5">
        <div className="mb-2 font-mono text-[10px] font-bold tracking-[0.06em] text-[#3dd68c]">
          ~/subscriptions $ dashboard
        </div>
        <h1 className="font-mono text-xl font-bold tracking-tight text-[#e8edf0]">
          ダッシュボード
        </h1>
      </div>
      <AlertList alerts={alerts} />
      <MonthlySummary summary={summary} />
      <OneTimeList oneTimeList={summary.oneTimeList} />
    </div>
  );
}
