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

      // Validate the extract functions does has a faliure
      if (docxWords[1] == false || excelHeaders[1] == false){
        return
      }

      // Validate if both have a content
      if ((docxWords[0].size === 0 && docxWords[1] == true) || (excelHeaders[0].length === 0 && excelHeaders[1] == true)) {
        throw new Error('File does not has a content')
      }

      // Validate there is no header matching
      const hasMatchingHeader = this.checkForMatchingHeader(docxWords[0], excelHeaders[0]);
      if (!hasMatchingHeader) {
        throw new Error('No excel header matchs a word in your document')
      }
    } catch (error) {
      this.errorHandlerService.showErrorMessage(`An error occurred during file processing: ${error}`)
      return
    }
  }

  // Extracts words from DOCX file, converting to lowercase for case-insensitive matching
  private async extractWordsFromDocx(file: File): Promise<[Set<string>, boolean]> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await Mammoth.extractRawText({ arrayBuffer });
      const words = new Set(result.value.toLowerCase().split(/\s+/));
      return [words, true];
    } catch (error) {
      this.errorHandlerService.showErrorMessage(`Error reading DOCX file: ${error}`)
      return [new Set<string>(), false];
    }
  }

  // Extracts headers from Excel or CSV file and returns them as lowercase strings
  private async extractHeadersFromExcel(file: File): Promise<[string[], boolean]> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Convert the sheet to a 2D array and check row count
      const sheetData = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });
      if (sheetData.length >= 7) {
        throw new Error('Excel file contains more than 10 rows, Subscription is required');
      }

      // Extract headers from the first row and convert them to lowercase
      const headers = sheetData[0] as string[];
      return [headers.map(header => header.toLowerCase()), true];  // Return headers and true to indicate success
    } catch (error) {
      this.errorHandlerService.showErrorMessage(`Error reading Excel/CSV file: ${error}`);
      return [[], false];  // Return empty array and false to indicate failure due to error
    }
  }


  // Checks if any header matches any word in DOCX text
  private checkForMatchingHeader(docxWords: Set<string>, headers: string[]): boolean {
    return headers.some(header => docxWords.has(header));
  }
}
