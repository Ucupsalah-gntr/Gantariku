// ============================================================
// GANTARIKU — AUTH
// LOGIN + DAFTAR ORANG TUA
// ============================================================

// ============================================================
// LOAD PROFILE
// ============================================================

async function loadUserProfile(userId) {
  if (!supabase) {
    throw new Error(
      "Supabase belum terhubung."
    );
  }

  const {
    data,
    error,
  } = await supabase
    .from("pengguna")
    .select(
      "id,user_id,nama,email,role"
    )
    .eq(
      "user_id",
      userId
    )
    .single();

  if (error) {
    console.error(
      "Profile error:",
      error
    );

    throw new Error(
      "Profil pengguna tidak ditemukan atau tidak dapat diakses."
    );
  }

  if (!data) {
    throw new Error(
      "Profil pengguna tidak ditemukan."
    );
  }

  return data;
}

// ============================================================
// LOGIN PAGE
// ============================================================

function renderLoginPage() {
  return `
    <div class="login-container">

      <div class="login-box">

        <div class="login-header">

          <div class="login-brand">

            <h1>Gantariku</h1>

            <p>
              Rumah Belajar Inklusi
            </p>

          </div>

        </div>

        <div
          class="error-msg"
          id="loginError"
        ></div>

        <form
          class="login-form"
          id="loginForm"
        >

          <div class="form-group">

            <label for="email">
              Email
            </label>

            <input
              type="email"
              id="email"
              placeholder="nama@email.com"
              autocomplete="email"
              required
            >

          </div>

          <div class="form-group">

            <label for="password">
              Password
            </label>

            <input
              type="password"
              id="password"
              placeholder="Masukkan password"
              autocomplete="current-password"
              required
            >

          </div>

          <button
            type="submit"
            class="login-btn"
            id="loginBtn"
          >
            <span id="loginBtnText">
              Masuk
            </span>
          </button>

        </form>

        <div
          style="
            margin-top:18px;
            padding-top:17px;
            border-top:1px solid rgba(100,80,60,.12);
            text-align:center;
          "
        >

          <div
            style="
              color:#776d63;
              font-size:12px;
              margin-bottom:7px;
            "
          >
            Belum punya akun?
          </div>

          <button
            type="button"
            id="btnRegisterOrtu"
            class="login-register-link"
            style="
              border:0;
              background:none;
              cursor:pointer;
            "
          >
            Daftar sebagai Orang Tua
          </button>

        </div>

      </div>

    </div>
  `;
}

// ============================================================
// RENDER LOGIN
// ============================================================

function renderLogin() {

  const app =
    document.getElementById(
      "app"
    );

  if (!app) return;

  app.innerHTML =
    renderLoginPage();

  const form =
    document.getElementById(
      "loginForm"
    );

  if (form) {
    form.addEventListener(
      "submit",
      handleLogin
    );
  }

  document
    .getElementById(
      "btnRegisterOrtu"
    )
    ?.addEventListener(
      "click",
      renderRegister
    );
}

// ============================================================
// LOGIN
// ============================================================

