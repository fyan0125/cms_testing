import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FileUpload, UploadEvent } from 'primeng/fileupload';

export interface file {
  src: string;
}

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
  standalone: true,
  imports: [FileUpload, ButtonModule],
})
export class FileUploadComponent {
  mode = input.required<'layout' | 'content' | 'preview'>();
  inputData = input.required<file | null>();
  remove = output();
  outputData = output<file>();

  file: File | null = null;

  onUpload(event: any) {
    console.log(event.files);
  }
}
