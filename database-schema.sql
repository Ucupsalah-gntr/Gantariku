-- ============================================================
-- GANTARIKU DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. TABLE: pengguna (Users with roles)
CREATE TABLE pengguna (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nama VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'guru', 'ortu')),
  nomor_hp VARCHAR(20),
  alamat TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pengguna_user_id ON pengguna(user_id);
CREATE INDEX idx_pengguna_role ON pengguna(role);
CREATE INDEX idx_pengguna_email ON pengguna(email);

-- 2. TABLE: siswa (Students)
CREATE TABLE siswa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama VARCHAR(255) NOT NULL,
  nis VARCHAR(50) UNIQUE,
  kelas VARCHAR(10) NOT NULL,
  tahun_ajaran VARCHAR(10) NOT NULL DEFAULT '2025/2026',
  orang_tua_id UUID REFERENCES pengguna(id) ON DELETE SET NULL,
  tanggal_lahir DATE,
  jenis_kelamin VARCHAR(10) CHECK (jenis_kelamin IN ('L', 'P')),
  alamat TEXT,
  nomor_hp_ortu VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_siswa_kelas ON siswa(kelas);
CREATE INDEX idx_siswa_orang_tua_id ON siswa(orang_tua_id);
CREATE INDEX idx_siswa_tahun_ajaran ON siswa(tahun_ajaran);

-- 3. TABLE: absensi (Attendance records)
CREATE TABLE absensi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  siswa_id UUID NOT NULL REFERENCES siswa(id) ON DELETE CASCADE,
  tanggal DATE NOT NULL,
  status VARCHAR(10) NOT NULL CHECK (status IN ('H', 'I', 'S', 'A', NULL)),
  -- H = Hadir, I = Izin, S = Sakit, A = Alpa
  keterangan TEXT,
  input_oleh UUID REFERENCES pengguna(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(siswa_id, tanggal)
);

CREATE INDEX idx_absensi_siswa_id ON absensi(siswa_id);
CREATE INDEX idx_absensi_tanggal ON absensi(tanggal);
CREATE INDEX idx_absensi_siswa_tanggal ON absensi(siswa_id, tanggal);

-- 4. TABLE: spp (Tuition payments)
CREATE TABLE spp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  siswa_id UUID NOT NULL REFERENCES siswa(id) ON DELETE CASCADE,
  bulan INTEGER NOT NULL CHECK (bulan >= 1 AND bulan <= 12),
  tahun INTEGER NOT NULL,
  nominal BIGINT NOT NULL DEFAULT 150000,
  status VARCHAR(20) NOT NULL DEFAULT 'belum' CHECK (status IN ('belum', 'lunas', 'sebagian')),
  tanggal_bayar DATE,
  bukti_bayar_url TEXT,
  dicatat_oleh UUID REFERENCES pengguna(id) ON DELETE SET NULL,
  catatan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(siswa_id, bulan, tahun)
);

CREATE INDEX idx_spp_siswa_id ON spp(siswa_id);
CREATE INDEX idx_spp_status ON spp(status);
CREATE INDEX idx_spp_bulan_tahun ON spp(bulan, tahun);

-- ============================================================
-- SEED DATA (Optional - for testing)
-- ============================================================

-- Admin user (email: admin@sekolah.id, password: password123)
-- Note: Password should be set through Supabase Auth, not here

INSERT INTO pengguna (user_id, nama, email, role, nomor_hp, alamat)
VALUES 
  -- You'll need to create auth users first via Supabase dashboard or API
  -- Then use their user_id here
  ('00000000-0000-0000-0000-000000000001'::UUID, 'Admin Sekolah', 'admin@sekolah.id', 'admin', '081234567890', 'Sekolah SMP Negeri 1');

-- Example student data
INSERT INTO siswa (nama, nis, kelas, tahun_ajaran, tanggal_lahir, jenis_kelamin, alamat)
VALUES 
  ('Ahmad Ridho', '0001', '7A', '2025/2026', '2010-05-15', 'L', 'Jl. Merdeka No. 1'),
  ('Budi Santoso', '0002', '7A', '2025/2026', '2010-08-22', 'L', 'Jl. Diponegoro No. 5'),
  ('Citra Dewi', '0003', '7B', '2025/2026', '2010-03-10', 'P', 'Jl. Sudirman No. 12');

