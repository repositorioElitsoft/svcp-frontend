import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { DialogoAccesibilidadComponent } from '../../../shared/components/dialogo-accesibilidad/dialogo-accesibilidad.component';
import { ErrorsService } from '../../../core/services/errors.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import SwiperCore from 'swiper';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,

  ],
  providers: [
    AuthService,
    ErrorsService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form!: FormGroup
  errorMessage!: String

  images: string[] = ["1.jpg", "2.jpg", "3.jpg", "4.jpg"]


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private errorService: ErrorsService,
    private dialog: MatDialog
  ) {
    this.form = formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    })


  }
  ngAfterViewInit() {
    // Initialize Swiper with options

  }


  getImageRoute(image: string) {
    return `assets/${image}`
  }

  openAccessibilityPanel() {
    this.dialog.open(DialogoAccesibilidadComponent, {

    })
  }

  login() {
    const credentials = this.form.value
    this.authService.login(credentials.username, credentials.password).subscribe({
      next: (authentication) => {

        this.errorService.getLoginError(credentials.username).subscribe((e: any) => {
          console.log("Mi errorcito", e.message)
          if (e.message) {
            this.errorMessage = e.message
            return;
          }

          localStorage.setItem("token", authentication.Authorization)
          this.router.navigate(['/']).then(() => {
            window.location.reload();
          });
        })


      },
      error: (error: HttpErrorResponse) => {

        if (error.status == 401) {
          this.errorMessage = "Nombre de usuario o contraseña incorrectos."
          return
        }
        this.errorMessage = "Error inesperado."
        if (error.status == 403) {

          this.errorMessage = "Nombre de usuario o contraseña incorrectos."
        }
        if (error.status == 500) {
          this.errorMessage = "Hubo un problema contactando al servidor, intente más tarde."
        }
        console.log("error at login", this.errorMessage)
      }
    })
  }
}
