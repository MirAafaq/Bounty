import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../Services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  today = new Date();
  resetForm: FormGroup;
  step: number = 1;

  constructor(
    private fb: FormBuilder,
    private route :Router,
    private apiService: ApiService, 
    private snackBar: MatSnackBar
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  onEmailInput() {
    if (this.resetForm.get('email').valid) {
    
    }
  }
  onSubmit() {
    if (this.step === 1) {
      this.verifyEmail();
    } else if (this.step === 2) {
      this.verifyOTP();
    } else if (this.step === 3) {
      this.saveNewPassword();
    }
  }

verifyEmail() {
  const email = this.resetForm.get('email').value;
  this.apiService.Post('Verifying email...', '/verify-email', { email }).subscribe(response => {
    if (response.success) {
      this.step = 2; 
      this.snackBar.open('Email verified. Please enter the OTP sent to your email.', 'Close', { duration: 3000 });
    } else {
      this.snackBar.open('Email does not exist.', 'Close', { duration: 3000 });
    }
  });
}
verifyOTP() {
  const email = this.resetForm.get('email').value;
  const otp = this.resetForm.get('otp').value;
  this.apiService.Post('Verifying OTP...', '/verify-otp', { email, otp }).subscribe(response => {
    if (response.success) {
      this.step = 3; 
      this.snackBar.open('OTP verified. Please enter your new password.', 'Close', { duration: 3000 });
    } else {
      this.snackBar.open('Invalid or expired OTP.', 'Close', { duration: 3000 });
    }
  });
}

saveNewPassword() {
  const newPassword = this.resetForm.get('newPassword').value;
  const confirmPassword = this.resetForm.get('confirmPassword').value;

  if (newPassword !== confirmPassword) {
    this.snackBar.open('Passwords do not match.', 'Close', { duration: 3000 });
    return;
  }

  const email = this.resetForm.get('email').value;
  this.apiService.Post('Saving new password...', '/save-password', { email, newPassword }).subscribe(response => {
    if (response.success) {
      this.snackBar.open('Password updated successfully.', 'Close', { duration: 3000 });
      this.resetForm.reset();
      this.step = 1; 
    } else {
      this.snackBar.open('Failed to update password.', 'Close', { duration: 3000 });
    }
  });
}

  
}
