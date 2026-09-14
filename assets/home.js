(() => {
  const lang = document.documentElement.lang === 'ru' ? 'ru' : 'en';

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
