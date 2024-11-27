import { Injectable } from '@angular/core';

declare const gapi: any;
declare var google: any;


@Injectable({
  providedIn: 'root'
})
export class GooglePickerService {
  private scope: string[] = ['https://www.googleapis.com/auth/drive.file'];

  constructor() {
  }


}
