(function () {
  var KEY = 'cookieNoticeAccepted';
  try { if (localStorage.getItem(KEY) === '1') return; } catch (e) {}
  var bar = document.createElement('div');
  bar.setAttribute('role', 'region');
  bar.setAttribute('aria-label', 'Уведомление об использовании cookie');
  bar.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:2147483647;max-width:720px;margin:0 auto;' +
    'background:#131c30;color:#d6e0f0;border:1px solid #2b3d5e;border-radius:8px;padding:12px 14px;' +
    'font:14px/1.5 system-ui,"Segoe UI",sans-serif;box-shadow:0 4px 18px rgba(0,0,0,.45);' +
    'display:flex;flex-wrap:wrap;gap:10px;align-items:center';
  var text = document.createElement('p');
  text.style.cssText = 'margin:0;flex:1 1 300px';
  text.innerHTML = 'Сайт использует cookie и аналогичные технологии (localStorage, обезличенный счётчик посещений Cloudflare Web Analytics) ' +
    'для работы страниц и сбора статистики. Продолжая пользоваться сайтом, вы соглашаетесь с этим. ' +
    'Подробнее — в <a href="privacy.html#cookies" style="color:#7db4ff">Политике обработки персональных данных</a>. ' +
    'Отключить cookie можно в настройках браузера.';
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = 'Понятно';
  btn.style.cssText = 'background:#7db4ff;color:#0b0f1a;border:0;border-radius:6px;padding:8px 18px;font:inherit;font-weight:600;cursor:pointer';
  btn.addEventListener('click', function () {
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
    bar.remove();
  });
  bar.appendChild(text);
  bar.appendChild(btn);
  document.body.appendChild(bar);
})();
