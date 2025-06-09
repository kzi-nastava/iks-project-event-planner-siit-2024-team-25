import { PurchasePreview } from "./purchase-preview.mode";

export interface PurchasePreviewWithCount extends PurchasePreview {
  count: number;
}