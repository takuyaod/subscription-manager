import type { DashboardSummary } from "../utils/calc-monthly-amount";
import { formatCurrency } from "../utils/format-currency";

type Props = {
  summary: DashboardSummary;
};

export function MonthlySummary({ summary }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex gap-px bg-[#2a2f32]">
        <div className="flex-1 bg-[#111416] p-[18px_22px]">
          <div className="mb-2.5 font-mono text-[10px] font-bold tracking-widest text-[#4a5358] uppercase">
            // 月額合計
          </div>
          <div className="font-mono text-[28px] font-bold leading-none tracking-tight text-[#3dd68c] tabular-nums">
            {formatCurrency(summary.monthlyTotal)}
          </div>
          <div className="mt-2.5 border-t border-[#2a2f32] pt-2.5 font-mono text-[11px] text-[#4a5358]">
            {summary.monthlyBreakdown.length} active
          </div>
        </div>
        <div className="flex-1 bg-[#111416] p-[18px_22px]">
          <div className="mb-2.5 font-mono text-[10px] font-bold tracking-widest text-[#4a5358] uppercase">
            // 年間合計
          </div>
          <div className="font-mono text-[28px] font-bold leading-none tracking-tight text-[#4dabf7] tabular-nums">
            {formatCurrency(summary.yearlyTotal)}
          </div>
          <div className="mt-2.5 border-t border-[#2a2f32] pt-2.5 font-mono text-[11px] text-[#4a5358]">
            月換算 {formatCurrency(summary.monthlyTotal)}
          </div>
        </div>
      </div>

      {summary.monthlyBreakdown.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold tracking-[0.08em] text-[#4a5358]">
              <span className="text-[#4a5358]">#</span> MONTHLY BREAKDOWN
            </span>
          </div>
          <div className="border border-[#2a2f32] bg-[#111416] overflow-hidden">
            {summary.monthlyBreakdown.map((item, i) => (
              <div
                key={item.id}
                className={`flex items-center justify-between px-4.5 py-3 font-mono ${
                  i < summary.monthlyBreakdown.length - 1 ? "border-b border-[#2a2f32]" : ""
                }`}
              >
                <span className="text-sm text-[#e8edf0]">{item.name}</span>
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
