import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MaterialModule } from '../infrastructure/material/material.module';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';

const components = [ImageUploadComponent];

@NgModule({
  declarations: [...components, ErrorDialogComponent],
  imports: [CommonModule, NgxDropzoneModule, MaterialModule, NgOptimizedImage],
  exports: [...components],
})
export class SharedModule {}
