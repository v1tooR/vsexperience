/**
 * VS Experience - Vanilla JavaScript
 * Premium interactions and animations
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  
  // ================================
  // Header Scroll Effect
  // ================================
  const header = document.getElementById('header');
  let lastScroll = 0;
  
  function handleHeaderScroll() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  }
  
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  
  // ================================
  // Mobile Menu Toggle
  // ================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      mobileMenuBtn.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking a link
    const mobileNavLinks = mobileMenu.querySelectorAll('a');
    mobileNavLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
  
  // ================================
  // Smooth Scroll for Anchor Links
  // ================================
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href === '#') return;
      
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        
        const headerHeight = header.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // ================================
  // Intersection Observer for Animations
  // ================================
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const animatedElements = document.querySelectorAll('.animate-fade-up');
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        // Add a small delay based on the element's delay class
        const element = entry.target;
        const delay = element.classList.contains('delay-100') ? 100 :
                      element.classList.contains('delay-200') ? 200 :
                      element.classList.contains('delay-300') ? 300 :
                      element.classList.contains('delay-400') ? 400 :
                      element.classList.contains('delay-500') ? 500 : 0;
        
        setTimeout(function() {
          element.style.animationPlayState = 'running';
        }, delay);
        
        observer.unobserve(element);
      }
    });
  }, observerOptions);
  
  // Pause animations initially and observe
  animatedElements.forEach(function(element) {
    element.style.animationPlayState = 'paused';
    observer.observe(element);
  });
  
  // ================================
  // Parallax Effect on Hero
  // ================================
  const heroGlow = document.querySelector('.hero-glow');
  
  if (heroGlow) {
    window.addEventListener('mousemove', function(e) {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      
      heroGlow.style.transform = `translateX(calc(-50% + ${x}px)) translateY(${y}px)`;
    });
  }
  
  // ================================
  // Active Navigation Link
  // ================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  function updateActiveNav() {
    const scrollY = window.pageYOffset;
    const headerHeight = header.offsetHeight;
    
    sections.forEach(function(section) {
      const sectionTop = section.offsetTop - headerHeight - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(function(link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  
  // ================================
  // Hover Effects for Cards
  // ================================
  const cards = document.querySelectorAll('.bento-item, .case-card, .pillar-card, .testimonial-card');
  
  cards.forEach(function(card) {
    card.addEventListener('mouseenter', function(e) {
      this.style.transition = 'transform 0.5s ease, border-color 0.5s ease';
    });
    
    card.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
  });
  
  // ================================
  // Typing Effect for Hero (Optional)
  // ================================
  // Uncomment if you want a typing effect on the hero title
  /*
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const text = heroTitle.innerHTML;
    heroTitle.innerHTML = '';
    let i = 0;
    
    function typeWriter() {
      if (i < text.length) {
        heroTitle.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, 30);
      }
    }
    
    setTimeout(typeWriter, 500);
  }
  */
  
  // ================================
  // Button Ripple Effect
  // ================================
  const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
  
  buttons.forEach(function(button) {
    button.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        left: ${x}px;
        top: ${y}px;
        width: 100px;
        height: 100px;
        margin-left: -50px;
        margin-top: -50px;
        pointer-events: none;
      `;
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(function() {
        ripple.remove();
      }, 600);
    });
  });
  
  // Add ripple animation to stylesheet
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  
  // ================================
  // Lazy Load Images (if any)
  // ================================
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(function(img) {
      imageObserver.observe(img);
    });
  }
  
  // ================================
  // Console Easter Egg
  // ================================
  console.log('%c VS Experience ', 'background: linear-gradient(135deg, #4F2623, #753937); color: #F8F8F8; font-size: 24px; padding: 10px 20px; border-radius: 8px; font-weight: bold;');
  console.log('%c Desenvolvido com ❤️ por Victor Santos ', 'color: #666; font-size: 12px;');
  
});

// ================================
// Page Load Animation
// ================================
window.addEventListener('load', function() {
  document.body.classList.add('loaded');
});

// ================================
// Custom Cursor
// ================================
document.addEventListener('DOMContentLoaded', function() {
  try {
    const cursor = document.getElementById('cursor');
    const cursorCircle = cursor.querySelector('.cursor__circle');

    const mouse = { x: -100, y: -100 };
    const pos = { x: 0, y: 0 };
    const speed = 0.35;

    const updateCoordinates = e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }

    window.addEventListener('mousemove', updateCoordinates);

    function getAngle(diffX, diffY) {
      return Math.atan2(diffY, diffX) * 180 / Math.PI;
    }

    function getSqueeze(diffX, diffY) {
      const distance = Math.sqrt(
        Math.pow(diffX, 2) + Math.pow(diffY, 2)
      );
      const maxSqueeze = 0.15;
      const accelerator = 1500;
      return Math.min(distance / accelerator, maxSqueeze);
    }

    const updateCursor = () => {
      const diffX = Math.round(mouse.x - pos.x);
      const diffY = Math.round(mouse.y - pos.y);

      pos.x += diffX * speed;
      pos.y += diffY * speed;

      const squeeze = getSqueeze(diffX, diffY);

      const scale = 'scale(' + (1 + squeeze) + ', ' + (1 - squeeze) +')';
      const translate = 'translate3d(' + pos.x + 'px ,' + pos.y + 'px, 0)';

      cursor.style.transform = translate;
      cursorCircle.style.transform = scale;
    };

    function loop() {
      updateCursor();
      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);

    // Add hover modifiers to common interactive elements
    const autoAdd = document.querySelectorAll('a, button, .btn-primary, .btn-secondary');
    autoAdd.forEach(el => el.classList.add('cursor-hover'));

    const cursorModifiers = document.querySelectorAll('.cursor-hover');

    cursorModifiers.forEach(cursorModifier => {
      cursorModifier.addEventListener('mouseenter', function() {
        cursorCircle.style.width = "100px";
        cursorCircle.style.height = "100px";
        cursorCircle.style.color = "#000";
      });

      cursorModifier.addEventListener('mouseleave', function() {
        cursorCircle.style.width = "16px";
        cursorCircle.style.height = "16px";
        cursorCircle.style.color = "transparent";
      });
    });
  } catch (err) {
    // if cursor element not present, fail silently
    // console.warn('Custom cursor not initialized', err);
  }
});
