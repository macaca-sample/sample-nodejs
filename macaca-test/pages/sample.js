document.querySelector('#hover_text').onmouseover = function() {
  document.getElementById('hover_text').style.color = 'red';
};

document.querySelector('#alert_button').onclick = function() {
  alert('this message is from alert');
};

document.querySelector('#userAgent').innerHTML = navigator.userAgent;
