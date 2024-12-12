import { Component, inject, input, OnInit, output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { FileUpload } from 'primeng/fileupload';
import { Popover } from 'primeng/popover';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

export interface image {
  src: string;
  link: string;
}

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss',
  standalone: true,
  imports: [FormsModule, ButtonModule, FileUpload, Popover, InputTextModule],
})
export class ImageComponent implements OnInit {
  mode = input.required<'layout' | 'content' | 'preview'>();
  inputData = input.required<image | null>();
  remove = output();
  outputData = output<image>();

  data: image = {} as image;

  uploadedFileName: string | null = null;

  private http = inject(HttpClient);

  ngOnInit(): void {
    this.data = this.inputData() || ({ src: '', link: '' } as image);
    const normalizedPath = this.inputData()?.src.replace(/\\/g, '/');
    this.uploadedFileName = normalizedPath?.split('/').pop() || null;
  }

  onUpload(event: any) {
    const response = event.originalEvent.body;
    const normalizedPath = response.filePath.replace(/\\/g, '/');
    this.uploadedFileName = normalizedPath.split('/').pop();
    this.data = {
      ...this.data,
      src: `http://localhost:3000/${response.filePath}`,
    };
    this.outputData.emit(this.data);
  }

  onError(event: any) {
    console.error('File upload error:', event);
    alert('Upload Failed!');
  }

  onClear() {
    console.log('File upload cleared.');
  }

  removeImage() {
    if (!this.uploadedFileName) {
      console.error('No file to delete.');
      return;
    }

    const deleteUrl = 'http://localhost:3000/deleteFile/';
    const request = {
      filename: this.uploadedFileName,
    };

    this.http.post(deleteUrl, request).subscribe({
      next: () => {
        console.log('Image deleted successfully.');
        this.data.src = '';
        this.uploadedFileName = '';
        this.outputData.emit(this.data);
      },
      error: (err) => {
        console.error('Failed to delete image:', err);
        alert('Failed to delete the image!');
      },
    });
  }

  link() {
    if (this.data.link) {
      window.open(this.data.link, '_blank');
    }
  }
}
