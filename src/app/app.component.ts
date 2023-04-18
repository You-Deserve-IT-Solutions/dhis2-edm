import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { Fn } from '@iapps/function-analytics';
import { DatastoreService } from './core/services/datastore.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  nameSpaceResponse$: Observable<any>;
  constructor(
    private translate: TranslateService,
    private titleService: Title,
    protected datastoreService: DatastoreService
  ) {
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use('en');

    // Set application title
    this.setTitle('edm');

    if (Fn) {
      Fn.init({
        baseUrl: '../../../',
      });
    }
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  ngOnInit(): void {
    this.nameSpaceResponse$ = this.datastoreService.createNameSpace();
  }
}
