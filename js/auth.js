/* =========================================================
   GANTARIKU - AUTH.JS
   Login + Register Orang Tua
   ========================================================= */

let currentUser = null;
let currentUserProfile = null;
let currentUserRole = null;

/* =========================================================
   LOAD PROFILE PENGGUNA
   ========================================================= */

async function loadUserProfile(userId) {
  if (!userId) return null;

  try {
    const { data, error } = await supabase
      .from("pengguna")
      .select(`
        id,
        user_id,
        nama,
        email,
        role,
        nomor_hp,
        alamat
      `)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Gagal mengambil profil pengguna:", error);
      return null;
    }

    return data || null;
  } catch (err) {
    console.error("loadUserProfile error:", err);
    return null;
  }
}


/* =========================================================
   TOGGLE PASSWORD
   ========================================================= */

function togglePassword(inputId, button) {
  const input = document.getElementById(inputId);

  if (!input) return;

  if (input.type === "password") {
    input.type = "text";
    button.textContent = "🙈";
    button.setAttribute("aria-label", "Sembunyikan password");
  } else {
    input.type = "password";
    button.textContent = "👁";
    button.setAttribute("aria-label", "Tampilkan password");
  }
}


/* =========================================================
   STYLE AUTH
   ========================================================= */

function injectAuthStyles() {
  if (document.getElementById("gantariku-auth-style")) return;

  const style = document.createElement("style");

  style.id = "gantariku-auth-style";

  style.textContent = `
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      box-sizing: border-box;
      background:
        radial-gradient(circle at top left, rgba(245, 193, 66, 0.20), transparent 35%),
        radial-gradient(circle at bottom right, rgba(92, 124, 74, 0.18), transparent 35%),
        linear-gradient(135deg, #3f3835 0%, #5a4840 48%, #8b674c 100%);
    }

    .auth-card {
      width: 100%;
      max-width: 430px;
      background: #fffaf0;
      border-radius: 28px;
      padding: 32px;
      box-sizing: border-box;
      box-shadow: 0 20px 60px rgba(0,0,0,.20);
    }

    .auth-logo-wrap {
      display: flex;
      justify-content: center;
      margin-bottom: 18px;
    }

    .auth-logo {
      width: 170px;
      max-width: 75%;
      height: auto;
      object-fit: contain;
    }

    .auth-title {
      text-align: center;
      margin: 4px 0 5px;
      color: #433934;
      font-size: 25px;
      font-weight: 800;
    }

    .auth-subtitle {
      text-align: center;
      margin: 0 0 24px;
      color: #806f65;
      font-size: 14px;
      line-height: 1.5;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .auth-field {
      display: flex;
      flex-direction: column;
      gap: 7px;
    }

    .auth-field label {
      font-size: 13px;
      font-weight: 700;
      color: #574940;
    }

    .auth-input-wrap {
      position: relative;
      width: 100%;
    }

    .auth-input {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid #ddcfbf;
      background: #fff;
      color: #3f3631;
      border-radius: 13px;
      padding: 13px 15px;
      font-size: 14px;
      outline: none;
      transition: .2s ease;
    }

    .auth-input.password-input {
      padding-right: 50px;
    }

    .auth-input:focus {
      border-color: #c58b4a;
      box-shadow: 0 0 0 3px rgba(197,139,74,.12);
    }

    .auth-password-toggle {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      width: 34px;
      height: 34px;
      border: 0;
      background: transparent;
      border-radius: 9px;
      cursor: pointer;
      font-size: 17px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #715d4f;
    }

    .auth-password-toggle:hover {
      background: rgba(197,139,74,.10);
    }

    .auth-button {
      width: 100%;
      border: 0;
      border-radius: 13px;
      padding: 13px 16px;
      font-size: 14px;
      font-weight: 800;
      cursor: pointer;
      transition: .2s ease;
      margin-top: 4px;
    }

    .auth-button.primary {
      background: #b97d48;
      color: white;
    }

    .auth-button.primary:hover {
      filter: brightness(.96);
      transform: translateY(-1px);
    }

    .auth-button.secondary {
      background: transparent;
      color: #986737;
      border: 1px solid #d9b58e;
    }

    .auth-button.secondary:hover {
      background: #fff2df;
    }

    .auth-message {
      display: none;
      border-radius: 12px;
      padding: 11px 13px;
      font-size: 13px;
      line-height: 1.45;
      margin-bottom: 4px;
    }

    .auth-message.show {
      display: block;
    }

    .auth-message.error {
      background: #fff0ee;
      border: 1px solid #f0c1ba;
      color: #9d4337;
    }

    .auth-message.success {
      background: #eef8ea;
      border: 1px solid #c3ddb8;
      color: #4e773d;
    }

    .auth-divider {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 18px 0;
      color: #a08f82;
      font-size: 12px;
    }

    .auth-divider::before,
    .auth-divider::after {
      content: "";
      flex: 1;
      height: 1px;
      background: #e3d7ca;
    }

    .auth-back {
      text-align: center;
      margin-top: 14px;
      font-size: 13px;
      color: #806f65;
    }

    .auth-link {
      border: 0;
      background: none;
      padding: 0;
      margin: 0;
      color: #a66d38;
      font-weight: 800;
      cursor: pointer;
      font-size: inherit;
    }

    .auth-link:hover {
      text-decoration: underline;
    }

    .auth-note {
      margin-top: 5px;
      font-size: 11px;
      line-height: 1.45;
      color: #9b8b7f;
    }

    .auth-loading {
      opacity: .7;
      pointer-events: none;
    }

    @media (max-width: 520px) {
      .auth-page {
        padding: 14px;
      }

      .auth-card {
        padding: 24px 18px;
        border-radius: 22px;
      }
    }
  `;

  document.head.appendChild(style);
}


