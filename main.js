(function () {
  const storageKey = 'siteAuthToken';
  const userStorageKey = 'siteAuthUser';
  const storageType = window.AUTH_TOKEN_STORAGE || 'localStorage';
  const authApiBase = (window.AUTH_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
  const googleClientId = window.GOOGLE_CLIENT_ID || '831513932056-ojvqr4hph5tpbii70q5i9ab7sfc22v05.apps.googleusercontent.com';

  function buildAuthUrl(path) {
    return `${authApiBase}${path.startsWith('/') ? path : `/${path}`}`;
  }

  function getStorage() {
    if (storageType === 'sessionStorage' && window.sessionStorage) {
      return window.sessionStorage;
    }
    return window.localStorage;
  }

  function readToken() {
    return getStorage().getItem(storageKey);
  }

  function saveToken(token) {
    getStorage().setItem(storageKey, token);
  }

  function clearToken() {
    getStorage().removeItem(storageKey);
  }

  function readUserLabel() {
    return getStorage().getItem(userStorageKey) || '';
  }

  function saveUserLabel(userLabel) {
    if (!userLabel) {
      getStorage().removeItem(userStorageKey);
      return;
    }

    getStorage().setItem(userStorageKey, userLabel);
  }

  function clearUserLabel() {
    getStorage().removeItem(userStorageKey);
  }

  function normalizeUserLabel(data, fallback) {
    const candidate = data?.user?.username || data?.username || data?.user?.name || data?.name || data?.email || data?.user?.email || fallback;
    if (!candidate) {
      return 'Member';
    }

    return String(candidate).trim();
  }

  async function logoutUser() {
    const token = readToken();
    if (token) {
      try {
        await fetch(buildAuthUrl('/auth/logout/'), {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          mode: 'cors'
        });
      } catch (error) {
        // Ignore logout errors and clear the local session anyway.
      }
    }

    clearToken();
    clearUserLabel();
    setAuthState(null, '');
    closeAuthDropdowns(null);
    const shell = document.getElementById('auth-shell');
    if (shell) {
      renderAuthUi(null, '');
    }
  }

  function attachAuthNavHandlers() {
    document.querySelectorAll('[data-auth-nav-link]').forEach((link) => {
      if (link.dataset.authBound === 'true') {
        return;
      }

      link.dataset.authBound = 'true';
      link.addEventListener('click', async (event) => {
        if (link.getAttribute('data-auth-logout') === 'true' && readToken()) {
          event.preventDefault();
          await logoutUser();
        }
      });
    });

    document.querySelectorAll('[data-auth-logout]').forEach((link) => {
      if (link.dataset.authBoundLogout === 'true') {
        return;
      }

      link.dataset.authBoundLogout = 'true';
      link.addEventListener('click', async (event) => {
        event.preventDefault();
        await logoutUser();
      });
    });
  }

  const NAV_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/about/', label: 'About' },
    { href: '/ductsizer/', label: 'DuctSizer' }
  ];

  function isActiveLink(href, path) {
    if (href === '/') {
      return path === '/' || path === '/index.html';
    }
    return path.startsWith(href);
  }

  function renderNav() {
    const placeholders = document.querySelectorAll('[data-nav-placeholder]');
    if (!placeholders.length) {
      return;
    }

    const path = window.location.pathname;
    const links = NAV_LINKS.map((link) => {
      const active = isActiveLink(link.href, path);
      return `<a class="nav-item nav-link${active ? ' active' : ''}" href="${link.href}">${link.label}</a>`;
    }).join('');

    const navHtml = `
    <nav class="navbar navbar-expand-md navbar-dark bg-steel fixed-top">
      <div class="container">
        <a class="navbar-brand mr-4" href="/" aria-label="Home">SN</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggle"
          aria-controls="navbarToggle" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarToggle">
          <div class="navbar-nav mr-auto">
            ${links}
          </div>
          <div class="navbar-nav nav-right">
            <a class="nav-item nav-link" href="/#contact">Collaborate</a>
            <div class="nav-item dropdown" data-auth-menu>
              <button class="btn btn-outline-light border-0" type="button" id="authMenuButton"
                aria-haspopup="true" aria-expanded="false" data-auth-menu-trigger>
                <span data-auth-menu-label>Login</span>
              </button>
              <div class="dropdown-menu dropdown-menu-right" aria-labelledby="authMenuButton">
                <a class="dropdown-item" href="/login.html" data-auth-nav-link>Login</a>
                <a class="dropdown-item" href="#" data-auth-logout hidden>Logout</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>`;

    placeholders.forEach((placeholder) => {
      placeholder.innerHTML = navHtml;
      // Bootstrap 4's collapse data-API is document-delegated and manages
      // injected togglers itself — only drive the toggle manually when the
      // plugin isn't loaded, so the navbar doesn't double-toggle.
      if (window.jQuery && window.jQuery.fn && window.jQuery.fn.collapse) {
        return;
      }
      const toggle = placeholder.querySelector('.navbar-toggler');
      const collapse = placeholder.querySelector('.navbar-collapse');
      if (toggle && collapse) {
        toggle.addEventListener('click', () => {
          const open = collapse.classList.toggle('show');
          toggle.setAttribute('aria-expanded', String(open));
        });
      }
    });
  }

  function closeAuthDropdowns(exceptMenu) {
    document.querySelectorAll('[data-auth-menu]').forEach((menu) => {
      if (menu === exceptMenu) {
        return;
      }
      const box = menu.querySelector('.dropdown-menu');
      const trigger = menu.querySelector('[data-auth-menu-trigger]');
      if (box) {
        box.classList.remove('show');
      }
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function bindAuthDropdowns() {
    document.addEventListener('click', (event) => {
      if (!event.target.closest('[data-auth-menu]')) {
        closeAuthDropdowns(null);
      }
    });
  }

  function setAuthState(token, userLabel) {
    const isLoggedIn = Boolean(token);
    const resolvedLabel = userLabel || readUserLabel() || (isLoggedIn ? 'Member' : '');
    document.documentElement.dataset.authState = isLoggedIn ? 'logged-in' : 'logged-out';
    document.querySelectorAll('.auth-required').forEach((element) => {
      element.hidden = !isLoggedIn;
    });

    attachAuthNavHandlers();
    document.querySelectorAll('[data-auth-nav-link]').forEach((link) => {
      link.textContent = 'Login';
      link.setAttribute('href', '/login.html');
      link.classList.toggle('active', !isLoggedIn && window.location.pathname.includes('login'));
    });

    document.querySelectorAll('[data-auth-logout]').forEach((link) => {
      link.hidden = !isLoggedIn;
    });

    document.querySelectorAll('[data-auth-menu-label]').forEach((label) => {
      label.textContent = isLoggedIn ? resolvedLabel || 'Member' : 'Login';
    });

    document.querySelectorAll('[data-auth-menu-trigger]').forEach((button) => {
      const isDropdownEnabled = isLoggedIn;
      button.classList.toggle('dropdown-toggle', isDropdownEnabled);
      button.classList.toggle('btn-outline-light', true);
      button.setAttribute('aria-haspopup', 'true');
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('type', 'button');

      button.onclick = (event) => {
        if (!isLoggedIn) {
          event.preventDefault();
          window.location.href = '/login.html';
          return;
        }
        const menu = button.closest('[data-auth-menu]');
        const box = menu && menu.querySelector('.dropdown-menu');
        if (!box) {
          return;
        }
        const open = box.classList.toggle('show');
        button.setAttribute('aria-expanded', String(open));
      };
    });

    document.querySelectorAll('[data-auth-menu]').forEach((menu) => {
      const loginLink = menu.querySelector('[data-auth-nav-link]');
      const logoutLink = menu.querySelector('[data-auth-logout]');
      const trigger = menu.querySelector('[data-auth-menu-trigger]');
      if (loginLink) {
        loginLink.hidden = isLoggedIn;
      }
      logoutLink.hidden = !isLoggedIn;
      if (trigger && isLoggedIn) {
        trigger.setAttribute('type', 'button');
        trigger.classList.remove('btn-link');
      }
    });

    const statusPill = document.getElementById('auth-status-pill');
    if (statusPill) {
      statusPill.textContent = isLoggedIn ? `Signed in${resolvedLabel ? ` · ${resolvedLabel}` : ''}` : 'Guest';
    }

    const authAction = document.getElementById('auth-action');
    if (authAction) {
      authAction.textContent = isLoggedIn ? 'Logout' : 'Login / Register';
    }
  }

  function createAuthMarkup(token, userLabel) {
    const isLoggedIn = Boolean(token);
    const resolvedLabel = userLabel || readUserLabel() || 'Member';
    return `
      <div class="auth-card">
        <div class="auth-hero">
          <div class="auth-main">
            <div id="auth-form-shell" class="auth-form-shell ${isLoggedIn ? 'auth-hidden' : ''}">
              <div class="auth-mode-switch" role="tablist" aria-label="Authentication mode">
                <button type="button" class="auth-mode-btn active" data-auth-mode-switch="login" aria-pressed="true">Login</button>
                <button type="button" class="auth-mode-btn" data-auth-mode-switch="register" aria-pressed="false">Register</button>
              </div>

              <div class="auth-form-panels">
                <div class="auth-form-panel active" data-auth-panel="login">
                  <form id="auth-login-form" novalidate>
                    <div class="form-group mb-2">
                      <label for="auth-login-identifier">Username</label>
                      <input id="auth-login-identifier" class="form-control form-control-sm" name="identifier" type="text" required>
                    </div>
                    <div class="form-group mb-2">
                      <label for="auth-login-password">Password</label>
                      <input id="auth-login-password" class="form-control form-control-sm" name="password" type="password" required>
                    </div>
                    <div class="auth-actions">
                      <button type="submit" class="btn btn-sm btn-primary">Login</button>
                    </div>
                  </form>
                  <div class="auth-divider"><span>or continue with</span></div>
                  <div id="auth-google-button" class="auth-google-button"></div>
                </div>

                <div class="auth-form-panel" data-auth-panel="register">
                  <form id="auth-register-form" novalidate>
                    <div class="form-group mb-2">
                      <label for="auth-register-identifier">Username</label>
                      <input id="auth-register-identifier" class="form-control form-control-sm" name="identifier" type="text" required>
                    </div>

                    <div class="form-group mb-2">
                      <label for="auth-register-password">Password</label>
                      <input id="auth-register-password" class="form-control form-control-sm" name="password" type="password" required>
                    </div>
                    <div class="form-group mb-2">
                      <label for="auth-register-confirm">Confirm password</label>
                      <input id="auth-register-confirm" class="form-control form-control-sm" name="confirmPassword" type="password" required>
                    </div>
                    <div class="auth-actions">
                      <button type="submit" class="btn btn-sm btn-outline-secondary">Register</button>
                    </div>
                  </form>
                </div>
              </div>

              <div id="auth-message" class="auth-message" role="alert"></div>
            </div>
          </div>

          <div class="auth-side">
            <div class="auth-side-content">
              <div class="auth-side-title">${isLoggedIn ? 'Welcome back' : 'New here?'}</div>
              <div class="auth-side-copy">${isLoggedIn ? 'You are already signed in and can continue exploring the site.' : 'Create an account to unlock member-only features and stay connected.'}</div>
              <a class="auth-side-link" href="#" data-auth-side-link="${isLoggedIn ? 'login' : 'register'}">${isLoggedIn ? 'Go to login' : 'Create account'}</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function setActiveAuthMode(mode) {
    document.querySelectorAll('[data-auth-mode-switch]').forEach((button) => {
      const isActive = button.dataset.authModeSwitch === mode;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    document.querySelectorAll('.auth-form-panel').forEach((panel) => {
      panel.classList.toggle('active', panel.dataset.authPanel === mode);
    });

    const sideTitle = document.querySelector('.auth-side-title');
    const sideCopy = document.querySelector('.auth-side-copy');
    const sideLink = document.querySelector('.auth-side-link');

    if (sideTitle && sideCopy && sideLink) {
      if (mode === 'register') {
        sideTitle.textContent = 'Welcome back';
        sideCopy.textContent = 'Already have an account? Sign in to continue where you left off.';
        sideLink.textContent = 'Login instead';
        sideLink.dataset.authSideLink = 'login';
      } else {
        sideTitle.textContent = 'New here?';
        sideCopy.textContent = 'Create an account to unlock member-only features and stay connected.';
        sideLink.textContent = 'Create account';
        sideLink.dataset.authSideLink = 'register';
      }
    }
  }

  function switchAuthMode(mode) {
    const hero = document.querySelector('.auth-hero');
    const currentPanel = document.querySelector('.auth-form-panel.active');
    if (currentPanel && currentPanel.dataset.authPanel === mode) {
      return;
    }

    if (hero && hero.classList.contains('swapping')) {
      return; // ignore clicks until the in-flight swap settles
    }

    const canAnimate =
      hero &&
      window.matchMedia('(min-width: 768px)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!canAnimate) {
      setActiveAuthMode(mode);
      return;
    }

    // Content swaps first so the doors carry it across as they trade places.
    setActiveAuthMode(mode);

    const goingToRegister = mode === 'register';
    hero.classList.add('swapping', goingToRegister ? 'to-register' : 'to-login');

    const mainDoor = hero.querySelector('.auth-main');
    let done = false;
    let fallback = 0;
    const onDoorEnd = (event) => {
      if (event.target === mainDoor && String(event.animationName).startsWith('door-')) {
        finish();
      }
    };
    const finish = () => {
      if (done) {
        return;
      }
      done = true;
      clearTimeout(fallback);
      hero.removeEventListener('animationend', onDoorEnd);
      hero.classList.remove('swapping', 'to-register', 'to-login');
      hero.classList.toggle('is-register', goingToRegister);
    };
    fallback = setTimeout(finish, 800);
    hero.addEventListener('animationend', onDoorEnd);
  }

  function renderAuthUi(token, userLabel) {
    const shell = document.getElementById('auth-shell');
    if (shell) {
      shell.innerHTML = createAuthMarkup(token, userLabel);
    }

    setAuthState(token, userLabel);

    const actionButton = document.getElementById('auth-action');
    if (actionButton) {
      actionButton.addEventListener('click', async () => {
        const currentToken = readToken();
        if (currentToken) {
          await logoutUser();
          return;
        }
        const formShell = document.getElementById('auth-form-shell');
        if (formShell) {
          formShell.classList.remove('auth-hidden');
        }
      });
    }

    document.querySelectorAll('[data-auth-mode-switch]').forEach((button) => {
      button.addEventListener('click', () => {
        switchAuthMode(button.dataset.authModeSwitch);
      });
    });

    document.querySelectorAll('[data-auth-side-link]').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        switchAuthMode(link.dataset.authSideLink);
      });
    });

    const loginForm = document.getElementById('auth-login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const identifier = document.getElementById('auth-login-identifier').value.trim();
        const password = document.getElementById('auth-login-password').value;
        const messageBox = document.getElementById('auth-message');

        if (!identifier || !password) {
          messageBox.textContent = 'Please enter both your username/email and password.';
          messageBox.className = 'auth-message auth-message-error';
          return;
        }

        try {
          const response = await fetch(buildAuthUrl('/auth/login/'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            body: JSON.stringify({ username: identifier, password })
          });

          const data = await response.json().catch(() => ({}));
          if (!response.ok) {
            throw new Error(data.message || `Authentication failed (${response.status}).`);
          }

          const token = data.token || data.accessToken || data.data?.token;
          if (!token) {
            throw new Error('The server did not return an auth token.');
          }

          const resolvedUserLabel = normalizeUserLabel(data, identifier);
          saveToken(token);
          saveUserLabel(resolvedUserLabel);
          window.location.href = '/ductsizer/';
        } catch (error) {
          messageBox.textContent = error.message || 'Unable to reach the authentication service.';
          messageBox.className = 'auth-message auth-message-error';
        }
      });
    }

    const registerForm = document.getElementById('auth-register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const identifier = document.getElementById('auth-register-identifier').value.trim();
        const password = document.getElementById('auth-register-password').value;
        const confirmPassword = document.getElementById('auth-register-confirm').value;
        const messageBox = document.getElementById('auth-message');

        if (!identifier || !password) {
          messageBox.textContent = 'Please complete all registration fields.';
          messageBox.className = 'auth-message auth-message-error';
          return;
        }

        if (password !== confirmPassword) {
          messageBox.textContent = 'Passwords do not match.';
          messageBox.className = 'auth-message auth-message-error';
          return;
        }

        try {
          const response = await fetch(buildAuthUrl('/auth/register/'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            body: JSON.stringify({ username: identifier, password })
          });

          const data = await response.json().catch(() => ({}));
          if (!response.ok) {
            throw new Error(data.message || `Registration failed (${response.status}).`);
          }

          const token = data.token || data.accessToken || data.data?.token;
          if (!token) {
            throw new Error('The server did not return an auth token.');
          }

          const resolvedUserLabel = normalizeUserLabel(data, identifier);
          saveToken(token);
          saveUserLabel(resolvedUserLabel);
          window.location.href = '/ductsizer/';
        } catch (error) {
          messageBox.textContent = error.message || 'Unable to reach the authentication service.';
          messageBox.className = 'auth-message auth-message-error';
        }
      });
    }

    initGoogleSignIn();
  }

  let googleInited = false;

  function loadGsiScript() {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Google Sign-In script failed to load.'));
      document.head.appendChild(script);
    });
  }

  function decodeJwtPayload(token) {
    try {
      const part = String(token).split('.')[1];
      if (!part) {
        return null;
      }
      const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
      const json = decodeURIComponent(
        atob(padded)
          .split('')
          .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
          .join('')
      );
      return JSON.parse(json);
    } catch (error) {
      return null;
    }
  }

  async function handleGoogleCredential(response) {
    const messageBox = document.getElementById('auth-message');
    if (!response || !response.credential) {
      if (messageBox) {
        messageBox.textContent = 'Google sign-in was cancelled.';
        messageBox.className = 'auth-message auth-message-error';
      }
      return;
    }
    try {
      const res = await fetch(buildAuthUrl('/auth/google/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        body: JSON.stringify({ id_token: response.credential })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `Google sign-in failed (${res.status}).`);
      }
      const token = data.token || data.accessToken || data.data?.token;
      if (!token) {
        throw new Error('The server did not return an auth token.');
      }
      saveToken(token);
      const claims = decodeJwtPayload(response.credential);
      saveUserLabel((claims && claims.name) || normalizeUserLabel(data, ''));
      window.location.href = '/ductsizer/';
    } catch (error) {
      if (messageBox) {
        messageBox.textContent = error.message || 'Unable to reach the authentication service.';
        messageBox.className = 'auth-message auth-message-error';
      }
    }
  }

  async function initGoogleSignIn() {
    const container = document.getElementById('auth-google-button');
    const formShell = document.getElementById('auth-form-shell');
    if (!container || !formShell || formShell.classList.contains('auth-hidden')) {
      return;
    }
    container.innerHTML = '';
    const divider = container.previousElementSibling;
    try {
      await loadGsiScript();
    } catch (error) {
      if (divider) {
        divider.style.display = 'none';
      }
      container.style.display = 'none';
      return;
    }
    if (!googleInited) {
      google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCredential
      });
      googleInited = true;
    }
    google.accounts.id.renderButton(container, {
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      shape: 'pill',
      logo_alignment: 'left',
      width: '100%'
    });
  }

  window.authFetch = async function authFetch(url, options = {}) {
    const token = readToken();
    const headers = new Headers(options.headers || {});

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    if (options.body && typeof options.body === 'string' && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    return fetch(url, { ...options, headers });
  };

  document.addEventListener('DOMContentLoaded', () => {
    renderNav();
    bindAuthDropdowns();
    const token = readToken();
    const userLabel = readUserLabel();
    setAuthState(token, userLabel);
    if (document.getElementById('auth-shell')) {
      renderAuthUi(token, userLabel);
    }
  });
})();
