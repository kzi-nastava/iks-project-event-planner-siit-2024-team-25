import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs';

interface ProfilePictureUpdate {
  file?: File;
  removeProfilePicture?: boolean;
}

@Component({
  selector: 'app-update-profile-picture',
  templateUrl: './update-profile-picture.component.html',
  styleUrls: ['./update-profile-picture.component.scss'],
})
export class UpdateProfilePictureComponent implements OnInit, OnDestroy {
  @Input() currentPictureUrl?: string;
  @Output() pictureUpdate = new EventEmitter<ProfilePictureUpdate>();
  @Input() resetEvent!: Observable<void>;

  private resetEventSubscription?: Subscription;

  previewUrl?: SafeUrl;
  isHovered = false;

  oldUrl?: string;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.oldUrl = this.currentPictureUrl;
    this.resetEventSubscription = this.resetEvent.subscribe(() => {
      this.oldUrl = this.currentPictureUrl;
    });
  }

  ngOnDestroy() {
    if (this.resetEventSubscription) {
      this.resetEventSubscription.unsubscribe();
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      if (this.isValidImageFile(file)) {
        this.previewUrl = this.sanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(file),
        );
        this.pictureUpdate.emit({ file });
      }
    }
  }

  removePicture() {
    this.previewUrl = undefined;
    this.oldUrl = undefined;
    this.pictureUpdate.emit({ removeProfilePicture: true });
  }

  private isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return validTypes.includes(file.type);
  }

  setToDefault() {
    this.oldUrl = undefined;
  }
}
