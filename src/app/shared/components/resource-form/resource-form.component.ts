import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { State } from 'src/app/store/reducers';
import { ResourcesService } from 'src/app/core/services/resources.service';

@Component({
  selector: 'app-resource-form',
  templateUrl: './resource-form.component.html',
  styleUrls: ['./resource-form.component.css'],
})
export class ResourceFormComponent implements OnInit {
  formResource: FormGroup;
  nameIsEmpty: boolean = false;
  file: any;
  resourceType: any;
  requiredField: boolean = false;
  formGroup: FormGroup;
  nameAlert: string = 'Resource name is required';
  addressAlert: string = 'Link is required';
  statusMessage: string;
  statusErrorMessage: string;
  @Input() currentUser: any;
  @Input() linkToBackTo: string;
  @Output() documentResourceData: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(
    private _formBuilder: FormBuilder,
    private resourceService: ResourcesService,
    private store: Store<State>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formResource = this._formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      file: ['', Validators.required],
      url: ['', Validators.required],
    });
  }

  resetLinkOrFile() {
    if (
      this.formResource.value.url != '' &&
      this.formResource.value.type == 'doc'
    ) {
      this.formResource.value.url = '';
    }
  }

  fileSelection(event) {
    const element: HTMLElement = document.getElementById('fileSelector');
    this.file = event.target.files[0];
    this.formResource.value.file = this.file;
  }

  get name() {
    return this.formResource.get('name') as FormControl;
  }

  get url() {
    return this.formResource.get('url') as FormControl;
  }

  onGetBack(event: Event): void {
    event.stopPropagation();
    this.closeModal.emit(false);
  }

  save(data) {
    if (data.type == 'url') {
      let formattedResourcePayload = {
        name: data.name,
        type: data.type == 'url' ? 'EXTERNAL_URL' : 'UPLOAD_FILE',
        attachment: false,
        url: data.url,
        external: true,
      };
      this.statusMessage =
        'Saving ' + formattedResourcePayload.name + ' .........';
      this.resourceService
        .saveDocument(formattedResourcePayload)
        .subscribe((documentResponse) => {
          if (documentResponse) {
            if (documentResponse.status == 'OK') {
              this.statusMessage =
                'Document "' +
                formattedResourcePayload.name +
                '" was added successfully';
              formattedResourcePayload['id'] = documentResponse?.response?.uid;
              this.documentResourceData.emit(formattedResourcePayload);
            } else {
              this.statusErrorMessage =
                'Document "' +
                formattedResourcePayload.name +
                '" failed to be saved';
            }
          } else {
            this.statusMessage =
              'Saving "' + formattedResourcePayload.name + '" .........';
          }
        });
    } else {
      this.statusMessage = 'Saving ' + data.name + ' .........';
      this.resourceService
        .fileUpload({
          resourceName: data.name,
          resourceType: data.type,
          attachment: true,
          file: this.file,
          url: '',
        })
        .subscribe((response) => {
          this.resourceService
            .saveDocument({
              name: data.name,
              type: 'UPLOAD_FILE',
              attachment: true,
              external: false,
              url: response.response.fileResource.id,
            })
            .subscribe((documentResponse) => {
              let resource = {
                name: data.name,
                type: 'UPLOAD_FILE',
                attachment: true,
                url: '',
                external: false,
              };
              if (documentResponse) {
                if (documentResponse.status == 'OK') {
                  this.statusMessage =
                    'Document "' + resource.name + '" was added successfully';
                  resource['id'] = documentResponse?.response?.uid;
                  this.documentResourceData.emit(resource);
                } else {
                  this.statusErrorMessage =
                    'Document "' + resource.name + '" failed to be saved';
                }
              }
            });
        });
    }
  }
}
