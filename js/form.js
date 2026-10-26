
const form = document.getElementById("form");
const namaInput = document.getElementById("nama");
const hargaInput = document.getElementById("harga");
const templateSelect = document.getElementById("template");
const captionOutput = document.getElementById("caption");
const feedback = document.getElementById("form-feedback");
const copyButton = document.getElementById("copyButton");

const namaError = document.getElementById("nama-error");
const hargaError = document.getElementById("harga-error");

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value);
}

function validateNama() {
  const nama = namaInput.value.trim();

  if (nama.length < 3) {
    namaError.textContent = "Nama produk minimal 3 karakter.";
    namaInput.classList.add("invalid");
    namaInput.classList.remove("valid");
    return false;
  }

  namaError.textContent = "";
  namaInput.classList.remove("invalid");
  namaInput.classList.add("valid");
  return true;
}

function validateHarga() {
  const harga = hargaInput.value.trim();
  const nilaiHarga = Number(harga);

  if (harga === "" || !Number.isFinite(nilaiHarga) || nilaiHarga <= 0) {
    hargaError.textContent = "Harga harus berupa angka lebih dari 0.";
    hargaInput.classList.add("invalid");
    hargaInput.classList.remove("valid");
    return false;
  }

  if (!Number.isInteger(nilaiHarga)) {
    hargaError.textContent = "Harga harus berupa bilangan bulat.";
    hargaInput.classList.add("invalid");
    hargaInput.classList.remove("valid");
    return false;
  }

  hargaError.textContent = "";
  hargaInput.classList.remove("invalid");
  hargaInput.classList.add("valid");
  return true;
}

function generateCaption(nama, harga, template) {
  const hargaFormat = formatRupiah(harga);

  const templates = {
    promo: `🔥 PROMO SPESIAL 🔥

Kenalan dengan ${nama}!

Sekarang kamu bisa mendapatkan ${nama} hanya dengan ${hargaFormat}.

Jangan sampai ketinggalan kesempatan ini. Yuk, pesan sekarang sebelum kehabisan!

#Promo #ProdukPilihan #BelanjaHemat`,

    santai: `Hai, teman-teman! 👋

Lagi cari sesuatu yang menarik? Kenalan, yuk, dengan ${nama}!

Dengan harga ${hargaFormat}, kamu sudah bisa membawa pulang produk ini.

Tunggu apa lagi? Yuk, cek sekarang!

#Rekomendasi #ProdukFavorit #BelanjaAsyik`,

    formal: `INFORMASI PRODUK

Nama Produk: ${nama}
Harga: ${hargaFormat}

${nama} hadir sebagai salah satu pilihan produk yang dapat Anda pertimbangkan sesuai kebutuhan.

Untuk informasi lebih lanjut mengenai produk dan ketersediaannya, silakan hubungi penjual.

Terima kasih atas kepercayaan Anda.`
  };

  return templates[template];
}

function showFeedback(message, type) {
  feedback.textContent = message;
  feedback.className = type;
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const namaValid = validateNama();
  const hargaValid = validateHarga();

  if (!namaValid || !hargaValid) {
    captionOutput.value = "";
    showFeedback("Periksa kembali input yang kamu masukkan.", "error");

    if (!namaValid) {
      namaInput.focus();
    } else {
      hargaInput.focus();
    }

    return;
  }

  const nama = namaInput.value.trim();
  const harga = Number(hargaInput.value);
  const template = templateSelect.value;

  captionOutput.value = generateCaption(nama, harga, template);

  showFeedback("Caption berhasil dibuat. Kamu bisa menyalinnya.", "success");
});

namaInput.addEventListener("input", function () {
  if (namaInput.value.trim().length > 0) {
    validateNama();
  } else {
    namaError.textContent = "";
    namaInput.classList.remove("invalid", "valid");
  }
});

hargaInput.addEventListener("input", function () {
  if (hargaInput.value.trim() !== "") {
    validateHarga();
  } else {
    hargaError.textContent = "";
    hargaInput.classList.remove("invalid", "valid");
  }
});

templateSelect.addEventListener("change", function () {
  feedback.textContent = "";

  if (captionOutput.value.trim() !== "") {
    const namaValid = validateNama();
    const hargaValid = validateHarga();

    if (namaValid && hargaValid) {
      captionOutput.value = generateCaption(
        namaInput.value.trim(),
        Number(hargaInput.value),
        templateSelect.value
      );

      showFeedback("Template caption berhasil diperbarui.", "success");
    }
  }
});

copyButton.addEventListener("click", async function () {
  const caption = captionOutput.value.trim();

  if (caption === "") {
    showFeedback("Buat caption terlebih dahulu sebelum menyalin.", "error");
    return;
  }

  try {
    await navigator.clipboard.writeText(caption);
    showFeedback("Caption berhasil disalin ke clipboard.", "success");
  } catch (error) {
    captionOutput.focus();
    captionOutput.select();

    const copied = document.execCommand("copy");

    if (copied) {
      showFeedback("Caption berhasil disalin.", "success");
    } else {
      showFeedback("Salin caption secara manual dari kotak hasil.", "error");
    }
  }
});
