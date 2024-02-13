import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TableService} from './table.service';
import {TableRequest, TableSearch, TableSort} from '../../../../core/models/table.request.model';
import {environment} from '../../../../../environments/environment';
import {getObjByKey} from '../../../../helpers/helpers';

export class TableHead {
  title: string;
  data: string;
  searchable: boolean;
  titleWidth: string;
  orderable: boolean;
  render: any;

  constructor(title: string, data: string, searchable?: boolean, orderable?: boolean, titleWidth?: string, render?: any) {
    this.title = title;
    this.data = data;
    this.searchable = searchable ?? true;
    this.orderable = orderable ?? true;
    this.titleWidth = titleWidth ?? '';
    this.render = render ?? null;
  }
}

interface State {
  page: number;
  startIndex: number;
  endIndex: number;
  recordsPage: number;
  totalPage: number;
  entriesSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: string;
  totalRecords: number;
}

export const SORT_DIRECTION = {
  ASC: 'asc',
  DESC: 'desc'
};

export const DATA_TYPE = {
  STRING: 'string',
  NUMBER: 'int'
};

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() tableId = '';
  @Input() idField = 'id';
  @Input() url = '';
  @Input() head: TableHead[] = [];
  @Input() sort: TableSort[] = [];
  @Input() defaultSearch = true;

  @Output() loadingCall = new EventEmitter();
  @Output() doneCall: EventEmitter<any> = new EventEmitter();
  @Output() editCall: EventEmitter<any> = new EventEmitter();
  @Output() deleteCall: EventEmitter<any> = new EventEmitter();
  @Output() detailCall: EventEmitter<any> = new EventEmitter();

  public state: State = {
    page: 1,
    startIndex: 0,
    endIndex: 0,
    recordsPage: 0,
    totalPage: 0,
    entriesSize: 15,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
    totalRecords: 1
  };

  tableHead: TableHead[] = [];
  tableRequest = new TableRequest();
  datas: any[] = [];
  dataIds: any[] = [];
  loading = false;

  constructor(
    public service: TableService
  ) {
    this.tableHead.push(new TableHead('No', 'no', false, false));
  }

  ngOnInit(): void {
    this.tableHead = this.tableHead.concat(this.head);
    this.tableRequest.sort = this.sort;
    this.fetchData();

    this.service.requestReload.subscribe(value => {
      if (value === this.tableId) {
        this.fetchData();
      }
    });
  }

  onSort(sortField: string, orderable: boolean) {
    if (orderable) {
      let sortDir = SORT_DIRECTION.ASC;

      if (this.tableRequest.sort.length > 0) {
        const currentSort = this.tableRequest.sort[0];
        if (currentSort.field === sortField) {
          if (currentSort.direction === SORT_DIRECTION.ASC) {
            sortDir = SORT_DIRECTION.DESC;
          } else {
            sortDir = SORT_DIRECTION.ASC;
          }
        }
      }

      this.tableRequest.sort = [];
      this.tableRequest.sort.push(new TableSort(sortField, sortDir));
      this.fetchData();
    }
  }

  onShowEntriesChange() {
    this.tableRequest.size = this.state.entriesSize;
    this.fetchData();
  }

  onSearch() {
    this.tableRequest.paramLike = [];
    if (this.state.searchTerm !== '') {
      this.tableHead.filter(find => find.searchable).forEach(f => {
        this.tableRequest.paramLike.push(new TableSearch(f.data, DATA_TYPE.STRING, this.state.searchTerm));
      });
    }
    this.fetchData();
  }

  onPageChange($event) {
    this.state.page = $event;
    this.fetchData();
  }

  edit(idx) {
    if (this.editCall.observers.length > 0) {
      this.editCall.emit(this.getDataByIdx(idx));
    }
  }

  delete(idx) {
    if (this.deleteCall.observers.length > 0) {
      this.deleteCall.emit(this.getDataByIdx(idx));
    }
  }

  detail(idx) {
    if (this.detailCall.observers.length > 0) {
      this.detailCall.emit(this.getDataByIdx(idx));
    }
  }

  private getDataByIdx(idx) {
    const currentData = JSON.parse(JSON.stringify(this.datas[idx]));
    currentData[0] = this.dataIds[idx];

    let jsonStr = '';

    // tslint:disable-next-line:no-shadowed-variable
    currentData.forEach((data, idx) => {
      if (idx === 0) {
        if (typeof data === 'string') {
          jsonStr += `"id": "${data}"`;
        } else {
          jsonStr += `"id": ${data}`;
        }
      } else {
        const headData = `${this.tableHead[idx].data}`;
        if (headData !== 'no') {
          jsonStr += ', ';
          if (headData.includes('.')) {
            let jsonDot = '';
            const spltHead = headData.split('.');
            let middleCount = 0;
            spltHead.forEach((value, index) => {
              if (index < (spltHead.length - 1)) {
                if (index === 0) {
                  jsonDot += `"${spltHead[index]}": `;
                } else {
                  jsonDot += `{"${spltHead[index]}": `;
                  middleCount++;
                }
              }
              if (index === (spltHead.length - 1)) {
                jsonDot += `{"${spltHead[index]}": `;

                if (typeof data === 'string') {
                  jsonDot += `"${data}"}`;
                } else {
                  jsonDot += `${data}}`;
                }

                while (middleCount !== 0) {
                  jsonDot += '}';
                  middleCount--;
                }
              }
            });
            jsonStr += jsonDot;
          } else {
            if (typeof data === 'string') {
              jsonStr += `"${headData}": "${data}"`;
            } else {
              jsonStr += `"${headData}": ${data}`;
            }
          }
        }
      }
    });

    return JSON.parse(`{${jsonStr}}`);
  }

  private fetchData() {
    this.datas = [];
    this.dataIds = [];

    this.state.sortColumn = '';
    this.state.sortDirection = '';

    this.loading = true;
    if (this.loadingCall.observers.length > 0) {
      this.loadingCall.emit();
    }

    this.tableRequest.page = this.state.page - 1;
    this.tableRequest.size = this.state.entriesSize;
    this.service.datatable(this.url, this.tableRequest, data => {
      const responseData = data.data;
      this.state.totalPage = responseData.totalPages;
      this.state.recordsPage = responseData.numberOfElements;
      this.state.totalRecords = responseData.totalElements;

      if (this.state.page === 1) {
        this.state.startIndex = this.state.page;
        this.state.endIndex = this.state.recordsPage;
      } else {
        this.state.startIndex = (this.state.entriesSize * (this.state.page - 1)) + 1;
        this.state.endIndex = (this.state.recordsPage - 1) + this.state.startIndex;
      }

      const content = responseData.content;
      content.forEach((cntn, cntnIdx) => {
        const contenData: any[] = [];
        this.tableHead.forEach((tHead) => {
          if (tHead.data === 'no') {
            if (this.state.page === 1) {
              contenData.push(cntnIdx + 1);
            } else {
              contenData.push(cntnIdx + this.state.startIndex);
            }
          } else {
            if (tHead.render === null) {
              try {
                contenData.push(getObjByKey(cntn, tHead?.data) ?? '');
              } catch (e) {
                if (!environment.production) {
                  console.log('tableContent', e.message);
                }
                contenData.push('');
              }
            } else {
              if (typeof tHead.render === 'function') {
                try {
                  contenData.push(tHead.render(getObjByKey(cntn, tHead?.data) ?? '', cntn));
                } catch (e) {
                  if (!environment.production) {
                    console.log('tableContent', e.message);
                  }
                  contenData.push('');
                }
              }
            }
          }
        });

        try {
          const id = getObjByKey(cntn, this.idField);
          this.dataIds.push(id);
          this.datas.push(contenData);
        } catch (e) {
          console.error('tableContent', e);
        }
      });

      if (this.datas.length === 0) {
        this.state.startIndex = 0;
      }

      if (this.tableRequest.sort.length > 0) {
        const tableSort = this.tableRequest.sort[0];
        this.state.sortColumn = tableSort.field;
        this.state.sortDirection = tableSort.direction;
      }

      this.loading = false;
      this.service.onReload();
      if (this.doneCall.observers.length > 0) {
        this.doneCall.emit(data);
      }
    }, _ => {
      this.loading = false;
      this.service.onReload();
    });
  }
}
