import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Field } from '../../models/field.model';
import { FormService } from '../../services';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
})
export class FieldComponent {
  @Input() field: Field<string>;
  @Input() isReport: boolean;
  @Input() value: any;
  @Input() form: FormGroup;
  @Input() isCheckBoxButton: boolean;
  @Input() fieldClass: string;
  @Input() shouldDisable: boolean;
  @Input() width: string;
  members$: Observable<any[]> = of([]);

  constructor(private formService: FormService) {}

  @Output() fieldUpdate: EventEmitter<FormGroup> =
    new EventEmitter<FormGroup>();

  @Output() fileFieldUpdate: EventEmitter<any> = new EventEmitter<any>();

  ngAfterViewInit() {
    if (
      this.field?.searchTerm ||
      this.field?.source ||
      (this.field?.shouldHaveLiveSearchForDropDownFields && this.field?.value)
    ) {
      this.members$ = this.formService.searchItem({ q: '' }, this.field);
    }
    this.fieldUpdate.emit(this.form);
  }

  get isValid(): boolean {
    return this.form?.controls[this.field.id]?.valid;
  }

  get issueWithTheDataField(): string {
    const message = this.form?.controls[this.field.id]?.valid
      ? null
      : !this.form?.controls[this.field.id]?.valid &&
        this.form.controls[this.field.id]?.errors?.minlength
      ? `${this.field?.label} has not reached required number of characters`
      : !this.form?.controls[this.field.id]?.valid &&
        this.form.controls[this.field.id]?.errors?.maxlength
      ? `${this.field?.label} has exceeded required number of characters`
      : !this.form?.controls[this.field.id]?.valid
      ? `${this.field?.label} is required`
      : '';
    return message;
  }

  get hasMinimunLengthIssue(): boolean {
    return this.form.controls[this.field.id]?.errors?.minlength;
  }

  get hasMaximumLengthIssue(): boolean {
    return this.form.controls[this.field.id]?.errors?.maxlength;
  }

  get isDateTime(): boolean {
    return this.field.controlType === 'date-time';
  }

  get isDate(): boolean {
    return this.field.controlType === 'date';
  }

  get isBoolean(): boolean {
    return this.field.controlType === 'boolean';
  }

  get isCommonField(): boolean {
    return !this.isCheckBoxButton && !this.isDate && !this.isBoolean;
  }

  get fieldId(): string {
    return this.field?.id;
  }

  onFieldUpdate(): void {
    this.fieldUpdate.emit(this.form);
  }

  fileChangeEvent(event, field): void {
    let objectToUpdate = {};
    objectToUpdate[field?.key] = event.target.files[0];
    this.fileFieldUpdate.emit(objectToUpdate);
  }

  updateFieldOnDemand(objectToUpdate): void {
    this.form.patchValue(objectToUpdate);
    const theKey = Object.keys(objectToUpdate);
    this.form.setValue({ dob: new Date() });
    this.fieldUpdate.emit(this.form);
  }

  get getOptionValue(): any {
    const matchedOption = (this.field.options.filter(
      (option) => option?.key === this.value
    ) || [])[0];
    return matchedOption ? matchedOption?.value : '';
  }

  searchItem(event: any, field?: any): void {
    event.stopPropagation();
    const searchingText = event.target.value;
    const parameters = { q: '' };
    this.members$ = this.formService.searchItem(parameters, this.field);
  }

  getSelectedItemFromOption(event: Event, item, field): void {
    event.stopPropagation();
    const value = item?.isDrug
      ? item?.formattedKey
      : item?.uuid
      ? item?.uuid
      : item?.id;
    let objectToUpdate = {};
    objectToUpdate[field?.key] =
      field?.searchControlType === 'drugStock'
        ? item
        : !field?.searchControlType ||
          field?.searchControlType !== 'residenceLocation'
        ? value
        : item;
    this.form.patchValue(objectToUpdate);
    this.fieldUpdate.emit(this.form);
  }

  getStockStatus(option) {
    const optionName = option?.display ? option?.display : option?.name;
    return optionName.includes('Available, Location') ? true : false;
  }
}
