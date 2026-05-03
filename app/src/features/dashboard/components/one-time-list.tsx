import type { DashboardSummary } from "../utils/calc-monthly-amount";
import { formatCurrency } from "../utils/format-currency";

type Props = {
  oneTimeList: DashboardSummary["oneTimeList"];
};

export function OneTimeList({ oneTimeList }: Props) {
  if (oneTimeList.length === 0) return null;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[11px] font-bold tracking-[0.08em] text-[#3d4549]">
          <span className="text-[#3d4549]">#</span> 買い切り・一括払い
        </span>
      </div>
      <div className="border border-[#222729] bg-[#111416] overflow-hidden rounded-[10px]">
        {oneTimeList.map((item, i) => (
          <div
            key={item.id}
            className={`flex items-center justify-between px-4.5 py-3 font-mono ${
              i < oneTimeList.length - 1 ? "border-b border-[#222729]" : ""
            }`}
          >
            <div>
              <p className="text-sm text-[#dde3e7]">{item.name}</p>
              {item.expiresAt && (
                <p className="text-[10px] text-[#3d4549]">有効期限: {item.expiresAt}</p>
              )}
            </div>
            <span className="text-sm font-bold text-[#3dd68c] tabular-nums">
              {formatCurrency(item.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