/* =========================================================
   HELPERS
   ========================================================= */

function authEscapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function setAuthMessage(message, type = "error") {
  const box = document.getElementById("authMessage");

  if (!box) return;

  box.textContent = message || "";
  box.className = `auth-message show ${type}`;
}


function clearAuthMessage() {
  const box = document.getElementById("authMessage");

  if (!box) return;

  box.textContent = "";
  box.className = "auth-message";
}


/* =========================================================
   LOGIN PAGE
   ========================================================= */

function renderLoginPage() {
  injectAuthStyles();

  const app = document.getElementById("app");

  if (!app) {
    console.error("Element #app tidak ditemukan.");
    return;
  }

  app.innerHTML = `
    <div class="auth-page">
      <div class="auth-card">

        <div class="auth-logo-wrap">
          <img
            src="logo-gantari.png"
            alt="Gantari"
            class="auth-logo"
            onerror="this.style.display='none'"
          >
        </div>

        <div class="auth-title">
          Selamat Datang di Gantariku
        </div>

        <div class="auth-subtitle">
          Rumah Belajar Inklusi
        </div>

        <form id="loginForm" class="auth-form">

          <div id="authMessage" class="auth-message"></div>

          <div class="auth-field">
            <label for="loginEmail">
              Email
            </label>

            <input
              id="loginEmail"
              type="email"
              class="auth-input"
              placeholder="Masukkan email"
              autocomplete="email"
              required
            >
          </div>

          <div class="auth-field">

            <label for="loginPassword">
              Password
            </label>

            <div class="auth-input-wrap">

              <input
                id="loginPassword"
                type="password"
                class="auth-input password-input"
                placeholder="Masukkan password"
                autocomplete="current-password"
                required
              >

              <button
                type="button"
                class="auth-password-toggle"
                onclick="togglePassword('loginPassword', this)"
                aria-label="Tampilkan password"
              >👁</button>

            </div>

          </div>

          <button
            type="submit"
            id="loginButton"
            class="auth-button primary"
          >
            Masuk
          </button>

        </form>

        <div class="auth-divider">
          atau
        </div>

        <button
          type="button"
          class="auth-button secondary"
          onclick="renderRegister()"
        >
          Daftar sebagai Orang Tua
        </button>

        <div class="auth-note">
          Akun orang tua dapat digunakan untuk menghubungkan
          anak menggunakan kode akses dari sekolah.
        </div>

      </div>
    </div>
  `;

  const form = document.getElementById("loginForm");

  if (form) {
    form.addEventListener("submit", handleLogin);
  }
}


/* =========================================================
   LOGIN
   ========================================================= */

