export interface INgxDatatableFilter {
  action?: string;
  sortBy?: string;
  sortValue?: string;
  sortData?: any;
}

export interface INgxDatatableListFilter {
  sortCol?: string;
  sortType?: string;
  sortValue?: string;
  sortList?: Array<any>;
  sortOrder?: number;
  searchContains?: boolean;
  searchByDate?: {
    min?: any,
    max?: any
  };
}
