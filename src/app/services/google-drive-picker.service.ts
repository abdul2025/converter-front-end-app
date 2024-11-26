import { Injectable } from '@angular/core';

declare const gapi: any;
declare var google: any;


@Injectable({
  providedIn: 'root'
})
export class GooglePickerService {
  private clientId: string = '784748268115-p2fq00o202apob7jg9urgh9g6bcsnfpk.apps.googleusercontent.com';
  private scope: string[] = ['https://www.googleapis.com/auth/drive.file'];

  constructor() {
    this.loadPicker();
  }

  loadPicker() {
    gapi.load('auth', { 'callback': this.onAuthApiLoad.bind(this) });
    gapi.load('picker');
  }

  onAuthApiLoad() {
    gapi.auth.authorize({
      'client_id': this.clientId,
      'scope': this.scope,
      'immediate': false
    }, this.handleAuthResult.bind(this));
  }

  handleAuthResult(authResult: any) {
    if (authResult && !authResult.error) {
      const oauthToken = authResult.access_token;
      const picker = new google.picker.PickerBuilder()
        .addView(google.picker.ViewId.DOCS)
        .setOAuthToken(oauthToken)
        .setDeveloperKey('AIzaSyA1t7a5PNIdXFXjbycPdE1FGxyfixI9IrE')
        .setCallback(this.pickerCallback)
        .build();
      picker.setVisible(true);
    }
    console.log('The user selected: ISSUE ');

  }

  pickerCallback(data: any) {
    if (data.action === google.picker.Action.PICKED) {
      const fileId = data.docs[0].id;
      console.log('The user selected: ' + fileId);
    }else {
      console.log('The user selected: ISSUE ');
    }
  }

  openPicker() {
    this.loadPicker();
  }
}
