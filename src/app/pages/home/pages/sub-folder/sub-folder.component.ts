import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DatastoreService } from 'src/app/core/services/datastore.service';
import { DeleteItemModalComponent } from 'src/app/shared/modals/delete-item-modal/delete-item-modal.component';
import { NewSubFolderModalComponent } from 'src/app/shared/modals/new-sub-folder-modal/new-sub-folder-modal.component';

@Component({
  selector: 'app-sub-folder',
  templateUrl: './sub-folder.component.html',
  styleUrls: ['./sub-folder.component.scss'],
})
export class SubFolderComponent implements OnInit {
  nameSpace: string;
  allFromNameSpace$: Observable<any>;
  constructor(
    private activatedRoute: ActivatedRoute,
    private datastoreService: DatastoreService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.nameSpace = this.activatedRoute.snapshot.params['id'];
    this.getAllNameSpaceData();
  }

  getAllNameSpaceData(): void {
    this.allFromNameSpace$ = this.datastoreService.getAllFromNameSpace(
      'userDataStore/' + 'FOLDER:' + this.nameSpace
    );
  }

  onChangeRoute(event: Event, subFolder: any): void {
    event.stopPropagation();
    this.router.navigate([
      'documents/' + this.nameSpace + '/' + subFolder?.key,
    ]);
  }

  onAddNewSubFolder(event: Event, allFromNameSpace: any): void {
    event.stopPropagation();
    this.dialog
      .open(NewSubFolderModalComponent, {
        width: '35%',
        data: {
          nameSpace: this.nameSpace,
          allFromNameSpace,
        },
      })
      .afterClosed()
      .subscribe((shouldReload: boolean) => {
        if (shouldReload) {
          this.getAllNameSpaceData();
        }
      });
  }

  onDelete(event: Event, subFolder: any): void {
    event.stopPropagation();
    this.dialog
      .open(DeleteItemModalComponent, {
        data: {
          nameSpace: this.nameSpace,
          subFolder,
          itemName: subFolder?.keyName,
        },
      })
      .afterClosed()
      .subscribe((shouldReload: boolean) => {
        if (shouldReload) {
          this.getAllNameSpaceData();
        }
      });
  }
}
