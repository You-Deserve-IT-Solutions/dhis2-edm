import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DatastoreService } from 'src/app/core/services/datastore.service';
import { State } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  showMenuItems: boolean = true;
  currentUser$: Observable<any>;
  keys$: Observable<string[]>;
  configurations$: Observable<any>;
  constructor(
    private _snackBar: MatSnackBar,
    private store: Store<State>,
    private datastoreService: DatastoreService
  ) {}

  ngOnInit() {
    this.currentUser$ = this.store.select(getCurrentUser);
    this.keys$ = this.datastoreService.getKeys(`edm`);
    this.configurations$ = this.datastoreService.getDatastoreKeyData(
      'edm',
      'configurations'
    );
  }

  toggleMenuItems(event: Event): void {
    event.stopPropagation();
    this.showMenuItems = !this.showMenuItems;
  }

  openSnackBar() {
    this._snackBar.open('This is working', 'OK', {
      duration: 2000,
    });
  }
}
