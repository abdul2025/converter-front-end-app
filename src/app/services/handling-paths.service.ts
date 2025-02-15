import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})


export class HandlingPathsService {



  constructor() { }

  private pathMapNorm: { [key: string]: ConversionInfoInterface } = {
    'jpg_pdf': {
      'title': 'JPG to PDF',
      'subTitle': 'Convert JPG to PDF in seconds. Easily adjust orientation and margins.',
      'selectFileBtn': 'Select JPG File',
      'hoverMessage': 'Select JPG from Dropbox',
      'dropLabal': 'Or drop JPG files here',
      'btnSubmit': 'Convert to PDF',
      'btnColor': 'rgb(160 157 12)', // Example color
      'acceptedFileType': '.jpg, .jpeg, .png',
      'fileType': 'image'
    },
    'word_pdf': {
      'title': 'Word to PDF',
      'subTitle': 'Convert Word documents to PDF. Easily adjust orientation and margins.',
      'selectFileBtn': 'Select Word File',
      'hoverMessage': 'Select Word from Dropbox',
      'dropLabal': 'Or drop Word files here',
      'btnSubmit': 'Convert to PDF',
      'btnColor': 'rgb(27, 89, 204)', // Example color
      'acceptedFileType': '.doc, .docx, .rtf, .txt',
      'fileType': 'docx'
    },
    'pp_pdf': {
      'title': 'PowerPoint to PDF',
      'subTitle': 'Convert PowerPoint presentations to PDF. Easily adjust orientation and margins.',
      'selectFileBtn': 'Select PowerPoint File',
      'hoverMessage': 'Select PowerPoint from Dropbox',
      'dropLabal': 'Or drop PowerPoint files here',
      'btnSubmit': 'Convert to PDF',
      'btnColor': 'rgb(204, 27, 27)', // Example color
      'acceptedFileType': '.ppt, .pptx, .pptm',
      'fileType': 'powerPoint'
    },
    'excel_pdf': {
      'title': 'Excel to PDF',
      'subTitle': 'Convert Excel sheets to PDF. Easily adjust orientation and margins.',
      'selectFileBtn': 'Select Excel File',
      'hoverMessage': 'Select Excel from Dropbox',
      'dropLabal': 'Or drop Excel files here',
      'btnSubmit': 'Convert to PDF',
      'btnColor': 'rgb(5, 146, 33)', // Example color
      'acceptedFileType': '.xls, .xlsx, .xlsm, .csv',
      'fileType': 'excel'
    },
    'html_pdf': {
      'title': 'HTML to PDF',
      'subTitle': 'Convert HTML to PDF in seconds. Easily adjust orientation and margins.',
      'selectFileBtn': 'Select HTML File',
      'hoverMessage': 'Select HTML from Dropbox',
      'dropLabal': 'Or drop HTML files here',
      'btnSubmit': 'Convert to PDF',
      'btnColor': 'rgb(240 144 31)', // Example color
      'acceptedFileType': '.html, .htm, .xhtml',
      'fileType': 'html'
    },
    'lock_pdf': {
      'title': 'Lock your PDF with your own password',
      'subTitle': 'Secure your PDF by adding a password. Protect sensitive documents easily.',
      'selectFileBtn': 'Select PDF File',
      'hoverMessage': 'Select PDF from Dropbox',
      'dropLabal': 'Or drop PDF files here',
      'btnSubmit': 'Lock PDF',
      'btnColor': 'rgb(204, 27, 27)', // Example color
      'acceptedFileType': '.pdf',
      'fileType': 'pdf'
    }

  };

  private pathMapReverse: { [key: string]: ConversionInfoInterface } = {
    'jpg_pdf/reverse': {
      'title': 'PDF to JPG',
      'subTitle': 'Convert PDF to high-quality JPG images. Easily adjust orientation and margins.',
      'selectFileBtn': 'Select PDF File',
      'hoverMessage': 'Select PDF from Dropbox',
      'dropLabal': 'Or drop PDF files here',
      'btnSubmit': 'Convert to JPG',
      'btnColor': 'rgb(204, 27, 27)', // Example color
      'acceptedFileType': '.pdf',
      'fileType': 'pdf_jpg'
    },
    'word_pdf/reverse': {
      'title': 'PDF to Word',
      'subTitle': 'Convert PDF documents to editable Word files. Easily adjust orientation and margins.',
      'selectFileBtn': 'Select PDF File',
      'hoverMessage': 'Select PDF from Dropbox',
      'dropLabal': 'Or drop PDF files here',
      'btnSubmit': 'Convert to Word',
      'btnColor': 'rgb(204, 27, 27)', // Example color
      'acceptedFileType': '.pdf',
      'fileType': 'pdf_docx'
    },
    'pp_pdf/reverse': {
      'title': 'PDF to PowerPoint',
      'subTitle': 'Convert PDF slides to editable PowerPoint presentations. Easily adjust orientation and margins.',
      'selectFileBtn': 'Select PDF File',
      'hoverMessage': 'Select PDF from Dropbox',
      'dropLabal': 'Or drop PDF files here',
      'btnSubmit': 'Convert to PowerPoint',
      'btnColor': 'rgb(204, 27, 27)', // Example color
      'acceptedFileType': '.pdf',
      'fileType': 'pdf_powerPoint'
    },
    'excel_pdf/reverse': {
      'title': 'PDF to Excel',
      'subTitle': 'Convert PDF tables to Excel spreadsheets. Easily adjust orientation and margins.',
      'selectFileBtn': 'Select PDF File',
      'hoverMessage': 'Select PDF from Dropbox',
      'dropLabal': 'Or drop PDF files here',
      'btnSubmit': 'Convert to Excel',
      'btnColor': 'rgb(204, 27, 27)', // Example color
      'acceptedFileType': '.pdf',
      'fileType': 'pdf_excel',
    },
    'html_pdf/reverse': {
      'title': 'PDF to HTML',
      'subTitle': 'Convert PDF files to HTML format. Easily adjust orientation and margins.',
      'selectFileBtn': 'Select PDF File',
      'hoverMessage': 'Select PDF from Dropbox',
      'dropLabal': 'Or drop PDF files here',
      'btnSubmit': 'Convert to HTML',
      'btnColor': 'rgb(204, 27, 27)', // Example color
      'acceptedFileType': '.pdf',
      'fileType': 'pdf_html',
    }
  };





  private defaultInfo: ConversionInfoInterface = {
    'title': '',
    'subTitle': '',
    'selectFileBtn': '',
    'hoverMessage': '',
    'dropLabal': '',
    'btnSubmit': '',
    'btnColor': '',
    'acceptedFileType': '',
    'fileType': ''
  };

  // Method for handling reverse paths
  handleReversePath(path: string): [ConversionInfoInterface, boolean] {
    let updatedObj = this.pathMapReverse[path] || { ...this.defaultInfo };
    return [ updatedObj, true ];
  }

  // Method for handling normal paths
  handleNormalPath(path: string): [ConversionInfoInterface, boolean] {
    let updatedObj = this.pathMapNorm[path] || { ...this.defaultInfo };
    return [ updatedObj, false ];
  }
}

export interface ConversionInfoInterface {
  title: string;
  subTitle: string;
  selectFileBtn: string;
  hoverMessage: string;
  dropLabal: string;
  btnSubmit: string;
  btnColor: string;
  acceptedFileType: string;
  fileType: string;
}