async function handleLogin(event) {
  event.preventDefault();

  clearAuthMessage();

  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");
  const loginButton = document.getElementById("loginButton");

  if (!emailInput || !passwordInput || !loginButton) {
    return;
  }

  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  if (!email || !password) {
    setAuthMessage("Email dan password wajib diisi.");
    return;
  }

  loginButton.disabled = true;
  loginButton.textContent = "Memproses...";
  loginButton.classList.add("auth-loading");

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }

    if (!data?.user) {
      throw new Error("Akun tidak ditemukan.");
    }

    currentUser = data.user;

    const profile = await loadUserProfile(data.user.id);

    if (!profile) {
      await supabase.auth.signOut();

      currentUser = null;
      currentUserProfile = null;
      currentUserRole = null;

      throw new Error(
        "Profil pengguna belum ditemukan. Silakan hubungi admin sekolah."
      );
    }

    currentUserProfile = profile;
    currentUserRole = profile.role;

    /*
     * Pastikan role tersedia di NAV_CONFIG.
     */
    if (
      typeof NAV_CONFIG !== "undefined" &&
      NAV_CONFIG &&
      !NAV_CONFIG[currentUserRole]
    ) {
      await supabase.auth.signOut();

      currentUser = null;
      currentUserProfile = null;
      currentUserRole = null;

      throw new Error(
        "Role akun tidak dikenali oleh aplikasi."
      );
    }

    /*
     * Tentukan halaman awal berdasarkan role.
     */

    if (currentUserRole === "admin") {
      currentNav =
        typeof NAV_CONFIG !== "undefined" &&
        NAV_CONFIG.admin?.[0]?.id
          ? NAV_CONFIG.admin[0].id
          : "dashboard";

    } else if (currentUserRole === "guru") {
      currentNav =
        typeof NAV_CONFIG !== "undefined" &&
        NAV_CONFIG.guru?.[0]?.id
          ? NAV_CONFIG.guru[0].id
          : "inputAbsensi";

    } else if (currentUserRole === "ortu") {
      currentNav =
        typeof NAV_CONFIG !== "undefined" &&
        NAV_CONFIG.ortu?.[0]?.id
          ? NAV_CONFIG.ortu[0].id
          : "ringkasan";

    } else {
      currentNav = "dashboard";
    }

    /*
     * Render aplikasi utama.
     */
    if (typeof renderApp === "function") {
      renderApp();
    } else {
      throw new Error(
        "Fungsi renderApp tidak ditemukan."
      );
    }

  } catch (err) {
    console.error("Login error:", err);

    currentUser = null;
    currentUserProfile = null;
    currentUserRole = null;

    setAuthMessage(
      err?.message || "Login gagal. Periksa email dan password."
    );

  } finally {
    loginButton.disabled = false;
    loginButton.textContent = "Masuk";
    loginButton.classList.remove("auth-loading");
  }
}


/* =========================================================
   REGISTER PAGE ORANG TUA
   ========================================================= */

