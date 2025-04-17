// Image paths - KEEP THIS AS-IS
const images = [
  '/images/salty.webp',
  '/images/onion.webp',
  '/images/tomato.webp'
];

class Carousel {
  constructor(element, images, autoChangeInterval = 10000) {
    this.carousel = element;
    this.images = images;
    this.currentIndex = 0;
    this.autoChangeInterval = autoChangeInterval;
    this.autoChangeTimer = null;
    this.isDragging = false;
    this.startX = 0;
    this.currentX = 0;
    this.dragThreshold = 0.1; // 20% threshold for changing slides
    this.dragOffset = 0;
    this.items = [];
    this.isUserInteracted = false;
    
    this.init();
    this.setupEvents();
    this.startAutoChange();

    // Bind resize handler
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
  }
  
  init() {
    // Create carousel items
    this.images.forEach((src, index) => {
      const item = document.createElement('div');
      item.className = 'carousel-item';
      
      const img = document.createElement('img');
      img.src = src;
      img.alt = `Carousel image ${index + 1}`;
      
      item.appendChild(img);
      this.carousel.appendChild(item);
      this.items.push(item);
    });
    
    this.updateCarousel();
  }

  handleResize() {
    this.updateCarousel();
  }

  destroy() {
    window.removeEventListener('resize', this.handleResize);
    this.stopAutoChange();
  }
  
  updateCarousel(dragPercent = 0) {
    const totalItems = this.items.length;
    const isMobile = window.innerWidth <= 1080;
    const baseTranslate = isMobile ? 45 : 60;
    const mobileScale = isMobile ? 0.7 : 0.9;
    const activeScale = isMobile ? 1.1 : 1.3;
  
    // Calculate indexes
    const prevIndex = (this.currentIndex - 1 + totalItems) % totalItems;
    const nextIndex = (this.currentIndex + 1) % totalItems;
    const nextNextIndex = (this.currentIndex + 2) % totalItems;
    const prevPrevIndex = (this.currentIndex - 2 + totalItems) % totalItems;
  
    // Get items
    const prevItem = this.items[prevIndex];
    const currentItem = this.items[this.currentIndex];
    const nextItem = this.items[nextIndex];
    const prevPrevItem = this.items[prevPrevIndex];
    const nextNextItem = this.items[nextNextIndex];
  
    // Reset all items first
    for (let i = 0; i < totalItems; i++) {
      const item = this.items[i];
      
      // Skip items we're explicitly handling
      if (i === prevIndex || i === this.currentIndex || i === nextIndex || 
          i === prevPrevIndex || i === nextNextIndex) {
        continue;
      }
      
      item.className = 'carousel-item';
      item.style.transform = '';
      item.style.opacity = '0';
      item.style.zIndex = '0';
      item.style.visibility = 'hidden';
    }
  
    // Apply base classes
    prevItem.classList.add('left');
    currentItem.classList.add('active');
    nextItem.classList.add('right');
    
    // Make sure these are visible
    prevPrevItem.style.visibility = 'visible';
    prevItem.style.visibility = 'visible';
    currentItem.style.visibility = 'visible';
    nextItem.style.visibility = 'visible';
    nextNextItem.style.visibility = 'visible';
  
    // Set z-index order
    prevPrevItem.style.zIndex = '0';
    nextNextItem.style.zIndex = '0';
    prevItem.style.zIndex = '1';
    nextItem.style.zIndex = '1';
    currentItem.style.zIndex = '2';
  
    // Default positions when not dragging
    if (dragPercent === 0) {
      // Current item (center)
      currentItem.style.transform = `translateX(0) scale(${activeScale})`;
      currentItem.style.opacity = '1';
      currentItem.style.cursor = 'pointer'; // Add this line
      
      // Previous item (left)
      prevItem.style.transform = `translateX(-${baseTranslate}%) scale(${mobileScale})`;
      prevItem.style.opacity = '0.6';
      prevItem.style.cursor = 'grab'; // Add this line
      
      // Next item (right)
      nextItem.style.transform = `translateX(${baseTranslate}%) scale(${mobileScale})`;
      nextItem.style.opacity = '0.6';
      nextItem.style.cursor = 'grab'; // Add this line
      
      // Far previous item (far left)
      prevPrevItem.style.transform = `translateX(-${baseTranslate * 1.5}%) scale(${mobileScale * 0.8})`;
      prevPrevItem.style.opacity = '0.6';
      prevPrevItem.style.cursor = 'grab'; // Add this line
      
      // Far next item (far right)
      nextNextItem.style.transform = `translateX(${baseTranslate * 1.5}%) scale(${mobileScale * 0.8})`;
      nextNextItem.style.opacity = '0.6';
      nextNextItem.style.cursor = 'grab'; // Add this line
      
      return;
    }
  
    // Dragging right (moving to next slide)
    if (dragPercent > 0) {
      // Limit dragPercent to 1
      const limitedDrag = Math.min(dragPercent, 1);
      
      // Calculate interpolated values
      const currentScale = activeScale - (limitedDrag * (activeScale - mobileScale));
      const currentOpacity = 1 - (limitedDrag * 0.4);
      
      const nextScale = mobileScale + (limitedDrag * (activeScale - mobileScale));
      const nextOpacity = 0.6 + (limitedDrag * 0.4);
      
      // Current item moves right and shrinks
      currentItem.style.transform = `translateX(${limitedDrag * baseTranslate*1.2}%) scale(${currentScale})`;
      currentItem.style.opacity = `${currentOpacity}`;
      
      // Next item moves left and grows this
      nextItem.style.transform = `translateX(-${baseTranslate*1.5 - (limitedDrag * baseTranslate)}%) scale(${nextScale/1.2})`;
      nextItem.style.opacity = `${nextOpacity}`;
      
      // Previous item moves further left and stays small
      prevItem.style.transform = `translateX(-${baseTranslate + (limitedDrag * baseTranslate*1.5)}%) scale(${mobileScale})`;
      
      // Far next item (moves in from right)
      nextNextItem.style.transform = `translateX(${baseTranslate * 1.5 - (limitedDrag * baseTranslate*1.5)}%) scale(${mobileScale * 0.8})`;
      nextNextItem.style.opacity = '0.3';
    } 
    // Dragging left (moving to previous slide)
    else {
      // Convert to positive value and limit
      const limitedDrag = Math.min(Math.abs(dragPercent), 1);
      
      // Calculate interpolated values
      const currentScale = activeScale - (limitedDrag * (activeScale - mobileScale));
      const currentOpacity = 1 - (limitedDrag * 0.4);
      
      const prevScale = mobileScale + (limitedDrag * (activeScale - mobileScale));
      const prevOpacity = 0.6 + (limitedDrag * 0.4);
      
      // Current item moves left and shrinks
      currentItem.style.transform = `translateX(-${limitedDrag * baseTranslate*1.2}%) scale(${currentScale})`;
      currentItem.style.opacity = `${currentOpacity}`;
      
      // Previous item moves right and grows this
      prevItem.style.transform = `translateX(${baseTranslate*1.5 - (limitedDrag * baseTranslate)}%) scale(${prevScale/1.2})`;
      prevItem.style.opacity = `1`;
      
      // Next item moves further right and stays small
      nextItem.style.transform = `translateX(${baseTranslate + (limitedDrag * baseTranslate/2)}%) scale(${mobileScale})`;
      
      // Far previous item (moves in from left)
      prevPrevItem.style.transform = `translateX(-${baseTranslate * 1.5 - (limitedDrag * baseTranslate*1.5)}%) scale(${mobileScale * 0.8})`;
      prevPrevItem.style.opacity = '0.3';
    }
  }
  
