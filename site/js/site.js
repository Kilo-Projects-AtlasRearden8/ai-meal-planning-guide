// AI Meal Planning Guide — site interactivity
// Copyright (c) 2026 Asdale Dynamics, LLC. MIT License.

(() => {
  'use strict';

  // Highlight the current page in the navigation
  const current = location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-list li a');
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === current || (current === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // Copy prompt blocks to clipboard
  document.querySelectorAll('pre code').forEach((block) => {
    const pre = block.parentElement;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.setAttribute('aria-label', 'Copy prompt to clipboard');
    btn.style.cssText =
      'float:right; margin-left:0.5rem; padding:0.2rem 0.5rem; font-size:0.75rem;' +
      ' background:var(--surface); border:1px solid var(--border);' +
      ' border-radius:4px; cursor:pointer; color:var(--text);';
    pre.style.position = 'relative';
    pre.appendChild(btn);

    btn.addEventListener('click', async () => {
      const text = block.innerText;
      try {
        await navigator.clipboard.writeText(text);
        const old = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = old; }, 1500);
      } catch (err) {
        // Fallback for browsers without clipboard API
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta);
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = old; }, 1500);
      }
    });
  });
})();
