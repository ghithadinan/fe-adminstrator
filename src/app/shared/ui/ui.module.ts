import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {
  NgbCollapseModule,
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbModule,
  NgbTimepickerModule,
  NgbTypeaheadModule
} from '@ng-bootstrap/ng-bootstrap';

import {PagetitleComponent} from './pagetitle/pagetitle.component';
import {TableComponent} from './tables/table/table.component';
import {TranslateModule} from '@ngx-translate/core';
import {ButtonComponent} from './button/button.component';
import {CardComponent} from './contents/card/card.component';
import {ContainerComponent} from './contents/container/container.component';
import {ToastrModule} from 'ngx-toastr';
import {FormLabelComponent} from './form-label/form-label.component';


@NgModule({
  declarations: [PagetitleComponent,
    TableComponent, ButtonComponent,
    CardComponent, ContainerComponent,
    FormLabelComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbCollapseModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    NgbDropdownModule,
    NgbTypeaheadModule,
    NgbModule,
    TranslateModule,
    ToastrModule.forRoot()
  ],
  exports: [PagetitleComponent,
    TableComponent,
    ButtonComponent,
    CardComponent,
    ContainerComponent,
    FormLabelComponent]
})
export class UIModule {
}
