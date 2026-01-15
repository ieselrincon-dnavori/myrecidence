import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { RecidenceService } from '../services/recidence-service';
import { AssistantService } from '../services/assistant.service';
import { HttpClient } from '@angular/common/http'; // 1. Importación necesaria

@Component({
  selector: 'app-my-recidence',
  templateUrl: './my-recidence.page.html',
  styleUrls: ['./my-recidence.page.scss'],
  standalone: false
})
export class MyRecidencePage implements OnInit {
  selectedSegment: string = 'registro';
  submitted = false;
  isEditing = false;
  currentRecidenceId: number | null = null;

  usersRecidence: any[] = [];
  assistants: any[] = [];
  assistantsWithResidents: any[] = [];
  
  recidenceForm!: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private recidenceService: RecidenceService,
    private assistantService: AssistantService,
    private alertController: AlertController,
    private toastController: ToastController,
    private http: HttpClient // 2. Inyección de HttpClient añadida
  ) {}

  ngOnInit() {
    this.recidenceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      medicalAssistantId: ['', Validators.required] 
    });
    this.loadAllData();
  }

  loadAllData() {
    this.loadUsers();
    this.loadAssistants();
  }

  loadUsers() {
    this.recidenceService.getRecidence().subscribe({
      next: (data: any) => this.usersRecidence = data,
      error: (err: any) => console.error('Error residentes:', err)
    });
  }

  loadAssistants() {
    this.assistantService.getAssistants().subscribe({
      next: (data: any) => {
        this.assistants = data;
        this.assistantsWithResidents = data;
      },
      error: (err: any) => console.error('Error asistentes:', err)
    });
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
    if (this.selectedSegment === 'lista') {
      this.loadAssistants();
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.recidenceForm.invalid) return;

    const formData = new FormData();
    formData.append('name', this.recidenceForm.value.name);
    formData.append('medicalAssistantId', this.recidenceForm.value.medicalAssistantId);
    if (this.selectedFile) {
      formData.append('photo', this.selectedFile, this.selectedFile.name);
    }

    if (this.isEditing && this.currentRecidenceId) {
      this.recidenceService.updateRecidence(this.currentRecidenceId, formData).subscribe({
        next: () => this.handleSuccess('Actualizado con éxito'),
        error: (err: any) => this.handleError(err)
      });
    } else {
      this.recidenceService.addRecidence(formData).subscribe({
        next: () => this.handleSuccess('Creado con éxito'),
        error: (err: any) => this.handleError(err)
      });
    }
  }

  handleSuccess(msg: string) {
    this.presentToast(msg);
    this.resetForm();
    this.loadAllData();
  }

  editRecidence(recidence: any) {
    this.isEditing = true;
    this.currentRecidenceId = recidence.id;
    this.imagePreview = recidence.image_url;
    this.recidenceForm.patchValue({
      name: recidence.name,
      medicalAssistantId: recidence.medicalAssistantId
    });
  }

  deleteRecidence(id: number) {
    this.recidenceService.deleteRecidence(id).subscribe({
      next: () => this.loadAllData(),
      error: (err: any) => console.error(err)
    });
  }

  get f() { return this.recidenceForm.controls; }

  resetForm() {
    this.isEditing = false;
    this.currentRecidenceId = null;
    this.submitted = false;
    this.recidenceForm.reset();
    this.imagePreview = null;
    this.selectedFile = null;
  }

  async confirmDelete(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Borrar este registro?',
      buttons: [
        { text: 'No' },
        { text: 'Sí', handler: () => this.deleteRecidence(id) }
      ]
    });
    await alert.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({ message, duration: 2000, color: 'success' });
    toast.present();
  }

  async handleError(err: any) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: err.error?.message || 'Error en el servidor',
      buttons: ['OK']
    });
    await alert.present();
  }

  // 3. Función corregida con la URL correcta del backend y tipos
  generateToken() {
    this.http.get<{accessToken: string}>('http://localhost:8080/api/auth/temp-token').subscribe({
      next: (res: any) => {
        localStorage.setItem('auth_token', res.accessToken);
        this.presentToast('Token generado y guardado correctamente');
        this.loadAllData();
      },
      error: (err: any) => this.handleError(err)
    });
  }
} // Llave de cierre de clase