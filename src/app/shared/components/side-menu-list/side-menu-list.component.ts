import { Component, Input, OnInit } from '@angular/core';
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
  userDataStoreNameSpaces$: Observable<any[]>;
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
