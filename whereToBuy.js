document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('search');
  const inputContainer = searchInput.parentElement;
  const buyContainer = document.querySelector('#buy > div');
  let addressData = []; // Stores addresses from JSON
  
  // Create a results container
  const resultsContainer = document.createElement('div');
  resultsContainer.className = 'search-results';
  inputContainer.appendChild(resultsContainer);
  
  // Fetch addresses
  fetch('ludisa-objects.json')
    .then(response => response.json())
    .then(data => {
      addressData = data;
    })
    .catch(error => console.error('Error loading addresses:', error));
  
  function adjustPadding() {
    const resultsHeight = resultsContainer.scrollHeight;
    const isSmallScreen = window.innerWidth <= 768 || window.innerHeight <= 600;
    
    const maxPadding = isSmallScreen ? 90 : 130; // 90px for small screens, 130px otherwise
    
    if (resultsHeight > window.innerHeight * 0.5) {
      buyContainer.style.paddingTop = `${maxPadding}px`; // Increase padding
    } else {
      buyContainer.style.paddingTop = "10px"; // Default padding
    }
  }
  
  function formatAddress(item) {
    const parts = [];
  
    if (item.ქალაქი) parts.push(item.ქალაქი);
    if (item.უბანი) parts.push(item.უბანი);
    if (item.მისამართი) parts.push(item.მისამართი);
    return parts.join(', ');
  }
  
  function getMarketInfo(item) {
    if (item.მარკეტი_ქსელი) return `"${item.მარკეტი_ქსელი}"`;
    return '---'; // Return empty string if no market info is available
  }
  
  searchInput.addEventListener('input', function() {
    const searchText = this.value.toLowerCase();
    
    resultsContainer.innerHTML = ''; // Clear previous results
    
    if (searchText.length < 2) {
      buyContainer.style.paddingTop = "10px"; // Reset padding
      return;
    }
    
    const matchingAddresses = addressData.filter(item => {
      const addressStr = formatAddress(item).toLowerCase();
      const marketStr = getMarketInfo(item).toLowerCase();
      // Include მფლობელი in search but not display
      const tbilisiRegion = item.თბილისის_რაიონი ? item.თბილისის_რაიონი.toLowerCase() : '';
      const ownerStr = item.მფლობელი ? item.მფლობელი.toLowerCase() : '';
      
      return addressStr.includes(searchText) || 
             marketStr.includes(searchText) || 
             tbilisiRegion.includes(searchText) ||
             ownerStr.includes(searchText);
    });
    
    if (matchingAddresses.length > 0) {
      // Create sticky header container
      const headerContainer = document.createElement('div');
      headerContainer.className = 'header-container';
      resultsContainer.appendChild(headerContainer);
      
      // Create table headers inside the sticky container
      const headerRow = document.createElement('div');
      headerRow.className = 'result-header';
      headerRow.innerHTML = `
        <div class="header-address">მისამართი</div>
        <div class="header-market">მარკეტი/ქსელი</div>
      `;
      headerContainer.appendChild(headerRow);
      
      // Create a separate container for scrollable results
      const resultsScrollable = document.createElement('div');
      resultsScrollable.className = 'results-scrollable';
      resultsContainer.appendChild(resultsScrollable);
      
      // Add results to the scrollable container
      matchingAddresses.forEach(item => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        
        const formattedAddress = formatAddress(item);
        const marketInfo = getMarketInfo(item);
        
        resultItem.innerHTML = `
          <div class="store-address">${formattedAddress}</div>
          <div class="store-market">${marketInfo}</div>
        `;
        
        resultsScrollable.appendChild(resultItem);
        
        resultItem.addEventListener('click', function() {
          searchInput.value = formattedAddress;
          resultsContainer.innerHTML = ''; // Clear results after selection
          buyContainer.style.paddingTop = "10px"; // Reset padding
        });
      });
    } else {
      const noResults = document.createElement('div');
      noResults.className = 'no-results';
      noResults.textContent = 'მისამართი ვერ მოიძებნა';
      resultsContainer.appendChild(noResults);
    }
    
    adjustPadding(); // Call the function to set correct padding
  });
  
  window.addEventListener('resize', adjustPadding); // Update padding on resize
});