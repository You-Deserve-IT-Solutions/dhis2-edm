import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SubFolderComponent } from './pages/sub-folder/sub-folder.component';
import { DocumentsComponent } from './pages/documents/documents.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: ':id',
        component: SubFolderComponent,
      },
      {
        path: 'documents/:id/:key',
        component: DocumentsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
