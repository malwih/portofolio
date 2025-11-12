// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Simple vanilla tilt effect for elements with [data-tilt]
(function setupTilt(){
  const tiltEls = Array.from(document.querySelectorAll('[data-tilt]'));
  const maxTilt = 10; // degrees
  const damp = 12;    // lower = snappier

  tiltEls.forEach(el => {
    let rx = 0, ry = 0, tx = 0, ty = 0;
    const inner = el.firstElementChild || el;

    function onMove(e){
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width/2;
      const cy = rect.top + rect.height/2;
      const x = (e.clientX - cx) / (rect.width/2);
      const y = (e.clientY - cy) / (rect.height/2);
      rx = (y * -maxTilt);
      ry = (x * maxTilt);
    }

    function onLeave(){ rx = 0; ry = 0; }

    function animate(){
      tx += (rx - tx) / damp;
      ty += (ry - ty) / damp;
      inner.style.transform = `translateZ(40px) rotateX(${tx.toFixed(2)}deg) rotateY(${ty.toFixed(2)}deg)`;
      requestAnimationFrame(animate);
    }

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    animate();
  });
})();

// Back to top button and clear active link at top
(function setupBackToTop(){
  const btn = document.getElementById('backToTop');
  const brand = document.querySelector('.brand');
  const navLinks = Array.from(document.querySelectorAll('.nav-list a[href^="#"]'));
  
  // Add click handler for brand to scroll to top
  if (brand) {
    brand.style.cursor = 'pointer';
    brand.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navLinks.forEach(a => a.classList.remove('active'));
    });
  }

  if (!btn) return;
  const showAt = 120; // px

  function onScroll(){
    if (window.scrollY > showAt) btn.classList.add('show'); else btn.classList.remove('show');
    // Clear active link when at the very top
    if (window.scrollY < 10){ navLinks.forEach(a => a.classList.remove('active')); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('load', onScroll);

  btn.addEventListener('click', ()=>{
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navLinks.forEach(a => a.classList.remove('active'));
  });
})();

// Auto slider for CERTIFICATION section
(function setupSlider(){
  const sliders = Array.from(document.querySelectorAll('[data-slider]'));
  
  sliders.forEach(root => {
    const track = root.querySelector('.slider-track');
    if (!track) return;
    
    const slides = Array.from(track.children);
    if (slides.length === 0) return;

    let index = 0;
    let playing = true;
    let isAnimating = false;
    const duration = 5000; // ms
    const transitionSpeed = 500; // ms
    
    // Set initial position
    track.style.transform = 'translateX(0)';
    track.style.transition = `transform ${transitionSpeed}ms ease`;

    function go(newIndex) {
      if (isAnimating) return;
      isAnimating = true;
      
      // Update index with loop
      index = (newIndex + slides.length) % slides.length;
      
      // Move to new slide
      track.style.transform = `translateX(${-100 * index}%)`;
      
      // Reset animation flag after transition
      setTimeout(() => {
        isAnimating = false;
      }, transitionSpeed);
      
      // If we're at the end, instantly reset to start without animation
      if (index === slides.length - 1) {
        setTimeout(() => {
          if (!playing) return; // Don't reset if user is interacting
          track.style.transition = 'none';
          index = 0;
          track.style.transform = 'translateX(0)';
          // Force reflow
          track.offsetHeight;
          track.style.transition = `transform ${transitionSpeed}ms ease`;
        }, transitionSpeed + 50);
      }
      
      // If we're at the beginning and going back, jump to the end
      if (index === -1) {
        setTimeout(() => {
          track.style.transition = 'none';
          index = slides.length - 1;
          track.style.transform = `translateX(${-100 * index}%)`;
          // Force reflow
          track.offsetHeight;
          track.style.transition = `transform ${transitionSpeed}ms ease`;
        }, transitionSpeed + 50);
      }
    }

    // Auto-advance slides
    let timer = setInterval(() => {
      if (playing && !isAnimating) {
        go(index + 1);
      }
    }, duration);

    // Pause on hover/touch
    root.addEventListener('mouseenter', () => {
      playing = false;
      clearInterval(timer);
    });
    
    root.addEventListener('mouseleave', () => {
      playing = true;
      timer = setInterval(() => {
        if (playing && !isAnimating) {
          go(index + 1);
        }
      }, duration);
    });

    // Navigation buttons
    const btnPrev = root.querySelector('.slider-btn.prev');
    const btnNext = root.querySelector('.slider-btn.next');
    
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (isAnimating) return;
        playing = false;
        clearInterval(timer);
        go(index - 1);
      });
    }
    
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (isAnimating) return;
        playing = false;
        clearInterval(timer);
        go(index + 1);
      });
    }

    // Touch swipe support
    let touchStartX = null;
    let touchStartY = null;
    let touchDX = 0;
    const swipeThreshold = 40; // px
    
    root.addEventListener('touchstart', (e) => {
      if (!e.touches || e.touches.length === 0) return;
      playing = false;
      clearInterval(timer);
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchDX = 0;
    }, { passive: true });
    
    root.addEventListener('touchmove', (e) => {
      if (touchStartX === null || touchStartY === null) return;
      
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      
      // Only process horizontal swipes
      const xDiff = Math.abs(touchX - touchStartX);
      const yDiff = Math.abs(touchY - touchStartY);
      
      if (xDiff > yDiff) {
        e.preventDefault(); // Prevent vertical scrolling when swiping horizontally
      }
      
      touchDX = touchX - touchStartX;
    }, { passive: false });
    
    root.addEventListener('touchend', () => {
      if (touchStartX !== null) {
        if (Math.abs(touchDX) > swipeThreshold) {
          if (touchDX < 0) { 
            go(index + 1); // Swipe left
          } else { 
            go(index - 1); // Swipe right
          }
        }
      }
      touchStartX = null; touchDX = 0; playing = true;
    });

    // Keyboard support when slider focused
    root.setAttribute('tabindex', '0');
    root.addEventListener('focus', ()=> playing = false);
    root.addEventListener('blur', ()=> playing = true);
    root.addEventListener('keydown', (e)=>{
      if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); go(index - 1); }
    });

    // Reset transition after it ends to avoid stacking issues
    track.addEventListener('transitionend', ()=>{
      // no-op placeholder for future loop techniques if cloning is added
    });

    // Initialize
    go(0);
    // Handle visibility change to pause when tab hidden
    document.addEventListener('visibilitychange', ()=>{
      playing = document.visibilityState === 'visible';
    });
  });
})();

