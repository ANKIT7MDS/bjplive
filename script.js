const url = 'YOUR_GOOGLE_WEBAPP_URL'; // <-- इसे अपने actual Apps Script URL से बदलें

const mandalList = [
  'भेन्सोदा','भानपुरा','गरोड़','मेलखेड़ा','खादवदा','शामगढ़','सुवासरा','बसई',
  'सितामऊ ग्रामीण','सितामऊ','क्यामपुरा','गुर्जरबाड़िया','धुंधड़का','पिपलिया मंडी',
  'बुढ़ा','मल्हारगढ़','डालोदा','मगरामाता जी','मंदसौर ग्रामीण','मंदसौर दक्षिण','मंदसौर उत्तर'
];

const reasonList = [
  'कार्यालय पर बैठक में',
  'माननीय जिला अध्यक्ष जी से किसी कार्य हेतु भेट',
  'ट्रांसफर या अन्य कोई शासकीय कार्य / शिकायत',
  'कार्यालय पर सामान्य उपस्थिति',
  'अन्य कोई कार्य'
];

mandalList.forEach(m => document.querySelector('select[name="मंडल"]').innerHTML += `<option value="${m}">${m}</option>`);
reasonList.forEach(r => document.querySelector('select[name="आने का कारण"]').innerHTML += `<option value="${r}">${r}</option>`);

const video = document.getElementById('camera-stream');
const canvas = document.getElementById('canvas');
const img = document.getElementById('selfie-img');
const captureBtn = document.getElementById('capture');
const form = document.getElementById('myForm');

let width = 320, height = 0, streaming = false;

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
    video.play();
  })
  .catch(() => alert('कैमरा एक्सेस नहीं मिला'));

video.addEventListener('canplay', () => {
  if (!streaming) {
    height = video.videoHeight / (video.videoWidth / width);
    video.setAttribute('width', width);
    video.setAttribute('height', height);
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    streaming = true;
  }
});

captureBtn.addEventListener('click', () => {
  canvas.getContext('2d').drawImage(video, 0, 0, width, height);
  const imageData = canvas.toDataURL('image/png');
  img.src = imageData;
});

form.addEventListener('submit', e => {
  e.preventDefault();
  if (!img.src || !img.src.startsWith('data:image')) {
    alert('कृपया पहले सेल्फी लें');
    return;
  }

  const data = new FormData(form);
  data.append('Selfie', img.src);

  fetch(url, {
    method: 'POST',
    body: new URLSearchParams(data)
  })
    .then(r => r.json())
    .then(res => {
      if (res.result === 'success') {
        alert('✅ फ़ॉर्म सफलतापूर्वक सबमिट हुआ!');
        form.reset();
        img.src = '';
      } else {
        alert('❌ त्रुटि: ' + res.error);
      }
    })
    .catch(err => alert('नेटवर्क त्रुटि: ' + err));
});
