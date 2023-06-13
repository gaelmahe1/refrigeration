class WeeSlider extends HTMLElement {
  constructor() {
    super();
    this.loopSlides = this.dataset.loop === 'true';
    this.slides = [...this.querySelectorAll('.wee-slider__slide')];
    this.navDots = [...this.querySelectorAll('.wee-slider__navdot')];
    this.buttons = [...this.querySelectorAll('.wee-slider__buttons button')];
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.buttons.forEach(button => button.addEventListener('click', this.handleButtonClick));
    this.navDots.forEach((navDot, index) => navDot.addEventListener('click', () => {
      this.handleSlideChange(index);
    }));

    const observer = new IntersectionObserver(entries => {
      entries.forEach(({ target, isIntersecting }) => {
        const slideIndex = this.slides.indexOf(target);
        target.classList.toggle('visible', isIntersecting);
        this.navDots[slideIndex].classList.toggle('visible', isIntersecting);
        if (!this.loopSlides) this.handleSlideButtonActive();
      });
    }, { threshold: 0.9 });
    this.slides.forEach(slide => observer.observe(slide));
    this.classList.add('loaded');
  }

  handleButtonClick(event) {
    const { classList } = event.currentTarget;
    const isNext = classList.contains('wee-slider__button-next');
    const modifier = isNext ? 1 : -1;
    const condition = slide => slide.classList.contains('visible');
    let index = isNext ? this.slides.findLastIndex(condition) : this.slides.findIndex(condition);
    index = index !== -1 ? index + modifier : (isNext ? 0 : this.slides.length - 1);
    if (this.loopSlides) index = (index + this.slides.length) % this.slides.length;
    this.handleSlideChange(index);
  }

  handleSlideChange(index) {
    this.slides.forEach((slide, i) => {
      if (i === index) slide.scrollIntoView();
    });
    this.navDots.forEach((navDot, i) => {
      navDot.classList.toggle('active', i === index);
    });
  }

  handleSlideButtonActive() {
    this.buttons.forEach(button => {
      const isNext = button.classList.contains('wee-slider__button-next');
      const slide = isNext ? this.slides[this.slides.length - 1] : this.slides[0]
      button.disabled = slide.classList.contains('visible');
    });
  }
}

customElements.define('wee-slider', WeeSlider);