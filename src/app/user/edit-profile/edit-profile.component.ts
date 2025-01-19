import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { environment } from '../../../environment/environment';
import { UserRole } from '../../infrastructure/auth/model/user-role.model';
import { ErrorResponse } from '../../shared/model/error.response.model';
import { EventOrganizer, Owner, User } from '../model/user.model';
import { UserRequest } from '../model/user.request.model';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  @Input() user!: User | EventOrganizer | Owner;
  @Output() userUpdate = new EventEmitter<User>();

  profileForm!: FormGroup;
  saving = false;

  profilePicture?: File;
  removeProfilePicture = false;

  resetSubject: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    const baseForm = {
      firstName: [
        this.user.firstName,
        [Validators.required, Validators.minLength(2)],
      ],
      lastName: [
        this.user.lastName,
        [Validators.required, Validators.minLength(2)],
      ],
      userRole: [this.user.userRole],
    };

    if (this.isEventOrganizer(this.user)) {
      const organizerForm = {
        ...baseForm,
        eventOrganizerFields: this.fb.group({
          phoneNumber: [
            this.user.phoneNumber,
            [Validators.required, Validators.pattern(/^\+?[\d\s-]+$/)],
          ],
          livingAddress: this.fb.group({
            country: [this.user.livingAddress.country, Validators.required],
            city: [this.user.livingAddress.city, Validators.required],
            address: [this.user.livingAddress.address, Validators.required],
          }),
        }),
      };
      this.profileForm = this.fb.group(organizerForm);
    } else if (this.isOwner(this.user)) {
      const ownerData = this.user as Owner;
      const ownerFieldsWithoutPictures = {
        companyName: ownerData.companyName,
        companyAddress: ownerData.companyAddress,
        contactPhone: ownerData.contactPhone,
        description: ownerData.description,
        companyPictures: undefined,
      };

      const ownerForm = {
        ...baseForm,
        ownerFields: [ownerFieldsWithoutPictures],
      };
      this.profileForm = this.fb.group(ownerForm);
    } else {
      this.profileForm = this.fb.group(baseForm);
    }
  }

  isEventOrganizer(user: User): user is EventOrganizer {
    return user.userRole === UserRole.EventOrganizer;
  }

  isOwner(user: User): user is Owner {
    return user.userRole === UserRole.Owner;
  }

  get profilePictureUrl(): string {
    if (!this.user) return 'placeholder-avatar.png';
    return environment.apiHost + `/api/users/${this.user.id}/profile-picture`;
  }

  onPictureUpdate(update: { file?: File; removeProfilePicture?: boolean }) {
    this.profilePicture = update.file;
    this.removeProfilePicture = !!update.removeProfilePicture;
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.saving = true;
      const formValue = this.profileForm.value;

      const userRequest: UserRequest = {
        ...formValue,
        profilePicture: this.profilePicture,
        removeProfilePicture: this.removeProfilePicture,
      };

      this.userService.updateUser(this.user.id, userRequest).subscribe({
        next: (user: User) => {
          this.saving = false;
          this.toastr.success('Profile updated successfully');
          this.userUpdate.emit(user);
        },
        error: (error: ErrorResponse) => {
          this.saving = false;
          this.toastr.error(error.message, 'Failed to update profile');
        },
      });
    }
  }

  onReset() {
    this.initializeForm();
    this.resetSubject.next();
  }

  upgradeProfile() {
    const queryParams = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
    };

    this.router.navigate(['/user/register'], { queryParams });
  }
}
