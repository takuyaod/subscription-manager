import {
  CreditCard,
  Landmark,
  Smartphone,
  Globe,
  Link as LinkIcon,
  Clock,
  MoreHorizontal,
} from "lucide-react";

export const TYPES_WITH_EXPIRY = ["credit", "postpay", "linked"] as const;
export const TYPES_WITH_BANK = ["credit", "debit", "postpay"] as const;

export const typeConfig: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  credit: { icon: CreditCard, label: "クレジットカード", color: "#4dabf7" },
  debit: { icon: CreditCard, label: "デビットカード", color: "#69db7c" },
  bank: { icon: Landmark, label: "銀行口座", color: "#ffd43b" },
  apple: { icon: Smartphone, label: "Apple ID", color: "#adb5bd" },
  google: { icon: Globe, label: "Google Pay", color: "#74c0fc" },
  linked: { icon: LinkIcon, label: "付帯カード", color: "#da77f2" },
  postpay: { icon: Clock, label: "ポストペイ", color: "#ff8787" },
  other: { icon: MoreHorizontal, label: "その他", color: "#868e96" },
};
