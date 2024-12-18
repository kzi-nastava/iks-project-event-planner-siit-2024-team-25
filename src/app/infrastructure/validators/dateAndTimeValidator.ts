import { AbstractControl, ValidationErrors } from '@angular/forms';

export function dateAndTimeValidator(
  group: AbstractControl,
): ValidationErrors | null {
  const startDate = group.get('startDate')?.value;
  const endDate = group.get('endDate')?.value;
  const startTime = group.get('startTime')?.value;
  const endTime = group.get('endTime')?.value;

  if (!startDate || !endDate) {
    return null; // Don't validate until both dates are selected
  }

  const start = new Date(`${startDate}T${startTime || '00:00'}`);
  const end = new Date(`${endDate}T${endTime || '00:00'}`);

  if (startDate > endDate) {
    return { startDateAfterEndDate: true };
  } else if (startDate === endDate && startTime && endTime && start >= end) {
    return { startTimeAfterOrEqualEndTime: true };
  }

  return null;
}
