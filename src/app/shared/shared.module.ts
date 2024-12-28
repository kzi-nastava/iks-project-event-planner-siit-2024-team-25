import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MaterialModule } from '../infrastructure/material/material.module';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { MapComponent } from './map/map.component';

const components = [ImageUploadComponent, MapComponent];

@NgModule({
  declarations: [...components, ErrorDialogComponent],
  imports: [CommonModule, NgxDropzoneModule, MaterialModule, NgOptimizedImage],
  exports: [...components],
})
export class SharedModule {}
