import { Component, OnInit } from '@angular/core';
import { Textbox } from '../../modules/forms/models/text-box.model';
import { TextArea } from '../../modules/forms/models/text-area.model';
import { FormValue } from '../../modules/forms/models/form-value.model';
import { MatDialogRef } from '@angular/material/dialog';
import { DatastoreService } from 'src/app/core/services/datastore.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-folder-modal',
  templateUrl: './new-folder-modal.component.html',
  styleUrls: ['./new-folder-modal.component.css'],
})
export class NewFolderModalComponent implements OnInit {
  formFields: any[];
  isFormValid: boolean = false;
  formData: any = {};
  saving: boolean = false;
  error: any;
  constructor(
    private dialogRef: MatDialogRef<NewFolderModalComponent>,
    private datastoreService: DatastoreService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.createFormFields();
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

  onCancel(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close(false);
  }

  onGetFormData(formValue: FormValue): void {
    this.isFormValid = formValue.isValid;
    this.formData = formValue.getValues();
    console.log(this.formData?.name?.value?.replaceAll(/\s/g, ''));
  }

  onSave(event: Event): void {
    event.stopPropagation();
    this.saving = true;
    const data = {
      folderName: this.formData?.name?.value,
      folderDescription: this.formData?.description?.value,
      nameSpace: this.formData?.name?.value?.replaceAll(/\s/g, ''),
      key: 'default',
      keyName: 'Default',
    };
    this.datastoreService.createUserDataStoreKey(data).subscribe((response) => {
      if (response && !response?.error) {
        this.saving = false;
        this.createFormFields();
        this.openSnackBar();
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 100);
      } else if (response && response?.error) {
        this.saving = false;
        this.error = response?.error;
      }
    });
  }

  openSnackBar() {
    this._snackBar.open('Created successfully', 'OK', {
      duration: 2000,
    });
  }
}
