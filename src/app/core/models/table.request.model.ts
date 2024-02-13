export class TableRequest {
  enablePage = true;
  page = 0;
  size = 10;
  paramNotIn: any[] = [];
  paramIs: any[] = [];
  paramLike: any[] = [];
  sort: TableSort[] = [];
}

export class TableSort {
  public field: string;
  public direction: string;

  constructor(field: string, direction: string) {
    this.field = field;
    this.direction = direction;
  }
}

export class TableSearch {
  public field: string;
  public dataType: string;
  public value: any;

  constructor(field: string, dataType: string, value: string) {
    this.field = field;
    this.dataType = dataType;
    this.value = value;
  }
}
