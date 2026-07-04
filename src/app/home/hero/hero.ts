import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero implements OnInit, OnDestroy {
  currentSlide = 0;

  private intervalId!: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  startAutoSlide(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide(): void {
    const element = document.querySelector(
      '#heroSlider .carousel-control-next',
    ) as HTMLButtonElement;

    if (element) {
      element.click();
    }

    this.currentSlide = (this.currentSlide + 1) % 3;
  }

  previousSlide(): void {
    const element = document.querySelector(
      '#heroSlider .carousel-control-prev',
    ) as HTMLButtonElement;

    if (element) {
      element.click();
    }

    this.currentSlide = this.currentSlide === 0 ? 2 : this.currentSlide - 1;
  }
}
