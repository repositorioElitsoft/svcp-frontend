import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-image',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule
  ],
  templateUrl: './upload-image.component.html',
  styleUrl: './upload-image.component.css'
})
export class UploadImageComponent {

  selectedFile: File | null = null;
  fileUrl: string | null = null;
  tooltipText: string = 'Formatos permitidos:</br>JPG,PNG. BMP, WEBP </br></br>Peso máximo:  </br>2mb';

  ngOnInit() {
    if (this.selectedFile) {
      this.fileUrl = URL.createObjectURL(this.selectedFile);
    }
  }

  patch(value: File) {
    this.selectedFile = value
    this.fileUrl = URL.createObjectURL(this.selectedFile);
  }

  deleteFile() {
    this.selectedFile = null;
    this.fileUrl = null;
  }
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.fileUrl = URL.createObjectURL(this.selectedFile);
    }
  }

  ngOnDestroy(): void {
    if (this.fileUrl) {
      URL.revokeObjectURL(this.fileUrl);
    }
  }
}