  setupEvents() {
    // Click events for side images
    this.items.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        if (!this.isDragging) {
          if (index === this.currentIndex) {
            // Use hash instead of query parameter
            window.location.href = `/tastes#${index}`;
          } else {
            // For side images, keep the existing behavior
            this.isUserInteracted = true;
            this.goToSlide(index);
          }
        }
      });
    });
    
    // Drag events
    this.carousel.addEventListener('mousedown', (e) => this.startDrag(e));
    this.carousel.addEventListener('touchstart', (e) => this.startDrag(e), { passive: true });
    
    document.addEventListener('mousemove', (e) => this.drag(e));
    document.addEventListener('touchmove', (e) => this.drag(e), { passive: true });
    
    document.addEventListener('mouseup', () => this.endDrag());
    document.addEventListener('touchend', () => this.endDrag());
  }
  
  startDrag(e) {
    this.isDragging = true;
    this.isUserInteracted = true;
    this.carousel.classList.add('dragging');
    this.startX = e.clientX || e.touches[0].clientX;
    this.currentX = this.startX;
    this.dragOffset = 0;

    // Add this line to change cursor during dragging
    document.body.style.cursor = 'grabbing';
    
    // Stop auto change while dragging
    this.stopAutoChange();
  }
  
  drag(e) {
    if (!this.isDragging) return;
    
    // Calculate exact drag percentage (-1 to 1)
    this.currentX = e.clientX || (e.touches ? e.touches[0].clientX : this.currentX);
    const containerWidth = this.carousel.offsetWidth;
    const dragDistance = this.currentX - this.startX;
    this.dragOffset = dragDistance / (containerWidth * 0.2); // 50% of container = full slide
    
    // Update carousel with exact drag percentage
    this.updateCarousel(this.dragOffset);
  }
  
  endDrag() {
    if (!this.isDragging) return;
    
    this.carousel.classList.remove('dragging');
    this.isDragging = false;

    // Add this line to reset cursor after dragging
    document.body.style.cursor = '';
    
    // Change slide if dragged past threshold
    if (Math.abs(this.dragOffset) > this.dragThreshold) {
      if (this.dragOffset > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    } else {
      // Reset to current slide
      this.updateCarousel(0);
    }
    
    // Restart auto change
    this.startAutoChange();
  }
  
  goToSlide(index) {
    this.currentIndex = index;
    this.updateCarousel();
    
    // Reset and restart autochange timer
    this.restartAutoChange();
  }
  
  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.updateCarousel();
    
    if (!this.isUserInteracted) {
      // Only restart if this was an automatic change
      this.restartAutoChange();
    }
  }
  
  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.updateCarousel();
    this.restartAutoChange();
  }
  
  startAutoChange() {
    // Clear any existing timer first
    this.stopAutoChange();
    
    this.autoChangeTimer = setInterval(() => {
      this.isUserInteracted = false; // Reset the flag before auto-change
      this.nextSlide();
    }, this.autoChangeInterval);
  }
  
  stopAutoChange() {
    if (this.autoChangeTimer) {
      clearInterval(this.autoChangeTimer);
      this.autoChangeTimer = null;
    }
  }
  
  restartAutoChange() {
    this.stopAutoChange();
    this.startAutoChange();
  }
}

// KEEP THIS INITIALIZATION CODE AS-IS
document.addEventListener('DOMContentLoaded', () => {
  // Initialize carousel
  const carouselElement = document.getElementById('image-carousel');
  new Carousel(carouselElement, images, 100000);
});