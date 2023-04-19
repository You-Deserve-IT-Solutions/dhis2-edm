import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DatastoreService } from 'src/app/core/services/datastore.service';
import { State } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors';

@Component({
  selector: 'app-resource-modal',
  templateUrl: './resource-modal.component.html',
  styleUrls: ['./resource-modal.component.css'],
})
export class ResourceModalComponent implements OnInit {
  currentUser$: Observable<any>;
  saving: boolean = false;
  linkToBackTo: string;
  constructor(
    private dialogRef: MatDialogRef<ResourceModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private store: Store<State>,
    private datastoreService: DatastoreService
  ) {}

  ngOnInit(): void {
    this.linkToBackTo =
      'documents/' +
      this.data?.nameSpace.replace('FOLDER:', '') +
      '/' +
      this.data?.key;
    this.currentUser$ = this.store.select(getCurrentUser);
  }

  onCancel(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close(false);
  }

  onCloseModal(shouldReload: boolean): void {
    this.dialogRef.close(shouldReload);
  }

  onGetDocumentData(documentData: any[]): void {
    const data = {
      ...this.data,
      documents: [...this.data?.documents, documentData],
    };
    this.saving = true;
    this.datastoreService
      .updateUserDataStoreKey(data)
      .subscribe((response: any) => {
        if (response) {
          this.saving = false;
          setTimeout(() => {
            this.dialogRef.close(true);
          }, 200);
        } else {
          this.saving = false;
        }
      });
  }
}
