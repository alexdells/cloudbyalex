(() => {
  const lang = document.documentElement.lang === 'ru' ? 'ru' : 'en';

  // Homepage visual layer shared by EN/RU pages.
  if (!document.querySelector('link[data-hero-enhancements]')) {
    const extraStyles = document.createElement('link');
    extraStyles.rel = 'stylesheet';
    extraStyles.href = '/assets/hero-enhancements.css?v=20260914-2';
    extraStyles.dataset.heroEnhancements = 'true';
    document.head.appendChild(extraStyles);
  }

  // Spread subtle DevOps watermarks across the whole background. They drift
  // downward at different speeds while the visitor scrolls, then wrap around.
  const hero = document.querySelector('.hero');
  if (hero && !document.querySelector('.tech-watermarks')) {
    const layer = document.createElement('div');
    layer.className = 'tech-watermarks';
    layer.setAttribute('aria-hidden', 'true');

    const marks = [
      { text:'AWS',            x:6,  base:.10, speed:.18, r:-11, s:1.12, o:.14 },
      { text:'LINUX',          x:82, base:.08, speed:.11, r:8,   s:1.02, o:.12 },
      { text:'K8s',            x:19, base:.25, speed:.15, r:-6,  s:.94,  o:.12 },
      { text:'DOCKER',         x:71, base:.24, speed:.20, r:9,   s:1.06, o:.11 },
      { text:'HELM',           x:45, base:.16, speed:.13, r:-4,  s:.88,  o:.09 },
      { text:'TERRAFORM',      x:3,  base:.44, speed:.12, r:-8,  s:1.02, o:.13 },
      { text:'JENKINS',        x:85, base:.42, speed:.17, r:7,   s:.92,  o:.10 },
      { text:'EKS',            x:28, base:.57, speed:.21, r:-5,  s:1.12, o:.11 },
      { text:'CI/CD',          x:62, base:.60, speed:.14, r:5,   s:1.06, o:.13 },
      { text:'KUBERNETES',     x:88, base:.67, speed:.10, r:-8,  s:.88,  o:.09 },
      { text:'PROMETHEUS',     x:7,  base:.76, speed:.19, r:6,   s:.90,  o:.10 },
      { text:'GRAFANA',        x:75, base:.79, speed:.16, r:-6,  s:1.00, o:.11 },
      { text:'ANSIBLE',        x:38, base:.87, speed:.12, r:7,   s:.92,  o:.09 },
      { text:'GITHUB ACTIONS', x:54, base:.35, speed:.09, r:-5,  s:.82,  o:.08 },
      { text:'BASH',           x:15, base:.91, speed:.22, r:-9,  s:.86,  o:.08 },
      { text:'PYTHON',         x:91, base:.92, speed:.15, r:8,   s:.86,  o:.08 }
    ];

    marks.forEach((mark, index) => {
      const el = document.createElement('span');
      el.textContent = mark.text;
      el.dataset.base = String(mark.base);
      el.dataset.speed = String(mark.speed);
      el.dataset.phase = String(index * .71);
      el.style.setProperty('--x', `${mark.x}%`);
      el.style.setProperty('--r', `${mark.r}deg`);
      el.style.setProperty('--s', mark.s);
      el.style.setProperty('--o', mark.o);
      layer.appendChild(el);
    });

    document.body.insertBefore(layer, document.body.firstChild);

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let ticking = false;

    const updateWatermarks = () => {
      const viewportH = Math.max(window.innerHeight || 0, 640);
      const cycle = viewportH + 220;
      const scrollY = window.scrollY || window.pageYOffset || 0;

      layer.querySelectorAll('span').forEach(el => {
        const base = Number(el.dataset.base || .5);
        const speed = reduceMotion ? 0 : Number(el.dataset.speed || .12);
        const phase = Number(el.dataset.phase || 0);
        const raw = base * viewportH + scrollY * speed;
        const y = ((raw + 110) % cycle) - 110;
        const xDrift = reduceMotion ? 0 : Math.sin(scrollY * .0025 + phase) * 9;
        el.style.setProperty('--y', `${y}px`);
        el.style.marginLeft = `${xDrift}px`;
      });
      ticking = false;
    };

    const requestWatermarkUpdate = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateWatermarks);
    };

    updateWatermarks();
    window.addEventListener('scroll', requestWatermarkUpdate, { passive:true });
    window.addEventListener('resize', requestWatermarkUpdate, { passive:true });
  }

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
