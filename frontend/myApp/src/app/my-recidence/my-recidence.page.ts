import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { RecidenceService } from '../services/recidence-service';



@Component({
  selector: 'app-my-recidence',
  templateUrl: './my-recidence.page.html',
  styleUrls: ['./my-recidence.page.scss'],
  standalone: false // <-- aquí
})




export class MyRecidencePage implements OnInit {

  usersRecidence: any[] = [];
  recidenceForm!: FormGroup;
  submitted = false;
  isEditing = false;
  currentRecidenceId: number | null = null;

  // 📸 Imagen
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private recidenceService: RecidenceService,
    private alertController: AlertController
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
      error: (err) => console.error('Error cargando usuarios:', err)
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = e => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    } else {
      this.selectedFile = null;
      this.imagePreview = null;
    }
  }

  onSubmit() {
  this.submitted = true;
  if (this.recidenceForm.invalid) return;

  const formData = new FormData();
  const recidenceData = this.recidenceForm.value;

  formData.append('name', recidenceData.name);
  formData.append('medical_assistant', recidenceData.medical_assistant);

  if (this.selectedFile) {
    formData.append('photo', this.selectedFile, this.selectedFile.name);
  }

  if (this.isEditing && this.currentRecidenceId) {
    this.recidenceService.updateRecidence(this.currentRecidenceId, formData).subscribe({
      next: () => {
        this.resetForm();
        this.loadUsers();
      },
      error: err => console.error('Error al actualizar:', err)
    });
  } else {
    this.recidenceService.addRecidence(formData).subscribe({
      next: () => {
        this.resetForm();
        this.loadUsers();
      },
      error: err => console.error('Error al crear:', err)
    });
  }
}
  currentImageUrl: string | null = null;
  editRecidence(recidence: any) {
  this.isEditing = true;
  this.currentRecidenceId = recidence.id;
  this.selectedFile = null;
  this.currentImageUrl = recidence.image_url || null; // Guardamos la imagen actual
  this.imagePreview = recidence.image_url || null;

  this.recidenceForm.patchValue({
    name: recidence.name,
    medical_assistant: recidence.medical_assistant
  });
}


  resetForm() {
  this.isEditing = false;
  this.currentRecidenceId = null;
  this.submitted = false;
  this.recidenceForm.reset();
  this.selectedFile = null;
  this.imagePreview = null;
  this.currentImageUrl = null;
  if (this.fileInput?.nativeElement) this.fileInput.nativeElement.value = '';
}

  async confirmDelete(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar Borrado',
      message: '¿Deseas eliminar este registro?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', handler: () => this.deleteRecidence(id) }
      ]
    });
    await alert.present();
  }

  deleteRecidence(id: number) {
    this.recidenceService.deleteRecidence(id).subscribe({
      next: () => this.loadUsers(),
      error: err => console.error('Error al eliminar:', err)
    });
  }

  get f() {
    return this.recidenceForm.controls;
  }
}
