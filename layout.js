/* ============================================================
   VAI Layout — layout.js
   Drop this in your repo root and add to every page:
   <script src="/layout.js"></script>  (just before </body>)

   Each page needs these placeholders in the <body>:
     <div id="vai-topbar"></div>
     <div id="vai-navbar"></div>   ← omit on login page if you want
     ... your page content ...
     <div id="vai-footer"></div>

   To mark a nav link active, give your <body> a data-page attr:
     <body data-page="programs">
   Valid values: home, programs, students, alumni, events
   ============================================================ */

(function () {

  /* ----------------------------------------------------------
     ARG STATE  (all stored in localStorage)
     vai_user      — display name once logged in
     vai_role      — "student" | null
     vai_site_down — "true" = show access-restricted overlay
  ---------------------------------------------------------- */
  const role  = localStorage.getItem('vai_role');
  const user  = localStorage.getItem('vai_user');
  const down  = localStorage.getItem('vai_site_down');

  const currentPage = document.body.dataset.page || '';

  /* ----------------------------------------------------------
     TOPBAR
  ---------------------------------------------------------- */
  const topbarEl = document.getElementById('vai-topbar');
  if (topbarEl) {
    const portalLabel = role === 'student'
      ? `${user}｜ポータル`
      : 'ログイン';
    const portalHref = role === 'student'
      ? '/dashboard/'
      : '/login/';

    topbarEl.innerHTML = `
      <div class="topbar">
        <div>VAI | Virtual Academy Institution</div>
        <div>
          <a href="/">ホーム</a>
          <a href="${portalHref}" id="portal-link">${portalLabel}</a>
          <a href="/support/">サポート</a>
          <a href="/search/">検索</a>
        </div>
      </div>`;
  }

  /* ----------------------------------------------------------
     MAIN NAVBAR
  ---------------------------------------------------------- */
  const navbarEl = document.getElementById('vai-navbar');
  if (navbarEl) {
    const links = [
      { key: 'home',     href: '/',          label: 'キャンパスライフ' },
      { key: 'programs', href: '/programs/', label: 'プログラム'       },
      { key: 'faculty',  href: '/faculty/',  label: '教員紹介'         },
      { key: 'students', href: '/students/', label: '学生'             },
      { key: 'alumni',   href: '/alumni/',   label: '卒業生'           },
      { key: 'events',   href: '/events/',   label: 'イベント'         },
    ];
    const linkHTML = links.map(l =>
      `<a href="${l.href}"${currentPage === l.key ? ' class="active"' : ''}>${l.label}</a>`
    ).join('');
    navbarEl.innerHTML = `
      <div class="navbar">
        <div class="logo">VAI</div>
        <div class="nav-links">${linkHTML}</div>
      </div>`;
  }

  /* ----------------------------------------------------------
     FOOTER
  ---------------------------------------------------------- */
  const footerEl = document.getElementById('vai-footer');
  if (footerEl) {
    footerEl.innerHTML = `
      <div class="footer">
        © 2026 Virtual Academy Institution（VAI）
      </div>`;
  }

  /* ----------------------------------------------------------
     ARG: SITE DOWN OVERLAY
     If vai_site_down === "true", hide all content and show
     the access-restricted message.
  ---------------------------------------------------------- */
  if (down === 'true') {
    const mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.style.display = 'none';

    let overlay = document.getElementById('vai-down-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'vai-down-overlay';
      overlay.style.cssText = 'text-align:center;padding:100px 30px;';
      overlay.innerHTML = `
        <h1>現在、メンテナンスを実施中です。</h1>
        <p>不審なアクティビティを検知しました。</p>
        <p>一部のユーザーのみアクセス可能です。</p>`;
      document.body.appendChild(overlay);
    }
  }

  /* ----------------------------------------------------------
     SHARED STYLES
     Injected once so every page gets consistent topbar/nav/footer
     without needing a separate CSS file (though you can move
     these to style.css any time).
  ---------------------------------------------------------- */
  if (!document.getElementById('vai-layout-styles')) {
    const style = document.createElement('style');
    style.id = 'vai-layout-styles';
    style.textContent = `
      /* TOPBAR */
      .topbar {
        background: #4a5bdc;
        color: white;
        padding: 10px 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .topbar a {
        color: white;
        text-decoration: none;
        margin-left: 20px;
        font-size: 0.9em;
      }
      .topbar a:hover { text-decoration: underline; }

      /* NAVBAR */
      .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 30px;
        border-bottom: 1px solid #eee;
      }
      .logo {
        font-size: 1.5em;
        font-weight: bold;
        color: #4a5bdc;
      }
      .nav-links a {
        margin: 0 15px;
        text-decoration: none;
        color: inherit;
      }
      .nav-links a.active {
        border-bottom: 2px solid #4a5bdc;
        padding-bottom: 2px;
      }
      .nav-links a:hover { color: #4a5bdc; }

      /* FOOTER */
      .footer {
        background: #f0f2ff;
        padding: 20px;
        text-align: center;
        margin-top: 40px;
        font-size: 0.9em;
        color: #555;
      }
    `;
    document.head.appendChild(style);
  }

})();

/* ----------------------------------------------------------
   UTILITY — call from browser console or ARG puzzle triggers
   window.resetVAI()     — wipe all state and reload
   window.setVAIDown()   — trigger the access-restricted screen
   window.loginVAI(name) — simulate a student login
---------------------------------------------------------- */
window.resetVAI = function () {
  localStorage.clear();
  location.reload();
};

window.setVAIDown = function () {
  localStorage.setItem('vai_site_down', 'true');
  location.reload();
};

window.loginVAI = function (name) {
  localStorage.setItem('vai_user', name || 'ゲスト');
  localStorage.setItem('vai_role', 'student');
  location.href = '/dashboard/';
};
