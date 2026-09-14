// ============================================================
// GANTARIKU — DATA SISWA
// ============================================================

async function loadOrangTuaUntukForm(selectedId = "") {
  const select = document.getElementById("siswaOrangTuaId");
  if (!select || !supabase) return;

  select.innerHTML = `<option value="">Memuat akun orang tua...</option>`;

  try {
    const { data, error } = await supabase
      .from("pengguna")
      .select("id, nama, email")
      .eq("role", "ortu")
      .order("nama", { ascending: true });

    if (error) throw error;

    semuaOrangTua = data || [];

    select.innerHTML =
      `<option value="">Tanpa akun orang tua</option>` +
      semuaOrangTua
        .map(
          (o) =>
            `<option value="${o.id}" ${
              String(o.id) === String(selectedId) ? "selected" : ""
            }>${o.nama || o.email || "Orang tua"} — ${o.email || ""}</option>`
        )
        .join("");
  } catch (error) {
    console.error("Error load akun orang tua:", error);
    select.innerHTML = `<option value="">Gagal memuat akun orang tua</option>`;
  }
}


// ============================================================
// VIEW DATA SISWA
// ============================================================

function renderSiswa() {
  return `
    <div class="section">
      <div class="section-head">
        <h2>Daftar Siswa</h2>

        <div class="controls">
          <input
            type="text"
            id="cariSiswa"
            placeholder="Cari nama, NIS, kelas..."
          >

          <button
            class="btn"
            onclick="window.__app.bukaFormSiswa()"
          >
            + Tambah Siswa
          </button>
        </div>
      </div>

      <div
        id="formSiswaContainer"
        style="display:none; padding:20px; border-bottom:1px solid var(--line);"
      >

        <h3 id="judulFormSiswa" style="margin-top:0;">
          Tambah Siswa Baru
        </h3>

        <form id="formSiswa">

          <input
            type="hidden"
            id="siswaId"
          >

          <div
            style="
              display:grid;
              grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
              gap:15px;
            "
          >

            <div class="form-group">
              <label>Nama Siswa</label>
              <input
                type="text"
                id="siswaNama"
                placeholder="Masukkan nama siswa"
                required
              >
            </div>

            <div class="form-group">
              <label>NIS</label>
              <input
                type="text"
                id="siswaNis"
                placeholder="Masukkan NIS"
                required
              >
            </div>

            <div class="form-group">
              <label>Kelas</label>
              <input
                type="text"
                id="siswaKelas"
                placeholder="Contoh: 7A"
                required
              >
            </div>

            <div class="form-group">
              <label>Tahun Ajaran</label>
              <input
                type="text"
                id="siswaTahunAjaran"
                placeholder="Contoh: 2026/2027"
              >
            </div>

            <div class="form-group">
              <label>Tanggal Lahir</label>
              <input
                type="date"
                id="siswaTanggalLahir"
              >
            </div>

            <div class="form-group">
              <label>Jenis Kelamin</label>

              <select id="siswaJenisKelamin">
                <option value="">Pilih jenis kelamin</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            <div class="form-group">
              <label>Nomor HP Orang Tua</label>

              <input
                type="text"
                id="siswaNomorHpOrtu"
                placeholder="Contoh: 081234567890"
              >
            </div>

            <div class="form-group">
              <label>Akun Orang Tua</label>

              <select id="siswaOrangTuaId">
                <option value="">
                  Memuat akun orang tua...
                </option>
              </select>

              <small style="color:var(--ink-soft);">
                Hubungkan siswa dengan akun login orang tua
                agar data anak muncul otomatis.
              </small>
            </div>

            <div class="form-group">
              <label>Alamat</label>

              <input
                type="text"
                id="siswaAlamat"
                placeholder="Masukkan alamat"
              >
            </div>

          </div>

          <div
            style="
              display:flex;
              gap:10px;
              margin-top:20px;
            "
          >

            <button
              type="submit"
              class="btn"
              id="btnSimpanSiswa"
            >
              Simpan Siswa
            </button>

            <button
              type="button"
              class="btn ghost"
              onclick="window.__app.tutupFormSiswa()"
            >
              Batal
            </button>

          </div>
        </form>
      </div>

      <div class="section-body">

        <table>

          <thead>
            <tr>
              <th>Nama</th>
              <th>NIS</th>
              <th>Kelas</th>
              <th>Tahun Ajaran</th>
              <th>Orang Tua</th>
              <th>Nomor HP</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody id="daftarSiswa">
            <tr>
              <td colspan="7" style="text-align:center;">
                Memuat data siswa...
              </td>
            </tr>
          </tbody>

        </table>

      </div>
    </div>
  `;
}


// ============================================================
// BUKA FORM TAMBAH
// ============================================================

function bukaFormSiswa() {
  const container = document.getElementById(
    "formSiswaContainer"
  );

  const judul = document.getElementById(
    "judulFormSiswa"
  );

  const form = document.getElementById(
    "formSiswa"
  );

  const hiddenId = document.getElementById(
    "siswaId"
  );

  const btn = document.getElementById(
    "btnSimpanSiswa"
  );

  if (!container) return;

  container.style.display = "block";

  if (judul) {
    judul.textContent = "Tambah Siswa Baru";
  }

  if (form) {
    form.reset();
  }

  if (hiddenId) {
    hiddenId.value = "";
  }

  if (btn) {
    btn.textContent = "Simpan Siswa";
  }

  loadOrangTuaUntukForm("");
}


// ============================================================
// TUTUP FORM
// ============================================================

function tutupFormSiswa() {
  const container = document.getElementById(
    "formSiswaContainer"
  );

  const form = document.getElementById(
    "formSiswa"
  );

  const hiddenId = document.getElementById(
    "siswaId"
  );

  if (container) {
    container.style.display = "none";
  }

  if (form) {
    form.reset();
  }

  if (hiddenId) {
    hiddenId.value = "";
  }
}


