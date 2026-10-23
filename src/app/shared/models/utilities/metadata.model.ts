import firebase from 'firebase/compat/app';

/**
 * Aditional Data
 *
 * @export
 * @interface Metadata
 */
export interface Metadata {
  uid?: string;
  createdAt?: firebase.firestore.Timestamp;
  createdBy?: string;
  updatedAt?: firebase.firestore.Timestamp;
  updatedBy?: string;
  disabled?: boolean;
  search?: string[];
}
