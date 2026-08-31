import { Timestamp } from '@angular/fire/firestore';

/**
 * Aditional Data
 *
 * @export
 * @interface MetaData
 */
export interface Metadata {
  uid?: string;
  createdAt?: Timestamp;
  createdBy?: string;
  updatedAt?: Timestamp;
  updatedBy?: string;
  disabled?: boolean;
  search?: string[];
}