// ============================================================
// EDIT SISWA
// ============================================================

async function editSiswa(id) {
  if (!supabase) {
    alert("Supabase belum terhubung.");
    return;
  }

  const siswa = semuaSiswa.find(
    (x) => String(x.id) === String(id)
  );

  if (!siswa) {
    alert("Data siswa tidak ditemukan.");
    return;
  }

  const container = document.getElementById(
    "formSiswaContainer"
  );

  const judul = document.getElementById(
    "judulFormSiswa"
  );

  const hiddenId = document.getElementById(
    "siswaId"
  );

  const btn = document.getElementById(
    "btnSimpanSiswa"
  );

  if (!container) return;

  container.style.display = "block";

  if (judul) {
    judul.textContent = "Edit Data Siswa";
  }

  if (hiddenId) {
    hiddenId.value = siswa.id;
  }

  document.getElementById("siswaNama").value =
    siswa.nama || "";

  document.getElementById("siswaNis").value =
    siswa.nis || "";

  document.getElementById("siswaKelas").value =
    siswa.kelas || "";

  document.getElementById("siswaTahunAjaran").value =
    siswa.tahun_ajaran || "";

  document.getElementById("siswaNomorHpOrtu").value =
    siswa.nomor_hp_ortu || "";

  document.getElementById("siswaAlamat").value =
    siswa.alamat || "";

  await loadOrangTuaUntukForm(
    siswa.orang_tua_id || ""
  );

  if (btn) {
    btn.textContent = "Simpan Perubahan";
  }

  const tanggalEl = document.getElementById(
    "siswaTanggalLahir"
  );

  const jkEl = document.getElementById(
    "siswaJenisKelamin"
  );

  if (tanggalEl) {
    tanggalEl.value = siswa.tanggal_lahir || "";
  }

  if (jkEl) {
    jkEl.value = siswa.jenis_kelamin || "";
  }

  container.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}


// ============================================================
// SIMPAN SISWA / UPDATE SISWA
// ============================================================

async function simpanSiswa(event) {
  event.preventDefault();

  if (!supabase) {
    alert("Supabase belum terhubung.");
    return;
  }

  const btn = document.getElementById(
    "btnSimpanSiswa"
  );

  const id = document.getElementById(
    "siswaId"
  )?.value || "";

  const nama = document.getElementById(
    "siswaNama"
  )?.value.trim();

  const nis = document.getElementById(
    "siswaNis"
  )?.value.trim();

  const kelas = document.getElementById(
    "siswaKelas"
  )?.value.trim();

  const tahunAjaran = document.getElementById(
    "siswaTahunAjaran"
  )?.value.trim();

  const tanggalLahir = document.getElementById(
    "siswaTanggalLahir"
  )?.value;

  const jenisKelamin = document.getElementById(
    "siswaJenisKelamin"
  )?.value;

  const nomorHpOrtu = document.getElementById(
    "siswaNomorHpOrtu"
  )?.value.trim();

  const orangTuaId = document.getElementById(
    "siswaOrangTuaId"
  )?.value || null;

  const alamat = document.getElementById(
    "siswaAlamat"
  )?.value.trim();

  if (!nama || !nis || !kelas) {
    alert(
      "Nama, NIS, dan Kelas wajib diisi."
    );
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.textContent = id
      ? "Menyimpan perubahan..."
      : "Menyimpan...";
  }

  try {
    const dataSiswa = {
      nama,
      nis,
      kelas,
      tahun_ajaran:
        tahunAjaran || null,
      tanggal_lahir:
        tanggalLahir || null,
      jenis_kelamin:
        jenisKelamin || null,
      nomor_hp_ortu:
        nomorHpOrtu || null,
      orang_tua_id:
        orangTuaId || null,
      alamat:
        alamat || null
    };

    let error;

    if (id) {

      const result = await supabase
        .from("siswa")
        .update(dataSiswa)
        .eq("id", id);

      error = result.error;

    } else {

      const result = await supabase
        .from("siswa")
        .insert(dataSiswa);

      error = result.error;
    }

    if (error) throw error;

    alert(
      id
        ? "Data siswa berhasil diperbarui!"
        : "Siswa berhasil ditambahkan!"
    );

    tutupFormSiswa();

    await loadSiswa();

  } catch (error) {
    console.error(
      "Error simpan siswa:",
      error
    );

    alert(
      "Gagal menyimpan siswa:\n\n" +
      (error?.message ||
        "Terjadi kesalahan.")
    );

  } finally {

    if (btn) {
      btn.disabled = false;
      btn.textContent =
        "Simpan Siswa";
    }
  }
}


// ============================================================
// LOAD SISWA
// ============================================================

