import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyRecidencePage } from './my-recidence.page';

const routes: Routes = [
  {
    path: '',
    component: MyRecidencePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyRecidencePageRoutingModule {}
