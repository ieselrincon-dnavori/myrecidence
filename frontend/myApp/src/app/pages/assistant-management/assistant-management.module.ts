import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- AGREGAR ReactiveFormsModule
import { IonicModule } from '@ionic/angular';
import { AssistantManagementPageRoutingModule } from './assistant-management-routing.module';
import { AssistantManagementPage } from './assistant-management.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, // <--- ESTA LÍNEA ES CRUCIAL
    IonicModule,
    AssistantManagementPageRoutingModule
  ],
  declarations: [AssistantManagementPage]
})
export class AssistantManagementPageModule {}