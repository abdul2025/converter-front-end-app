import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  showDropdown = false;
  dropdownTimeout: any; // To store the timer reference


  constructor() { }

  ngOnInit(): void {
  }



  onHoverStart(): void {
    // Clear any previous timeout to prevent unintended behavior
    clearTimeout(this.dropdownTimeout);
    this.showDropdown = true; // Show the dropdown immediately
  }

  onHoverEnd(): void {
    // Set a timer to delay hiding the dropdown
    this.dropdownTimeout = setTimeout(() => {
      this.showDropdown = false;
    }, 100); // Delay of 500ms
  }


  onClick(): void {
    this.showDropdown = false;
  }

}
