import { DocumentSnapshot, QueryDocumentSnapshot } from '@angular/fire/compat/firestore';
export class Pagination<T> {
  first: T | null = null;
  last: QueryDocumentSnapshot<T> | DocumentSnapshot<T> | null = null;
  onStart: boolean = true;
  onLast: boolean = true;
  page: number = 0;
  start: QueryDocumentSnapshot<T> | DocumentSnapshot<T> | null = null;

  constructor() {
    this.reset();
  }

  reset(): void {
    this.first = null;
    this.last = null;
    this.onLast = false;
    this.onStart = true;
    this.page = 0;
    this.start = null;
  }
}
