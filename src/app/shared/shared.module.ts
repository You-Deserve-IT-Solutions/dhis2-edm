import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { materialModules } from './material.modules';
import { sharedComponents } from './components';
import { sharedModals } from './modals';
import { modules } from './modules';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...materialModules,
    ...modules,
  ],
  exports: [...materialModules, ...sharedComponents, ...modules],
  entryComponents: [...sharedModals],
  declarations: [...sharedComponents, ...sharedModals],
})
export class SharedModule {}
