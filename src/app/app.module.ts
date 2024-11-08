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
import { HttpErrorInterceptor } from './services/http-error.interceptor'; // HTTP error interceptor


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MainContentComponent

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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,  // Register the HTTP interceptor
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
