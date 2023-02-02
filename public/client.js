'use strict'

var search = document.querySelector('[type=search]');
var code = document.querySelector('pre');

search.addEventListener('keyup', function(){
  var xhr = new XMLHttpRequest;
  xhr.open('GET', '/search/' + search.value, true);
  xhr.onload = function(){
    if (xhr.readyState === 4) {
      code.textContent = xhr.responseText;
    }
  };
  xhr.send();
}, false);