import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DatastoreService } from 'src/app/core/services/datastore.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css'],
})
export class DocumentsComponent implements OnInit {
  key: string;
  nameSpace: string;
  documents$: Observable<any>;
  constructor(
    private datastoreService: DatastoreService,
    private router: Router,
    private activatedRoute: ActivatedRoute
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

  onAddResource(event: Event): void {
    event.stopPropagation();
  }

  onBack(event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/' + this.nameSpace]);
  }
}
