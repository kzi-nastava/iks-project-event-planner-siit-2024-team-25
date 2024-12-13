import { AbstractControl, ValidationErrors } from "@angular/forms";

export function minArrayLength(min: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (Array.isArray(value) && value.length >= min) {
        return null; 
      }
      return { minArrayLength: { requiredLength: min, actualLength: value.length } };
    };
  }