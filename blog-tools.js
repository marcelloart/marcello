(() => {
  const init = () => {
    const list = document.querySelector('.blog-list');
    const search = document.querySelector('#blog-search');
    const clear = document.querySelector('#blog-search-clear');
    const status = document.querySelector('#blog-results-status');
    const pagination = document.querySelector('#blog-pagination');
    const empty = document.querySelector('#blog-empty');
    if (!list || !search || !pagination) return;

    const cards = [...list.querySelectorAll('.post-card')];
    const PAGE_SIZE = 6;
    const normalize = (value) => (value || '').toLowerCase().normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();

    cards.forEach(card => card.dataset.searchText = normalize(card.textContent));
    let query = '';
    let page = 1;

    const readUrl = () => {
      const params = new URLSearchParams(location.search);
      query = (params.get('q') || '').trim();
      page = Math.max(1, parseInt(params.get('page') || '1', 10) || 1);
      search.value = query;
    };

    const writeUrl = (push = false) => {
      const params = new URLSearchParams(location.search);
      query ? params.set('q', query) : params.delete('q');
      page > 1 ? params.set('page', String(page)) : params.delete('page');
      const url = location.pathname + (params.toString() ? '?' + params : '') + location.hash;
      history[push ? 'pushState' : 'replaceState']({q:query,page}, '', url);
    };

    const makeButton = (label, target, current = false, disabled = false, ariaLabel = '') => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'blog-page-btn' + (current ? ' is-current' : '');
      button.textContent = label;
      button.disabled = disabled;
      if (current) button.setAttribute('aria-current', 'page');
      if (ariaLabel) button.setAttribute('aria-label', ariaLabel);
      button.addEventListener('click', () => {
        if (disabled || target === page) return;
        page = target;
        writeUrl(true);
        render(true);
      });
      return button;
    };

    const drawPagination = (totalPages) => {
      pagination.innerHTML = '';
      pagination.hidden = totalPages <= 1;
      if (totalPages <= 1) return;
      pagination.appendChild(makeButton('‹', Math.max(1,page-1), false, page===1, 'Halaman sebelumnya'));

      let start = Math.max(1, page - 3);
      let end = Math.min(totalPages, start + 6);
      start = Math.max(1, end - 6);

      if (start > 1) {
        pagination.appendChild(makeButton('1',1,page===1));
        if (start > 2) {
          const dots = document.createElement('span');
          dots.className = 'blog-page-dots';
          dots.textContent = '…';
          pagination.appendChild(dots);
        }
      }
      for (let i=start; i<=end; i++) pagination.appendChild(makeButton(String(i),i,i===page));
      if (end < totalPages) {
        if (end < totalPages - 1) {
          const dots = document.createElement('span');
          dots.className = 'blog-page-dots';
          dots.textContent = '…';
          pagination.appendChild(dots);
        }
        pagination.appendChild(makeButton(String(totalPages),totalPages,page===totalPages));
      }
      pagination.appendChild(makeButton('›',Math.min(totalPages,page+1),false,page===totalPages,'Halaman berikutnya'));
    };

    const render = (scroll = false) => {
      const q = normalize(query);
      const matched = cards.filter(card => !q || card.dataset.searchText.includes(q));
      const totalPages = Math.max(1, Math.ceil(matched.length / PAGE_SIZE));
      if (page > totalPages) page = totalPages;
      cards.forEach(card => card.hidden = true);
      const start = (page - 1) * PAGE_SIZE;
      matched.slice(start, start + PAGE_SIZE).forEach(card => card.hidden = false);

      if (clear) clear.hidden = !query;
      if (empty) empty.hidden = matched.length !== 0;
      if (status) {
        status.textContent = matched.length
          ? 'Menampilkan ' + (start+1) + '–' + Math.min(start+PAGE_SIZE,matched.length) + ' dari ' + matched.length + ' artikel' + (query ? ' untuk “' + query + '”' : '') + '.'
          : 'Tidak ada artikel yang cocok dengan pencarian Anda.';
      }
      drawPagination(totalPages);
      writeUrl(false);
      if (scroll) document.querySelector('.blog-tools')?.scrollIntoView({behavior:'smooth',block:'start'});
    };

    let timer;
    search.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        query = search.value.trim();
        page = 1;
        render(false);
      }, 120);
    });
    clear?.addEventListener('click', () => {
      search.value = ''; query = ''; page = 1; render(false); search.focus();
    });
    window.addEventListener('popstate', () => { readUrl(); render(false); });

    readUrl();
    render(false);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();