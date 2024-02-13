import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {first, map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {TableSort} from '../models/table.request.model';
import {ToastrService} from 'ngx-toastr';

export class OptionRequest {
  enablePage = false;
  paramIs: any[] = [];
  paramLike: any[] = [];
  limit: number = null;
  sort: TableSort[] = [new TableSort('name', 'asc')];
}

export class ParamSearch {
  field: string = null;
  dataType: string = null;
  value: any[] = [];

  constructor(field: string, dataType: string, value: any[]) {
    this.field = field;
    this.dataType = dataType;
    this.value = value;
  }
}

export const TABLE_DATA_TYPE = {
  STRING: 'string',
  INT: 'int'
};

@Injectable({
  providedIn: 'root'
})
export class BaseApiService<T> {
  protected pathUrl: string;
  protected showNotification = true;
  private modelsSubject: BehaviorSubject<T>;
  models: Observable<T>;

  constructor(private http: HttpClient, private toastr: ToastrService) {
    this.modelsSubject = new BehaviorSubject<T>(JSON.parse(JSON.stringify('{}')));
    this.models = this.modelsSubject.asObservable();
  }

  options(req: OptionRequest, onDone: any, onError: any) {
    return this.http.post<any>(`${environment.apiHost}/${this.pathUrl}/datatable`, req)
      .pipe(map(response => {
        return response;
      })).pipe(first()).subscribe(
        data => {
          onDone(data?.data?.content ?? []);
        }, error => {
          onError(error);
        });
  }

  get currentModelsData(): T {
    return this.modelsSubject.value;
  }

  getByPath(path: string, onDone: any, onError: any) {
    return this.http.get<any>(`${environment.apiHost}/${path}`)
      .pipe(map(response => {
        const responseData: any = response?.data ?? null;
        if (responseData) {
          this.modelsSubject.next(responseData);
        }
        return response;
      })).pipe(first()).subscribe(
        response => {
          const responseData: any = response?.data ?? null;
          onDone(responseData);
        }, error => {
          onError(error);
        });
  }

  detail(id: string, onDone: any, onError: any) {
    return this.http.get<any>(`${environment.apiHost}/${this.pathUrl}/${id}`)
      .pipe(map(response => {
        const responseData: any = response?.data ?? null;
        if (responseData) {
          this.modelsSubject.next(responseData);
        }
        return response;
      })).pipe(first()).subscribe(
        response => {
          const responseData: any = response?.data ?? null;
          onDone(responseData);
        }, error => {
          onError(error);
        });
  }

  postByPath(path: string, postData: any, onDone: any, onError: any) {
    return this.http.post<any>(`${environment.apiHost}/${path}`, postData)
      .pipe(map(response => {
        return response;
      })).pipe(first()).subscribe(
        response => {
          if (this.showNotification) {
            this.toastr.success('Successfully Create Data', 'info');
          }
          const responseData: any = response?.data ?? null;
          onDone(responseData);
        }, error => {
          onError(error);
        });
  }

  create(postData: any, onDone: any, onError: any) {
    return this.http.post<any>(`${environment.apiHost}/${this.pathUrl}`, postData)
      .pipe(map(response => {
        return response;
      })).pipe(first()).subscribe(
        response => {
          if (this.showNotification) {
            this.toastr.success('Successfully Create Data', 'info');
          }
          const responseData: any = response?.data ?? null;
          onDone(responseData);
        }, error => {
          onError(error);
        });
  }

  putByPath(path: string, postData: any, onDone: any, onError?: any) {
    return this.http.put<any>(`${environment.apiHost}/${path}`, postData)
      .pipe(map(response => {
        return response;
      })).pipe(first()).subscribe(
        response => {
          if (this.showNotification) {
            this.toastr.success('Successfully Update Data', 'info');
          }
          const responseData: any = response?.data ?? null;
          onDone(responseData);
        }, error => {
          if (typeof onError === 'function') {
            onError(error);
          }
        });
  }

  update(postData: any, id: any, onDone: any, onError?: any) {
    return this.http.put<any>(`${environment.apiHost}/${this.pathUrl}/${id}`, postData)
      .pipe(map(response => {
        return response;
      })).pipe(first()).subscribe(
        response => {
          if (this.showNotification) {
            this.toastr.success('Successfully Update Data', 'info');
          }
          const responseData: any = response?.data ?? null;
          onDone(responseData);
        }, error => {
          if (typeof onError === 'function') {
            onError(error);
          }
        });
  }

  deleteByPath(path: string, onDone: any, onError?: any) {
    return this.http.delete<any>(`${environment.apiHost}/${path}`)
      .pipe(map(response => {
        return response;
      })).pipe(first()).subscribe(
        response => {
          if (this.showNotification) {
            this.toastr.success('Successfully Delete Data', 'info');
          }
          const responseData: any = response?.data ?? null;
          onDone(responseData);
        }, error => {
          if (typeof onError === 'function') {
            onError(error);
          }
        });
  }

  delete(id: any, onDone: any, onError?: any) {
    return this.http.delete<any>(`${environment.apiHost}/${this.pathUrl}/${id}`)
      .pipe(map(response => {
        return response;
      })).pipe(first()).subscribe(
        response => {
          if (this.showNotification) {
            this.toastr.success('Successfully Delete Data', 'info');
          }
          const responseData: any = response?.data ?? null;
          onDone(responseData);
        }, error => {
          if (typeof onError === 'function') {
            onError(error);
          }
        });
  }
}
