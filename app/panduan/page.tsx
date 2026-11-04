import { IkonBuku, IkonServer } from '@/components/Ikon';

export const metadata = { title: 'Panduan Setup' };
export const dynamic = 'force-dynamic';

const LANGKAH = [
  {
    judul: 'Buat service PostgreSQL di Aiven',
    isi: 'Masuk ke console.aiven.io, pilih menu Create Service, pilih Database > PostgreSQL, lalu pilih paket Free. Beri nama misalnya "aureus-siswa". Region paling dekat (Singapore / Jakarta) dipilih supaya koneksi lebih cepat.',
    kode: 'Service name : aureus-siswa\nPlan         : Free (hobbyist)\nVersion      : PostgreSQL 17\nRegion       : Singapore',
  },
  {
    judul: 'Buat user database dan ambil connection string',
    isi: 'Di halaman service, buka tab Users & Databases, buat user baru (misalnya app_user) dengan password buatan sendiri. Lalu buka tab Overview > Service URI, pilih tipe PostgreSQL, dan salin connection string-nya. Jangan lupa mengaktifkan SSL.',
    kode: 'postgresql://app_user:PASSWORD@pg-xxxx.aivencloud.com:PORT/defaultdb?sslmode=require',
  },
  {
    judul: 'Isi .env.local dengan data koneksi',
    isi: 'Salin berkas .env.example menjadi .env.local, lalu ganti passwordnya dengan password user Aiven Anda. Jangan pernah meng-commit berkas ini.',
    kode: 'copy .env.example .env.local\n\nDATABASE_URL=mysql://avnadmin:PASSWORD@mysql-16d67d9d-...:18521/defaultdb?sslmode=require\nAIVEN_HOST=mysql-16d67d9d-...aivencloud.com\nAIVEN_PORT=18521\nAIVEN_DATABASE=defaultdb\nAIVEN_USER=avnadmin\nAIVEN_PASSWORD=PASSWORD',
  },
  {
    judul: 'Hubungkan DBeaver dan jalankan skrip SQL',
    isi: 'Buka DBeaver, buat koneksi baru (Database > New Database Connection > MySQL), isi host, port, database, user, dan password dari langkah sebelumnya, lalu aktifkan SSL dengan CA certificate D:\\ca.pem. Setelah tersambung, jalankan database/schema-mysql.sql untuk membuat tabel data_siswa.',
    kode: 'Host     : mysql-16d67d9d-achmadsyafiqkh2255-2c63.l.aivencloud.com\nPort     : 18521\nDatabase : defaultdb\nUser     : avnadmin\nSSL      : CA certificate = D:\\ca.pem\nSQL      : database/schema-mysql.sql',
  },
  {
    judul: 'Jalankan aplikasinya',
    isi: 'Pasang dependensi lalu jalankan server pengembangan. Buka http://localhost:3000 di browser. Lencana di kanan atas menunjukkan aplikasi sudah terhubung ke Aiven.>data siswa yang ditambahkan lewat aplikasi langsung terlihat di DBeaver, dan sebaliknya.',
    kode: 'npm install\nnpm run dev\n\n-> http://localhost:3000',
  },
];

const ENDPOINT = [
  { metode: 'GET', jalur: '/api/siswa', ket: 'Mengambil daftar siswa (dukung q, kelas, jurusan, status, sort, order, page, perPage)' },
  { metode: 'GET', jalur: '/api/siswa/{id}', ket: 'Mengambil detail satu siswa' },
  { metode: 'POST', jalur: '/api/siswa', ket: 'Menambah siswa baru' },
  { metode: 'PUT', jalur: '/api/siswa/{id}', ket: 'Mengubah data siswa' },
  { metode: 'DELETE', jalur: '/api/siswa/{id}', ket: 'Menghapus data siswa' },
  { metode: 'GET', jalur: '/api/statistik', ket: 'Ringkasan data untuk dasbor' },
];

export default function HalamanPanduan() {
  return (
    <>
      <div className="kepala">
        <div>
          <p className="eyebrow">Panduan</p>
          <h1 className="judul-h1">Setup Aiven, DBeaver & Aplikasi</h1>
          <p className="lede">
            Lima langkah untuk menyalakan aplikasi ini dengan database PostgreSQL di Aiven dan
            DBeaver sebagai alat management database. Halaman ini juga bisa dibuka sebagai panduan
            saat presentasi.
          </p>
        </div>
        <div className="grup-tombol">
          <span className="pil">
            <IkonServer />
            PostgreSQL 17 · Aiven
          </span>
          <span className="pil">
            <IkonBuku />
            DBeaver 24+
          </span>
        </div>
      </div>

      <div className="kartu">
        <div className="kartu-pad">
          <div className="langkah">
            {LANGKAH.map((l) => (
              <div className="langkah-item" key={l.judul}>
                <span className="langkah-no" />
                <div>
                  <h4>{l.judul}</h4>
                  <p>{l.isi}</p>
                  <pre className="blok-kode">{l.kode}</pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 22 }}>
        <div className="kartu">
          <div className="judul-bagian">
            <h2 className="judul-seksi">Struktur Data (ERD)</h2>
            <p className="nama-sub">Schema sekolah, sudah ternormalisasi 1NF</p>
          </div>
          <div className="kartu-pad">
            <div className="erd">
              <div className="erd-kepala">sekolah . data_siswa</div>
              <div className="erd-baris erd-kunci">
                <span className="erd-nama">id</span>
                <span className="erd-tipe">SERIAL · PK</span>
              </div>
              <div className="erd-baris">
                <span className="erd-nama">nis</span>
                <span className="erd-tipe">VARCHAR(20) · UNIQUE</span>
              </div>
              <div className="erd-baris">
                <span className="erd-nama">nama</span>
                <span className="erd-tipe">VARCHAR(100)</span>
              </div>
              <div className="erd-baris">
                <span className="erd-nama">kelas</span>
                <span className="erd-tipe">VARCHAR(10)</span>
              </div>
              <div className="erd-baris">
                <span className="erd-nama">jurusan</span>
                <span className="erd-tipe">VARCHAR(80)</span>
              </div>
              <div className="erd-baris">
                <span className="erd-nama">status</span>
                <span className="erd-tipe">VARCHAR(10) · CHECK</span>
              </div>
              <div className="erd-baris">
                <span className="erd-nama">created_at</span>
                <span className="erd-tipe">TIMESTAMPTZ</span>
              </div>
            </div>
          </div>
        </div>

        <div className="kartu">
          <div className="judul-bagian">
            <h2 className="judul-seksi">Dokumentasi REST API</h2>
            <p className="nama-sub">Semua endpoint memakai prefix /api</p>
          </div>
          <div className="kartu-pad">
            <div className="tabel-wrap">
              <table className="tabel" style={{ fontSize: 13 }}>
                <thead>
                  <tr>
                    <th>Metode</th>
                    <th>Endpoint</th>
                    <th>Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {ENDPOINT.map((e) => (
                    <tr key={`${e.metode} ${e.jalur}`}>
                      <td>
                        <span className="kode">{e.metode}</span>
                      </td>
                      <td>
                        <span className="kode">{e.jalur}</span>
                      </td>
                      <td style={{ color: 'var(--teks-2)' }}>{e.ket}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="petunjuk" style={{ marginTop: 16 }}>
              Balaban sukses berbentuk <span className="kode">{'{ ok: true, data: ... }'}</span>.
              Bila gagal, server membalas <span className="kode">{'{ ok: false, galat: {...} }'}</span>{' '}
              dengan kode status 400 (validasi), 404 (tidak ditemukan), atau 409 (NIS duplikat).
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
