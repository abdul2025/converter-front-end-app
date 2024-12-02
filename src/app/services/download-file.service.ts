import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DownloadFileService {

  constructor() { }



  downloadFile(fileBlob: Blob | null, fileName: string) {
    if (fileBlob) {
      const url = window.URL.createObjectURL(fileBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName 
      a.click();
      window.URL.revokeObjectURL(url); // Clean up
      return true
    }
    return false
  }
}
