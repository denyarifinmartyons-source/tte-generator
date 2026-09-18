// Aset Logo dalam Format Base64 / URL Gambar
const LOGO_KEMENSOS = 'https://upload.wikimedia.org/wikipedia/commons/2/23/Logo_Kementerian_Sosial_Republik_Indonesia.png';
const LOGO_SEKOLAH_RAKYAT = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Logo_Sekolah_Rakyat.png/600px-Logo_Sekolah_Rakyat.png';

let uploadedImageBase64 = null;
let qrCodeStyling = null;

// Inisialisasi Signature Pad
const canvas = document.getElementById('signature-canvas');
const signaturePad = new SignaturePad(canvas, {
  backgroundColor: 'rgba(255, 255, 255, 0)'
});

function resizeCanvas() {
  const ratio = Math.max(window.devicePixelRatio || 1, 1);
  canvas.width = canvas.offsetWidth * ratio;
  canvas.height = canvas.offsetHeight * ratio;
  canvas.getContext("2d").scale(ratio, ratio);
  signaturePad.clear();
}

window.addEventListener("resize", resizeCanvas);
setTimeout(resizeCanvas, 100);

function clearCanvas() {
  signaturePad.clear();
  uploadedImageBase64 = null;
  document.getElementById('upload-ttd').value = '';
}

function handleUploadTTD(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      uploadedImageBase64 = e.target.result;
      signaturePad.clear(); // Bersihkan canvas jika ada file terunggah
    };
    reader.readAsDataURL(file);
  }
}

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

function generateTTE() {
  const nama = document.getElementById('nama').value.trim();
  const nip = document.getElementById('nip').value.trim();
  const jabatan = document.getElementById('jabatan').value.trim();
  const instansi = getSelectedInstansi();

  if (!nama || !nip || !jabatan) {
    alert("Harap lengkapi semua field Data Pegawai!");
    return;
  }

  // Ambil Sumber Gambar TTD (Dari Upload atau Dari Canvas)
  let ttdSource = null;
  if (uploadedImageBase64) {
    ttdSource = uploadedImageBase64;
  } else if (!signaturePad.isEmpty()) {
    ttdSource = signaturePad.toDataURL("image/png");
  } else {
    alert("Harap unggah file TTD atau buat coretan TTD pada canvas terlebih dahulu!");
    return;
  }

  // 1. Tampilkan Data Pegawai ke Pratinjau
  document.getElementById('res-instansi').innerText = instansi.nama;
  document.getElementById('res-nama').innerText = nama;
  document.getElementById('res-nip').innerText = nip;
  document.getElementById('res-jabatan').innerText = jabatan;
  document.getElementById('res-ttd').src = ttdSource;
  
  const SEKARANG = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  document.getElementById('res-waktu').innerText = `Diverifikasi pada: ${SEKARANG.toLocaleDateString('id-ID', options)} WIB`;

  // 2. Generate QR Code Berlogo
  const qrDataText = `TTE VERIFIED\nNama: ${nama}\nNIP: ${nip}\nJabatan: ${jabatan}\nInstansi: ${instansi.nama}`;

  document.getElementById('qrcode-box').innerHTML = ''; // Clear QR lama

  qrCodeStyling = new QRCodeStyling({
    width: 120,
    height: 120,
    type: "svg",
    data: qrDataText,
    image: instansi.logo,
    dotsOptions: {
      color: "#1a365d",
      type: "rounded"
    },
    backgroundOptions: {
      color: "#ffffff",
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 3,
      imageSize: 0.35
    }
  });

  qrCodeStyling.append(document.getElementById('qrcode-box'));

  // 3. Tampilkan Tampilan Pratinjau
  document.getElementById('empty-state').style.display = 'none';
  document.getElementById('preview-area').style.display = 'block';
}

function downloadTTE() {
  const targetCard = document.getElementById('tte-card-result');
  const namaPegawai = document.getElementById('nama').value.trim() || 'Pegawai';

  html2canvas(targetCard, {
    useCORS: true,
    scale: 3, // Resolusi tinggi
    backgroundColor: null
  }).then(canvas => {
    const link = document.createElement('a');
    link.download = `TTE_${namaPegawai.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}