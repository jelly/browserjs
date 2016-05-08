// Globals for now..
var userPrompt = 'guest@title:/$ ';

function getChar(event) {
  return String.fromCharCode(event.keyCode || event.charCode);
}

function newline(element, text) {
  var p = document.createElement('p');
  p.innerText = text;
  element.appendChild(p);
}

function executeCommand(display, cmd) {
  switch (cmd) {
  case 'clear':
    while (display.hasChildNodes()) {
      display.removeChild(display.childNodes[0]);
    }
  break;
  case 'ls':
    newline(display, 'blog index.html');
  break;
  case 'pwd':
    newline(display, '/');
  break;
  default:
    newline(display, '-shelljs: ' + cmd + ': command not found');
  break;
}
}

document.addEventListener('DOMContentLoaded', function() {
  // FIXME: those globals..
  var cursor = document.getElementById('cursor');
  var display = document.getElementById('display');
  var text = document.getElementById('text');

  setInterval(function() {
    if (cursor.className) {
      cursor.className = '';
    } else {
      cursor.className = 'cursor-on';
    }
  }, 800);

  document.onkeydown = function(event) {
    switch (event.keyCode) {
      // Backspace
      case 8:
        event.preventDefault();

        if (text.innerText.length > 0) {
          text.innerText = text.innerText.slice(0, -1);
        }
      break;
    }
  };

  document.onkeypress = function(event) {
    // FIXME: when inserting text, disable cursor blinking..

    switch (event.keyCode) {
    // Enter
    case 13:
      var p = document.createElement('p');
      p.innerText = userPrompt + text.innerText;

      display.appendChild(p);
      executeCommand(display, text.innerText);

      text.innerText = '';
    break;
    // Space
    case 32:
      text.innerText += '\u00A0';
    break;
    default:
      var character = getChar(event || window.event);
      // Any other special key
      if (character) {
        text.innerText += character;
      }

  }

    cursor.scrollIntoView({block: 'end', behavior: 'smooth'});
  };
});
