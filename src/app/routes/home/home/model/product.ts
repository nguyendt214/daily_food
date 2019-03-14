
export interface IProduct {
  ID?: number;
  GROUP?: string;
  SKU?: string | number;
  NAME?: string;
  TYPE?: string;
  SL?: number;
  SL_THEO_NGAY?: number;
  SL_SOLD?: number;
  PRICE_ORIGIN?: number;
  PRICE_SELL?: number;
  PRICE_SPECIAL?: number;
  GIA_THEO_NGAY?: number;
  IMAGE_URL?: string;
  COMMENT?: string;
}
