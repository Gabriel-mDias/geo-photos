import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';


export abstract class BaseStore<T> {
  protected readonly baseUrl: string;
  protected readonly jsonHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(protected http: HttpClient, protected endpoint: string) {
    const api = (environment && environment.apiUrl) ? environment.apiUrl.replace(/\/+$/, '') : '';
    const ep = (endpoint || '').replace(/^\/+|\/+$/g, '');
    this.baseUrl = `${api}/${ep}`;
  }

  getAll(params?: HttpParams): Observable<T[]> {
    return this.http.get<T[]>(this.baseUrl, { params }).pipe(catchError(this.handleError));
  }

  getById(id: string | number, params?: HttpParams): Observable<T> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<T>(url, { params }).pipe(catchError(this.handleError));
  }

  post(item: Partial<T>): Observable<T> {
    return this.http.post<T>(this.baseUrl, item, { headers: this.jsonHeaders }).pipe(catchError(this.handleError));
  }

  put(id: string | number, item: Partial<T>): Observable<T> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<T>(url, item, { headers: this.jsonHeaders }).pipe(catchError(this.handleError));
  }

  delete(id: string | number): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url).pipe(catchError(this.handleError));
  }

  protected handleError(error: any) {
    const message = (error && error.message) ? error.message : 'Server error';
    return throwError(() => new Error(message));
  }
}
