import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssistantService } from '../../services/assistant.service';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-assistant-management',
  templateUrl: './assistant-management.page.html',
  styleUrls: ['./assistant-management.page.scss'],
  standalone: false
})
export class AssistantManagementPage implements OnInit {
  assistantForm!: FormGroup;
  assistants: any[] = [];
  submitted = false;

  // Propiedades que faltaban y causaban el error
  isEditing = false;
  currentAssistantId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private assistantService: AssistantService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.assistantForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      specialty: ['', Validators.required]
    });
    this.loadAssistants();
  }

  loadAssistants() {
    this.assistantService.getAssistants().subscribe({
      next: (data) => this.assistants = data,
      error: (err) => console.error('Error al cargar asistentes:', err)
    });
  }

  // Método que faltaba para cargar datos en el formulario
  editAssistant(assistant: any) {
    this.isEditing = true;
    this.currentAssistantId = assistant.id;
    this.assistantForm.patchValue({
      name: assistant.name,
      specialty: assistant.specialty
    });
  }

  // Método que faltaba para limpiar el formulario
  resetForm() {
    this.isEditing = false;
    this.currentAssistantId = null;
    this.submitted = false;
    this.assistantForm.reset();
  }

  onSubmit() {
    this.submitted = true;
    if (this.assistantForm.invalid) return;

    if (this.isEditing && this.currentAssistantId) {
      // Lógica de Actualización
      this.assistantService.updateAssistant(this.currentAssistantId, this.assistantForm.value).subscribe({
        next: () => {
          this.presentToast('Asistente actualizado con éxito');
          this.resetForm();
          this.loadAssistants();
        },
        error: (err) => console.error(err)
      });
    } else {
      // Lógica de Creación
      this.assistantService.createAssistant(this.assistantForm.value).subscribe({
        next: () => {
          this.presentToast('Asistente creado con éxito');
          this.resetForm();
          this.loadAssistants();
        },
        error: (err) => console.error(err)
      });
    }
  }

  async confirmDelete(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Deseas eliminar este asistente?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', handler: () => this.deleteAssistant(id) }
      ]
    });
    await alert.present();
  }

  deleteAssistant(id: number) {
    this.assistantService.deleteAssistant(id).subscribe({
      next: () => this.loadAssistants(),
      error: (err) => console.error('Error al eliminar:', err)
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }
}