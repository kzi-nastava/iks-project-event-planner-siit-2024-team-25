import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';

export interface UploadedImage {
  file: File;
  preview: string;
}

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss',
})
export class ImageUploadComponent implements OnDestroy {
  @Input() multiple = false;
  @Input() maxFileSize = 5000000; // 5MB default
  @Output() imagesChanged = new EventEmitter<File[]>();

  images: UploadedImage[] = [];
  error: string | null = null;

  onSelect(event: NgxDropzoneChangeEvent) {
    this.error = null;

    // Validate file size and type
    const invalidFiles = event.rejectedFiles.filter(
      (file) => file.reason === 'size' || !file.type.startsWith('image/'),
    );

    if (invalidFiles.length > 0) {
      this.error = `Some files were rejected. Please ensure all files are images under ${
        this.maxFileSize / 1000000
      }MB.`;
      return;
    }

    // Handle selected files
    if (!this.multiple && this.images.length + event.addedFiles.length > 1) {
      this.error = 'Only one image can be uploaded';
      return;
    }

    // Create preview URLs and add to images array
    const newImages: UploadedImage[] = event.addedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    if (this.multiple) {
      this.images.push(...newImages);
    } else {
      // Replace existing image in single mode
      this.images = newImages;
    }

    this.emitChanges();
  }

  onRemove(index: number) {
    URL.revokeObjectURL(this.images[index].preview);
    this.images.splice(index, 1);
    this.emitChanges();
  }

  private emitChanges() {
    this.imagesChanged.emit(this.images.map((img) => img.file));
  }

  ngOnDestroy() {
    // Clean up preview URLs
    this.images.forEach((image) => URL.revokeObjectURL(image.preview));
  }
}
