import { NgModule } from '@angular/core';
import { DatepickerOverviewExample } from '../commons/date_picker/date_picker.component';
import { CpfPipe } from './cpf.pipe'


@NgModule({
  declarations: [ DatepickerOverviewExample ], // declare all directives and components
  exports:[
    DatepickerOverviewExample
  ]
  
})
export class MyAgreementModule { }