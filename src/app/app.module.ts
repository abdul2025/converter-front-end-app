import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';  // <-- Import FormsModule

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MainContentComponent } from './main-content/main-content.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr'; // Import ToastrModule
import { ErrorHandlerService } from './services/error-handler.service';  // Your custom error handler
import { HttpErrorInterceptor } from './services/http-error.interceptor';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component'; // HTTP error interceptor
import { LoadingInterceptor } from './services/loading.interceptor';
import { GooglePickerService } from './services/google-drive-picker.service';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MainContentComponent,
    LoadingSpinnerComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,  // Required for Toastr
    HttpClientModule,
    ToastrModule.forRoot(),  // Configure Toastr globally
  ],
  providers: [
    ErrorHandlerService,
    GooglePickerService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,  // Register the HTTP interceptor
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
