import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, LoadingController, ToastController } from '@ionic/angular';
import { BlogService } from '../../../../shared/services/blog.service';
import { BlogPost, PRESET_BLOG_IMAGES } from '../../../../shared/models/blog';
import { UtilitiesService } from '../../../../shared/services/utilities.service';

@Component({
  selector: 'app-blog-modal',
  templateUrl: './blog-modal.component.html',
  styleUrls: ['./blog-modal.component.scss'],
  standalone: false
})
export class BlogModalComponent implements OnInit {

  @Input() post?: BlogPost;

  blogForm!: FormGroup;
  quillInstance: any;

  // Catálogo de imágenes de assets precargadas
  presetImages = PRESET_BLOG_IMAGES;

  // Manejo de opción de imagen ('preset' para assets, 'custom' para archivo subido)
  imageOption: 'preset' | 'custom' = 'preset';
  selectedFile?: File;
  previewUrl: string = PRESET_BLOG_IMAGES[0].path;

  // Lista local de tags para la interfaz del modal
  tagsList: string[] = [];
  newTagInput: string = '';

  // Configuración de la barra de herramientas de Quill con handler personalizado para 'image'
  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],        // Negrita, cursiva, subrayado, tachado
        [{ 'header': [1, 2, 3, false] }],                 // Encabezados H1, H2, H3
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],     // Listas numeradas y con viñetas
        [{ 'align': [] }],                                // Alineación de texto
        ['link', 'image'],                                // Enlaces URL e Imágenes
        ['clean']                                         // Botón para limpiar formato
      ],
      handlers: {
        image: () => this.selectCustomImageForQuill()     // Intercepta el clic en el botón de imagen
      }
    }
  };

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private blogService: BlogService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private utilities: UtilitiesService
  ) {}

  ngOnInit() {
    this.initForm();

    // Escuchar cambios en el título para actualizar el slug y sugerir tags automáticamente
    this.blogForm.get('titulo')?.valueChanges.subscribe(titulo => {
      if (titulo) {
        const slug = this.generateSlug(titulo);
        this.blogForm.get('slug')?.setValue(slug, { emitEvent: false });

        // Sugerir tags automáticamente basados en las palabras del título si no se han agregado tags manuales
        if (this.tagsList.length === 0 && !this.post) {
          const suggested = this.generateSuggestedTags(titulo);
          this.tagsList = suggested;
          this.blogForm.get('tags')?.setValue(suggested);
        }
      } else {
        this.blogForm.get('slug')?.setValue('', { emitEvent: false });
      }
    });

    if (this.post) {
      this.patchFormValues();
    }
  }

  private initForm() {
    this.blogForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      slug: ['', [Validators.required]],
      autor: ['Inverfin', [Validators.required]],
      extracto: ['', [Validators.required, Validators.maxLength(250)]],
      contenido: ['', [Validators.required]],
      publicado: [true],
      imagenPortada: [this.presetImages[0].path, [Validators.required]],
      imagenPortadaPath: [''],
      tags: [[]] // 👈 Control reactivo para los tags
    });
  }

  private patchFormValues() {
    if (!this.post) return;

    const isCustom = !!this.post.imagenPortadaPath;
    this.imageOption = isCustom ? 'custom' : 'preset';
    this.previewUrl = this.post.imagenPortada || this.presetImages[0].path;
    this.tagsList = this.post.tags || [];

    this.blogForm.patchValue({
      titulo: this.post.titulo,
      slug: this.post.slug,
      autor: this.post.autor,
      extracto: this.post.extracto,
      contenido: this.post.contenido,
      publicado: this.post.publicado,
      imagenPortada: this.post.imagenPortada || this.presetImages[0].path,
      imagenPortadaPath: this.post.imagenPortadaPath || '',
      tags: this.post.tags || []
    });
  }

  // Genera sugerencias de tags limpiando palabras comunes del título
  private generateSuggestedTags(title: string): string[] {
    const stopWords = ['el', 'la', 'los', 'las', 'un', 'una', 'y', 'o', 'de', 'del', 'a', 'en', 'para', 'por', 'con', 'sin', 'que', 'como'];
    const words = title
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3 && !stopWords.includes(w));

    // Tomar hasta 4 palabras clave únicas como sugerencias iniciales
    return Array.from(new Set(words)).slice(0, 4);
  }

  // Métodos para administrar los tags visualmente en el modal
  addTag(tagText: string) {
    const cleanTag = tagText.trim().toLowerCase();
    if (cleanTag && !this.tagsList.includes(cleanTag)) {
      this.tagsList.push(cleanTag);
      this.blogForm.get('tags')?.setValue([...this.tagsList]);
    }
    this.newTagInput = '';
  }

  removeTag(tagToRemove: string) {
    this.tagsList = this.tagsList.filter(t => t !== tagToRemove);
    this.blogForm.get('tags')?.setValue([...this.tagsList]);
  }

  onTagInputKeyup(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      const val = (event.target as HTMLInputElement).value.replace(',', '');
      if (val) {
        this.addTag(val);
      }
    }
  }

  // Seleccionar una de las 4 opciones precargadas de assets
  selectPresetImage(path: string) {
    this.imageOption = 'preset';
    this.selectedFile = undefined;
    this.previewUrl = path;

    this.blogForm.patchValue({
      imagenPortada: path,
      imagenPortadaPath: ''
    });
  }

  // Seleccionar archivo local desde la computadora
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageOption = 'custom';
      this.selectedFile = file;

      // Vista previa local inmediata
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  /**
   * Abre un input de archivo local, sube la imagen a Firebase mediante BlogService
   * e inserta el tag <img> dentro del contenido de Quill.
   */
  selectCustomImageForQuill() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.click();

    fileInput.onchange = async () => {
      const file = fileInput.files?.[0];
      if (!file) return;

      const loading = await this.loadingCtrl.create({
        message: 'Subiendo imagen al contenido...'
      });
      await loading.present();

      try {
        const uploadRes = await this.blogService.uploadImage(file);
        const range = this.quillInstance.getSelection(true) || { index: this.quillInstance.getLength() };
        this.quillInstance.insertEmbed(range.index, 'image', uploadRes.url);
        this.quillInstance.setSelection(range.index + 1);
        this.presentToast('Imagen agregada al contenido', 'success');
      } catch (error) {
        console.error('Error al subir imagen al editor:', error);
        this.presentToast('No se pudo subir la imagen al contenido', 'danger');
      } finally {
        await loading.dismiss();
      }
    };
  }

  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  onEditorCreated(editor: any) {
    this.quillInstance = editor;

    const initialContent = this.blogForm.get('contenido')?.value;
    if (initialContent) {
      this.quillInstance.clipboard.dangerouslyPasteHTML(initialContent);
    }

    this.quillInstance.on('text-change', () => {
      const html = this.quillInstance.root.innerHTML;
      const cleanedContent = (html === '<p><br></p>' || !html) ? '' : html;

      this.blogForm.patchValue({ contenido: cleanedContent });
      this.blogForm.get('contenido')?.markAsTouched();
      this.blogForm.get('contenido')?.updateValueAndValidity();
    });
  }

  async onSubmit() {
    if (this.blogForm.invalid) {
      this.blogForm.markAllAsTouched();
      return;
    }

    const rawValue = this.blogForm.getRawValue() as BlogPost;
    const slug = rawValue.slug;

    const isUnique = await this.blogService.isSlugUnique(slug, this.post?.id);
    if (!isUnique) {
      this.presentToast('El slug/título ya existe. Elige uno diferente.', 'danger');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: this.post ? 'Actualizando...' : 'Guardando...'
    });
    await loading.present();

    try {
      let finalPortada = rawValue.imagenPortada;
      let finalStoragePath = rawValue.imagenPortadaPath;

      if (this.imageOption === 'custom' && this.selectedFile) {
        if (this.post?.imagenPortadaPath) {
          await this.blogService.deleteImageByPath(this.post.imagenPortadaPath).catch(() => {});
        }

        const uploadRes = await this.blogService.uploadImage(this.selectedFile);
        finalPortada = uploadRes.url;
        finalStoragePath = uploadRes.path;
      }

      const titulo = rawValue.titulo?.trim() || '';
      const tagsFinal = rawValue.tags || [];

      const postPayload: BlogPost = {
        titulo,
        slug: rawValue.slug?.trim() || '',
        autor: rawValue.autor?.trim() || 'Inverfin',
        extracto: rawValue.extracto?.trim() || '',
        contenido: rawValue.contenido?.trim() || '',
        publicado: !!rawValue.publicado,
        imagenPortada: finalPortada,
        imagenPortadaPath: finalStoragePath,
        tags: tagsFinal,
        search: [
          ...this.utilities.arraySearch(titulo),
          ...tagsFinal
        ]
      };

      if (this.post?.id) {
        await this.blogService.updatePost(this.post.id, postPayload);
        this.presentToast('Artículo actualizado con éxito', 'success');
      } else {
        await this.blogService.createPost(postPayload);
        this.presentToast('Artículo publicado con éxito', 'success');
      }

      await loading.dismiss();
      this.modalCtrl.dismiss(null, 'saved');
    } catch (error: any) {
      await loading.dismiss();
      console.error('Error detallado:', error);
      this.presentToast('Error al guardar los datos.', 'danger');
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  private async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'bottom'
    });
    toast.present();
  }
}
