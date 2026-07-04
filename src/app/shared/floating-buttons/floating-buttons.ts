import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-floating-buttons',
  standalone: true,
  templateUrl: './floating-buttons.html',
  styleUrl: './floating-buttons.css',
})
export class FloatingButtons {
  showTopButton = false;

  @HostListener('window:scroll')
  onScroll() {
    this.showTopButton = window.scrollY > 400;

    const btn = document.getElementById('topBtn');

    if (btn) {
      btn.style.display = this.showTopButton ? 'flex' : 'none';
    }
  }

  scrollTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
