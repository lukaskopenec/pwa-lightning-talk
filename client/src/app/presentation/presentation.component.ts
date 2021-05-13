import { Component } from '@angular/core';

const SLIDES_COUNT = 11;

@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.scss']
})
export class PresentationComponent {
  currentSlideId = 1;
  maxSlides = SLIDES_COUNT;

  get currentSlideUrl(): string {
    return `assets/img/Snímek${this.currentSlideId}.PNG`;
  }

  onNextSlide(): void {
    if (this.currentSlideId < SLIDES_COUNT) {
      ++this.currentSlideId;
    }
  }

  onPrevSlide(): void {
    if (this.currentSlideId > 1) {
      --this.currentSlideId;
    }
  }

  onFirstSlide(): void {
    this.currentSlideId = 1;
  }

  onLastSlide(): void {
    this.currentSlideId = SLIDES_COUNT;
  }
}
