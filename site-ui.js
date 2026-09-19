(() => {
  const init = () => {
    const nav = document.querySelector('.nav');
    const inner = nav?.querySelector('.nav-inner');
    const links = inner?.querySelector('.nav-links');
    if (!nav || !inner || !links || nav.dataset.menuReady === 'true') return;

    const currentPath = location.pathname.replace(/index\.html$/, '');
    const isPath = (href) => {
      const targetPath = new URL(href, location.origin).pathname.replace(/index\.html$/, '');
      return (href === '/' && currentPath === '/') ||
        (href !== '/' && !href.includes('#') && currentPath === targetPath);
    };

    const testingChildren = [
      ['Status Pengujian', '/status-pengujian.html'],
      ['Closed Testing', '/pengujian-tertutup.html'],
      ['Changelog', '/changelog.html']
    ];
    const testingActive = testingChildren.some(([,href]) => isPath(href));

    const primaryItems = [
      ['Beranda', '/'],
      ['Game', '/coin-rush-3d/'],
      ['Blog', '/blog/']
    ];

    const secondaryItems = [
      ['Tentang', '/about.html'],
      ['Dukungan', '/feedback.html']
    ];

    const linkHtml = ([label, href]) =>
      '<a href="' + href + '"' + (isPath(href) ? ' class="active"' : '') + '>' + label + '</a>';

    links.innerHTML =
      primaryItems.map(linkHtml).join('') +
      '<div class="nav-group' + (testingActive ? ' is-expanded' : '') + '">' +
        '<button class="nav-group-toggle' + (testingActive ? ' active' : '') + '" type="button" aria-expanded="' + String(testingActive) + '">' +
          '<span>Pengujian</span><span class="nav-group-chevron" aria-hidden="true">⌄</span>' +
        '</button>' +
        '<div class="nav-submenu">' +
          testingChildren.map(linkHtml).join('') +
        '</div>' +
      '</div>' +
      secondaryItems.map(linkHtml).join('');

    links.id = 'site-menu';
    links.setAttribute('aria-label', 'Menu utama');

    const testingGroup = links.querySelector('.nav-group');
    const testingToggle = links.querySelector('.nav-group-toggle');
    testingToggle?.addEventListener('click', (event) => {
      event.stopPropagation();
      const expanded = !testingGroup.classList.contains('is-expanded');
      testingGroup.classList.toggle('is-expanded', expanded);
      testingToggle.setAttribute('aria-expanded', String(expanded));
    });

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'nav-toggle';
    button.setAttribute('aria-label', 'Buka menu');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', 'site-menu');
    button.innerHTML = '<span></span><span></span><span></span>';
    inner.appendChild(button);

    const setOpen = (open) => {
      nav.classList.toggle('is-open', open);
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    };

    button.addEventListener('click', (event) => {
      event.stopPropagation();
      setOpen(!nav.classList.contains('is-open'));
    });
    links.addEventListener('click', (event) => {
      if (event.target.closest('a')) setOpen(false);
    });
    document.addEventListener('click', (event) => {
      if (!nav.contains(event.target)) setOpen(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        button.focus();
      }
    });

    const footerLinks = document.querySelector('.footer-links');
    if (footerLinks) {
      footerLinks.innerHTML = [
        ['Game','/coin-rush-3d/'],
        ['Blog','/blog/'],
        ['Tentang','/about.html'],
        ['Kontak','/contact.html'],
        ['Privasi','/privacy-policy.html'],
        ['Cookies','/cookie-policy.html'],
        ['Ketentuan','/terms-of-service.html'],
        ['Disclaimer','/disclaimer.html']
      ].map(([label,href]) => '<a href="' + href + '">' + label + '</a>').join('');
    }

    nav.classList.add('nav-enhanced');
    nav.dataset.menuReady = 'true';
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();