async function handleLogin(
  e
) {

  e.preventDefault();

  const email =
    document.getElementById(
      "email"
    )?.value
      ?.trim();

  const password =
    document.getElementById(
      "password"
    )?.value || "";

  const errorEl =
    document.getElementById(
      "loginError"
    );

  const btnEl =
    document.getElementById(
      "loginBtn"
    );

  const btnText =
    document.getElementById(
      "loginBtnText"
    );

  if (errorEl) {
    errorEl.textContent = "";
    errorEl.classList.remove(
      "show"
    );
  }

  if (
    !email ||
    !password
  ) {

    if (errorEl) {
      errorEl.textContent =
        "Email dan password harus diisi.";

      errorEl.classList.add(
        "show"
      );
    }

    return;
  }

  if (btnEl) {
    btnEl.disabled = true;
  }

  if (btnText) {
    btnText.innerHTML =
      '<span class="loading-spinner"></span>Memproses...';
  }

  try {

    if (!supabase) {
      throw new Error(
        "Tidak dapat terhubung ke server."
      );
    }

    const {
      data: authData,
      error: authError,
    } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      throw new Error(
        "Email atau password salah."
      );
    }

    if (!authData?.user) {
      throw new Error(
        "User tidak ditemukan."
      );
    }

    const profile =
      await loadUserProfile(
        authData.user.id
      );

    currentUser =
      profile;

    currentUserRole =
      profile.role;

    const menuRole =
      NAV_CONFIG[
        currentUserRole
      ];

    if (
      !menuRole ||
      !menuRole.length
    ) {

      await supabase.auth.signOut();

      throw new Error(
        "Role akun tidak dikenali."
      );
    }

    currentNav =
      menuRole[0].id;

    renderApp();

  } catch (error) {

    console.error(
      "Login error:",
      error
    );

    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (_) {}
    }

    if (errorEl) {

      errorEl.textContent =
        error?.message ||
        "Terjadi kesalahan saat login.";

      errorEl.classList.add(
        "show"
      );
    }

  } finally {

    if (btnEl) {
      btnEl.disabled = false;
    }

    if (btnText) {
      btnText.textContent =
        "Masuk";
    }
  }
}

// ============================================================
// REGISTER ORANG TUA
// ============================================================

function renderRegister() {

  const app =
    document.getElementById(
      "app"
    );

  if (!app) return;

  app.innerHTML = `

    <div class="login-container">

      <div class="login-box">

        <div class="login-header">

          <div class="login-brand">

            <h1>Daftar Akun</h1>

            <p>
              Orang Tua · Gantariku
            </p>

          </div>

        </div>

        <div
          id="registerError"
          class="error-msg"
        ></div>

        <div
          id="registerSuccess"
          style="
            display:none;
            margin-bottom:14px;
            padding:11px 12px;
            border-radius:10px;
            background:#EAF7E9;
            color:#2D8B43;
            font-size:12px;
            line-height:1.5;
          "
        ></div>

        <form
          id="registerForm"
          class="login-form"
        >

          <div class="form-group">

            <label for="registerNama">
              Nama Orang Tua
            </label>

            <input
              type="text"
              id="registerNama"
              placeholder="Nama lengkap"
              autocomplete="name"
              required
            >

          </div>

          <div class="form-group">

            <label for="registerEmail">
              Email
            </label>

            <input
              type="email"
              id="registerEmail"
              placeholder="nama@email.com"
              autocomplete="email"
              required
            >

          </div>

          <div class="form-group">

            <label for="registerPassword">
              Password
            </label>

            <input
              type="password"
              id="registerPassword"
              placeholder="Minimal 8 karakter"
              autocomplete="new-password"
              minlength="8"
              required
            >

          </div>

          <div class="form-group">

            <label for="registerPassword2">
              Ulangi Password
            </label>

            <input
              type="password"
              id="registerPassword2"
              placeholder="Ulangi password"
              autocomplete="new-password"
              minlength="8"
              required
            >

          </div>

          <button
            type="submit"
            class="login-btn"
            id="registerBtn"
          >
            <span id="registerBtnText">
              Buat Akun
            </span>
          </button>

        </form>

        <div
          style="
            margin-top:18px;
            text-align:center;
          "
        >

          <button
            type="button"
            class="login-register-link"
            id="btnBackLogin"
            style="
              border:0;
              background:none;
              cursor:pointer;
            "
          >
            ← Kembali ke Login
          </button>

        </div>

      </div>

    </div>
  `;

  document
    .getElementById(
      "registerForm"
    )
    ?.addEventListener(
      "submit",
      handleRegister
    );

  document
    .getElementById(
      "btnBackLogin"
    )
    ?.addEventListener(
      "click",
      renderLogin
    );
}

// ============================================================
// REGISTER HANDLER
// ============================================================