// Reveal on scroll using IntersectionObserver
(function setupReveal(){
  const els = Array.from(document.querySelectorAll('[data-reveal]'));
  if (!('IntersectionObserver' in window)){
    els.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });
  els.forEach(el => io.observe(el));
})();

// Scroll spy for navbar active link (robust position-based on headings)
(function setupScrollSpy(){
  const navLinks = Array.from(document.querySelectorAll('.nav-list a[href^="#"]'));
  if (navLinks.length === 0) return;

  function collectItems(){
    return navLinks
      .map(a => {
        const sel = a.getAttribute('href');
        const heading = document.querySelector(sel);
        if (!heading) return null;
        const top = heading.getBoundingClientRect().top + window.scrollY;
        return { id: sel.slice(1), link: a, heading, top };
      })
      .filter(Boolean)
      .sort((a,b) => a.top - b.top);
  }

  let items = collectItems();
  const rootStyles = getComputedStyle(document.documentElement);
  const headerOffset = parseInt(rootStyles.getPropertyValue('--header-offset').trim()) || 128;
  const extra = 48; // must match CSS extra scroll margin and click offset
  const totalOffset = headerOffset + extra;

  function setActiveId(id){
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
  }

  function updateActive(){
    // If at the very top, clear active state
    if (window.scrollY < 10){
      navLinks.forEach(a => a.classList.remove('active'));
      return;
    }
    // Recompute tops in case of layout changes
    items = collectItems();
    const pos = window.scrollY + totalOffset + 1;
    let current = items[0];
    for (const it of items){
      if (it.top <= pos) current = it; else break;
    }
    if (current) setActiveId(current.id);
  }

  let ticking = false;
  function onScroll(){ if (!ticking){ ticking = true; requestAnimationFrame(()=>{ updateActive(); ticking = false; }); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', onScroll);
  updateActive();
})();

// Anchor click smooth scroll with fixed header offset
(function setupAnchorOffsetScroll(){
  const links = Array.from(document.querySelectorAll('.nav-list a[href^="#"]'));
  if (links.length === 0) return;
  // Read CSS variable --header-offset and add extra padding (match CSS +48px)
  const rootStyles = getComputedStyle(document.documentElement);
  const headerVar = rootStyles.getPropertyValue('--header-offset').trim();
  const headerOffset = parseInt(headerVar) || 128;
  const extra = 48; // must sync with CSS scroll-margin extra
  const totalOffset = headerOffset + extra;

  function scrollToTarget(id){
    const target = document.querySelector(id);
    if (!target) return;
    const y = target.getBoundingClientRect().top + window.scrollY - totalOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  links.forEach(a => {
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      e.preventDefault();
      scrollToTarget(href);
      // update active link immediately for better feedback
      document.querySelectorAll('.nav-list a').forEach(el=>el.classList.remove('active'));
      a.classList.add('active');
    });
  });
})();

// Subtle parallax based on cursor for decorative elements
(function setupParallax(){
  const p = document.querySelector('.parallax');
  if (!p) return;
  const factors = new Map();
  p.querySelectorAll('.p-dot, .p-ring').forEach((el,i)=>{
    const f = (i % 2 === 0) ? 12 : 18; // higher = slower
    factors.set(el, f);
  });
  window.addEventListener('mousemove', (e)=>{
    const cx = window.innerWidth/2;
    const cy = window.innerHeight/2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    factors.forEach((f, el)=>{
      el.style.transform = `translate(${dx * f}px, ${dy * f}px)`;
    });
  });
})();
