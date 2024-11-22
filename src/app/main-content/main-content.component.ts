import { Component, OnInit } from '@angular/core';
import { FileProcessingService } from './services/file-processing.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ApiServiceService } from './services/api.service.service';
import { DropboxService } from '../services/dropbox.service';




@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {

  constructor(
    private fileProcessingService: FileProcessingService,
    private errorHandlerService: ErrorHandlerService,
    private apiServiceService: ApiServiceService,
    private dropboxService: DropboxService
    ) { }
  ngOnInit(): void {
  }


  selectedDocxFile: File | null = null;
  selectedExcelCsvFile: File | null = null;
  isDragging: boolean = false;
  isToggledFileType: boolean = false;

  // File readiness
  fileReady = false;
  fileBlob: Blob | null = null;

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
        this.errorHandlerService.showErrorMessage(`Invalid file type`)
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


  openDropboxChooser(fileType: number) {
    this.dropboxService.openChooser(
      (files) => {
        if (files && files[0]) {
          const selectedFile = files[0]; // Get the first selected file
          const fileUrl = selectedFile.link; // Dropbox file download link

          // Fetch the file content as ArrayBuffer
          fetch(fileUrl)
            .then((response) => response.arrayBuffer())
            .then((buffer) => {
              // Convert ArrayBuffer to Blob
              const blob = new Blob([buffer], { type: this.dropboxService.getMimeType(selectedFile.name) });

              // Convert Blob to File
              const file = new File([blob], selectedFile.name, { type: blob.type });

              if (fileType === 1) {
                this.selectedDocxFile = file; // Store as a File object
                console.log('Selected DOCX file:', this.selectedDocxFile);
              } else if (fileType === 0) {
                this.selectedExcelCsvFile = file; // Store as a File object
                console.log('Selected Excel/CSV file:', this.selectedExcelCsvFile);
              }
            })
            .catch((error) => {
              console.error('Error fetching file from Dropbox:', error);
            });
        }
      },
      () => {
        console.log('User canceled file selection');
      }
    );
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

    this.apiServiceService
    .generatePdfOrWord(this.selectedDocxFile!, this.selectedExcelCsvFile!, outputType)
    .subscribe({
      next: (response: Blob) => {
        this.fileBlob = response; // Store the Blob for later
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
    if (this.fileBlob) {
      const url = window.URL.createObjectURL(this.fileBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.isToggledFileType ? 'documents.zip' : 'pdfs.zip';
      a.click();
      window.URL.revokeObjectURL(url); // Clean up
      this.fileReady = false
      this.selectedDocxFile = null
      this.selectedExcelCsvFile = null
    }
  }








}
