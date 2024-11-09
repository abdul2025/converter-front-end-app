import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  private apiUrl = 'https://your-backend-url.com'; // Replace with your backend URL

  constructor(private http: HttpClient) { }

  generatePdfOrWord(wordFile: File, excelFile: File, outputType: string): Observable<any> {
    const formData = new FormData();
    formData.append('wordFile', wordFile);
    formData.append('excelFile', excelFile);
    formData.append('outputType', outputType);

    const headers = new HttpHeaders();

    return this.http.post(this.apiUrl, formData, { headers });
  }
}
