document.addEventListener('DOMContentLoaded', () => {
    // Use actual paths to your images
    const images = [
      '/images/salty.png',
      '/images/onion.png',
      '/images/tomato.png',
    //   '/images/yviteli.png',
    //   '/images/lurji.png',
    //   '/images/stafilosferi.png'
    ];
    
    const mainImg = document.getElementById('main-img');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const descriptions = document.querySelectorAll('.description');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    
    let currentIndex = 0;
    
    // Initialize images
    if (mainImg) {
      mainImg.src = images[currentIndex];
      
      thumbnails.forEach((thumb, index) => {
        const img = thumb.querySelector('img');
        if (index < images.length) {
          img.src = images[index];
        }
      });
    }
    
    // Update active description
    function updateActiveDescription() {
      descriptions.forEach((desc, index) => {
        if (index === currentIndex) {
          desc.classList.add('active');
        } else {
          desc.classList.remove('active');
        }
      });
    }
    
    // Show only next and previous thumbnails
    function updateVisibleThumbnails() {
      // Calculate previous and next indices
      const prevIndex = (currentIndex - 1 + images.length) % images.length;
      const nextIndex = (currentIndex + 1) % images.length;
      
      // Hide all thumbnails first
      thumbnails.forEach(thumb => {
        thumb.classList.add('hidden');
      });
      
      // Show only previous and next thumbnails and update their data-index
      thumbnails[prevIndex].classList.remove('hidden');
      thumbnails[prevIndex].dataset.index = prevIndex;
      thumbnails[prevIndex].querySelector('img').src = images[prevIndex];
      
      thumbnails[nextIndex].classList.remove('hidden');
      thumbnails[nextIndex].dataset.index = nextIndex;
      thumbnails[nextIndex].querySelector('img').src = images[nextIndex];
      
      // Position left thumbnail on the left and right thumbnail on the right
      const thumbnailsScroll = document.querySelector('.thumbnails-scroll');
      if (thumbnailsScroll) {
        const leftThumb = thumbnails[prevIndex];
        const rightThumb = thumbnails[nextIndex];
        
        // Ensure correct order in the DOM
        thumbnailsScroll.innerHTML = '';
        thumbnailsScroll.appendChild(leftThumb);
        thumbnailsScroll.appendChild(rightThumb);
      }
    }
    
    // Change slide
    function changeSlide(newIndex, direction) {
      if (!mainImg) return;
      
      // Remove previous animation classes
      mainImg.classList.remove('slide-in-right', 'slide-in-left', 'slide-out-right', 'slide-out-left');
      
      // Add appropriate animation classes based on direction
      if (direction === 'next') {
        mainImg.classList.add('slide-out-left');
        setTimeout(() => {
          mainImg.src = images[newIndex];
          mainImg.classList.remove('slide-out-left');
          mainImg.classList.add('slide-in-right');
        }, 250);
      } else {
        mainImg.classList.add('slide-out-right');
        setTimeout(() => {
          mainImg.src = images[newIndex];
          mainImg.classList.remove('slide-out-right');
          mainImg.classList.add('slide-in-left');
        }, 250);
      }
      
      currentIndex = newIndex;
      updateVisibleThumbnails();
      updateActiveDescription();
    }
    
    // Next button click - always shows the right thumbnail in main image
    if (nextButton) {
      nextButton.addEventListener('click', () => {
        const newIndex = (currentIndex + 1) % images.length;
        changeSlide(newIndex, 'next');
      });
    }
    
    // Previous button click - always shows the left thumbnail in main image
    if (prevButton) {
      prevButton.addEventListener('click', () => {
        const newIndex = (currentIndex - 1 + images.length) % images.length;
        changeSlide(newIndex, 'prev');
      });
    }
    
    // Thumbnail click - respect the position of the thumbnail
    document.addEventListener('click', (e) => {
      const thumbnail = e.target.closest('.thumbnail');
      if (!thumbnail) return;
      
      const newIndex = parseInt(thumbnail.dataset.index);
      if (newIndex === currentIndex) return;
      
      // Determine if this is the left or right thumbnail
      const thumbnailsArr = Array.from(document.querySelectorAll('.thumbnail:not(.hidden)'));
      const isLeftThumbnail = thumbnailsArr.indexOf(thumbnail) === 0;
      
      const direction = isLeftThumbnail ? 'prev' : 'next';
      changeSlide(newIndex, direction);
    });
    
    // Initialize visible thumbnails and description
    updateVisibleThumbnails();
    updateActiveDescription();
  });
  
  
  