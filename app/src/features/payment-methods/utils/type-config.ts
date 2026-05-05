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
  credit: { icon: CreditCard, label: "クレカ", color: "#3dd68c" },
  debit: { icon: CreditCard, label: "デビット", color: "#3dd68c" },
  bank: { icon: Landmark, label: "銀行口座", color: "#3dd68c" },
  apple: { icon: Smartphone, label: "Apple ID", color: "#3dd68c" },
  google: { icon: Globe, label: "Google Pay", color: "#3dd68c" },
  linked: { icon: LinkIcon, label: "付帯カード", color: "#3dd68c" },
  postpay: { icon: Clock, label: "ポストペイ", color: "#3dd68c" },
  other: { icon: MoreHorizontal, label: "その他", color: "#3dd68c" },
};
