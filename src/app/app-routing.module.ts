import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainContentComponent } from './main-content/main-content.component';
import { JpgToPdfComponent } from './jpg-to-pdf/jpg-to-pdf.component';
import { WordToPdfComponent } from './word-to-pdf/word-to-pdf.component';
import { PowerpointToPdfComponent } from './powerpoint-to-pdf/powerpoint-to-pdf.component';
import { HtmlToPdfComponent } from './html-to-pdf/html-to-pdf.component';
import { ExcelToPdfComponent } from './excel-to-pdf/excel-to-pdf.component';

const routes: Routes = [
  { path: 'autofill', component: MainContentComponent }, // Default route
  { path: 'jpj_pdf', component: JpgToPdfComponent },
  { path: 'word_pdf', component: WordToPdfComponent },
  { path: 'pp_pdf', component: PowerpointToPdfComponent },
  { path: 'excel_pdf', component: ExcelToPdfComponent },
  { path: 'html_pdf', component: HtmlToPdfComponent },
  { path: '**', redirectTo: 'autofill' }, // Wildcard route for handling 404s
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