function renderRegister() {
  injectAuthStyles();

  const app = document.getElementById("app");

  if (!app) {
    console.error("Element #app tidak ditemukan.");
    return;
  }

  app.innerHTML = `
    <div class="auth-page">
      <div class="auth-card">

        <div class="auth-logo-wrap">
          <img
            src="logo-gantari.png"
            alt="Gantari"
            class="auth-logo"
            onerror="this.style.display='none'"
          >
        </div>

        <div class="auth-title">
          Daftar Akun Orang Tua
        </div>

        <div class="auth-subtitle">
          Buat akun untuk memantau perkembangan dan
          pembayaran anak di Gantariku.
        </div>

        <form id="registerForm" class="auth-form">

          <div id="authMessage" class="auth-message"></div>

          <div class="auth-field">

            <label for="registerNama">
              Nama Orang Tua
            </label>

            <input
              id="registerNama"
              type="text"
              class="auth-input"
              placeholder="Nama lengkap"
              autocomplete="name"
              required
            >

          </div>

          <div class="auth-field">

            <label for="registerEmail">
              Email
            </label>

            <input
              id="registerEmail"
              type="email"
              class="auth-input"
              placeholder="Email aktif"
              autocomplete="email"
              required
            >

          </div>

          <div class="auth-field">

            <label for="registerPassword">
              Password
            </label>

            <div class="auth-input-wrap">

              <input
                id="registerPassword"
                type="password"
                class="auth-input password-input"
                placeholder="Minimal 8 karakter"
                autocomplete="new-password"
                minlength="8"
                required
              >

              <button
                type="button"
                class="auth-password-toggle"
                onclick="togglePassword('registerPassword', this)"
                aria-label="Tampilkan password"
              >👁</button>

            </div>

          </div>

          <div class="auth-field">

            <label for="registerPassword2">
              Ulangi Password
            </label>

            <div class="auth-input-wrap">

              <input
                id="registerPassword2"
                type="password"
                class="auth-input password-input"
                placeholder="Ketik ulang password"
                autocomplete="new-password"
                minlength="8"
                required
              >

              <button
                type="button"
                class="auth-password-toggle"
                onclick="togglePassword('registerPassword2', this)"
                aria-label="Tampilkan password"
              >👁</button>

            </div>

          </div>

          <button
            type="submit"
            id="registerButton"
            class="auth-button primary"
          >
            Buat Akun
          </button>

        </form>

        <div class="auth-back">
          Sudah punya akun?
          <button
            type="button"
            class="auth-link"
            onclick="renderLogin()"
          >
            Kembali ke Login
          </button>
        </div>

      </div>
    </div>
  `;

  const form = document.getElementById("registerForm");

  if (form) {
    form.addEventListener("submit", handleRegister);
  }
}


/* =========================================================
   REGISTER ORANG TUA
   ========================================================= */

async function handleRegister(event) {
  event.preventDefault();

  clearAuthMessage();

  const namaInput = document.getElementById("registerNama");
  const emailInput = document.getElementById("registerEmail");
  const passwordInput = document.getElementById("registerPassword");
  const password2Input = document.getElementById("registerPassword2");
  const registerButton = document.getElementById("registerButton");

  if (
    !namaInput ||
    !emailInput ||
    !passwordInput ||
    !password2Input ||
    !registerButton
  ) {
    return;
  }

  const nama = namaInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;
  const password2 = password2Input.value;

  if (!nama) {
    setAuthMessage("Nama orang tua wajib diisi.");
    return;
  }

  if (!email) {
    setAuthMessage("Email wajib diisi.");
    return;
  }

  if (password.length < 8) {
    setAuthMessage(
      "Password minimal 8 karakter."
    );
    return;
  }

  if (password !== password2) {
    setAuthMessage(
      "Konfirmasi password tidak sama."
    );
    return;
  }

  registerButton.disabled = true;
  registerButton.textContent = "Membuat akun...";
  registerButton.classList.add("auth-loading");

  try {

    /*
     * registration_type = ortu
     * akan dibaca oleh trigger Supabase:
     * handle_new_ortu_user()
     *
     * Trigger tersebut membuat:
     * public.pengguna.role = 'ortu'
     */

    const { data, error } = await supabase.auth.signUp({
      email,
      password,

      options: {
        data: {
          nama,
          registration_type: "ortu"
        }
      }
    });

    if (error) {
      throw error;
    }

    if (!data?.user) {
      throw new Error(
        "Akun gagal dibuat."
      );
    }

    /*
     * Kita sengaja TIDAK menunggu verifikasi email.
     *
     * Dengan Confirm Email OFF di Supabase,
     * signup akan langsung mendapatkan session.
     */

    if (!data.session) {
      throw new Error(
        "Akun berhasil dibuat, tetapi belum bisa langsung masuk. Pastikan Confirm Email di Supabase sudah OFF."
      );
    }

    currentUser = data.user;

    /*
     * Beri sedikit waktu agar trigger database selesai
     * membuat profil pengguna.
     */

    let profile = null;

    for (let i = 0; i < 5; i++) {
      profile = await loadUserProfile(data.user.id);

      if (profile) break;

      await new Promise(resolve =>
        setTimeout(resolve, 500)
      );
    }

    if (!profile) {

      /*
       * Jangan langsung signOut.
       * Bisa saja trigger membutuhkan waktu sedikit lebih lama.
       */

      throw new Error(
        "Akun berhasil dibuat, tetapi profil orang tua belum ditemukan. Silakan coba masuk kembali beberapa saat lagi."
      );
    }

    /*
     * Pastikan role memang orang tua.
     */

    if (profile.role !== "ortu") {

      await supabase.auth.signOut();

      currentUser = null;
      currentUserProfile = null;
      currentUserRole = null;

      throw new Error(
        "Akun berhasil dibuat tetapi role akun tidak sesuai."
      );
    }

    currentUserProfile = profile;
    currentUserRole = "ortu";

    /*
     * Halaman awal orang tua.
     */

    currentNav =
      typeof NAV_CONFIG !== "undefined" &&
      NAV_CONFIG.ortu?.[0]?.id
        ? NAV_CONFIG.ortu[0].id
        : "ringkasan";

    /*
     * Masuk ke aplikasi.
     */

    if (typeof renderApp === "function") {

      renderApp();

      /*
       * Setelah masuk, tampilkan sedikit notifikasi
       * bila tersedia.
       */

      setTimeout(() => {

        if (
          typeof showToast === "function"
        ) {
          showToast(
            "Akun orang tua berhasil dibuat."
          );
        }

      }, 400);

    } else {

      throw new Error(
        "Fungsi renderApp tidak ditemukan."
      );

    }

  } catch (err) {

    console.error(
      "Register orang tua error:",
      err
    );

    currentUser = null;
    currentUserProfile = null;
    currentUserRole = null;

    setAuthMessage(
      err?.message ||
      "Pendaftaran gagal. Silakan coba lagi."
    );

  } finally {

    registerButton.disabled = false;
    registerButton.textContent = "Buat Akun";
    registerButton.classList.remove("auth-loading");

  }
}


