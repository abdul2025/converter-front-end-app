import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelToPdfComponent } from './excel-to-pdf.component';

describe('ExcelToPdfComponent', () => {
  let component: ExcelToPdfComponent;
  let fixture: ComponentFixture<ExcelToPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcelToPdfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExcelToPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
