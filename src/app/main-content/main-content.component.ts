import { Component, OnInit } from '@angular/core';
import { FileProcessingService } from './services/file-processing.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ApiService } from '../services/api.service';
import { DropboxService } from '../services/dropbox.service';
import { GooglePickerService } from '../services/google-drive-picker.service';
import { DownloadFileService } from '../services/download-file.service';




@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {

  constructor(
    private fileProcessingService: FileProcessingService,
    private errorHandlerService: ErrorHandlerService,
    private apiService: ApiService,
    private dropboxService: DropboxService,
    private googlePickerService: GooglePickerService,
    private downloadFileService: DownloadFileService
    ) { }


   ngOnInit(): void {
    // Initialize the Google API client when the app starts
  }



  selectedDocxFile: File | null = null;
  selectedExcelCsvFile: File | null = null;
  isDragging: boolean = false;
  isToggledFileType: boolean = false;
  contentDisposition: string | null = null

  // File readiness
  fileReady = false;
  fileBlob: Blob | null = null;

  // Google drive files to process
  googleDriveFile: any[] = [];
  googleDriveselectedFile: any = null;

  // Method to open the .docx file input dialog
  triggerDocxInput(): void {
    const docxInput = document.getElementById('docxInput') as HTMLInputElement;
    docxInput.click();
  }

  // Method to open the .xlsx/.csv file input dialog
  triggerExcelCsvInput(): void {
    const excelCsvInput = document.getElementById('excelCsvInput') as HTMLInputElement;
    excelCsvInput.click();
  }

  // Handle the selected .docx file
  onDocxSelected(event: Event): void {
    this.handleFileSelection(event, 'docx');
  }

  // Handle the selected .xlsx or .csv file
  onExcelCsvSelected(event: Event): void {
    this.handleFileSelection(event, 'excelCsv');
  }

  // Handle file selection based on type
  private handleFileSelection(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (type === 'docx' && file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        this.selectedDocxFile = file;
      } else if (type === 'excelCsv' && (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'text/csv')) {
        this.selectedExcelCsvFile = file;
      } else {
        this.errorHandlerService.showErrorMessage(`Invalid file type for ${type}`)
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

  onDocxDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0];
      if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        this.selectedDocxFile = file;
      } else {
        this.errorHandlerService.showErrorMessage('Please drop a document file.')
      }
    }
  }

  onExcelCsvDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0];
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'text/csv') {
        this.selectedExcelCsvFile = file;
      } else {
        this.errorHandlerService.showErrorMessage('Please drop an .xlsx or .csv file.')
      }
    }
  }


  // Method to check if the toggle has been switched
  checkToggle() {
    if (this.isToggledFileType) {
      console.log('The switch is ON');
      return '0'; // that means desired as PDFs
    } else {
      console.log('The switch is OFF');
      return '1'; // that means desired as WORDs
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

              if (fileType === 1) {
                this.selectedDocxFile = file; // Store as a File object
              } else if (fileType === 0) {
                this.selectedExcelCsvFile = file; // Store as a File object
              }
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


  async handleFileValidation(docxFile: File, excelFile: File) {
    try {
      await this.fileProcessingService.validateMatching(docxFile, excelFile);
      // You can add any additional success handling here
    } catch (error) {
      console.error("Error during file validation:", error);
      // Handle the error, e.g., show an error message to the user
      this.errorHandlerService.showErrorMessage('Files validated');
    }
  }

  // Function triggered to process files
  onGenerateClick(): void {

    // desired file type true as PDF and false as WORD
    let desiredFileType = this.checkToggle();

    // check if file are uploaded by user
    if (this.selectedDocxFile == null) {
      this.errorHandlerService.showErrorMessage('Please select or drop WORD file')
      return
    }
    if (this.selectedExcelCsvFile == null) {
      this.errorHandlerService.showErrorMessage('Please select or drop Excel file')
      return
    }

    this.handleFileValidation(this.selectedDocxFile!, this.selectedExcelCsvFile!)
    console.log("End of file validation")

    // Example: Perform some task here (e.g., generating a PDF, calling an API, etc.)
    this.generateDocument(desiredFileType);
  }





  ////////////////////////////////////////////////////////////////
  /// API service to convert
  ////////////////////////////////////////////////////////////////

  generateDocument(outputType: string): void {

    this.apiService
    .generatePdfOrWord(this.selectedDocxFile!, this.selectedExcelCsvFile!, outputType)
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
    let fileName = 'default-file-name.zip'; // Fallback filename
    if (this.contentDisposition) {
      const matches = /filename="([^"]+)"/.exec(this.contentDisposition);
      if (matches && matches[1]) {
        fileName = matches[1]; // Extracted filename
      }
    }
    // Downloading file action where it actually processed to the user ...
    let downloadStatus = this.downloadFileService.downloadFile(this.fileBlob, fileName)

    if (downloadStatus) {
      this.fileReady = false
      this.selectedDocxFile = null
      this.selectedExcelCsvFile = null
    }else {
      console.log('DownloadFile Failed')
    }
  }








}
