import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatastoreService } from 'src/app/core/services/datastore.service';

@Component({
  selector: 'app-delete-item-modal',
  templateUrl: './delete-item-modal.component.html',
  styleUrls: ['./delete-item-modal.component.css'],
})
export class DeleteItemModalComponent implements OnInit {
  error: any;
  deleting: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<DeleteItemModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private datastoreService: DatastoreService
  ) {}

  ngOnInit(): void {}

  onCancel(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close(false);
  }

  onConfirm(event: Event) {
    // TODO: Add support to delete all the documents within the sub-folder
    event.stopPropagation();
    this.deleting = true;
    this.datastoreService
      .deleteUserDataStoreKey(
        'FOLDER:' + this.data?.nameSpace,
        this.data?.subFolder?.key
      )
      .subscribe((response: any) => {
        if (response && response?.status == 'OK') {
          this.deleting = false;
          this.dialogRef.close(true);
        } else {
          this.error = response;
          this.deleting = false;
        }
      });
  }

  onDismissMessage(event: Event): void {
    event.stopPropagation();
    this.error = null;
  }
}
