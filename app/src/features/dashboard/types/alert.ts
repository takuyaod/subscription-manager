export type CardExpiryAlert = {
  type: "card_expiry";
  id: string;
  nickname: string;
  expiryYear: number;
  expiryMonth: number;
};

export type ServiceExpiryAlert = {
  type: "service_expiry";
  id: string;
  name: string;
  expiresAt: string;
};

export type AddressInactiveAlert = {
  type: "address_inactive";
  subscriptionId: string;
  subscriptionName: string;
  addressId: string;
  addressLabel: string;
};

export type DashboardAlert = CardExpiryAlert | ServiceExpiryAlert | AddressInactiveAlert;
