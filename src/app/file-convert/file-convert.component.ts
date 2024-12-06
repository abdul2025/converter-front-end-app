import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { DownloadFileService } from '../services/download-file.service';
import { DropboxService } from '../services/dropbox.service';
import { ErrorHandlerService } from '../services/error-handler.service';
import { ConversionInfoInterface, HandlingPathsService } from '../services/handling-paths.service';

@Component({
  selector: 'app-file-convert',
  templateUrl: './file-convert.component.html',
  styleUrls: ['./file-convert.component.scss']
})
export class FileConvertComponent implements OnInit {
  obj: ConversionInfoInterface = {
    title: '',
    subTitle: '',
    selectFileBtn: '',
    hoverMessage: '',
    dropLabal: '',
    btnSubmit: '',
    btnColor: '',
    acceptedFileType: '',
    fileType: ''
  };

  constructor(
    private errorHandlerService: ErrorHandlerService,
    private dropboxService: DropboxService,
    private downloadFileService: DownloadFileService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private handlingPathsService: HandlingPathsService
    ) { }


    ngOnInit(): void {
      // Find the user path
      const currentPath = this.route.snapshot.url.join('/');
      //  handle page content, style and file types
      // check if reverse
      if (currentPath.includes('reverse')) {
        // Handle reverse logic
        [this.obj, this.urlReversed] = this.handlingPathsService.handleReversePath(currentPath);
      } else {
        // Handle normal path logic
        [this.obj, this.urlReversed] = this.handlingPathsService.handleNormalPath(currentPath);
      }
      this.allowedTypes = this.allowedTypes ?? (this.obj.acceptedFileType ? this.obj.acceptedFileType.split(', ').map(item => item.trim()) : []);

      if (currentPath){
        this.reverseFileType = currentPath.split('_')[0];
      }
      console.log(this.reverseFileType)
    }


  selected: File | null = null;
  isDragging: boolean = false;
  isToggledFileType: boolean = false;

  // File readiness
  fileReady = false;
  fileBlob: Blob | null = null;
  fileheader = new HttpHeaders()
  contentDisposition: string | null = null
  allowedTypes: Array<string> | null | undefined;
  urlReversed: boolean = false
  reverseFileType: string | null = null




  // Method to open the .docx file input dialog
  triggerInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }


  // Handle the selected .docx file
  onFileSelected(event: Event): void {
    this.handleFileSelection(event);
  }


  // Handle file selection based on type
  private handleFileSelection(event: Event): void {

    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      // Extract the file extension from the file name
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      console.log(fileExtension)

      // Check if the extension is in the allowed types
      if (fileExtension && this.allowedTypes && this.allowedTypes.includes(`.${fileExtension}`)) {
        this.selected = file;
      } else {
        this.errorHandlerService.showErrorMessage(`Please drop a ${this.obj.fileType} file.`)
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
      // Extract the file extension from the file name
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      // Check if the extension is in the allowed types
      if (fileExtension && this.allowedTypes && this.allowedTypes.includes(`.${fileExtension}`)) {
        this.selected = file;
      } else {
        this.errorHandlerService.showErrorMessage(`Please drop a ${this.obj.fileType} file.`)
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
        this.errorHandlerService.showErrorMessage(`Please drop a ${this.obj.fileType} file.`)
    }
    // Perform Converter
    this.convertAction();
  }





  ////////////////////////////////////////////////////////////////
  /// API service to convert
  ////////////////////////////////////////////////////////////////

  convertAction(): void {

    if (this.urlReversed){

      this.apiService.convertFromPdf(this.selected!, this.reverseFileType!)
      .subscribe({
        next: (response) => {
          this.contentDisposition = response.headers.get('Content-Disposition');
          this.fileBlob = response.body; // Store the Blob for later
        },
        error: (err) => {
          this.errorHandlerService.handleHttpError(err);
          this.selected = null
        },
        complete: () => {
          this.fileReady = true; // Notify the user
          console.log('Document generation process completed');
        }
      });
    }else {
      this.apiService.convertToPdf(this.selected!, this.obj.fileType)
      .subscribe({
        next: (response) => {
          this.contentDisposition = response.headers.get('Content-Disposition');
          this.fileBlob = response.body; // Store the Blob for later
        },
        error: (err) => {
          this.errorHandlerService.handleHttpError(err);
          this.selected = null
        },
        complete: () => {
          this.fileReady = true; // Notify the user
          console.log('Document generation process completed');
        }
      });
    }

  }




  downloadFile() {
    let fileName = 'default-file-name.pdf'; // Fallback filename
    if (this.contentDisposition) {
      const matches = /filename="?([^"]+)"?/.exec(this.contentDisposition);
      if (matches && matches[1]) {
        fileName = matches[1]; // Extracted filename
      }
    }
    let downloadStatus = this.downloadFileService.downloadFile(this.fileBlob, fileName)
    if (downloadStatus) {
      this.fileReady = false
      this.selected = null
    }else {
      console.log('Downloading File Failed')
    }
  }





}
