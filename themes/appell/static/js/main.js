(function() {
  const toggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  function getPreferred() {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  applyTheme(getPreferred());

  toggle.addEventListener('click', function() {
    const current = html.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // Make h2 headings clickable anchor links
  document.querySelectorAll('.landing__content h2[id]').forEach(function(heading) {
    heading.style.cursor = 'pointer';
    heading.addEventListener('click', function() {
      const id = this.getAttribute('id');
      if (id) {
        window.location.hash = id;
        // Copy link to clipboard
        const url = window.location.href;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(function() {
            // Optional: show a tooltip or notification
          }).catch(function() {});
        }
      }
    });
  });

  // Shrink header on scroll
  const header = document.querySelector('.site-header');
  let lastScroll = 0;
  
  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });

  // Track scroll position and update URL hash
  const headings = document.querySelectorAll('.landing__content h2[id], .supporters[id]');
  
  if (headings.length > 0 && 'IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    let currentId = '';
    let updateTimeout;
    
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (id && id !== currentId) {
            currentId = id;
            // Debounce hash updates to reduce scroll adjustments
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(function() {
              if (history.replaceState) {
                history.replaceState(null, null, '#' + id);
              }
            }, 100);
          }
        }
      });
    }, observerOptions);

    headings.forEach(function(heading) {
      observer.observe(heading);
    });

    // Clear hash when at top of page
    let clearHashTimeout;
    window.addEventListener('scroll', function() {
      if (window.pageYOffset < 100) {
        clearTimeout(clearHashTimeout);
        clearHashTimeout = setTimeout(function() {
          if (history.replaceState && window.location.hash) {
            history.replaceState(null, null, window.location.pathname);
            currentId = '';
          }
        }, 100);
      }
    });
  }
})();
