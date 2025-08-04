import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../infrastructure/auth/service/auth.service';

@Component({
  selector: 'app-suspension-page',
  templateUrl: './suspension-page.component.html',
  styleUrls: ['./suspension-page.component.scss'],
})
export class SuspensionPageComponent implements OnInit, OnDestroy {
  remainingTime: string = '';
  suspendUntil: Date = new Date();
  timerInterval?: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const suspensionEndDateTime =
      this.authService.getUser()?.suspensionEndDateTime;

    if (suspensionEndDateTime) {
      this.suspendUntil = new Date(suspensionEndDateTime);
      this.authService.setUser(null);
      if (!isNaN(this.suspendUntil.getTime())) {
        this.updateTimer();
      } else {
        console.error('Invalid suspension end date.');
      }
    }
  }

  updateTimer() {
    this.timerInterval = setInterval(() => {
      const currentTime = Date.now();
      const remainingSeconds = Math.max(
        0,
        Math.floor((this.suspendUntil.getTime() - currentTime) / 1000)
      );

      const days = Math.floor(remainingSeconds / (3600 * 24));
      const hours = Math.floor((remainingSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((remainingSeconds % 3600) / 60);
      const seconds = remainingSeconds % 60;

      this.remainingTime = `${days}d ${hours
        .toString()
        .padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds
        .toString()
        .padStart(2, '0')}s`;

      if (remainingSeconds === 0) {
        clearInterval(this.timerInterval);
        this.authService.setUser(null);
        this.router.navigate(['/user/login']);
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}
