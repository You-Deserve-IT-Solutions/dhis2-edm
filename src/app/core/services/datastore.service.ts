import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as async from 'async';
import {
  getPaginatedDataStoreKeys,
  getDataStoreUrlParams,
} from '../helpers/datastore.helper';
import * as moment from 'moment';

import { orderBy } from 'lodash';

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

  getDataViaKey(keys: string[], nameSpace: string): Observable<any[]> {
    let data = [];
    let errors = {};
    return new Observable((observer) => {
      async.mapLimit(
        keys,
        2,
        async.reflect((key, callback) => {
          this.httpClient.get(`userDataStore/${nameSpace}/${key}`).subscribe(
            (results) => {
              data = [...data, results];
              callback(null, results);
            },
            (err) => {
              errors[key] = err;
              callback(err, null);
            }
          );
        }),
        () => {
          observer.next(data);
          observer.complete();
        }
      );
    });
  }

  findByKeys(
    namespace: string,
    keys: string[],
    pager?: any,
    configurations?: any
  ): Observable<any> {
    keys = keys.filter((key) => key !== 'configurations') || [];
    if (keys?.length === 0) {
      return of({
        data: [],
      });
    }

    console.log('keys', keys);

    let data = [];
    let errors = {};

    const paginatedKeys: string[] = getPaginatedDataStoreKeys(keys, pager);
    return new Observable((observer) => {
      async.mapLimit(
        paginatedKeys,
        10,
        async.reflect((key, callback) => {
          this.findOne(namespace, key, configurations).subscribe(
            (results) => {
              data = [...data, results];
              callback(null, results);
            },
            (err) => {
              errors[key] = err;
              callback(err, null);
            }
          );
        }),
        () => {
          const response = {
            data: data?.map((dataItem) => {
              return dataItem;
            }),
            errors,
          };
          const newPager = pager
            ? {
                ...pager,
                page: pager.page || 1,
                pageCount:
                  paginatedKeys?.length > 0
                    ? Math.ceil((keys?.length || 0) / paginatedKeys.length)
                    : 1,
                total: keys.length,
              }
            : null;

          observer.next(newPager ? { ...response, pager: newPager } : response);
          observer.complete();
        }
      );
    });
  }

  findOne(
    namespace: string,
    key: string,
    configurations: any
  ): Observable<any> {
    return this.httpClient.get(`${'userDataStore/' + namespace}/${key}`).pipe(
      map((response) => {
        return {
          ...response,
        };
      }),
      catchError((error) => of(error))
    );
  }

  getAllFromNameSpace(
    dataStoreUrl: string,
    configurations?: any
  ): Observable<any> {
    const { key, namespace, pager } = getDataStoreUrlParams(dataStoreUrl) || {
      key: undefined,
      namespace: undefined,
    };

    if (key) {
      return this.findOne(namespace, key, configurations);
    }

    return this.findAll(namespace, pager, configurations).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => of(error))
    );
  }

  findNamespaceKeys(
    namespace: string,
    configurations?: any
  ): Observable<string[]> {
    return this.httpClient.get('userDataStore/' + namespace).pipe(
      map((response) => {
        return response;
      }),
      catchError((error: any) => {
        if (error.status === 404) {
          return of([]);
        }

        return throwError(error);
      })
    );
  }

  findAll(
    namespace: string,
    pager?: any,
    configurations?: any
  ): Observable<{ [namespace: string]: any }> {
    return this.findNamespaceKeys(namespace, configurations).pipe(
      switchMap((keys: string[]) => {
        return this.findByKeys(namespace, keys, pager, configurations).pipe(
          map((values) => values)
        );
      })
    );
  }

  getKeyData(key: string, nameSpace: string): Observable<any> {
    return this.httpClient.get(`userDataStore/${nameSpace}/${key}`).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }
}
