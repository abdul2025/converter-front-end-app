import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    LoadingSpinnerComponent.isLoadingSubject.next(true); // Show spinner
    return next.handle(request).pipe(
      finalize(() => LoadingSpinnerComponent.isLoadingSubject.next(false)) // Hide spinner
    );
  }
}
