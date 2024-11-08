// src/app/services/error-handler.service.ts

import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';  // Import ToastrService
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(private toastr: ToastrService) {}

  // Show error message to the user via Toastr
  showErrorMessage(message: string): void {
    this.toastr.error(message, '', {
      closeButton: true,
      timeOut: 5000,  // Customize display duration (ms)
      progressBar: true,
    });
  }

  // Show success message to the user via Toastr
  showSuccessMessage(message: string): void {
    this.toastr.success(message, 'Success', {
      closeButton: true,
      timeOut: 3000,
    });
  }

  // Handle HTTP errors (client and server)
  handleHttpError(error: HttpErrorResponse): void {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server-side error: ${error.status} - ${error.message}`;
    }
    this.showErrorMessage(errorMessage);
  }

  // Handle custom application errors
  handleCustomError(message: string): void {
    this.showErrorMessage(message);
  }
}
