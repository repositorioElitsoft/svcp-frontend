import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-upload-image',
  standalone: true,
  imports: [],
  templateUrl: './upload-image.component.html',
  styleUrl: './upload-image.component.css'
})
export class UploadImageComponent {

  @Input() selectedFile: File | null = null;
  fileUrl: string | null = null;

  ngOnInit() {
    if (this.selectedFile) {
      this.fileUrl = URL.createObjectURL(this.selectedFile);
    }
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
