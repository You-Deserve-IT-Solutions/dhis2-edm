import { Injectable } from '@angular/core';
import { from, Observable, of, zip } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';

@Injectable({ providedIn: 'root' })
export class FormService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  searchItem(parameters, field?): Observable<any[]> {
    return this.httpClient.get('optionSets');
  }
}
