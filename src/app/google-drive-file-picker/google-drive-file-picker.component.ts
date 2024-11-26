import { Component, AfterViewInit } from '@angular/core';


declare var gapi: any;



@Component({
  selector: 'app-google-drive-file-picker',
  templateUrl: './google-drive-file-picker.component.html',
  styleUrls: ['./google-drive-file-picker.component.scss']
})
export class GoogleDriveFilePickerComponent implements AfterViewInit {




  private CLIENT_ID = '784748268115-p2fq00o202apob7jg9urgh9g6bcsnfpk.apps.googleusercontent.com';
  private API_KEY = 'AIzaSyA1t7a5PNIdXFXjbycPdE1FGxyfixI9IrE';
  private DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
  private SCOPES = "https://www.googleapis.com/auth/drive.readonly";

  constructor() {}


  ngAfterViewInit(): void {
    // Load the Google API client and Picker API asynchronously after the view is initialized
    gapi.load('client:auth2', () => {
      this.initClient();
    });
  }

  private initClient(): void {
    gapi.client.init({
      apiKey: this.API_KEY,
      clientId: this.CLIENT_ID,
      discoveryDocs: this.DISCOVERY_DOCS,
      scope: this.SCOPES
    }).then(() => {
      console.log('Google API client initialized');
      this.checkAuthStatus();
    }).catch((error: any) => {
      console.error('Error initializing Google API client:', error);
    });
  }

  private initPicker(): void {
    console.log('Google Picker API loaded');
  }

  public checkAuthStatus(): void {
    const authInstance = gapi.auth2.getAuthInstance();
    if (authInstance.isSignedIn.get()) {
      console.log('User is already signed in');
      // If signed in, open the file picker
      this.openPicker();
    } else {
      console.log('User is not signed in');
      this.signIn();
    }
  }

  private signIn(): void {
    gapi.auth2.getAuthInstance().signIn().then(() => {
      console.log('User signed in');
      this.openPicker();
    }).catch((error: any) => {
      console.error('Sign-in error:', error);
    });
  }

  public openPicker(): void {
    // Ensure google.picker is defined
    if (typeof google !== 'undefined' && google.picker) {
      const picker = new google.picker.PickerBuilder()
        .addView(google.picker.ViewId.DOCS)
        .setOAuthToken(gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token)
        .setCallback(this.pickerCallback.bind(this))
        .build();
      picker.setVisible(true);
    } else {
      console.error('Google Picker API is not loaded properly.');
    }
  }

  private pickerCallback(data: any): void {
    if (data.action === google.picker.Action.PICKED) {
      const fileId = data.docs[0].id;
      console.log('Picked file ID:', fileId);
    }
  }

  signOut(): void {
    gapi.auth2.getAuthInstance().signOut().then(() => {
      console.log('User signed out');
    });
  }

}
