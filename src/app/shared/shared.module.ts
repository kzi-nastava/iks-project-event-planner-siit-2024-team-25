import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MaterialModule } from '../infrastructure/material/material.module';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { MapComponent } from './map/map.component';
import { EmptyStateComponent } from './empty-state/empty-state.component';
import { HomeOfferingCardComponent } from '../offering/home-offering-card/home-offering-card.component';

const components = [ImageUploadComponent, MapComponent, EmptyStateComponent];

@NgModule({
  declarations: [...components, ErrorDialogComponent],
  imports: [CommonModule, NgxDropzoneModule, MaterialModule, NgOptimizedImage],
  exports: [...components],
})
export class SharedModule {}
