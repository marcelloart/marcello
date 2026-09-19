(function () {
  'use strict';

  // Isi dengan Measurement ID GA4 (format G-XXXXXXXXXX) untuk mengaktifkan
  // pengiriman data. Event tetap masuk ke dataLayer sebelum ID ditambahkan.
  const GA_MEASUREMENT_ID = '';

  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  const enabled = /^G-[A-Z0-9]+$/i.test(GA_MEASUREMENT_ID);
  if (enabled) {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_MEASUREMENT_ID);
    document.head.appendChild(script);
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      anonymize_ip: true,
      transport_type: 'beacon'
    });
  }

  function track(name, params) {
    gtag('event', name, Object.assign({
      page_location: location.href,
      page_title: document.title
    }, params || {}));
  }

  window.MarcelloAnalytics = { track, enabled };

  document.addEventListener('click', function (event) {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const href = link.href;
    if (href.includes('/pengujian-tertutup')) {
      track('tester_cta_click', { link_url: href, link_text: link.textContent.trim() });
    } else if (href.includes('play.google.com/apps/testing/com.marcelloart.coinrush3d')) {
      track('play_testing_click', { link_url: href, link_text: link.textContent.trim() });
    } else if (href.includes('/feedback')) {
      track('support_click', { link_url: href, link_text: link.textContent.trim() });
    }
  });

  document.addEventListener('play', function (event) {
    if (event.target.matches('video')) track('gameplay_video_play');
  }, true);

  document.addEventListener('marcello:testing-submitted', function () {
    track('testing_form_submit_success');
  });
})();
