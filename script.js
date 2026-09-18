// Link Logo Instansi
const LOGO_KEMENSOS = 'https://upload.wikimedia.org/wikipedia/commons/2/23/Logo_Kementerian_Sosial_Republik_Indonesia.png';
const LOGO_SEKOLAH_RAKYAT = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Logo_Sekolah_Rakyat.png/600px-Logo_Sekolah_Rakyat.png';

let qrCodeStyling = null;

function getSelectedInstansi() {
  const radios = document.getElementsByName('instansi');
  for (const radio of radios) {
    if (radio.checked) {
      if (radio.value === 'kemensos') {
        return {
          nama: 'Sentra "Bahagia" di Medan',
          logo: LOGO_KEMENSOS
        };
      } else {
        return {
          nama: 'Sekolah Rakyat Menengah Pertama 2 Medan',
          logo: LOGO_SEKOLAH_RAKYAT
        };
      }
    }
  }
}

function generateQRCode() {
  const nama = document.getElementById('nama').value.trim();
  const nip = document.getElementById('nip').value.trim();
  const jabatan = document.getElementById('jabatan').value.trim();
  const instansi = getSelectedInstansi();

  if (!nama || !nip || !jabatan) {
    alert("Harap lengkapi semua field Data Pegawai!");
    return;
  }

  const SEKARANG = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const tanggalFormat = SEKARANG.toLocaleDateString('id-ID', options);

  // Isi data teks tersembunyi di dalam QR Code
  const qrDataText = `Tanda Tangan Elektronik Sah\nNama: ${nama}\nNIP: ${nip}\nJabatan: ${jabatan}\nInstansi: ${instansi.nama}\nTanggal: ${tanggalFormat}`;

  // Reset area QR
  document.getElementById('qrcode-box').innerHTML = '';

  // Buat QR Code Murni Berlogo
  qrCodeStyling = new QRCodeStyling({
    width: 250,
    height: 250,
    type: "canvas",
    data: qrDataText,
    image: instansi.logo,
    dotsOptions: {
      color: "#000000",
      type: "square"
    },
    backgroundOptions: {
      color: "#ffffff",
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 4,
      imageSize: 0.28
    }
  });

  qrCodeStyling.append(document.getElementById('qrcode-box'));

  // Tampilkan pratinjau
  document.getElementById('empty-state').style.display = 'none';
  document.getElementById('preview-area').style.display = 'block';
}

function downloadQRCode() {
  if (qrCodeStyling) {
    const namaPegawai = document.getElementById('nama').value.trim() || 'Barcode';
    
    // Unduh MURNI file gambar QR Code-nya saja
    qrCodeStyling.download({
      name: `Barcode_TTD_${namaPegawai.replace(/\s+/g, '_')}`,
      extension: "png"
    });
  }
}
