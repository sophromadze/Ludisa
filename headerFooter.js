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

document.addEventListener("DOMContentLoaded", () => {
  loadHTML("header", "header.html").then(() => {
    setActiveNavItem();
    // Initialize scroll handler after header is loaded
    window.addEventListener('scroll', throttle(handleScroll, 100));
  });
  loadHTML("footer", "footer.html");
});

async function loadHTML(id, file) {
  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error(`Could not load ${file}`);
    const data = await response.text();
    const element = document.getElementById(id);
    if (element) element.innerHTML = data;
    return true;
  } catch (error) {
    console.error(error);
  }
}