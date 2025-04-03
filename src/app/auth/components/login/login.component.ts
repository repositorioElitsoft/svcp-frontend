import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { convertErrorMessageToI18 } from '../../../core/utils/errors.utils';

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
    TranslateModule,
    RouterModule

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
  hidePassword: boolean = true;

  images: string[] = ["1.jpg", "2.jpg", "3.jpg", "4.jpg"]


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService,
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
      minWidth: '380px'

    })
  }

  login() {
    const credentials = this.form.value
    this.authService.login(credentials.username, credentials.password).subscribe({
      next: (authentication) => {

        //this.errorService.getLoginError(credentials.username).subscribe((e: any) => {
        //  console.log("Mi errorcito", e.message)
        //  if (e.message) {
        //    this.errorMessage = e.message
        //    return;
        //  }


        localStorage.setItem("token", JSON.stringify(authentication))
        this.router.navigate(['/']).then(() => {
          window.location.reload();
        });
        //})


      },
      error: (error: any) => {

        console.log("error at login", error)
        if (error.status == 401 || error.status == 403) {
          this.errorMessage = this.translate.instant(convertErrorMessageToI18(error));
          return
        }
        if (error.status == 500) {
          this.errorMessage = this.translate.instant('login.errors.serverError')
          return
        }
        this.errorMessage = this.translate.instant('login.errors.unexpectedError')
      }
    })
  }
}
