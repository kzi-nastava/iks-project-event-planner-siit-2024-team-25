import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../service/user.service';
import { AuthService } from '../../infrastructure/auth/service/auth.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RegisterSuccessDialogComponent } from '../register-success-dialog/register-success-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../infrastructure/material/material.module';
import { SharedModule } from '../../shared/shared.module';
import { NgxMatInputTelComponent } from 'ngx-mat-input-tel';
import { UserRole } from '../../infrastructure/auth/model/user-role.model';
import { ErrorResponse } from '../../shared/model/error.response.model';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRoute: jasmine.SpyObj<ActivatedRoute>;

  const commonFormData = {
    email: 'test@email.com',
    password: 'Test1234',
    confirmPassword: 'Test1234',
    firstName: 'John',
    lastName: 'Doe',
  };

  const eventOrganizerData = {
    eventOrganizerFields: {
      country: 'USA',
      city: 'New York',
      address: '123 Main St',
      phoneNumber: '+38164654456',
    },
  };

  const ownerData = {
    ownerFields: {
      companyName: 'Test Company',
      country: 'USA',
      city: 'New York',
      address: '123 Business Ave',
      contactPhone: '+38164654456',
      description: 'Test description',
      companyPictures: [],
    },
  };

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', [
      'register',
      'upgradeProfile',
    ]);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockToastrService = jasmine.createSpyObj('ToastrService', ['error']);
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'getUser',
      'logOut',
    ]);
    mockRoute = jasmine.createSpyObj('ActivatedRoute', [], {
      queryParams: of({}),
    });

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        MaterialModule,
        SharedModule,
        NgxMatInputTelComponent,
      ],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ActivatedRoute, useValue: mockRoute },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize the form with empty values and EVENT_ORGANIZER as default role', () => {
      expect(component.selectedRole).toBe('EVENT_ORGANIZER');
      expect(component.form.get('email')?.value).toBe('');
      expect(component.form.get('password')?.value).toBe('');
      expect(component.form.get('confirmPassword')?.value).toBe('');
      expect(component.form.get('firstName')?.value).toBe('');
      expect(component.form.get('lastName')?.value).toBe('');
      expect(
        component.form.get('eventOrganizerFields')?.get('country')?.value
      ).toBe('');
      expect(component.form.get('ownerFields')?.get('companyName')?.value).toBe(
        ''
      );
    });

    it('should validate required fields for EVENT_ORGANIZER role', () => {
      component.selectedRole = 'EVENT_ORGANIZER';
      component.updateRoleSpecificValidators();
      component.form.patchValue({
        ...commonFormData,
        eventOrganizerFields: {
          country: '',
          city: '',
          address: '',
          phoneNumber: '',
        },
      });

      expect(component.form.valid).toBeFalse();
      expect(
        component.form.get('eventOrganizerFields')?.get('country')?.valid
      ).toBeFalsy();
    });

    it('should validate required fields for OWNER role', () => {
      component.selectedRole = 'OWNER';
      component.updateRoleSpecificValidators();
      component.form.patchValue({
        ...commonFormData,
        ownerFields: {
          companyName: '',
          country: '',
          city: '',
          address: '',
          contactPhone: '',
        },
      });

      expect(component.form.valid).toBeFalse();
      expect(
        component.form.get('ownerFields')?.get('companyName')?.errors?.[
          'required'
        ]
      ).toBeTruthy();
    });
  });

  describe('Role Selection', () => {
    it('should update form validation when switching to EVENT_ORGANIZER role', () => {
      component.selectedRole = 'OWNER';
      component.updateRoleSpecificValidators();
      component.selectedRole = 'EVENT_ORGANIZER';
      component.updateRoleSpecificValidators();
      fixture.detectChanges();

      const eventOrganizerFields = component.form.get('eventOrganizerFields');
      const ownerFields = component.form.get('ownerFields');

      eventOrganizerFields?.get('country')?.setValue('');
      ownerFields?.get('companyName')?.setValue('');

      expect(
        eventOrganizerFields?.get('country')?.errors?.['required']
      ).toBeTruthy();
      expect(ownerFields?.get('companyName')?.errors).toBeNull();
    });

    it('should update form validation when switching to OWNER role', () => {
      component.selectedRole = 'EVENT_ORGANIZER';
      component.updateRoleSpecificValidators();
      component.selectedRole = 'OWNER';
      component.updateRoleSpecificValidators();
      fixture.detectChanges();

      const eventOrganizerFields = component.form.get('eventOrganizerFields');
      const ownerFields = component.form.get('ownerFields');

      eventOrganizerFields?.get('country')?.setValue('');
      ownerFields?.get('companyName')?.setValue('');

      expect(
        ownerFields?.get('companyName')?.errors?.['required']
      ).toBeTruthy();
      expect(eventOrganizerFields?.get('country')?.errors).toBeNull();
    });
  });

  describe('Form Submission', () => {
    it('should submit EVENT_ORGANIZER registration successfully', fakeAsync(() => {
      const mockResponse = {
        email: commonFormData.email,
        fullName: `${commonFormData.firstName} ${commonFormData.lastName}`,
        userRole: UserRole.EventOrganizer,
      };
      mockUserService.register.and.returnValue(of(mockResponse));

      component.selectedRole = 'EVENT_ORGANIZER';
      component.updateRoleSpecificValidators();
      component.form.patchValue({
        ...commonFormData,
        ...eventOrganizerData,
      });

      component.onSubmit();
      tick();

      expect(mockUserService.register).toHaveBeenCalledWith({
        email: commonFormData.email,
        password: commonFormData.password,
        firstName: commonFormData.firstName,
        lastName: commonFormData.lastName,
        profilePicture: null,
        userRole: 'EVENT_ORGANIZER',
        eventOrganizerFields: {
          livingAddress: {
            country: eventOrganizerData.eventOrganizerFields.country,
            city: eventOrganizerData.eventOrganizerFields.city,
            address: eventOrganizerData.eventOrganizerFields.address,
          },
          phoneNumber: eventOrganizerData.eventOrganizerFields.phoneNumber,
        },
      });
      expect(mockDialog.open).toHaveBeenCalledWith(
        RegisterSuccessDialogComponent,
        {
          width: '480px',
          data: mockResponse,
        }
      );
    }));

    it('should submit OWNER registration successfully', fakeAsync(() => {
      const mockResponse = {
        email: 'test@email.com',
        fullName: 'John Doe',
        userRole: UserRole.Owner,
      };
      mockUserService.register.and.returnValue(of(mockResponse));

      component.selectedRole = 'OWNER';
      component.updateRoleSpecificValidators();
      component.form.patchValue({
        ...commonFormData,
        ...ownerData,
      });

      component.onSubmit();
      tick();

      expect(mockUserService.register).toHaveBeenCalledWith({
        email: commonFormData.email,
        password: commonFormData.password,
        firstName: commonFormData.firstName,
        lastName: commonFormData.lastName,
        profilePicture: null,
        userRole: 'OWNER',
        ownerFields: {
          companyName: ownerData.ownerFields.companyName,
          companyAddress: {
            country: ownerData.ownerFields.country,
            city: ownerData.ownerFields.city,
            address: ownerData.ownerFields.address,
          },
          contactPhone: ownerData.ownerFields.contactPhone,
          description: ownerData.ownerFields.description,
          companyPictures: [],
        },
      });
      expect(mockDialog.open).toHaveBeenCalledWith(
        RegisterSuccessDialogComponent,
        {
          width: '480px',
          data: mockResponse,
        }
      );
    }));

    it('should handle registration errors with field-specific messages', fakeAsync(() => {
      const mockError: ErrorResponse = {
        code: 422,
        message: 'Registration failed',
        errors: {
          email: 'Email already exists',
          'ownerFields.companyName': 'Company name already taken',
        },
      };
      mockUserService.register.and.returnValue(throwError(() => mockError));

      component.selectedRole = 'OWNER';
      component.updateRoleSpecificValidators();
      component.form.patchValue({
        ...commonFormData,
        ...ownerData,
      });

      component.onSubmit();
      tick();

      expect(mockToastrService.error).toHaveBeenCalledWith(
        mockError.message,
        'Failed to register'
      );
      expect(component.form.get('email')?.errors?.['serverError']).toBe(
        'Email already exists'
      );
      expect(
        component.form.get('ownerFields.companyName')?.errors?.['serverError']
      ).toBe('Company name already taken');
    }));
  });

  describe('File Handling', () => {
    it('should handle profile picture selection', () => {
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      component.onProfilePictureSelected([file]);

      expect(component.profilePicture).toBe(file);
      expect(component.form.get('profilePicture')?.value).toBe(file);
    });

    it('should handle company pictures selection for OWNER role', () => {
      const files = [
        new File(['test1'], 'company1.png', { type: 'image/png' }),
        new File(['test2'], 'company2.png', { type: 'image/png' }),
      ];

      component.selectedRole = 'OWNER';
      component.onCompanyPicturesSelected(files);

      expect(component.companyPictures).toEqual(files);
      expect(
        component.form.get('ownerFields')?.get('companyPictures')?.value
      ).toEqual(files);
    });
  });

  describe('Password Validation', () => {
    it('should reject passwords that do not meet complexity requirements', () => {
      component.form.patchValue({
        password: 'weak',
        confirmPassword: 'weak',
      });

      expect(
        component.form.get('password')?.errors?.['invalidPassword']
      ).toBeTruthy();
    });

    it('should reject when confirmPassword does not match password', () => {
      component.form.patchValue({
        password: 'Test1234',
        confirmPassword: 'Test12345',
      });

      expect(component.form.errors?.['confirmPasswordMismatch']).toBeTruthy();
    });
  });

  describe('Email Validation', () => {
    it('should reject invalid email formats', () => {
      component.form.patchValue({
        email: 'invalid-email',
      });

      expect(component.form.get('email')?.errors?.['email']).toBeTruthy();
    });

    it('should accept valid email formats', () => {
      component.form.patchValue({
        email: 'valid@email.com',
      });

      expect(component.form.get('email')?.errors).toBeNull();
    });
  });

  describe('Toggle Password Visibility', () => {
    it('should toggle password visibility', () => {
      component.togglePasswordVisibility('password');
      expect(component.hidePassword).toBeFalse();

      component.togglePasswordVisibility('password');
      expect(component.hidePassword).toBeTrue();
    });

    it('should toggle confirm password visibility', () => {
      component.togglePasswordVisibility('confirmPassword');
      expect(component.hideConfirmPassword).toBeFalse();

      component.togglePasswordVisibility('confirmPassword');
      expect(component.hideConfirmPassword).toBeTrue();
    });
  });

  describe('Form Submission with Partial Data', () => {
    it('should not submit the form if only partial data is provided', () => {
      component.form.patchValue({
        email: 'test@email.com',
        password: 'Test1234',
        confirmPassword: 'Test1234',
        firstName: '',
        lastName: '',
      });

      component.onSubmit();

      expect(mockUserService.register).not.toHaveBeenCalled();
      expect(mockUserService.upgradeProfile).not.toHaveBeenCalled();
    });
  });

  describe('Form Submission with Invalid Phone Number', () => {
    it('should not submit the form if an invalid phone number is provided', () => {
      component.selectedRole = 'EVENT_ORGANIZER';
      component.updateRoleSpecificValidators();
      component.form.patchValue({
        ...commonFormData,
        eventOrganizerFields: {
          country: 'USA',
          city: 'New York',
          address: '123 Main St',
          phoneNumber: 'invalid-phone',
        },
      });

      component.onSubmit();

      expect(mockUserService.register).not.toHaveBeenCalled();
      expect(mockUserService.upgradeProfile).not.toHaveBeenCalled();
    });
  });
});
