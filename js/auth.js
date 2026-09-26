/* ============================================================
   GANTARIKU - AUTH.JS
   Login + Register Orang Tua
   Cocok dengan app.js saat ini
   Logo tidak memakai file eksternal
   ============================================================ */


/* ============================================================
   LOAD PROFILE PENGGUNA
   ============================================================ */

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

      console.error(
        "Profile error:",
        error
      );

      return null;
    }

    return data || null;

  } catch (error) {

    console.error(
      "loadUserProfile error:",
      error
    );

    return null;
  }
}


/* ============================================================
   TOGGLE PASSWORD
   ============================================================ */

function togglePassword(inputId, button) {

  const input =
    document.getElementById(inputId);

  if (!input || !button) return;

  if (input.type === "password") {

    input.type = "text";

    button.textContent = "🙈";

    button.setAttribute(
      "aria-label",
      "Sembunyikan password"
    );

  } else {

    input.type = "password";

    button.textContent = "👁";

    button.setAttribute(
      "aria-label",
      "Tampilkan password"
    );

  }
}


/* ============================================================
   STYLE
   ============================================================ */

function injectAuthStyles() {
  // CSS autentikasi dimuat dari css/style.css.
}


/* ============================================================
   REGISTER PAGE
   ============================================================ */

function renderRegister() {

  injectAuthStyles();

  const app =
    document.getElementById(
      "app"
    );

  if (!app) return;


  app.innerHTML = `

    <div class="gtr-auth-page">

      <div class="gtr-auth-card">

        ${renderGantariBrand()}


        <h1 class="gtr-auth-title">
          Daftar Akun Orang Tua
        </h1>


        <p class="gtr-auth-subtitle">
          Buat akun untuk memantau
          anak melalui Gantariku.
        </p>


        <div
          id="authMessage"
          class="gtr-auth-message"
        ></div>


        <form
          id="registerForm"
          class="gtr-auth-form"
        >

          <div class="gtr-auth-field">

            <label for="registerNama">
              Nama Orang Tua
            </label>

            <input
              type="text"
              id="registerNama"
              class="gtr-auth-input"
              placeholder="Nama lengkap"
              autocomplete="name"
              required
            >

          </div>


          <div class="gtr-auth-field">

            <label for="registerEmail">
              Email
            </label>

            <input
              type="email"
              id="registerEmail"
              class="gtr-auth-input"
              placeholder="Email aktif"
              autocomplete="email"
              required
            >

          </div>


          <div class="gtr-auth-field">

            <label for="registerPassword">
              Password
            </label>

            <div class="gtr-auth-input-wrap">

              <input
                type="password"
                id="registerPassword"
                class="gtr-auth-input password-input"
                placeholder="Minimal 8 karakter"
                autocomplete="new-password"
                minlength="8"
                required
              >

              <button
                type="button"
                class="gtr-auth-eye"
                onclick="
                  togglePassword(
                    'registerPassword',
                    this
                  )
                "
                aria-label="Tampilkan password"
              >
                👁
              </button>

            </div>

          </div>


          <div class="gtr-auth-field">

            <label for="registerPassword2">
              Ulangi Password
            </label>

            <div class="gtr-auth-input-wrap">

              <input
                type="password"
                id="registerPassword2"
                class="gtr-auth-input password-input"
                placeholder="Ulangi password"
                autocomplete="new-password"
                minlength="8"
                required
              >

              <button
                type="button"
                class="gtr-auth-eye"
                onclick="
                  togglePassword(
                    'registerPassword2',
                    this
                  )
                "
                aria-label="Tampilkan password"
              >
                👁
              </button>

            </div>

          </div>


          <button
            type="submit"
            id="registerButton"
            class="gtr-auth-button gtr-auth-primary"
          >
            Buat Akun
          </button>

        </form>


        <div class="gtr-auth-back">

          Sudah punya akun?

          <button
            type="button"
            class="gtr-auth-link"
            onclick="renderLogin()"
          >
            Kembali ke Login
          </button>

        </div>

      </div>

    </div>

  `;


  const form =
    document.getElementById(
      "registerForm"
    );

  if (form) {

    form.addEventListener(
      "submit",
      handleRegister
    );

  }
}


/* ============================================================
   REGISTER HANDLER
   ============================================================ */

