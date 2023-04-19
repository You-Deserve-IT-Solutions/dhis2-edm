import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DatastoreService } from 'src/app/core/services/datastore.service';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.nameSpace = this.activatedRoute.snapshot.params['id'];
    this.allFromNameSpace$ = this.datastoreService.getAllFromNameSpace(
      'userDataStore/' + 'FOLDER:' + this.nameSpace
    );
  }

  onChangeRoute(event: Event, subFolder: any): void {
    event.stopPropagation();
    console.log(subFolder);
    this.router.navigate([
      'documents/' + this.nameSpace + '/' + subFolder?.key,
    ]);
  }

  onAddNewSubFolder(event: Event): void {
    event.stopPropagation();
    console.log(this.nameSpace);
  }
}