/* =========================================================
   LOGOUT
   ========================================================= */

async function logout() {

  try {

    /*
     * Matikan realtime terlebih dahulu
     * supaya tidak ada subscription tertinggal.
     */

    if (
      typeof stopRealtimeNotifications === "function"
    ) {
      try {
        await stopRealtimeNotifications();
      } catch (err) {
        console.warn(
          "Gagal menghentikan realtime notifications:",
          err
        );
      }
    }

    /*
     * Sign out Supabase.
     */

    const { error } =
      await supabase.auth.signOut();

    if (error) {
      console.error(
        "Supabase logout error:",
        error
      );
    }

  } catch (err) {

    console.error(
      "Logout error:",
      err
    );

  } finally {

    /*
     * Bersihkan seluruh state user.
     */

    currentUser = null;
    currentUserProfile = null;
    currentUserRole = null;

    if (typeof anakOrangTuaList !== "undefined") {
      try {
        anakOrangTuaList = [];
      } catch (e) {}
    }

    if (typeof anakTerpilihId !== "undefined") {
      try {
        anakTerpilihId = null;
      } catch (e) {}
    }

    /*
     * Kembali ke login.
     */

    renderLoginPage();

  }
}


/* =========================================================
   SESSION CHECK SAAT HALAMAN DIBUKA
   ========================================================= */

async function checkExistingSession() {

  try {

    const {
      data: {
        session
      }
    } = await supabase.auth.getSession();

    if (!session?.user) {
      renderLoginPage();
      return;
    }

    currentUser = session.user;

    const profile =
      await loadUserProfile(
        session.user.id
      );

    if (!profile) {

      await supabase.auth.signOut();

      currentUser = null;
      currentUserProfile = null;
      currentUserRole = null;

      renderLoginPage();

      setTimeout(() => {

        setAuthMessage(
          "Profil pengguna tidak ditemukan. Silakan hubungi admin sekolah."
        );

      }, 100);

      return;
    }

    currentUserProfile = profile;
    currentUserRole = profile.role;

    /*
     * Tentukan halaman awal.
     */

    if (currentUserRole === "admin") {

      currentNav =
        typeof NAV_CONFIG !== "undefined" &&
        NAV_CONFIG.admin?.[0]?.id
          ? NAV_CONFIG.admin[0].id
          : "dashboard";

    } else if (currentUserRole === "guru") {

      currentNav =
        typeof NAV_CONFIG !== "undefined" &&
        NAV_CONFIG.guru?.[0]?.id
          ? NAV_CONFIG.guru[0].id
          : "inputAbsensi";

    } else if (currentUserRole === "ortu") {

      currentNav =
        typeof NAV_CONFIG !== "undefined" &&
        NAV_CONFIG.ortu?.[0]?.id
          ? NAV_CONFIG.ortu[0].id
          : "ringkasan";

    } else {

      await supabase.auth.signOut();

      currentUser = null;
      currentUserProfile = null;
      currentUserRole = null;

      renderLoginPage();

      setTimeout(() => {

        setAuthMessage(
          "Role akun tidak dikenali oleh aplikasi."
        );

      }, 100);

      return;
    }

    /*
     * Tampilkan aplikasi.
     */

    if (typeof renderApp === "function") {
      renderApp();
    } else {
      renderLoginPage();

      setTimeout(() => {
        setAuthMessage(
          "Aplikasi belum siap dimuat. Periksa fungsi renderApp()."
        );
      }, 100);
    }

  } catch (err) {

    console.error(
      "Session check error:",
      err
    );

    currentUser = null;
    currentUserProfile = null;
    currentUserRole = null;

    renderLoginPage();
  }
}


