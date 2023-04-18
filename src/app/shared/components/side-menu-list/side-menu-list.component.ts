import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DatastoreService } from 'src/app/core/services/datastore.service';
import { NewFolderModalComponent } from '../../modals/new-folder-modal/new-folder-modal.component';

@Component({
  selector: 'app-side-menu-list',
  templateUrl: './side-menu-list.component.html',
  styleUrls: ['./side-menu-list.component.scss'],
})
export class SideMenuListComponent implements OnInit {
  @Input() keys: string[];
  @Input() configurations: any;
  @Input() currentNameSpace: string;
  userDataStoreNameSpaces$: Observable<any[]>;
  @Output() selectedMenu: EventEmitter<any> = new EventEmitter<any>();
  activeMenu: string;
  constructor(
    private dataStoreService: DatastoreService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // console.log(this.keys);
    // console.log(this.configurations);
    this.getUserDataStoreNameSpaces();
  }

  getUserDataStoreNameSpaces(): void {
    this.userDataStoreNameSpaces$ =
      this.dataStoreService.getUserDataStoreNameSpaces();
    if (!this.currentNameSpace) {
      this.userDataStoreNameSpaces$.subscribe((responses: any[]) => {
        this.selectedMenu.emit(responses[0]);
        this.activeMenu = responses[0];
      });
    } else {
      this.activeMenu = this.currentNameSpace;
      this.selectedMenu.emit(this.currentNameSpace);
    }
  }

  onSetMenu(event: Event, menu: any): void {
    event.stopPropagation();
    this.selectedMenu.emit(menu);
    this.activeMenu = menu;
  }

  onAddNewFolder(): void {
    this.dialog
      .open(NewFolderModalComponent, {
        width: '35%',
      })
      .afterClosed()
      .subscribe((shouldReload) => {
        if (shouldReload) {
          this.getUserDataStoreNameSpaces();
        }
      });
  }
}
