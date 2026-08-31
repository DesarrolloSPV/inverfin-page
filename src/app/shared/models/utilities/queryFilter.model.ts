import { WhereFilterOp } from 'firebase/firestore';

export interface QueryFilter<T> {
  fieldPath: keyof T;
  relation: WhereFilterOp;
  data: unknown;
  name?: string;
  nameData?: string;
}