async function loadSiswa() {
  const tbody = document.getElementById(
    "daftarSiswa"
  );

  if (!tbody) return;

  tbody.innerHTML = `
    <tr>
      <td colspan="7" style="text-align:center;">
        Memuat data siswa...
      </td>
    </tr>
  `;

  try {
    if (!supabase) {
      throw new Error(
        "Supabase belum terhubung."
      );
    }

    const { data, error } =
      await supabase
        .from("siswa")
        .select(`
          id,
          nama,
          nis,
          kelas,
          tahun_ajaran,
          tanggal_lahir,
          jenis_kelamin,
          nomor_hp_ortu,
          orang_tua_id,
          alamat,
          orang_tua:orang_tua_id (
            id,
            nama,
            email
          )
        `)
        .order(
          "created_at",
          { ascending: false }
        );

    if (error) throw error;

    semuaSiswa = data || [];

    if (
      semuaSiswa.length === 0
    ) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center;">
            Belum ada data siswa.
          </td>
        </tr>
      `;
      return;
    }

    renderDaftarSiswa(
      semuaSiswa
    );

  } catch (error) {

    console.error(
      "Error load siswa:",
      error
    );

    tbody.innerHTML = `
      <tr>
        <td
          colspan="7"
          style="
            text-align:center;
            color:#E11D48;
          "
        >
          Gagal memuat data siswa.
        </td>
      </tr>
    `;
  }
}


// ============================================================
// RENDER DAFTAR
// ============================================================

function renderDaftarSiswa(
  dataSiswa
) {
  const tbody = document.getElementById(
    "daftarSiswa"
  );

  if (!tbody) return;

  if (
    !dataSiswa ||
    dataSiswa.length === 0
  ) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center;">
          Data siswa tidak ditemukan.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML =
    dataSiswa
      .map(
        (siswa) => {

          const namaSafe =
            String(
              siswa.nama || ""
            )
              .replace(
                /\\/g,
                "\\\\"
              )
              .replace(
                /'/g,
                "\\'"
              );

          return `
            <tr>

              <td>
                ${siswa.nama || "-"}
              </td>

              <td>
                ${siswa.nis || "-"}
              </td>

              <td>
                ${siswa.kelas || "-"}
              </td>

              <td>
                ${siswa.tahun_ajaran || "-"}
              </td>

              <td>
                ${
                  siswa.orang_tua?.nama ||
                  siswa.orang_tua?.email ||
                  "Belum ditautkan"
                }
              </td>

              <td>
                ${siswa.nomor_hp_ortu || "-"}
              </td>

              <td>

                <div
                  style="
                    display:flex;
                    gap:6px;
                    flex-wrap:wrap;
                  "
                >

                  <button
                    class="btn ghost small"
                    onclick="window.__app.editSiswa('${siswa.id}')"
                  >
                    Edit
                  </button>

                  <button
                    class="btn ghost small"
                    onclick="window.__app.hapusSiswa('${siswa.id}', '${namaSafe}')"
                  >
                    Hapus
                  </button>

                </div>

              </td>

            </tr>
          `;
        }
      )
      .join("");
}


// ============================================================
// CARI SISWA
// ============================================================

function cariSiswa() {
  const input = document.getElementById(
    "cariSiswa"
  );

  if (!input) return;

  const keyword =
    input.value
      .toLowerCase()
      .trim();

  const hasil =
    semuaSiswa.filter(
      (siswa) => {

        const nama =
          (siswa.nama || "")
            .toLowerCase();

        const nis =
          (siswa.nis || "")
            .toLowerCase();

        const kelas =
          (siswa.kelas || "")
            .toLowerCase();

        const tahunAjaran =
          (siswa.tahun_ajaran || "")
            .toLowerCase();

        return (
          nama.includes(keyword) ||
          nis.includes(keyword) ||
          kelas.includes(keyword) ||
          tahunAjaran.includes(keyword)
        );
      }
    );

  renderDaftarSiswa(
    hasil
  );
}


// ============================================================
// HAPUS SISWA
// ============================================================

async function hapusSiswa(
  id,
  nama
) {
  if (!supabase) {
    alert(
      "Supabase belum terhubung."
    );
    return;
  }

  const konfirmasi =
    confirm(
      `Yakin ingin menghapus data siswa "${nama}"?\n\n` +
      `Data terkait seperti absensi, SPP, dan perkembangan ` +
      `mungkin juga ikut terdampak tergantung aturan foreign key database.`
    );

  if (!konfirmasi) return;

  try {

    const { error } =
      await supabase
        .from("siswa")
        .delete()
        .eq("id", id);

    if (error) throw error;

    alert(
      "Data siswa berhasil dihapus."
    );

    await loadSiswa();

  } catch (error) {

    console.error(
      "Error hapus siswa:",
      error
    );

    alert(
      "Gagal menghapus siswa:\n\n" +
      (error?.message ||
        "Terjadi kesalahan.")
    );
  }
}
// ============================================================
// GANTARIKU — IMPORT DATA SISWA
// Tambahkan di PALING BAWAH js/siswa.js
// Tidak perlu mengubah app.js / index.html
// ============================================================

(function () {
  "use strict";

  // ----------------------------------------------------------
  // KONFIGURASI
  // ----------------------------------------------------------

  const IMPORT_CHUNK_SIZE = 200;

  let importRows = [];
  let importValidRows = [];
  let importInvalidRows = [];

  // ----------------------------------------------------------
  // LOAD SHEETJS DINAMIS
  // Supaya tidak perlu menambah file/library secara manual.
  // ----------------------------------------------------------

  async function ensureXLSX() {
    if (window.XLSX) {
      return window.XLSX;
    }

    return new Promise((resolve, reject) => {
      const existing =
        document.querySelector(
          'script[data-gantariku-xlsx="1"]'
        );

      if (existing) {
        existing.addEventListener("load", () => {
          if (window.XLSX) {
            resolve(window.XLSX);
          } else {
            reject(
              new Error(
                "Library Excel berhasil dimuat tetapi XLSX tidak tersedia."
              )
            );
          }
        });

        existing.addEventListener(
          "error",
          () =>
            reject(
              new Error(
                "Gagal memuat library Excel."
              )
            )
        );

        return;
      }

      const script =
        document.createElement("script");

      script.src =
        "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";

      script.async = true;
      script.dataset.gantarikuXlsx = "1";

      script.onload = () => {
        if (window.XLSX) {
          resolve(window.XLSX);
        } else {
          reject(
            new Error(
              "Library Excel tidak tersedia."
            )
          );
        }
      };

      script.onerror = () => {
        reject(
          new Error(
            "Tidak dapat memuat library Excel. Periksa koneksi internet."
          )
        );
      };

      document.head.appendChild(script);
    });
  }

  // ----------------------------------------------------------
  // ESCAPE HTML
  // ----------------------------------------------------------

  function esc(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ----------------------------------------------------------
  // NORMALISASI HEADER
  // Bisa membaca beberapa variasi nama kolom.
  // ----------------------------------------------------------

  function normalizeHeader(value) {
    return String(value ?? "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/[_-]+/g, " ");
  }

  function findValue(row, aliases) {
    const keys =
      Object.keys(row || {});

    for (const alias of aliases) {
      const wanted =
        normalizeHeader(alias);

      const found =
        keys.find(
          key =>
            normalizeHeader(key) === wanted
        );

      if (
        found !== undefined &&
        row[found] !== undefined &&
        row[found] !== null
      ) {
        return row[found];
      }
    }

    return "";
  }

  // ----------------------------------------------------------
  // NORMALISASI NOMOR HP
  // ----------------------------------------------------------

  function normalizePhone(value) {
    if (
      value === null ||
      value === undefined
    ) {
      return "";
    }

    let phone =
      String(value)
        .trim()
        .replace(/[^\d+]/g, "");

    if (phone.startsWith("+62")) {
      phone =
        "0" +
        phone.slice(3);
    } else if (
      phone.startsWith("62")
    ) {
      phone =
        "0" +
        phone.slice(2);
    }

    return phone;
  }

  // ----------------------------------------------------------
  // TANGGAL EXCEL
  // ----------------------------------------------------------

  function parseDateValue(value) {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return null;
    }

    // Date object
    if (value instanceof Date) {
      if (Number.isNaN(value.getTime())) {
        return null;
      }

      const y =
        value.getFullYear();

      const m =
        String(
          value.getMonth() + 1
        ).padStart(2, "0");

      const d =
        String(
          value.getDate()
        ).padStart(2, "0");

      return `${y}-${m}-${d}`;
    }

    // Excel serial number
    if (
      typeof value === "number" &&
      window.XLSX &&
      XLSX.SSF &&
      typeof XLSX.SSF.parse_date_code ===
        "function"
    ) {
      const parsed =
        XLSX.SSF.parse_date_code(
          value
        );

      if (parsed) {
        return `${parsed.y}-${String(
          parsed.m
        ).padStart(2, "0")}-${String(
          parsed.d
        ).padStart(2, "0")}`;
      }
    }

    const text =
      String(value).trim();

    // yyyy-mm-dd
    if (
      /^\d{4}-\d{1,2}-\d{1,2}$/.test(
        text
      )
    ) {
      const parts =
        text.split("-");

      return `${parts[0]}-${String(
        parts[1]
      ).padStart(2, "0")}-${String(
        parts[2]
      ).padStart(2, "0")}`;
    }

    // dd/mm/yyyy
    if (
      /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(
        text
      )
    ) {
      const parts =
        text.split("/");

      return `${parts[2]}-${String(
        parts[1]
      ).padStart(2, "0")}-${String(
        parts[0]
      ).padStart(2, "0")}`;
    }

    return null;
  }

// ============================================================
// MAP BARIS EXCEL → DATA SISWA
// MENGIKUTI POSISI KOLOM ASLI
// ============================================================

function mapImportRow(
  row,
  index
) {

  // ----------------------------------------------------------
  // POSISI KOLOM
  // ----------------------------------------------------------

  const nomor =
    row[0] ?? "";

  const nama =
    String(
      row[1] ?? ""
    ).trim();

  const nis =
    String(
      row[2] ?? ""
    ).trim();

  const ttl =
    String(
      row[3] ?? ""
    ).trim();

  const alamat =
    String(
      row[4] ?? ""
    ).trim();

  const namaWali =
    String(
      row[5] ?? ""
    ).trim();

  const nomorHpOrtu =
    normalizePhone(
      row[6] ?? ""
    );

  const kelas =
    String(
      row[7] ?? ""
    ).trim();

  const mulaiBergabung =
    row[8] ?? "";

  const errors = [];

  // ----------------------------------------------------------
  // NAMA
  // ----------------------------------------------------------

  if (!nama) {
    errors.push(
      "Nama siswa kosong"
    );
  }

  // ----------------------------------------------------------
  // NIS
  // ----------------------------------------------------------

  if (!nis) {
    errors.push(
      "NIS kosong"
    );
  }

  // ----------------------------------------------------------
  // KELAS
  // ----------------------------------------------------------

  if (!kelas) {
    errors.push(
      "Kelas kosong"
    );
  }

  // ----------------------------------------------------------
  // TTL
  // Contoh:
  // Semarang, 01 Mei 2020
  // ----------------------------------------------------------

  let tempatLahir = "";
  let tanggalLahir = null;

  if (ttl) {

    const parts =
      ttl.split(",");

    if (parts.length >= 2) {

      tempatLahir =
        parts
          .slice(
            0,
            parts.length - 1
          )
          .join(",")
          .trim();

      tanggalLahir =
        parseFlexibleDate(
          parts[
            parts.length - 1
          ]
        );

    } else {

      tanggalLahir =
        parseFlexibleDate(
          ttl
        );

    }

  }

  // ----------------------------------------------------------
  // MULAI BERGABUNG
  // Excel date serial → bulan + tahun
  // ----------------------------------------------------------

  const mulai =
    parseBulanTahunExcel(
      mulaiBergabung
    );

  if (
    mulaiBergabung !== "" &&
    (
      mulai.bulan === null ||
      mulai.tahun === null
    )
  ) {
    errors.push(
      "Format Mulai bergabung tidak dapat dibaca"
    );
  }

  return {

    rowNumber:
      index + 1,

    nomor:

      nomor,

    nama:

      nama,

    nis:

      nis,

    tempat_lahir:

      tempatLahir ||
      null,

    tanggal_lahir:

      tanggalLahir ||
      null,

    alamat:

      alamat ||
      null,

    nama_wali:

      namaWali ||
      null,

    nomor_hp_ortu:

      nomorHpOrtu ||
      null,

    kelas:

      kelas,

    tahun_ajaran:

      null,

    jenis_kelamin:

      null,

    mulai_bulan:

      mulai.bulan,

    mulai_tahun:

      mulai.tahun,

    orang_tua_id:

      null,

    kode_akses:

      null,

    errors:

      errors
  };
}
// ============================================================
// PARSE TANGGAL LEBIH FLEKSIBEL
// Mendukung:
// 01 Mei 2020
// 1 Juni 2018
// 05 September 2019
// 2020-05-01
// 01/05/2020
// ============================================================

function parseFlexibleDate(
  value
) {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  if (
    value instanceof Date
  ) {

    if (
      Number.isNaN(
        value.getTime()
      )
    ) {
      return null;
    }

    return formatDateISO(
      value
    );

  }

  const text =
    String(
      value
    ).trim();

  if (!text) {
    return null;
  }

  // yyyy-mm-dd
  if (
    /^\d{4}-\d{1,2}-\d{1,2}$/
      .test(text)
  ) {

    const [
      tahun,
      bulan,
      tanggal
    ] =
      text.split("-");

    return `${tahun}-${String(
      bulan
    ).padStart(
      2,
      "0"
    )}-${String(
      tanggal
    ).padStart(
      2,
      "0"
    )}`;

  }

  // dd/mm/yyyy
  if (
    /^\d{1,2}\/\d{1,2}\/\d{4}$/
      .test(text)
  ) {

    const [
      tanggal,
      bulan,
      tahun
    ] =
      text.split("/");

    return `${tahun}-${String(
      bulan
    ).padStart(
      2,
      "0"
    )}-${String(
      tanggal
    ).padStart(
      2,
      "0"
    )}`;

  }

  // ----------------------------------------------------------
  // Nama bulan Indonesia
  // ----------------------------------------------------------

  const bulanMap = {

    januari: 1,
    jan: 1,

    februari: 2,
    feb: 2,

    maret: 3,
    mar: 3,

    april: 4,
    apr: 4,

    mei: 5,

    juni: 6,
    jun: 6,

    juli: 7,
    jul: 7,

    agustus: 8,
    agu: 8,

    september: 9,
    sep: 9,

    oktober: 10,
    okt: 10,

    november: 11,
    nov: 11,

    desember: 12,
    des: 12

  };

  const match =
    text.match(
      /^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/i
    );

  if (match) {

    const tanggal =
      Number(
        match[1]
      );

    const namaBulan =
      match[2]
        .toLowerCase();

    const tahun =
      Number(
        match[3]
      );

    const bulan =
      bulanMap[
        namaBulan
      ];

    if (
      bulan &&
      tanggal >= 1 &&
      tanggal <= 31
    ) {

      return `${tahun}-${String(
        bulan
      ).padStart(
        2,
        "0"
      )}-${String(
        tanggal
      ).padStart(
        2,
        "0"
      )}`;

    }

  }

  return null;
}
// ============================================================
// PARSE MULAI BERGABUNG
// Hasil:
// {
//   bulan: 7,
//   tahun: 2024
// }
// ============================================================

function parseBulanTahunExcel(
  value
) {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return {
      bulan: null,
      tahun: null
    };
  }

  let date = null;

  // ----------------------------------------------------------
  // Date object
  // ----------------------------------------------------------

  if (
    value instanceof Date
  ) {

    date =
      value;

  }

  // ----------------------------------------------------------
  // Excel serial number
  // ----------------------------------------------------------

  else if (
    typeof value === "number"
  ) {

    /*
     * Excel menggunakan sistem 1900-date.
     */

    const utcDate =
      new Date(
        Math.round(
          (
            value -
            25569
          ) *
          86400 *
          1000
        )
      );

    if (
      !Number.isNaN(
        utcDate.getTime()
      )
    ) {

      date =
        utcDate;

    }

  }

  // ----------------------------------------------------------
  // String
  // ----------------------------------------------------------

  else {

    const text =
      String(
        value
      ).trim();

    if (!text) {
      return {
        bulan: null,
        tahun: null
      };
    }

    /*
     * Coba dd/mm/yyyy
     */

    const slash =
      text.match(
        /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
      );

    if (slash) {

      const d =
        Number(
          slash[1]
        );

      const m =
        Number(
          slash[2]
        );

      const y =
        Number(
          slash[3]
        );

      return {
        bulan:
          m >= 1 &&
          m <= 12
            ? m
            : null,

        tahun:
          y >= 2000 &&
          y <= 2100
            ? y
            : null
      };

    }

    /*
     * Coba yyyy-mm-dd
     */

    const iso =
      text.match(
        /^(\d{4})-(\d{1,2})-(\d{1,2})$/
      );

    if (iso) {

      const y =
        Number(
          iso[1]
        );

      const m =
        Number(
          iso[2]
        );

      return {
        bulan:
          m >= 1 &&
          m <= 12
            ? m
            : null,

        tahun:
          y >= 2000 &&
          y <= 2100
            ? y
            : null
      };

    }

    const parsed =
      parseFlexibleDate(
        text
      );

    if (parsed) {

      const [
        y,
        m
      ] =
        parsed.split("-");

      return {
        bulan:
          Number(m),

        tahun:
          Number(y)
      };

    }

  }

  if (date) {

    return {
      bulan:
        date.getUTCMonth() +
        1,

      tahun:
        date.getUTCFullYear()
    };

  }

  return {
    bulan: null,
    tahun: null
  };
}


// ============================================================
// DATE → YYYY-MM-DD
// ============================================================

function formatDateISO(
  date
) {

  const y =
    date.getFullYear();

  const m =
    String(
      date.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const d =
    String(
      date.getDate()
    ).padStart(
      2,
      "0"
    );

  return `${y}-${m}-${d}`;
}
// ============================================================
// BACA FILE IMPORT GANTARIKU
// FORMAT SESUAI EXCEL ASLI:
// A = No
// B = Nama
// C = NIS
// D = TTL
// E = Alamat
// F = Nama Wali
// G = No. HP
// H = Kelas
// I = Mulai bergabung
// ============================================================

async function bacaFileImport(file) {

  if (!file) {
    throw new Error(
      "File belum dipilih."
    );
  }

  const extension =
    file.name
      .split(".")
      .pop()
      .toLowerCase();

  const allowed = [
    "xlsx",
    "xls",
    "csv"
  ];

  if (!allowed.includes(extension)) {
    throw new Error(
      "Format file tidak didukung. Gunakan Excel (.xlsx/.xls) atau CSV."
    );
  }

  const XLSXLib =
    await ensureXLSX();

  const buffer =
    await file.arrayBuffer();

  const workbook =
    XLSXLib.read(
      buffer,
      {
        type: "array",
        cellDates: true
      }
    );

  const sheetName =
    workbook.SheetNames?.[0];

  if (!sheetName) {
    throw new Error(
      "Sheet Excel tidak ditemukan."
    );
  }

  const sheet =
    workbook.Sheets[
      sheetName
    ];

  /*
   * PENTING:
   * Kita membaca berdasarkan posisi kolom,
   * bukan nama header.
   *
   * Karena file asli kamu punya
   * kolom B dengan header kosong/spasi.
   */

  const rows =
    XLSXLib.utils.sheet_to_json(
      sheet,
      {
        header: 1,
        raw: true,
        defval: "",
        blankrows: false
      }
    );

  if (!rows.length) {
    throw new Error(
      "File tidak berisi data."
    );
  }

  /*
   * Cari baris header.
   * Kita cari baris yang memiliki
   * "NIS", "TTL", "Alamat", dst.
   */

  let headerIndex = -1;

  for (
    let i = 0;
    i < Math.min(rows.length, 20);
    i++
  ) {

    const row =
      rows[i] || [];

    const joined =
      row
        .map(
          value =>
            String(
              value ?? ""
            )
              .trim()
              .toLowerCase()
        )
        .join("|");

    if (
      joined.includes("nis") &&
      joined.includes("ttl") &&
      joined.includes("alamat") &&
      joined.includes("kelas")
    ) {
      headerIndex = i;
      break;
    }
  }

  if (headerIndex === -1) {
    throw new Error(
      "Header Data Siswa tidak ditemukan. Pastikan format Excel sesuai template Gantariku."
    );
  }

  /*
   * Semua baris setelah header
   * adalah data siswa.
   */

  const dataRows =
    rows
      .slice(headerIndex + 1)
      .filter(row => {

        if (!row) return false;

        const values =
          row.map(
            value =>
              String(
                value ?? ""
              ).trim()
          );

        return values.some(
          value => value !== ""
        );

      })
      .filter(row => {

        /*
         * Hilangkan baris judul/keterangan
         * kalau ada di bawah.
         *
         * Baris siswa biasanya memiliki
         * nama/NIS.
         */

        const nama =
          String(
            row[1] ?? ""
          ).trim();

        const nis =
          String(
            row[2] ?? ""
          ).trim();

        return (
          nama !== "" ||
          nis !== ""
        );
      });

  if (!dataRows.length) {
    throw new Error(
      "Tidak ditemukan data siswa setelah header."
    );
  }

  return dataRows;
}

  // ----------------------------------------------------------
  // CEK DUPLIKAT DI FILE
  // ----------------------------------------------------------

  function cekDuplikatDalamFile(rows) {
    const seen =
      new Map();

    rows.forEach(row => {
      const key =
        String(row.nis || "")
          .trim()
          .toLowerCase();

      if (!key) return;

      if (!seen.has(key)) {
        seen.set(key, []);
      }

      seen
        .get(key)
        .push(row);
    });

    seen.forEach(
      list => {
        if (list.length > 1) {
          list.forEach(row => {
            row.errors.push(
              "NIS duplikat di dalam file"
            );
          });
        }
      }
    );
  }

  // ----------------------------------------------------------
  // CEK DUPLIKAT DENGAN DATABASE
  // ----------------------------------------------------------

  async function cekDatabase(rows) {
    if (!supabase) {
      throw new Error(
        "Supabase belum terhubung."
      );
    }

    const nisList =
      [
        ...new Set(
          rows
            .filter(
              x =>
                x.nis &&
                !x.errors.includes(
                  "NIS duplikat di dalam file"
                )
            )
            .map(
              x =>
                String(
                  x.nis
                ).trim()
            )
        ),
      ];

    if (!nisList.length) {
      return [];
    }

    const existing = [];

    // Query bertahap supaya tidak terlalu panjang
    for (
      let i = 0;
      i < nisList.length;
      i += 200
    ) {
      const chunk =
        nisList.slice(
          i,
          i + 200
        );

      const {
        data,
        error,
      } =
        await supabase
          .from("siswa")
          .select(
            "id,nis,nama"
          )
          .in(
            "nis",
            chunk
          );

      if (error) {
        throw error;
      }

      existing.push(
        ...(data || [])
      );
    }

    return existing;
  }

  // ----------------------------------------------------------
  // MODAL IMPORT
  // ----------------------------------------------------------

  function buatModalImport() {
    const existing =
      document.getElementById(
        "modalImportSiswa"
      );

    if (existing) {
      existing.remove();
    }

    const modal =
      document.createElement(
        "div"
      );

    modal.id =
      "modalImportSiswa";

    modal.innerHTML = `
      <div class="gtr-import-backdrop">

        <div class="gtr-import-modal">

          <div class="gtr-import-header">

            <div>
              <h2>Import Data Siswa</h2>

              <p>
                Masukkan data siswa sekaligus dari Excel atau CSV.
              </p>
            </div>

            <button
              type="button"
              class="gtr-import-close"
              onclick="window.tutupImportSiswa()"
            >
              ×
            </button>

          </div>

          <div
            id="gtrImportContent"
            class="gtr-import-content"
          >

            <div class="gtr-import-upload">

              <div class="gtr-import-icon">
                📊
              </div>

              <strong>
                Pilih file Excel / CSV
              </strong>

              <span>
                .xlsx, .xls atau .csv
              </span>

              <input
                type="file"
                id="gtrInputFileSiswa"
                accept=".xlsx,.xls,.csv"
              >

              <label
                for="gtrInputFileSiswa"
                class="btn"
              >
                Pilih File
              </label>

              <small>
                Kolom wajib:
                <b>Nama Siswa, NIS, Kelas</b>
              </small>

            </div>

            <div
              id="gtrImportStatus"
              class="gtr-import-status"
            ></div>

            <div
              id="gtrImportPreview"
              class="gtr-import-preview"
            ></div>

          </div>

        </div>

      </div>
    `;

    document.body.appendChild(
      modal
    );

    document
      .getElementById(
        "gtrInputFileSiswa"
      )
      ?.addEventListener(
        "change",
        handleImportFile
      );

    modal
      .querySelector(
        ".gtr-import-backdrop"
      )
      ?.addEventListener(
        "click",
        event => {
          if (
            event.target.classList.contains(
              "gtr-import-backdrop"
            )
          ) {
            tutupImportSiswa();
          }
        }
      );
  }

  // ----------------------------------------------------------
  // PROSES FILE
  // ----------------------------------------------------------

  async function handleImportFile(event) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const status =
      document.getElementById(
        "gtrImportStatus"
      );

    const preview =
      document.getElementById(
        "gtrImportPreview"
      );

    if (status) {
      status.innerHTML =
        `
          <div class="gtr-import-loading">
            ⏳ Membaca file...
          </div>
        `;
    }

    if (preview) {
      preview.innerHTML = "";
    }

    try {
      const rawRows =
        await bacaFileImport(
          file
        );

      const mapped =
        rawRows.map(
          (row, index) =>
            mapImportRow(
              row,
              index
            )
        );

      cekDuplikatDalamFile(
        mapped
      );

      const existing =
        await cekDatabase(
          mapped
        );

      const existingMap =
        new Map(
          existing.map(
            x => [
              String(x.nis)
                .trim()
                .toLowerCase(),
              x,
            ]
          )
        );

      mapped.forEach(row => {

        const existingStudent =
          existingMap.get(
            String(
              row.nis || ""
            )
              .trim()
              .toLowerCase()
          );

        if (
          existingStudent
        ) {
          row.errors.push(
            `NIS sudah terdaftar (${existingStudent.nama || "siswa lain"})`
          );
        }

      });

      importRows =
        mapped;

      importValidRows =
        mapped.filter(
          row =>
            row.errors.length === 0
        );

      importInvalidRows =
        mapped.filter(
          row =>
            row.errors.length > 0
        );

      renderImportPreview(
        file.name
      );

    } catch (error) {

      console.error(
        "Import siswa:",
        error
      );

      if (status) {
        status.innerHTML =
          `
            <div class="gtr-import-error">
              ❌ ${esc(
                error?.message ||
                "Gagal membaca file."
              )}
            </div>
          `;
      }
    }
  }

  // ----------------------------------------------------------
  // PREVIEW
  // ----------------------------------------------------------

  function renderImportPreview(
    fileName
  ) {
    const status =
      document.getElementById(
        "gtrImportStatus"
      );

    const preview =
      document.getElementById(
        "gtrImportPreview"
      );

    if (!status || !preview) {
      return;
    }

    status.innerHTML = `
      <div class="gtr-import-summary">

        <div class="gtr-import-stat">
          <strong>
            ${importRows.length}
          </strong>
          <span>Total baris</span>
        </div>

        <div class="gtr-import-stat good">
          <strong>
            ${importValidRows.length}
          </strong>
          <span>Siap diimport</span>
        </div>

        <div class="gtr-import-stat bad">
          <strong>
            ${importInvalidRows.length}
          </strong>
          <span>Perlu diperbaiki</span>
        </div>

      </div>

      <div class="gtr-import-file">
        📄 ${esc(fileName)}
      </div>
    `;

    const previewRows =
      importRows.slice(
        0,
        30
      );

    preview.innerHTML = `
      <div class="gtr-import-preview-title">
        <strong>Preview Data</strong>

        <span>
          ${
            importRows.length > 30
              ? "Menampilkan 30 baris pertama"
              : "Semua baris"
          }
        </span>
      </div>

      <div class="gtr-import-table-wrap">

        <table class="gtr-import-table">

          <thead>
            <tr>
              <th>Baris</th>
              <th>Nama</th>
              <th>NIS</th>
              <th>Kelas</th>
              <th>Status</th>
              <th>Masalah</th>
            </tr>
          </thead>

          <tbody>

            ${previewRows
              .map(
                row => {

                  const valid =
                    row.errors.length ===
                    0;

                  return `
                    <tr
                      class="${
                        valid
                          ? ""
                          : "is-invalid"
                      }"
                    >

                      <td>
                        ${row.rowNumber}
                      </td>

                      <td>
                        ${esc(row.nama)}
                      </td>

                      <td>
                        ${esc(row.nis)}
                      </td>

                      <td>
                        ${esc(row.kelas)}
                      </td>

                      <td>
                        ${
                          valid
                            ? `<span class="gtr-import-ok">✓ Valid</span>`
                            : `<span class="gtr-import-invalid">! Perlu diperbaiki</span>`
                        }
                      </td>

                      <td>
                        ${
                          row.errors.length
                            ? row.errors
                                .map(
                                  e =>
                                    `<div>${esc(e)}</div>`
                                )
                                .join("")
                            : `<span class="gtr-import-muted">—</span>`
                        }
                      </td>

                    </tr>
                  `;
                }
              )
              .join("")}

          </tbody>

        </table>

      </div>

      <div class="gtr-import-actions">

        <button
          type="button"
          class="btn ghost"
          onclick="window.tutupImportSiswa()"
        >
          Batal
        </button>

        <button
          type="button"
          class="btn"
          id="gtrBtnImportSekarang"
          ${
            importValidRows.length
              ? ""
              : "disabled"
          }
        >
          Import ${
            importValidRows.length
          } Data
        </button>

      </div>
    `;

    document
      .getElementById(
        "gtrBtnImportSekarang"
      )
      ?.addEventListener(
        "click",
        importSekarang
      );
  }

  // ----------------------------------------------------------
  // EKSEKUSI IMPORT
  // ----------------------------------------------------------

  async function importSekarang() {
    if (
      currentUserRole !== "admin"
    ) {
      alert(
        "Hanya admin yang dapat melakukan import data siswa."
      );
      return;
    }

    if (
      !supabase
    ) {
      alert(
        "Supabase belum terhubung."
      );
      return;
    }

    if (
      !importValidRows.length
    ) {
      alert(
        "Tidak ada data valid untuk diimport."
      );
      return;
    }

    const btn =
      document.getElementById(
        "gtrBtnImportSekarang"
      );

    const total =
      importValidRows.length;

    if (btn) {
      btn.disabled = true;
      btn.textContent =
        `Mengimport 0/${total}...`;
    }

    try {

      let berhasil = 0;

      for (
        let i = 0;
        i < total;
        i += IMPORT_CHUNK_SIZE
      ) {

        const chunk =
          importValidRows.slice(
            i,
            i +
              IMPORT_CHUNK_SIZE
          );

        const payload =
  chunk.map(
    row => ({

      nama:
        row.nama,

      nis:
        row.nis,

      tempat_lahir:
        row.tempat_lahir,

      tanggal_lahir:
        row.tanggal_lahir,

      alamat:
        row.alamat,

      nama_wali:
        row.nama_wali,

      nomor_hp_ortu:
        row.nomor_hp_ortu,

      kelas:
        row.kelas,

      tahun_ajaran:
        row.tahun_ajaran,

      jenis_kelamin:
        row.jenis_kelamin,

      mulai_bulan:
        row.mulai_bulan,

      mulai_tahun:
        row.mulai_tahun,

      orang_tua_id:
        null

      // kode_akses tidak perlu dikirim.
      // Trigger database akan membuat otomatis.

    })
  );
        const {
          error,
        } =
          await supabase
            .from("siswa")
            .insert(
              payload
            );

        if (error) {
          throw error;
        }

        berhasil +=
          chunk.length;

        if (btn) {
          btn.textContent =
            `Mengimport ${berhasil}/${total}...`;
        }
      }

      alert(
        `Berhasil mengimport ${berhasil} data siswa.`
      );

      tutupImportSiswa();

      if (
        typeof loadSiswa ===
        "function"
      ) {
        await loadSiswa();
      }

    } catch (error) {

      console.error(
        "Gagal import siswa:",
        error
      );

      alert(
        "Import berhenti.\n\n" +
        (
          error?.message ||
          "Terjadi kesalahan."
        )
      );

      if (btn) {
        btn.disabled = false;
        btn.textContent =
          `Import ${total} Data`;
      }
    }
  }

  // ----------------------------------------------------------
  // BUKA IMPORT
  // ----------------------------------------------------------

  function bukaImportSiswa() {

    if (
      currentUserRole !==
      "admin"
    ) {
      alert(
        "Fitur import hanya tersedia untuk admin."
      );
      return;
    }

    buatModalImport();
  }

  // ----------------------------------------------------------
  // TUTUP IMPORT
  // ----------------------------------------------------------

  function tutupImportSiswa() {
    const modal =
      document.getElementById(
        "modalImportSiswa"
      );

    if (modal) {
      modal.remove();
    }

    importRows = [];
    importValidRows = [];
    importInvalidRows = [];
  }

  // ----------------------------------------------------------
  // PASANG TOMBOL IMPORT
  //
  // Kita bungkus renderSiswa() yang sudah ada.
  // Jadi TIDAK perlu mengedit fungsi lama.
  // ----------------------------------------------------------

  function pasangTombolImport() {

    if (
      typeof window.renderSiswa !==
      "function"
    ) {
      return;
    }

    if (
      window.renderSiswa.__gtrImportWrapped
    ) {
      return;
    }

    const originalRenderSiswa =
      window.renderSiswa;

    function wrappedRenderSiswa() {

      let html =
        originalRenderSiswa();

      // Hanya admin yang melihat tombol Import.
      if (
        currentUserRole !==
        "admin"
      ) {
        return html;
      }

      const tambahButtonPattern =
        /(<button[^>]*onclick="window\.__app\.bukaFormSiswa\(\)"[^>]*>[\s\S]*?\+ Tambah Siswa[\s\S]*?<\/button>)/;

      const match =
        html.match(
          tambahButtonPattern
        );

      if (!match) {
        return html;
      }

      const importButton = `
        <button
          class="btn ghost"
          type="button"
          onclick="window.bukaImportSiswa()"
        >
          📊 Import Data
        </button>
      `;

      html =
        html.replace(
          match[1],
          `${importButton}${match[1]}`
        );

      return html;
    }

    wrappedRenderSiswa
      .__gtrImportWrapped = true;

    wrappedRenderSiswa
      .__gtrOriginal =
      originalRenderSiswa;

    window.renderSiswa =
      wrappedRenderSiswa;
  }

  // ----------------------------------------------------------
  // PUBLIC
  // ----------------------------------------------------------

  window.bukaImportSiswa =
    bukaImportSiswa;

  window.tutupImportSiswa =
    tutupImportSiswa;

  // ----------------------------------------------------------
  // TUNGGU SEMUA SCRIPT SELESAI
  // ----------------------------------------------------------

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      pasangTombolImport,
      { once: true }
    );

  } else {

    pasangTombolImport();

  }

  // Beberapa project memuat script
  // secara sangat cepat sebelum global
  // benar-benar tersedia.
  setTimeout(
    pasangTombolImport,
    0
  );

  setTimeout(
    pasangTombolImport,
    300
  );

})();
