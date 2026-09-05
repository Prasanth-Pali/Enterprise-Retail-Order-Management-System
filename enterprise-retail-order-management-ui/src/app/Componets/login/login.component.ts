import { Component } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  isRegisterMode = false;


  // Login Form
  loginForm = this.fb.group({

    email: ['', [
      Validators.required,
      Validators.email
    ]],

    password: ['', [
      Validators.required
    ]]

  });


  // Register Form
  registerForm = this.fb.group({

    fullName: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)
    ]],

    email: ['', [
      Validators.required,
      Validators.pattern(
        /^[a-zA-Z0-9._%+-]+@gmail\.com$/
      )
    ]],

    password: ['', [
      Validators.required,
      Validators.pattern(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
      )
    ]],

    phoneNumber: ['', [
      Validators.required,
      Validators.pattern(/^[0-9]{10}$/)
    ]],

    address: ['', [
      Validators.maxLength(250)
    ]]

  });


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }


  // Login
  login(): void {

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request = {

      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!

    };

    this.authService.login(request).subscribe({

      next: (response) => {

        console.log('Login successful');

        localStorage.setItem(
          'token',
          response.token
        );

        this.isLoading = false;

        this.router.navigate(['/admin']);

      },

      error: (error) => {

        this.isLoading = false;

        this.errorMessage =
          'Invalid email or password.';

        console.error(error);

      }

    });

  }


  // Register
  register(): void {

    if (this.registerForm.invalid) {

      this.registerForm.markAllAsTouched();

      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request = {

      fullName:
        this.registerForm.value.fullName!,

      email:
        this.registerForm.value.email!,

      password:
        this.registerForm.value.password!,

      phoneNumber:
        this.registerForm.value.phoneNumber!,

      address:
        this.registerForm.value.address || null

    };

    this.authService.register(request).subscribe({

next: (response) => {

  console.log(
    'Registration successful:',
    response
  );

  this.isLoading = false;

  // Show success popup
  this.successMessage =
    'User successfully created!';

  // Clear registration form
  this.registerForm.reset();

  // Close popup and return to login
  setTimeout(() => {

    this.isRegisterMode = false;

    this.successMessage = '';

  }, 2500);
},

      error: (error) => {

        this.isLoading = false;

        console.error(
          'Registration error:',
          error
        );

        this.errorMessage =
          error.error ||
          'Registration failed. Please try again.';

      }

    });

  }


  // Login → Register
  showRegister(): void {

    this.isRegisterMode = true;

    this.errorMessage = '';
    this.successMessage = '';

  }


  // Register → Login
  showLogin(): void {

    this.isRegisterMode = false;

    this.errorMessage = '';
    this.successMessage = '';

  }

}

