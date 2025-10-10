import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

import { MyRecidencePageRoutingModule } from './my-recidence-routing.module';
import { MyRecidencePage } from './my-recidence.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MyRecidencePageRoutingModule,
    HttpClientModule
  ],
  declarations: [MyRecidencePage]
})
export class MyRecidencePageModule {}
