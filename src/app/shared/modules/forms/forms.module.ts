import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { fieldComponents } from './components';
import { materialModules } from '../../material.modules';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, ...materialModules],
  declarations: [...fieldComponents],
  providers: [],
  exports: [...fieldComponents],
})
export class FormModule {}
