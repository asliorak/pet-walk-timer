// Sayfadaki elemanları değiişkenlere atıyoruz
const timerDisplay = document.getElementById("timer");
const statusText = document.getElementById("status-text");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");
const dogRunner = document.getElementById("dog-runner");
const boneCountDisplay = document.getElementById("bone-count");

// Zaman ve durum değişkenleri
const TOTAL_TIME = 5; //25 * 60; // 25 dakika = 1500 saniye
let timeLeft = TOTAL_TIME; // kalan saniye
let timerInterval = null; // Zaman sayacını çalıştırıcak saat mekanizmaası
let isRunning = false; //Sayaç şuan akıyor mu
let completedWalks = 0; //kazanılan ödül kemiği sayısı

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60); //kalan dakikayı bul
  const seconds = timeLeft % 60;

  // Sayı tek haneliyse (örneğin 5) başına '0' ekleyip '05' yapar
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  timerDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;
}

function updateDogPosition() {
  // Geçen sürenin yüzdesini hesaplar (%0 ile %90 arası)
  const progress = (TOTAL_TIME - timeLeft) / TOTAL_TIME;
  const currentPosition = progress * 90; // Ağacın tam üstüne binmesin diye maax %90

  dogRunner.style.left = `${currentPosition}%`;
}
// Başlat butonuna basılınca
function startTimer() {
  if (isRunning) return; //Zaten çalışıyorsa ikince kez başlatma

  isRunning = true;
  statusText.textContent = "Yürüyüş başladı! Odaklanmaya devam et...";

  //setInterval: Her 1000 milisaniyede (1 saniyede) bir içindeki kodları çalıştırır
  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--; //1 saniye düş
      updateDisplay(); //Ekrana yeni süreyi yaz
      updateDogPosition(); //Köpeği biraz daha sağa kaydır
    } else {
      // Süre bittiğinde (00.00 olunca);
      clearInterval(timerInterval); // Sayıcı durdur
      isRunning = false;
      completedWalks++; // Kemik sayısını 1 artır

      statusText.textContent = "Tebrikler! Köpeğin parka vardı";
      boneCountDisplay.textContent = `🦴 x ${completedWalks}`;
      alert("Harika bir odaklanma seansı! Köpeğin parka ulaştı");
    }
  }, 1000);
}
//Duraklat Butonuna Basılınca:
function pauseTimer() {
  if (!isRunning) return;

  clearInterval(timerInterval); // Zaman akışını dondur
  isRunning = false;
  statusText.textContent = " yürüyüş duraklatıldı.";
}

//Sıfırla Butonuna Basılınca:
function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  timeLeft = TOTAL_TIME; //Süreyi tekrar 1500 saniyeye çek

  updateDisplay();
  dogRunner.style.left = "0%"; // Köpeği başa al
  statusText.textContent = "Odaklanma oturumunu başlatmaya hazırsın";
}
//Butonlara tıklama olaylarınıı (Click Event) Tanımlıyoruz
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

// Sayfa iilk açıldığında sayacı ekrana düzgün yazdıralım
updateDisplay();
