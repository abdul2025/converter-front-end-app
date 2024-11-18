import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
})
export class LoadingSpinnerComponent {
  public static isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = LoadingSpinnerComponent.isLoadingSubject.asObservable();
}
