import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  private apiUrl = 'http://0.0.0.0:8000/app/convert_process_docx'; // Replace with your backend URL

  constructor(private http: HttpClient) { }

  generatePdfOrWord(wordFile: File, excelFile: File, outputType: string): Observable<any> {
    const formData = new FormData();
    formData.append('docx', wordFile);
    formData.append('excel', excelFile);
    formData.append('results_type', outputType);

    const headers = new HttpHeaders();

    return this.http.post(this.apiUrl, formData, { 
      headers, 
      responseType: 'blob', // Expect binary data (ZIP file)
     });
  }
}
