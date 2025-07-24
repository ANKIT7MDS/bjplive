const url = 'https://script.google.com/macros/s/AKfycbxZhcfU-fSRpFCgvqhAVUiSUJNquaaZNEY-3DbPF_d3dDQisATFcGLH5_kbN-iebqB0/exec';
document.querySelectorAll('select[name="मंडल"]')[0].innerHTML += '<option>मंडल‑1</option><option>मंडल‑2</option>';
document.querySelectorAll('select[name="आने का कारण"]')[0].innerHTML += '<option>कारण‑1</option><option>कारण‑2</option>';

const video = document.getElementById('camera-stream');
const canvas = document.getElementById('canvas');
const img = document.getElementById('selfie-img');
const captureBtn = document.getElementById('capture');
const form = document.getElementById('myForm');
const msg = document.getElementById('message');

let width = 320, height = 0, streaming = false;

navigator.mediaDevices.getUserMedia({ video:true })
  .then(stream => {
    video.srcObject = stream;
    video.play();
  })
  .catch(err => msg.textContent = 'कैमरा एक्सेस अस्वीकृत');

video.addEventListener('canplay', e => {
  if (!streaming) {
    height = video.videoHeight / (video.videoWidth/width);
    video.setAttribute('width', width);
    video.setAttribute('height', height);
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    streaming = true;
  }
});

captureBtn.addEventListener('click', () => {
  canvas.getContext('2d').drawImage(video,0,0,width,height);
  img.src = canvas.toDataURL('image/png');
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(form);
  if (!img.src) return msg.textContent = 'कृपया सेल्फी लें।';
  data.append('Selfie', img.src);
  fetch(url, {
    method:'POST',
    body: new URLSearchParams(data)
  })
  .then(r => r.json())
  .then(res => {
    if (res.result=='success') msg.textContent = 'सबमिट सफल!';
    else msg.textContent = 'त्रुटि: '+res.error;
  })
  .catch(err => msg.textContent = 'नेटवर्क त्रुटि: '+err);
});
