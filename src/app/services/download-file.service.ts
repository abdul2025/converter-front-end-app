import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DownloadFileService {

  constructor() { }



  downloadFile(fileBlob: Blob | null, isToggledFileType:boolean, service: string) {
    if (fileBlob) {
      const url = window.URL.createObjectURL(fileBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = isToggledFileType ? 'documents.zip' : 'pdfs.zip';
      a.click();
      window.URL.revokeObjectURL(url); // Clean up
      return true
    }
    return false
  }
}
