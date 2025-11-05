/*login*/
const loginBtn = document.getElementById('loginBtn');
const lupaBtn = document.getElementById('lupaBtn');
const daftarBtn = document.getElementById('daftarBtn');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const closeModal = document.getElementById('closeModal');
const modalText = document.getElementById('modalText');

loginBtn.addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const pengguna = dataPengguna.find(user => user.email === email && user.password === password);

    if(pengguna) {
        alert(`Login berhasil! Selamat datang, ${pengguna.nama}`);
        sessionStorage.setItem("userLogin", JSON.stringify(pengguna));
        window.location.href = "dashboard.html";
    } else {
        alert("Email/password yang anda masukkan salah");
    }
});

function openModal(text) {
    modal.style.display = "block";
    modalText.textContent = text;
}

lupaBtn.addEventListener('click', () => {
    openModal("Masukkan email Anda untuk reset password.");
});

daftarBtn.addEventListener('click', () => {
    openModal("Isi data untuk mendaftar akun baru.");
});

closeModal.addEventListener('click', () => {
    modal.style.display = "none";
});

window.addEventListener('click', (e) => {
    if(e.target === modal) {
        modal.style.display = "none";
    }
});

/*dashboard*/
function tampilkanGreeting() {
  const jam = new Date().getHours();
  let sapaan;

  if (jam < 12) sapaan = "Selamat Pagi";
  else if (jam < 18) sapaan = "Selamat Siang";
  else sapaan = "Selamat Malam";

  const nama = localStorage.getItem("namaUser") || "";
  document.getElementById("greeting").textContent =
    `${sapaan}, ${nama}! Selamat datang di Dashboard Toko Buku.`;
}

/*katalog*/
function tampilkanKatalog() {
    const tbody = document.querySelector("#tabelStok tbody");
    tbody.innerHTML = ""; 

    dataKatalogBuku.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.kode}</td>
            <td>${item.nama}</td>
            <td>${item.jenis}</td>
            <td>${item.edisi}</td>
            <td>${item.stok}</td>
            <td>${item.harga}</td>
            <td><img src="${item.cover}" alt="${item.nama}" style="width:60px; border-radius:5px;"></td>
        `;
        tbody.appendChild(row);
    });
}

document.addEventListener("DOMContentLoaded", tampilkanKatalog);

/*tracking*/
function tampilkanTracking() {
    var nomor = document.getElementById("nomorDO").value.trim();
    var hasilDiv = document.getElementById("hasilTracking");
    var riwayatList = document.getElementById("riwayat");

    if (dataTracking[nomor]) {
        var data = dataTracking[nomor];
        document.getElementById("namaPemesan").textContent = data.nama;
        document.getElementById("status").textContent = data.status;
        document.getElementById("ekspedisi").textContent = data.ekspedisi;
        document.getElementById("tanggal").textContent = data.tanggalKirim;
        document.getElementById("jenis").textContent = data.paket;
        document.getElementById("total").textContent = data.total;

        document.getElementById("progress").style.width = data.progress + "%";
        if (data.progress === 100) {
            document.getElementById("progress").style.backgroundColor = "#16a34a";
        } else {
            document.getElementById("progress").style.backgroundColor = "#facc15";
        }

        riwayatList.innerHTML = "";
        data.perjalanan.forEach(item => {
            let li = document.createElement("li");
            li.innerHTML = `<strong>${item.waktu}</strong> - ${item.keterangan}`;
            riwayatList.appendChild(li);
        });

        hasilDiv.style.display = "block";
    } else {
        alert("Nomor Delivery Order tidak ditemukan!");
        hasilDiv.style.display = "none";
    }
}

/*chekout*/
document.getElementById("formPemesanan").addEventListener("submit", function(e) {
  e.preventDefault();

  var nama = document.getElementById("nama").value;
  var buku = document.getElementById("buku").value;
  var jumlah = document.getElementById("jumlah").value;
  var metode = document.getElementById("metode").value;
  var total = document.getElementById("total").value;
  var dataLama = JSON.parse(localStorage.getItem("riwayatTransaksi")) || [];
  var transaksiBaru = {
    namaPemesan: nama,
    bukuDipesan: buku + " (" + jumlah + " pcs)",
    metode: metode,
    total: "Rp " + total,
    status: "Menunggu Pembayaran"
  };

  dataLama.push(transaksiBaru);
  localStorage.setItem("riwayatTransaksi", JSON.stringify(dataLama));

  alert("Pemesanan berhasil! Data disimpan ke riwayat transaksi.");

  document.getElementById("formPemesanan").reset();
  window.location.href = "dashboard.html";
});

/*history*/
const tbody = document.querySelector("#tabelTransaksi tbody");

function ambilHistory() {
  return JSON.parse(localStorage.getItem("riwayatTransaksi")) || [];
}

function tampilkanHistory() {
  const history = ambilHistory();
  tbody.innerHTML = "";

  if (history.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4">Belum ada transaksi.</td></tr>`;
    return;
  }

  history.forEach(item => {
    const row = `
      <tr>
        <td>${item.nama}</td>
        <td>${item.metode}</td>
        <td>Rp ${item.total.toLocaleString("id-ID")}</td>
        <td>${item.tanggal}</td>
      </tr>`;
    tbody.innerHTML += row;
  });
}


function hapusHistory() {
  if (confirm("Yakin ingin menghapus semua riwayat transaksi?")) {
    localStorage.removeItem("riwayatTransaksi"); 
    tampilkanHistory();
    alert("Riwayat transaksi berhasil dihapus!");
  }
}


document.addEventListener("DOMContentLoaded", tampilkanHistory);
