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

export const typeConfig: Record<string, { icon: React.ElementType; label: string }> = {
  credit: { icon: CreditCard, label: "クレジットカード" },
  debit: { icon: CreditCard, label: "デビットカード" },
  bank: { icon: Landmark, label: "銀行口座" },
  apple: { icon: Smartphone, label: "Apple ID" },
  google: { icon: Globe, label: "Google Pay" },
  linked: { icon: LinkIcon, label: "付帯カード" },
  postpay: { icon: Clock, label: "ポストペイ" },
  other: { icon: MoreHorizontal, label: "その他" },
};
