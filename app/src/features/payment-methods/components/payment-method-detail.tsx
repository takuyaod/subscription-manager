import Link from "next/link";
import { Button } from "@/components/ui/button";
import { typeConfig } from "@/features/payment-methods/utils/type-config";

type PaymentMethod = {
  id: string;
  nickname: string;
  type: string;
  parentId: string | null;
  bankAccountId: string | null;
  expiryYear: number | null;
  expiryMonth: number | null;
  memo: string | null;
};

type DirectDebitCard = {
  id: string;
  nickname: string;
  type: string;
  linkedCards: { id: string; nickname: string; type: string }[];
};

type Props = {
  paymentMethod: PaymentMethod;
  parent: { id: string; nickname: string } | null;
  bankAccount: { id: string; nickname: string } | null;
  directDebitCards?: DirectDebitCard[];
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex border-b border-[#2a2f32] py-2.25">
      <span className="w-40 shrink-0 font-mono text-[11px] font-semibold tracking-[0.03em] text-[#4a5358]">
        {label}
      </span>
      <span className="font-mono text-[12px] text-[#e8edf0]">{value || "—"}</span>
    </div>
  );
}

export function PaymentMethodDetail({ paymentMethod, parent, bankAccount, directDebitCards = [] }: Props) {
  const config = typeConfig[paymentMethod.type] ?? typeConfig.other;

  return (
    <div className="space-y-6 max-w-xl">
      {/* Hero */}
      <div
        className="border p-5"
        style={{ borderColor: `${config.color}40`, background: `${config.color}10` }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div
              className="mb-2 font-mono text-[9px] font-bold tracking-widest uppercase"
              style={{ color: config.color }}
            >
              // {config.label.toUpperCase()}
            </div>
            <div className="font-mono text-[22px] font-bold text-[#e8edf0]">{paymentMethod.nickname}</div>
          </div>
          {paymentMethod.expiryYear && paymentMethod.expiryMonth && (
            <div className="text-right">
              <div className="mb-1 font-mono text-[9px] tracking-[0.06em] text-[#4a5358]">EXPIRES</div>
              <div className="font-mono text-[14px] font-bold text-[#e8edf0]">
                {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="border border-[#2a2f32] bg-[#111416] p-5">
        <div className="mb-3 font-mono text-[9px] font-bold tracking-widest text-[#4a5358] uppercase">
          // DETAILS
        </div>
        <DetailRow label="type" value={config.label} />
        {parent && (
          <div className="flex border-b border-[#2a2f32] py-2.25">
            <span className="w-40 shrink-0 font-mono text-[11px] font-semibold tracking-[0.03em] text-[#4a5358]">
              parent_card
            </span>
            <Link
              href={`/payment-methods/${parent.id}`}
              className="font-mono text-[12px] text-[#4dabf7] hover:underline"
            >
              {parent.nickname}
            </Link>
          </div>
        )}
        {bankAccount && (
          <div className="flex border-b border-[#2a2f32] py-2.25">
            <span className="w-40 shrink-0 font-mono text-[11px] font-semibold tracking-[0.03em] text-[#4a5358]">
              bank_account
            </span>
            <Link
              href={`/payment-methods/${bankAccount.id}`}
              className="font-mono text-[12px] text-[#4dabf7] hover:underline"
            >
              {bankAccount.nickname}
            </Link>
          </div>
        )}
        {paymentMethod.memo && <DetailRow label="memo" value={paymentMethod.memo} />}
      </div>

      {directDebitCards.length > 0 && (
        <div>
          <div className="mb-2 font-mono text-[11px] font-bold tracking-[0.08em] text-[#4a5358]">
            # 紐づきカード
          </div>
          <div className="border border-[#2a2f32] bg-[#111416] overflow-hidden">
            {directDebitCards.map((card, i) => {
              const cardConfig = typeConfig[card.type] ?? typeConfig.other;
              return (
                <div
                  key={card.id}
                  className={`px-4.5 py-3 ${i < directDebitCards.length - 1 ? "border-b border-[#2a2f32]" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex items-center border px-1.5 py-px font-mono text-[10px] font-bold uppercase tracking-[0.06em]"
                      style={{ borderColor: `${cardConfig.color}55`, background: `${cardConfig.color}12`, color: cardConfig.color }}
                    >
                      {cardConfig.label}
                    </span>
                    <Link
                      href={`/payment-methods/${card.id}`}
                      className="font-mono text-[13px] font-semibold text-[#e8edf0] hover:text-[#4dabf7]"
                    >
                      {card.nickname}
                    </Link>
                  </div>
                  {card.linkedCards.length > 0 && (
                    <div className="ml-6 mt-2 space-y-1">
                      {card.linkedCards.map((linked) => {
                        const linkedConfig = typeConfig[linked.type] ?? typeConfig.other;
                        return (
                          <div key={linked.id} className="flex items-center gap-2">
                            <span
                              className="inline-flex items-center border px-1.5 py-px font-mono text-[10px] font-bold uppercase tracking-[0.06em]"
                              style={{ borderColor: `${linkedConfig.color}55`, background: `${linkedConfig.color}12`, color: linkedConfig.color }}
                            >
                              {linkedConfig.label}
                            </span>
                            <Link
                              href={`/payment-methods/${linked.id}`}
                              className="font-mono text-[12px] text-[#8b9499] hover:text-[#4dabf7]"
                            >
                              {linked.nickname}
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button asChild>
          <Link href={`/payment-methods/${paymentMethod.id}/edit`}>~ EDIT</Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/payment-methods">← BACK</Link>
        </Button>
      </div>
    </div>
  );
}
