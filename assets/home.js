(() => {
  const lang = document.documentElement.lang === 'ru' ? 'ru' : 'en';

  // Keep the IP checker visible in the compact mobile navigation.
  // The desktop stylesheet hides most navigation links below 980px, but
  // checking an IP is one of the most useful actions for phone visitors.
  const ipButton = document.querySelector('.nav-pill[href*="my-ip"]');
  if (ipButton) {
    const icon = ipButton.querySelector('svg');
    const fullLabel = document.createElement('span');
    const shortLabel = document.createElement('span');
    fullLabel.className = 'ip-label-full';
    shortLabel.className = 'ip-label-short';
    fullLabel.textContent = lang === 'ru' ? 'Мой IP' : 'What Is My IP?';
    shortLabel.textContent = lang === 'ru' ? 'Мой IP' : 'My IP';
    ipButton.replaceChildren();
    if (icon) ipButton.appendChild(icon);
    ipButton.append(fullLabel, shortLabel);

    const mobileNavStyle = document.createElement('style');
    mobileNavStyle.textContent = `
      .ip-label-short{display:none}
      @media(max-width:980px){
        .nav-links .nav-pill{
          display:inline-flex!important;
          align-items:center;
          justify-content:center;
          gap:7px;
          min-width:82px;
          padding:8px 10px;
          font-size:10px;
          white-space:nowrap;
          border-color:rgba(102,228,255,.24);
          background:linear-gradient(135deg,rgba(102,228,255,.11),rgba(194,119,255,.08));
          box-shadow:0 8px 24px rgba(102,228,255,.07);
        }
        .nav-links .nav-pill .ip-label-full{display:none}
        .nav-links .nav-pill .ip-label-short{display:inline}
        .nav-links .nav-pill svg{width:14px;height:14px;flex:0 0 auto}
      }
      @media(max-width:480px){
        .nav-links .nav-pill{min-width:78px;padding:8px 9px}
      }
    `;
    document.head.appendChild(mobileNavStyle);
  }

  const statusBox = document.getElementById('liveSystemStatus');
  const statusLabel = document.getElementById('liveSystemStatusText');
  if (statusBox && statusLabel) {
    const labels = lang === 'ru'
      ? { operational:'Все системы работают', degraded:'Частичное снижение доступности', outage:'Сбой сервиса', error:'Статус временно недоступен' }
      : { operational:'All Systems Operational', degraded:'Partial Service Degradation', outage:'Service Outage', error:'Status temporarily unavailable' };

    fetch('https://cloudbyalex-status.alexdellsone.workers.dev/status', { cache:'no-store' })
      .then(r => r.ok ? r.json() : Promise.reject(new Error('status')))
      .then(data => {
        const state = ['operational','degraded','outage'].includes(data?.overall) ? data.overall : 'degraded';
        statusBox.dataset.state = state;
        statusLabel.textContent = labels[state];
      })
      .catch(() => {
        statusBox.dataset.state = 'degraded';
        statusLabel.textContent = labels.error;
      });
  }

  const reveals = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold:.12, rootMargin:'0px 0px -40px 0px' });
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }
})();
