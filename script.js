// Sayfadaki elemanları değiişkenlere atıyoruz
const timerDisplay = document.getElementById("timer");
const statusText = document.getElementById("status-text");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");
const dogRunner = document.getElementById("dog-runner");
const boneCountDisplay = document.getElementById("bone-count");
const timeButtons = document.querySelectorAll(".time-btn[data-time]");
const customMinutesInput = document.getElementById("custom-minutes");
const setCustomBtn = document.getElementById("set-custom-btn");

// Zaman ve durum değişkenleri
let TOTAL_TIME = 25 * 60; // 25 dakika = 1500 saniye
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

      //Köpeği tekrardan başlangıç noktasına döndürür
      dogRunner.style.left = "0%";

      //Süreyi sıfırlar
      timeLeft = TOTAL_TIME;
      updateDisplay();

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

// Seçilen süreyi ayarlayan genel fonksiyon
function setDuration(minutes) {
  //Eğer sayaç zaten çalışıyorsa durdur
  clearInterval(timerInterval);
  isRunning = false;
  //Dakikayı saniyeye çevirip değişkenlere ata
  TOTAL_TIME = minutes * 60;
  timeLeft = TOTAL_TIME;

  //Ekranı güncelle ve köpeği başa al
  updateDisplay();
  dogRunner.style.left = "0%";
  statusText.textContent = `${minutes} dakikalık yürüyüş seçildi. Başlamaya hazır!`;
}
//BUtonlara tıklanınca
timeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    //aktif buton rengini güncelle
    timeButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const selectedMinutes = parseInt(btn.getAttribute("data-time"));
    setDuration(selectedMinutes);
  });
});
// Özel dakika girişi butonuna tıklanınca
setCustomBtn.addEventListener("click", () => {
  const enteredMinutes = parseInt(customMinutesInput.value);

  if (!enteredMinutes || enteredMinutes <= 0) {
    alert("Lütfen geçerli bir dakika giriniz!");
    return;
  }
  //Butonlardaki aktifliği kaldır
  timeButtons.forEach((b) => b.classList.remove("active"));
  setDuration(enteredMinutes);
  customMinutesInput.value = "";
});
