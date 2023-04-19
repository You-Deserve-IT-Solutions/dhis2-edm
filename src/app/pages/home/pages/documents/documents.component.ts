import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, zip } from 'rxjs';
import { DatastoreService } from 'src/app/core/services/datastore.service';
import { ResourcesService } from 'src/app/core/services/resources.service';
import { ResourceModalComponent } from 'src/app/shared/modals/resource-modal/resource-modal.component';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css'],
})
export class DocumentsComponent implements OnInit {
  key: string;
  nameSpace: string;
  documents$: Observable<any>;
  deleting: boolean = false;
  constructor(
    private datastoreService: DatastoreService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private resourceService: ResourcesService
  ) {}

  ngOnInit(): void {
    this.key = this.activatedRoute.snapshot.params['key'];
    this.nameSpace = this.activatedRoute.snapshot.params['id'];
    this.getDocuments();
  }

  getDocuments(): void {
    this.documents$ = this.datastoreService.findByKeys(
      'FOLDER:' + this.nameSpace,
      [this.key]
    );
  }

  onAddResource(event: Event, keyData: any): void {
    event.stopPropagation();
    this.dialog
      .open(ResourceModalComponent, {
        minWidth: '40%',
        data: keyData,
      })
      .afterClosed()
      .subscribe((shouldReload: boolean) => {
        if (shouldReload) {
          this.getDocuments();
        }
      });
  }

  onBack(event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/' + this.nameSpace]);
  }

  openResource(resource: any) {
    window.open(`../../../api/documents/${resource?.id}/data`, '_blank');
  }

  deleteResource(documentToDelete: any, keyData: any): void {
    const data = {
      ...keyData,
      documents:
        keyData?.documents?.filter(
          (document: any) => document?.id != documentToDelete?.id
        ) || [],
    };
    this.deleting = true;
    zip(
      this.datastoreService.updateUserDataStoreKey(data),
      this.resourceService.deleteResource(documentToDelete?.id)
    ).subscribe((response: any) => {
      if (response) {
        this.deleting = false;
        this.getDocuments();
      } else {
        this.deleting = false;
      }
    });
  }
}
