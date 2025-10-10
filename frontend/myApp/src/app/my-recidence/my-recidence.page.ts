import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular'; // 👈 Importar para alertas y navegación
import { RecidenceService } from '../services/recidence-service';

@Component({
  selector: 'app-my-recidence',
  templateUrl: './my-recidence.page.html',
  styleUrls: ['./my-recidence.page.scss'],
  standalone: false
})
export class MyRecidencePage implements OnInit {

  usersRecidence: any[] = [];
  recidenceForm!: FormGroup;
  submitted = false;
  isEditing = false; // 👈 Estado para saber si estamos creando o editando
  currentRecidenceId: number | null = null; // 👈 ID del registro en edición

  constructor(
    private fb: FormBuilder,
    private recidenceService: RecidenceService,
    private alertController: AlertController, // 👈 Inyectar AlertController
    private navCtrl: NavController // 👈 Inyectar NavController (o Router)
  ) {}

  ngOnInit() {
    this.recidenceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      medical_assistant: ['', Validators.required]
    });
    this.loadUsers();
  }

  loadUsers() {
    this.recidenceService.getRecidence().subscribe({
      next: (data: any) => {
        this.usersRecidence = data;
      },
      error: (err) => {
        console.error('Error cargando usuarios:', err);
      }
    });
  }

  // ------------------------------------------------------------------
  // 🔹 CREATE (Crear) y UPDATE (Actualizar)
  // ------------------------------------------------------------------
  onSubmit() {
    this.submitted = true;

    if (this.recidenceForm.invalid) {
      return;
    }

    const recidenceData = this.recidenceForm.value;

    if (this.isEditing && this.currentRecidenceId) {
      // ✅ Lógica de ACTUALIZACIÓN (UPDATE)
      this.recidenceService.updateRecidence(this.currentRecidenceId, recidenceData).subscribe({
        next: () => {
          console.log('Usuario actualizado con éxito');
          this.resetForm();
          this.loadUsers(); // Recargar lista
        },
        error: (err) => {
          console.error('Error al actualizar usuario:', err);
        }
      });
    } else {
      // ✅ Lógica de CREACIÓN (CREATE)
      this.recidenceService.addRecidence(recidenceData).subscribe({
        next: (res) => {
          console.log('Usuario creado:', res);
          this.resetForm();
          this.loadUsers(); // Recargar lista
        },
        error: (err) => {
          console.error('Error al crear usuario:', err);
        }
      });
    }
  }

  // ------------------------------------------------------------------
  // 🔸 Funciones de Edición
  // ------------------------------------------------------------------

  /** Prepara el formulario para editar un registro existente */
  editRecidence(recidence: any) {
    this.isEditing = true;
    this.currentRecidenceId = recidence.id; // Asume que el ID se llama 'id'

    // Rellenar el formulario con los datos del registro
    this.recidenceForm.patchValue({
      name: recidence.name,
      medical_assistant: recidence.medical_assistant
      // ... otros campos
    });

    // Opcional: Desplazarse al formulario para que el usuario pueda editar
    // this.navCtrl.navigateForward('/edit-recidence/' + recidence.id); 
  }

  /** Cancela la edición y resetea el formulario */
  resetForm() {
    this.isEditing = false;
    this.currentRecidenceId = null;
    this.submitted = false;
    this.recidenceForm.reset();
  }


  // ------------------------------------------------------------------
  // 🛑 DELETE (Borrar)
  // ------------------------------------------------------------------

  /** Muestra una alerta de confirmación antes de borrar */
  async confirmDelete(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar Borrado',
      message: '¿Estás seguro de que deseas eliminar este registro?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteRecidence(id);
          }
        }
      ]
    });

    await alert.present();
  }

  /** Ejecuta la llamada al servicio para eliminar el registro */
  deleteRecidence(id: number) {
    this.recidenceService.deleteRecidence(id).subscribe({
      next: () => {
        console.log(`Registro con ID ${id} eliminado con éxito.`);
        this.loadUsers(); // Recargar la lista después del borrado
      },
      error: (err) => {
        console.error('Error al eliminar registro:', err);
      }
    });
  }

  // ✅ Acceso rápido a controles del formulario (para mensajes de error)
  get f() {
    return this.recidenceForm.controls;
  }
}