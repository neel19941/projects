import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { TitleCaseDirective } from './directives/title-case.directive';



@NgModule({
  declarations: [
    CapitalizePipe,
    TitleCaseDirective
  ],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
