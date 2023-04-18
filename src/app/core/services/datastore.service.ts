import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DatastoreService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  createNameSpace(): Observable<any> {
    const configurations = {
      addNameSpaceKeyUserGroup: {
        id: 'QYrzIjSfI8z',
        name: 'Add name space',
      },
      addMoreThanOneNameSpaceKeyUserGroup: {
        id: 'QYrzIjSfI8z',
        name: 'Add name space',
      },
    };
    return this.httpClient
      .post(`dataStore/edm/configurations`, configurations)
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError((error) => of(error))
      );
  }

  createUserDataStoreKey(data): Observable<any> {
    return this.httpClient
      .post(`userDataStore/${data?.nameSpace}/${data?.key}`, data)
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError((error) => of(error))
      );
  }

  getUserDataStoreNameSpaces(): Observable<string[]> {
    return this.httpClient.get(`userDataStore`).pipe(
      map((response: any) => response),
      catchError((error: any) => of(error))
    );
  }

  getUserDataStorekeys(nameSpace: string): Observable<string[]> {
    return this.httpClient.get(`userDataStore/${nameSpace}`).pipe(
      map((response: any) => response),
      catchError((error: any) => of(error))
    );
  }

  getKeys(nameSpace: string): Observable<string[]> {
    return this.httpClient.get(`dataStore/${nameSpace}`).pipe(
      map((response: any) => response),
      catchError((error: any) => of(error))
    );
  }

  getDatastoreKeyData(nameSpace: string, key: string): Observable<any> {
    return this.httpClient.get(`dataStore/${nameSpace}/${key}`).pipe(
      map((response: any) => response),
      catchError((error: any) => of(error))
    );
  }
}
