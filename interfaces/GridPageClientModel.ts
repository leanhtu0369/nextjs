import { SortDescriptor } from '@progress/kendo-data-query';

export default interface GridPageClientModel {
  totalRecords: number;
  skip: number;
  take: number;
  sort: SortDescriptor[];
}