async function handleRegister(event) {

  event.preventDefault();

  clearAuthMessage();


  const namaInput =
    document.getElementById(
      "registerNama"
    );

  const emailInput =
    document.getElementById(
      "registerEmail"
    );

  const passwordInput =
    document.getElementById(
      "registerPassword"
    );

  const password2Input =
    document.getElementById(
      "registerPassword2"
    );

  const button =
    document.getElementById(
      "registerButton"
    );


  if (
    !namaInput ||
    !emailInput ||
    !passwordInput ||
    !password2Input ||
    !button
  ) {
    return;
  }


  const nama =
    namaInput.value.trim();

  const email =
    emailInput.value
      .trim()
      .toLowerCase();

  const password =
    passwordInput.value;

  const password2 =
    password2Input.value;


  if (!nama) {

    setAuthMessage(
      "Nama orang tua wajib diisi."
    );

    return;
  }


  if (!email) {

    setAuthMessage(
      "Email wajib diisi."
    );

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
      "Password dan konfirmasi password tidak sama."
    );

    return;
  }


  button.disabled = true;

  button.textContent =
    "Membuat akun...";

  button.classList.add(
    "gtr-auth-loading"
  );


  try {

    const {
      data,
      error
    } =
      await supabase.auth.signUp({

        email,

        password,

        options: {

          data: {

            nama: nama,

            registration_type:
              "ortu"

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
     * Confirm Email harus OFF.
     */

    if (!data.session) {

      throw new Error(
        "Akun berhasil dibuat tetapi belum langsung masuk. Pastikan Confirm Email di Supabase sudah OFF."
      );

    }


    currentUser =
      data.user;


    /*
     * Tunggu trigger
     * membuat profile pengguna.
     */

    let profile =
      null;


    for (
      let i = 0;
      i < 8;
      i++
    ) {

      profile =
        await loadUserProfile(
          data.user.id
        );


      if (profile) {
        break;
      }


      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            500
          )
      );

    }


    if (!profile) {

      throw new Error(
        "Akun berhasil dibuat, tetapi profil orang tua belum siap. Coba login kembali."
      );

    }


    if (
      profile.role !==
      "ortu"
    ) {

      await supabase.auth.signOut();

      currentUser = null;

      currentUserRole = null;

      throw new Error(
        "Role akun tidak sesuai."
      );

    }


    currentUser =
      profile;

    currentUserRole =
      "ortu";


    currentNav =
      NAV_CONFIG.ortu?.[0]?.id ||
      "ringkasan";


    renderApp();


    if (
      typeof startRealtimeNotifications ===
      "function"
    ) {

      try {

        startRealtimeNotifications();

      } catch (error) {

        console.warn(
          "Realtime gagal dimulai:",
          error
        );

      }

    }


    if (
      typeof showToast ===
      "function"
    ) {

      setTimeout(() => {

        try {

          showToast(
            "Akun orang tua berhasil dibuat."
          );

        } catch (e) {}

      }, 500);

    }


  } catch (error) {

    console.error(
      "Register error:",
      error
    );


    setAuthMessage(
      error?.message ||
      "Pendaftaran gagal."
    );


  } finally {

    button.disabled = false;

    button.textContent =
      "Buat Akun";

    button.classList.remove(
      "gtr-auth-loading"
    );

  }
}


/* ============================================================
   LOGOUT
   ============================================================ */

async function logout() {

  try {

    if (
      typeof stopRealtimeNotifications ===
      "function"
    ) {

      try {

        await stopRealtimeNotifications();

      } catch (error) {

        console.warn(
          "Realtime gagal dihentikan:",
          error
        );

      }

    }


    if (
      typeof supabase !==
      "undefined" &&
      supabase?.auth
    ) {

      const {
        error
      } =
        await supabase.auth
          .signOut();


      if (error) {

        console.error(
          "Supabase logout error:",
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


    try {

      if (
        typeof anakOrangTuaList !==
        "undefined"
      ) {

        anakOrangTuaList = [];

      }

    } catch (e) {}


    try {

      if (
        typeof anakTerpilihId !==
        "undefined"
      ) {

        anakTerpilihId = null;

      }

    } catch (e) {}


    renderLogin();

  }
}


/* ============================================================
   EXPORT GLOBAL
   ============================================================ */

window.loadUserProfile =
  loadUserProfile;

window.togglePassword =
  togglePassword;

window.renderLoginPage =
  renderLoginPage;

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


/* ============================================================
   END AUTH.JS
   ============================================================ */