async function handleRegister(
  e
) {

  e.preventDefault();

  const nama =
    document.getElementById(
      "registerNama"
    )?.value
      ?.trim();

  const email =
    document.getElementById(
      "registerEmail"
    )?.value
      ?.trim();

  const password =
    document.getElementById(
      "registerPassword"
    )?.value || "";

  const password2 =
    document.getElementById(
      "registerPassword2"
    )?.value || "";

  const errorEl =
    document.getElementById(
      "registerError"
    );

  const successEl =
    document.getElementById(
      "registerSuccess"
    );

  const btn =
    document.getElementById(
      "registerBtn"
    );

  const btnText =
    document.getElementById(
      "registerBtnText"
    );

  if (errorEl) {
    errorEl.textContent = "";
    errorEl.classList.remove(
      "show"
    );
  }

  if (successEl) {
    successEl.style.display =
      "none";

    successEl.textContent =
      "";
  }

  if (!nama) {
    tampilkanErrorRegister(
      "Nama orang tua wajib diisi."
    );
    return;
  }

  if (!email) {
    tampilkanErrorRegister(
      "Email wajib diisi."
    );
    return;
  }

  if (
    password.length < 8
  ) {
    tampilkanErrorRegister(
      "Password minimal 8 karakter."
    );
    return;
  }

  if (
    password !== password2
  ) {
    tampilkanErrorRegister(
      "Konfirmasi password tidak sama."
    );
    return;
  }

  if (!supabase) {
    tampilkanErrorRegister(
      "Supabase belum terhubung."
    );
    return;
  }

  if (btn) {
    btn.disabled = true;
  }

  if (btnText) {
    btnText.innerHTML =
      '<span class="loading-spinner"></span>Membuat akun...';
  }

  try {

    const redirectUrl =
      window.location.origin;

    const {
      data,
      error,
    } =
      await supabase.auth.signUp({

        email,

        password,

        options: {

          data: {

            nama,

            /*
             * Penting:
             * database hanya membuat profile
             * otomatis sebagai "ortu"
             * bila registration_type = "ortu".
             */

            registration_type:
              "ortu",

          },

          emailRedirectTo:
            redirectUrl,

        },

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
     * Bila email confirmation aktif,
     * session biasanya belum tersedia.
     */

    if (!data.session) {

      if (successEl) {

        successEl.innerHTML =
          `
            ✅ Akun berhasil dibuat.<br>
            Silakan buka email Anda dan
            klik tautan verifikasi.
            Setelah itu kembali ke Gantariku
            dan login.
          `;

        successEl.style.display =
          "block";
      }

      return;
    }

    /*
     * Autoconfirm aktif:
     * langsung login.
     */

    const profile =
      await loadUserProfile(
        data.user.id
      );

    currentUser =
      profile;

    currentUserRole =
      profile.role;

    currentNav =
      NAV_CONFIG.ortu?.[0]?.id ||
      "ringkasan";

    renderApp();

  } catch (error) {

    console.error(
      "Register error:",
      error
    );

    tampilkanErrorRegister(
      error?.message ||
      "Gagal membuat akun."
    );

  } finally {

    if (btn) {
      btn.disabled = false;
    }

    if (btnText) {
      btnText.textContent =
        "Buat Akun";
    }
  }
}

// ============================================================
// ERROR REGISTER
// ============================================================

function tampilkanErrorRegister(
  message
) {

  const el =
    document.getElementById(
      "registerError"
    );

  if (!el) return;

  el.textContent =
    message;

  el.classList.add(
    "show"
  );
}

// ============================================================
// LOGOUT
// ============================================================

async function logout() {

  try {

    if (
      typeof stopRealtimeNotifications ===
      "function"
    ) {
      stopRealtimeNotifications();
    }

  } catch (error) {

    console.error(
      "Stop realtime error:",
      error
    );

  }

  try {

    if (supabase) {

      const {
        error,
      } =
        await supabase.auth.signOut();

      if (error) {
        console.error(
          "Logout error:",
          error
        );
      }
    }

  } catch (error) {

    console.error(
      "Logout error:",
      error
    );

  } finally {

    currentUser = null;
    currentUserRole = null;
    currentNav = "dasbor";

    anakOrangTuaList = [];
    anakTerpilihId = null;

    renderLogin();
  }
}

// ============================================================
// GLOBAL
// ============================================================

window.renderLogin =
  renderLogin;

window.renderRegister =
  renderRegister;

window.handleLogin =
  handleLogin;

window.handleRegister =
  handleRegister;

window.logout =
  logout;
