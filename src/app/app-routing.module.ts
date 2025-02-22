import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainContentComponent } from './main-content/main-content.component';
import { FileConvertComponent } from './file-convert/file-convert.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

const routes: Routes = [
  { path: 'autofill', component: MainContentComponent },
  { path: 'lock_pdf', component: FileConvertComponent },
  { path: 'jpg_pdf', component: FileConvertComponent },
  { path: 'word_pdf', component: FileConvertComponent },
  { path: 'pp_pdf', component: FileConvertComponent },
  { path: 'excel_pdf', component: FileConvertComponent },
  { path: 'html_pdf', component: FileConvertComponent },
  { path: 'jpg_pdf/reverse', component: FileConvertComponent },
  { path: 'word_pdf/reverse', component: FileConvertComponent },
  { path: 'pp_pdf/reverse', component: FileConvertComponent },
  { path: 'excel_pdf/reverse', component: FileConvertComponent },
  { path: 'html_pdf/reverse', component: FileConvertComponent },
  { path: 'landing_page', component: LandingPageComponent },
  { path: '**', redirectTo: 'autofill' }, // Wildcard route for handling 404s
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
