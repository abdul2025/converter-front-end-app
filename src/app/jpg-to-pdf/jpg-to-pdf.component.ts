import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from '../services/error-handler.service';
import { DropboxService } from '../services/dropbox.service';
import { DownloadFileService } from '../services/download-file.service';
import { HttpHeaders } from '@angular/common/http';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-jpg-to-pdf',
  templateUrl: './jpg-to-pdf.component.html',
  styleUrls: ['./jpg-to-pdf.component.scss']
})
export class JpgToPdfComponent implements OnInit {

  constructor(
    private errorHandlerService: ErrorHandlerService,
    private dropboxService: DropboxService,
    private downloadFileService: DownloadFileService,
    private apiService: ApiService
    ) { }


   ngOnInit(): void {
    // Initialize the Google API client when the app starts
  }



  selected: File | null = null;
  isDragging: boolean = false;
  isToggledFileType: boolean = false;

  // File readiness
  fileReady = false;
  fileBlob: Blob | null = null;
  fileheader = new HttpHeaders()
  contentDisposition: string | null = null

  // Method to open the .docx file input dialog
  triggerInput(): void {
    const docxInput = document.getElementById('fileInput') as HTMLInputElement;
    docxInput.click();
  }


  // Handle the selected .docx file
  onFileSelected(event: Event): void {
    this.handleFileSelection(event, 'jpg');
  }


  // Handle file selection based on type
  private handleFileSelection(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type === 'image/jpeg' && (type === 'jpg' || type === 'jpeg')) {
        this.selected = file;
      }
    }
  }

  // Drag and Drop event handlers
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onDropFile(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0];
      if (file.type === 'image/jpeg') {
        this.selected = file;
      } else {
        this.errorHandlerService.showErrorMessage('Please drop a jpeg file.')
      }
    }
  }



  // DROPBOX Service to select file
  openDropboxChooser(fileType: number) {
    this.dropboxService.openChooser(
      (files) => {
        if (files && files[0]) {
          const selectedFile = files[0]; // Get the first selected file
          const fileUrl = selectedFile.link; // Dropbox file download link

          // Fetch the file content as ArrayBuffer
          fetch(fileUrl, { mode: 'cors' }) // Ensure CORS mode is enabled
            .then((response) => {
              if (!response.ok) {
                this.errorHandlerService.showErrorMessage(`HTTP error! status: ${response.status}`);
              }
              return response.arrayBuffer();
            })
            .then((buffer) => {
              // Convert ArrayBuffer to Blob
              const mimeType = this.dropboxService.getMimeType(selectedFile.name);
              const blob = new Blob([buffer], { type: mimeType });

              // Convert Blob to File
              const file = new File([blob], selectedFile.name, { type: mimeType });

              this.selected = file; // Store as a File object
            })
            .catch((error) => {
              this.errorHandlerService.showErrorMessage(`Error fetching file from Dropbox: ${error}`);
            });
        } else {
          this.errorHandlerService.showErrorMessage('No files selected or file metadata unavailable.');
        }
      },
      () => {
        console.log('User canceled file selection');
      }
    );
  }

  openGooglePicker(): void {
    console.log('Google Picker')
  }


  // Function triggered to process files
  onGenerateClick(): void {

    // check if file are uploaded by user
    if (this.selected == null) {
      this.errorHandlerService.showErrorMessage('Please select or drop .jpg or .jpeg file')
      return
    }
    this.fileReady = true; // Notify the user
    // Example: Perform Converter
    this.convertAction();
  }





  ////////////////////////////////////////////////////////////////
  /// API service to convert
  ////////////////////////////////////////////////////////////////

  convertAction(): void {
    console.log('generatePDF')

    this.apiService.convertToPdf(this.selected!, 'image')
    .subscribe({
      next: (response) => {
        this.contentDisposition = response.headers.get('Content-Disposition');
        this.fileBlob = response.body; // Store the Blob for later
        this.fileReady = true; // Notify the user
      },
      error: (err) => {
        console.error('Error generating document:', err);
        // Optional: Show an error notification
        // this.toastr.error('Failed to generate document.');
      },
      complete: () => {
        console.log('Document generation process completed');
      }
    });
  }


  

  downloadFile() {
    let fileName = 'default-file-name.pdf'; // Fallback filename
    if (this.contentDisposition) {
      const matches = /filename="([^"]+)"/.exec(this.contentDisposition);
      if (matches && matches[1]) {
        fileName = matches[1]; // Extracted filename
      }
    }
    let downloadStatus = this.downloadFileService.downloadFile(this.fileBlob, 'jpg')
    if (downloadStatus) {
      this.fileReady = false
      this.selected = null
    }else {
      console.log('Downloading File Failed')
    }
  }




}
