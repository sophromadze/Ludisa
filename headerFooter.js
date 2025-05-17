// In your existing JavaScript file
function setActiveNavItem() {
  const path = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll("nav ul li a");
  const mainLogo = document.querySelector(".mainLogo");
  const logo = document.querySelector(".logo");
  
  if (path === "" || path === "index.html") {
    mainLogo.style.display = "block";
    logo.style.display = "none";
  } else {
    mainLogo.style.display = "none";
    logo.style.display = "block";
  }
  
  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href === path || (href === "index.html" && path === "")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// Throttle function for scroll events
function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function() {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function() {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  }
}

function handleScroll() {
  const nav = document.querySelector('nav');
  const scrollPosition = window.scrollY || document.documentElement.scrollTop;
  
  if (scrollPosition > 30) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}

// Load header and footer
async function loadHeaderFooter() {
  try {
    const [headerResponse, footerResponse] = await Promise.all([
      fetch("header.html"),
      fetch("footer.html")
    ]);

    if (!headerResponse.ok || !footerResponse.ok) {
      throw new Error('Failed to load header or footer');
    }

    const headerHTML = await headerResponse.text();
    const footerHTML = await footerResponse.text();

    const headerElement = document.getElementById("header");
    const footerElement = document.getElementById("footer");

    if (headerElement) {
      headerElement.innerHTML = headerHTML;
      setActiveNavItem();
      window.addEventListener('scroll', throttle(handleScroll, 100));
    }

    if (footerElement) {
      footerElement.innerHTML = footerHTML;
    }
  } catch (error) {
    console.error('Error loading header/footer:', error);
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Load header and footer
  loadHeaderFooter();
});