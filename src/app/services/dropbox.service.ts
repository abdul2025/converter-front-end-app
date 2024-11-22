import { Injectable } from '@angular/core';

declare const Dropbox: any; // Declare the global Dropbox object

@Injectable({
  providedIn: 'root',
})
export class DropboxService {
  private appKey = 'm7bj0w440meusti'; // Replace with your Dropbox app key

  constructor() {
    console.log('DropboxService initialized');
  }

  /**
   * Opens the Dropbox Chooser and returns the selected file(s).
   * @param successCallback Callback for when a file is successfully selected
   * @param cancelCallback Callback for when the user cancels the picker
   */
  openChooser(successCallback: (files: any[]) => void, cancelCallback: () => void): void {
    const options = {
      success: successCallback,
      cancel: cancelCallback,
      linkType: 'direct', // "direct" for direct download link or "preview" for Dropbox preview link
      multiselect: false, // Allow only one file to be selected
      extensions: [
        '.pdf',        // PDF files
        '.doc',        // Word (older format)
        '.docx',       // Word (newer format)
        '.xls',        // Excel (older format)
        '.xlsx',       // Excel (newer format)
        '.ppt',        // PowerPoint (older format)
        '.pptx',       // PowerPoint (newer format)
        '.csv',        // CSV files
        '.jpg', '.jpeg', // JPEG images
        '.png'         // PNG images
      ], // Allowed file types
    };

    Dropbox.choose(options); // Open the Dropbox Chooser
  }

  getMimeType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'xlsx':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'csv':
        return 'text/csv';
      case 'pdf':
        return 'application/pdf';
      case 'png':
        return 'image/png';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      default:
        return 'application/octet-stream'; // Fallback for unknown types
    }
  }




}
