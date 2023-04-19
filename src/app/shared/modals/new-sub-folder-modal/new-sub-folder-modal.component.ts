import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Textbox } from '../../modules/forms/models/text-box.model';
import { TextArea } from '../../modules/forms/models/text-area.model';
import { FormValue } from '../../modules/forms/models/form-value.model';
import { DatastoreService } from 'src/app/core/services/datastore.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-new-sub-folder-modal',
  templateUrl: './new-sub-folder-modal.component.html',
  styleUrls: ['./new-sub-folder-modal.component.css'],
})
export class NewSubFolderModalComponent implements OnInit {
  formFields: any[];
  isFormValid: boolean = false;
  isNameUniq: boolean = false;
  formData: any = {};
  oneKeyOfTheNameSpaceData$: Observable<any>;
  error: any;
  saving: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<NewSubFolderModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private datastoreService: DatastoreService
  ) {}

  ngOnInit(): void {
    this.createFormFields();
    this.oneKeyOfTheNameSpaceData$ =
      this.data?.allFromNameSpace?.data?.length > 0
        ? this.datastoreService.getUserDatastoreKeyData(
            'FOLDER:' + this.data?.nameSpace,
            this.data?.allFromNameSpace?.data[0]?.key
          )
        : of({});
  }

  createFormFields(): void {
    this.formFields = [
      new Textbox({
        id: 'name',
        key: 'name',
        label: 'Name',
        required: true,
      }),
      new TextArea({
        id: 'description',
        key: 'description',
        label: 'Description',
        required: false,
      }),
    ];
  }

  onFormUpdate(formValue: FormValue): void {
    this.isFormValid = formValue.isValid;
    this.formData = formValue.getValues();
    const name = this.formData?.name?.value?.replaceAll(/\s/g, '');

    this.isNameUniq =
      (
        this.data?.allFromNameSpace?.data?.filter(
          (keysData: any) =>
            keysData?.key?.toLowerCase() === name?.toLowerCase()
        ) || []
      )?.length === 0;
  }

  onCancel(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close(false);
  }

  onSave(event: Event, oneKeyOfTheNameSpaceData: any): void {
    event.stopPropagation();
    this.saving = true;
    const data = {
      ...oneKeyOfTheNameSpaceData,
      key: this.formData?.name?.value?.replaceAll(/\s/g, ''),
      keyName: this.formData?.name?.value,
      keyNameDescription: this.formData?.description?.value,
      documents: [],
    };
    this.datastoreService.createUserDataStoreKey(data).subscribe((response) => {
      if (response && response?.status != 'ERROR') {
        this.saving = false;
        this.createFormFields();
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 100);
      } else {
        this.saving = false;
        this.error = response;
      }
    });
  }
}