/* =========================================================
   AUTH STATE LISTENER
   ========================================================= */

function initAuthListener() {

  if (
    typeof supabase === "undefined" ||
    !supabase?.auth
  ) {
    console.error(
      "Supabase belum tersedia."
    );
    return;
  }

  /*
   * Listener hanya untuk menjaga state session.
   *
   * Tidak melakukan render berulang ketika
   * SIGNED_IN dipicu setelah login karena
   * handleLogin sendiri sudah melakukan renderApp().
   */

  supabase.auth.onAuthStateChange(
    async (event, session) => {

      console.log(
        "Auth state:",
        event
      );

      if (event === "SIGNED_OUT") {

        currentUser = null;
        currentUserProfile = null;
        currentUserRole = null;

        return;
      }

      /*
       * INITIAL_SESSION hanya perlu memastikan
       * session awal terbaca.
       */

      if (
        event === "INITIAL_SESSION" &&
        !currentUser &&
        session?.user
      ) {

        try {

          currentUser = session.user;

          const profile =
            await loadUserProfile(
              session.user.id
            );

          if (profile) {

            currentUserProfile = profile;
            currentUserRole = profile.role;

            if (
              typeof renderApp === "function"
            ) {
              currentNav =
                currentUserRole === "ortu"
                  ? (
                      typeof NAV_CONFIG !== "undefined" &&
                      NAV_CONFIG.ortu?.[0]?.id
                        ? NAV_CONFIG.ortu[0].id
                        : "ringkasan"
                    )
                  : (
                      typeof NAV_CONFIG !== "undefined" &&
                      NAV_CONFIG[currentUserRole]?.[0]?.id
                        ? NAV_CONFIG[currentUserRole][0].id
                        : "dashboard"
                    );

              renderApp();

            } else {

              renderLoginPage();

            }

          } else {

            await supabase.auth.signOut();

            currentUser = null;
            currentUserProfile = null;
            currentUserRole = null;

            renderLoginPage();

          }

        } catch (err) {

          console.error(
            "INITIAL_SESSION error:",
            err
          );

          renderLoginPage();
        }
      }
    }
  );
}


/* =========================================================
   GLOBAL WINDOW EXPORT
   Supaya bisa dipanggil dari HTML / inline onclick
   ========================================================= */

window.renderLogin = renderLoginPage;
window.renderLoginPage = renderLoginPage;
window.renderRegister = renderRegister;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.togglePassword = togglePassword;
window.logout = logout;
window.loadUserProfile = loadUserProfile;
window.checkExistingSession = checkExistingSession;


/* =========================================================
   INIT
   ========================================================= */

(function initAuth() {

  /*
   * Tunggu DOM jika diperlukan.
   */

  const start = () => {

    /*
     * Pastikan fungsi tidak dijalankan sebelum Supabase siap.
     */

    if (
      typeof supabase === "undefined" ||
      !supabase?.auth
    ) {
      console.error(
        "Supabase client belum tersedia saat auth.js dijalankan."
      );
      return;
    }

    injectAuthStyles();

    initAuthListener();

    checkExistingSession();
  };

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      start,
      { once: true }
    );
  } else {
    start();
  }

})();