-- Example attendance data
INSERT INTO absensi (siswa_id, tanggal, status, keterangan)
SELECT 
  s.id, 
  CURRENT_DATE - INTERVAL '1 day',
  CASE WHEN random() < 0.8 THEN 'H' ELSE 'I' END,
  NULL
FROM siswa s LIMIT 3;

-- Example SPP data
INSERT INTO spp (siswa_id, bulan, tahun, status)
SELECT 
  s.id,
  1,
  2026,
  CASE WHEN random() < 0.8 THEN 'lunas' ELSE 'belum' END
FROM siswa s;

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE pengguna ENABLE ROW LEVEL SECURITY;
ALTER TABLE siswa ENABLE ROW LEVEL SECURITY;
ALTER TABLE absensi ENABLE ROW LEVEL SECURITY;
ALTER TABLE spp ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can see all data
CREATE POLICY "Admins can view all" ON pengguna
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM pengguna WHERE role = 'admin' AND user_id = auth.uid())
  );

CREATE POLICY "Admins can view all siswa" ON siswa
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM pengguna WHERE role = 'admin' AND user_id = auth.uid())
  );

CREATE POLICY "Admins can view all absensi" ON absensi
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM pengguna WHERE role = 'admin' AND user_id = auth.uid())
  );

CREATE POLICY "Admins can view all spp" ON spp
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM pengguna WHERE role = 'admin' AND user_id = auth.uid())
  );

-- Policy: Orang tua (Parents) can only see their own children
CREATE POLICY "Parents can view their children" ON siswa
  FOR SELECT USING (
    orang_tua_id = (SELECT id FROM pengguna WHERE user_id = auth.uid())
  );

CREATE POLICY "Parents can view children attendance" ON absensi
  FOR SELECT USING (
    siswa_id IN (
      SELECT id FROM siswa 
      WHERE orang_tua_id = (SELECT id FROM pengguna WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Parents can view children spp" ON spp
  FOR SELECT USING (
    siswa_id IN (
      SELECT id FROM siswa 
      WHERE orang_tua_id = (SELECT id FROM pengguna WHERE user_id = auth.uid())
    )
  );

-- Policy: Guru (Teachers) can see all students but only edit attendance
CREATE POLICY "Teachers can view all students" ON siswa
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM pengguna WHERE role = 'guru' AND user_id = auth.uid())
  );

CREATE POLICY "Teachers can insert attendance" ON absensi
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM pengguna WHERE role = 'guru' AND user_id = auth.uid())
  );

CREATE POLICY "Teachers can update attendance" ON absensi
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM pengguna WHERE role = 'guru' AND user_id = auth.uid())
  );

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Function to get student attendance summary
CREATE OR REPLACE FUNCTION get_attendance_summary(p_siswa_id UUID, p_bulan INTEGER, p_tahun INTEGER)
RETURNS TABLE (
  hadir INT,
  izin INT,
  sakit INT,
  alpa INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(CASE WHEN status = 'H' THEN 1 END)::INT,
    COUNT(CASE WHEN status = 'I' THEN 1 END)::INT,
    COUNT(CASE WHEN status = 'S' THEN 1 END)::INT,
    COUNT(CASE WHEN status = 'A' THEN 1 END)::INT
  FROM absensi
  WHERE siswa_id = p_siswa_id
    AND EXTRACT(MONTH FROM tanggal) = p_bulan
    AND EXTRACT(YEAR FROM tanggal) = p_tahun;
END;
$$ LANGUAGE plpgsql;

-- Function to get SPP summary by class
CREATE OR REPLACE FUNCTION get_spp_summary_by_class(p_kelas VARCHAR, p_bulan INTEGER, p_tahun INTEGER)
RETURNS TABLE (
  total_siswa INT,
  lunas INT,
  belum INT,
  sebagian INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT s.id)::INT,
    COUNT(CASE WHEN spp.status = 'lunas' THEN 1 END)::INT,
    COUNT(CASE WHEN spp.status = 'belum' THEN 1 END)::INT,
    COUNT(CASE WHEN spp.status = 'sebagian' THEN 1 END)::INT
  FROM siswa s
  LEFT JOIN spp ON s.id = spp.siswa_id AND spp.bulan = p_bulan AND spp.tahun = p_tahun
  WHERE s.kelas = p_kelas;
END;
$$ LANGUAGE plpgsql;
