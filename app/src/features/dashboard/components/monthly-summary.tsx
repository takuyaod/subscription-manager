import type { DashboardSummary } from "../utils/calc-monthly-amount";
import { formatCurrency } from "../utils/format-currency";

type Props = {
  summary: DashboardSummary;
};

export function MonthlySummary({ summary }: Props) {
  const cancelledCount = summary.cancelledCount ?? 0;
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-2.5">
        <div className="flex-1 border border-[#222729] bg-[#111416] p-[18px_22px] rounded-[10px]">
          <div className="mb-2.5 font-mono text-[10px] font-bold tracking-widest text-[#3d4549] uppercase">
            // 月額合計
          </div>
          <div className="font-mono text-[28px] font-bold leading-none tracking-tight text-[#3dd68c] tabular-nums">
            {formatCurrency(summary.monthlyTotal)}
          </div>
          <div className="mt-2.5 border-t border-[#222729] pt-2.5 font-mono text-[11px] text-[#3d4549]">
            {summary.monthlyBreakdown.length} active · {cancelledCount} cancelled
          </div>
        </div>
        <div className="flex-1 border border-[#222729] bg-[#111416] p-[18px_22px] rounded-[10px]">
          <div className="mb-2.5 font-mono text-[10px] font-bold tracking-widest text-[#3d4549] uppercase">
            // 年間合計
          </div>
          <div className="font-mono text-[28px] font-bold leading-none tracking-tight text-[#3dd68c] tabular-nums">
            {formatCurrency(summary.yearlyTotal)}
          </div>
          <div className="mt-2.5 border-t border-[#222729] pt-2.5 font-mono text-[11px] text-[#3d4549]">
            月換算 {formatCurrency(summary.monthlyTotal)}
          </div>
        </div>
        <div className="flex-1 border border-[#222729] bg-[#111416] p-[18px_22px] rounded-[10px]">
          <div className="mb-2.5 font-mono text-[10px] font-bold tracking-widest text-[#3d4549] uppercase">
            // サービス数
          </div>
          <div className="font-mono text-[28px] font-bold leading-none tracking-tight text-[#3dd68c] tabular-nums">
            {summary.monthlyBreakdown.length}
          </div>
          <div className="mt-2.5 border-t border-[#222729] pt-2.5 font-mono text-[11px] text-[#3d4549]">
            {cancelledCount} cancelled
          </div>
        </div>
      </div>

      {summary.monthlyBreakdown.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold tracking-[0.08em] text-[#3d4549]">
              <span className="text-[#3d4549]">#</span> MONTHLY BREAKDOWN
            </span>
          </div>
          <div className="border border-[#222729] bg-[#111416] overflow-hidden rounded-[10px]">
            {summary.monthlyBreakdown.map((item, i) => (
              <div
                key={item.id}
                className={`flex items-center justify-between px-4.5 py-3 font-mono ${
                  i < summary.monthlyBreakdown.length - 1 ? "border-b border-[#222729]" : ""
                }`}
              >
                <span className="text-sm text-[#dde3e7]">{item.name}</span>
                <span className="text-sm font-bold text-[#3dd68c] tabular-nums">
                  {formatCurrency(item.monthlyAmount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
