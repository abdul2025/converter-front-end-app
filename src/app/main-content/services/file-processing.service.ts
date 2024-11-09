import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as Mammoth from 'mammoth';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

@Injectable({
  providedIn: 'root'
})

export class FileProcessingService {
  /**
      Service to handle word and Excel files to match between headers in Excel and word contents.
   */


  constructor(private errorHandlerService: ErrorHandlerService) { }

  async validateMatching(docxFile: File, excelFile: File): Promise<void> {
    try {
      const docxWords = await this.extractWordsFromDocx(docxFile);
      const excelHeaders = await this.extractHeadersFromExcel(excelFile);
      const hasMatchingHeader = this.checkForMatchingHeader(docxWords, excelHeaders);


      // Validate if both have a content
      if (docxWords.size === 0 || excelHeaders.length === 0) {
        return
      }

      if (!hasMatchingHeader) {
        this.errorHandlerService.showErrorMessage('No excel header matchs a word in your document')
      }
    } catch (error) {
      this.errorHandlerService.showErrorMessage(`An error occurred during file processing: ${error}`)
    }
  }

  // Extracts words from DOCX file, converting to lowercase for case-insensitive matching
  private async extractWordsFromDocx(file: File): Promise<Set<string>> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await Mammoth.extractRawText({ arrayBuffer });
      const words = new Set(result.value.toLowerCase().split(/\s+/));
      return words;
    } catch (error) {
      this.errorHandlerService.showErrorMessage(`Error reading DOCX file: ${error}`)
      return new Set<string>();
    }
  }

  // Extracts headers from Excel or CSV file and returns them as lowercase strings
  private async extractHeadersFromExcel(file: File): Promise<string[]> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Convert the sheet to a 2D array and check row count
      const sheetData = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });
      if (sheetData.length >= 7) {
        this.errorHandlerService.showErrorMessage(`File contain more than 7 rows, subscription is required`);
        return [];
      }

      // Extract headers from the first row
      const headers = sheetData[0];
      return headers.map(header => header.toLowerCase());
    } catch (error) {
      this.errorHandlerService.showErrorMessage(`Error reading Excel/CSV file: ${error}`);
      return [];
    }
  }

  // Checks if any header matches any word in DOCX text
  private checkForMatchingHeader(docxWords: Set<string>, headers: string[]): boolean {
    return headers.some(header => docxWords.has(header));
  }
}
