import { Component, OnInit } from '@angular/core';
import { FileProcessingService } from './services/file-processing.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';




@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {

  constructor(
    private fileProcessingService: FileProcessingService,
    private errorHandlerService: ErrorHandlerService
    ) { }

  ngOnInit(): void {
  }


  selectedDocxFile: File | null = null;
  selectedExcelCsvFile: File | null = null;
  isDragging: boolean = false;
  isToggled: boolean = false;

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
    if (this.isToggled) {
      console.log('The switch is ON');
      return true; // that means desired as PDFs
    } else {
      console.log('The switch is OFF');
      return false; // that means desired as WORDs
    }
  }


  async handleFileValidation(docxFile: File, excelFile: File) {
    await this.fileProcessingService.validateMatching(docxFile, excelFile);
  }

  // Function triggered to process files
  onGenerateClick(): void {

    // check the desired file type
    let desiredFileType = this.checkToggle();

    // check if file are uploaded by user
    if (this.selectedDocxFile != null) {
      // Throw Error
    }
    if (this.selectedExcelCsvFile != null) {
      // Throw Error
    }


    this.handleFileValidation(this.selectedDocxFile!, this.selectedExcelCsvFile!)

    // Example: Perform some task here (e.g., generating a PDF, calling an API, etc.)
    this.generateDocument();
  }

  // Example function that handles document generation (PDF or Word)
  generateDocument(): void {
    // Perform the document generation task here
    // For example, trigger an API call to generate the document
    console.log('Document generation started...');

    // Add your logic here, such as:
    // - Calling a service to generate the document
    // - Showing a loading spinner
    // - Handling success or failure responses
  }



}
