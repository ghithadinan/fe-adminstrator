import {Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {first, map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {TableRequest} from '../../../../core/models/table.request.model';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private host = environment.apiHost;

  requestReload: Observable<string>;
  private requestReloadSubject: BehaviorSubject<string>;

  constructor(private http: HttpClient) {
    this.requestReloadSubject = new BehaviorSubject<string>(null);
    this.requestReload = this.requestReloadSubject.asObservable();
  }

  datatable(url: string, req: TableRequest, onDone: any, onError: any) {
    return this.http.post<any>(`${this.host}/${url}`, req)
      .pipe(map(response => {
        return response;
      })).pipe(first()).subscribe(
        data => {
          onDone(data);
        }, error => {
          onError(error);
        });
  }

  reload(tableId: string) {
    this.requestReloadSubject.next(tableId);
  }

  onReload() {
    this.requestReloadSubject.next(null);
  }
}
