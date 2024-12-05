import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';









@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  generatePdfOrWord(wordFile: File, excelFile: File, outputType: string): Observable<any> {
    const formData = new FormData();
    formData.append('docx', wordFile);
    formData.append('excel', excelFile);
    formData.append('results_type', outputType);

    const fullUrl = `${this.apiUrl}/convert_autotask`; 
    const headers = new HttpHeaders();

    return this.http.post(fullUrl, formData, {
      headers,
      responseType: 'blob', // Expect binary data (ZIP file)
      observe: 'response', // To access headers
     });
  }



  convertToPdf(File: File, type: string): Observable<any> {
    const formData = new FormData();
    formData.append(type, File);
    formData.append('incoming_type', type);

    const fullUrl = `${this.apiUrl}/convert_to_pdf`; 
    const headers = new HttpHeaders();

    return this.http.post(fullUrl, formData, {
      headers,
      responseType: 'blob', // Expect binary data (ZIP file)
      observe: 'response', // To access headers
     });
  }
}
