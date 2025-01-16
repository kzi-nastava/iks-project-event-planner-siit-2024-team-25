import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, map } from 'rxjs';
import { ErrorResponse } from '../../shared/model/error.response.model';
import { Owner, User } from '../model/user.model';
import { OwnerFields } from '../model/user.request.model';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-edit-company-info',
  templateUrl: './edit-company-info.component.html',
  styleUrls: ['./edit-company-info.component.scss'],
})
export class EditCompanyInfoComponent implements OnInit, OnDestroy {
  @Input() owner!: Owner;
  @Output() userUpdate = new EventEmitter<User>();

  companyForm!: FormGroup;
  saving = false;
  selectedFiles: File[] = [];
  pictureUrls: SafeUrl[] = [];
  private objectUrls: string[] = []; // for cleanup

  private picturesToRemove: string[] = [];
  private existingPictures: { picId: string; idx: number }[] = []; // old pictures that were not removed

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadCompanyPictures();
  }

  private initializeForm() {
    this.companyForm = this.fb.group({
      companyName: [
        this.owner.companyName,
        [Validators.required, Validators.minLength(2)],
      ],
      contactPhone: [
        this.owner.contactPhone,
        [Validators.required, Validators.pattern(/^\+?[\d\s-]+$/)],
      ],
      description: [
        this.owner.description,
        [Validators.required, Validators.minLength(20)],
      ],
      companyAddress: this.fb.group({
        country: [this.owner.companyAddress.country, Validators.required],
        city: [this.owner.companyAddress.city, Validators.required],
        address: [this.owner.companyAddress.address, Validators.required],
      }),
    });
  }

  private loadCompanyPictures() {
    this.existingPictures =
      this.owner.companyPictures?.map((picId, idx) => ({ picId, idx })) ?? [];
    if (this.owner.companyPictures?.length) {
      const pictureObservables = this.owner.companyPictures.map((pictureId) =>
        this.userService.getCompanyPicture(this.owner.id, pictureId).pipe(
          map((blob) => {
            const objectUrl = URL.createObjectURL(blob);
            this.objectUrls.push(objectUrl);
            return this.sanitizer.bypassSecurityTrustUrl(objectUrl);
          }),
        ),
      );

      forkJoin(pictureObservables).subscribe({
        next: (urls: SafeUrl[]) => {
          this.pictureUrls = urls;
        },
        error: () => {
          this.toastr.error('Error loading company pictures');
        },
      });
    }
  }

  private cleanUpObjectUrls() {
    this.objectUrls.forEach((url) => {
      URL.revokeObjectURL(url);
    });
  }

  ngOnDestroy() {
    this.cleanUpObjectUrls();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      const validFiles = files.filter((file) => this.isValidImageFile(file));
      this.selectedFiles = [...this.selectedFiles, ...validFiles];

      // Create preview URLs
      validFiles.forEach((file) => {
        const objectUrl = URL.createObjectURL(file);
        this.objectUrls.push(objectUrl);
        const safeUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
        this.pictureUrls.push(safeUrl);
      });
    }
  }

  removeImage(index: number) {
    this.pictureUrls.splice(index, 1);
    if (index < this.existingPictures.length) {
      this.picturesToRemove.push(this.existingPictures[index].picId);
      this.existingPictures.splice(index, 1);
    } else {
      this.selectedFiles.splice(index - this.existingPictures.length, 1);
    }
  }

  private isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return validTypes.includes(file.type);
  }

  onSubmit() {
    if (this.companyForm.valid) {
      this.saving = true;

      const companyInfo: OwnerFields = {
        ...this.companyForm.value,
        companyPictures:
          this.selectedFiles.length > 0 ? this.selectedFiles : undefined,
        picturesToRemove: this.picturesToRemove,
      };

      this.userService.updateCompanyInfo(this.owner, companyInfo).subscribe({
        next: (user) => {
          this.saving = false;
          this.toastr.success('Company information updated successfully');
          this.userUpdate.emit(user);
        },
        error: (error: ErrorResponse) => {
          this.saving = false;
          this.toastr.error(
            error.message,
            'Failed to update company information',
          );
        },
      });
    }
  }

  onReset() {
    this.initializeForm();
    this.selectedFiles = [];
    this.pictureUrls = [];
    this.cleanUpObjectUrls();
    this.loadCompanyPictures();
  }
}
