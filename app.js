// Globals for now..
var userPrompt = 'guest@title:/$ ';
var path = '/';

function getChar(event) {
  return String.fromCharCode(event.keyCode || event.charCode);
}

function newline(element, text) {
  var p = document.createElement('p');
  p.innerText = text;
  element.appendChild(p);
}

function readfile(file, callback) {
	fetch(file, { method: 'get' }).then(function(response) { 
    if (response.status === 200) {
      return response.text(); 
    } else {
      return '';
    }
	}).then(function(content) { 
		callback(content);
	});
}

function executeCommand(display, cmdstr) {
  // Handle null string case.
  if (cmdstr.length === 0) {
    newline(display, '');
    return;
  }

  var arg = '';
  var args = cmdstr.split('\u00A0');

  // TODO: handle multiple arguments?
  if (args.length >= 2) {
    arg = args[1];
  }

  var cmd = args[0];

  switch (cmd) {
    case 'cat':
      var file = window.location.origin + path + arg;
			readfile(file, function(text) {
        if (text === '') {
          newline(display, 'cat: \'' + arg + '\': No such file or directory');
        } else {
          newline(display, text);
        }
      });
    break;
    case 'clear':
      while (display.hasChildNodes()) {
        display.removeChild(display.childNodes[0]);
      }
    break;
    case 'echo':
      newline(display, arg);
    break;
    case 'ls':
      var dir = window.location.origin + path + arg;

      readfile(dir, function(content) {

        if (content !== '') {
          var text = '';
          parser = new DOMParser();
          htmlDoc = parser.parseFromString(content, 'text/html');

          var elements = htmlDoc.getElementsByTagName('a');
          for (var i = 0; i < elements.length; i++) {
            text += ' ' + elements[i].innerText;
          }

          newline(display, text);
        } else {
          newline(display, 'ls: cannot access \'' + arg + '\': No such file or directory');
        }
      });

    break;
    case 'pwd':
      newline(display, path);
    break;
    default:
      newline(display, '-shelljs: ' + cmd + ': command not found');
    break;
  }
}

function cursorBlink() {
  var cursor = document.getElementById('cursor');
  if (cursor.className) {
    cursor.className = '';
  } else {
    cursor.className = 'cursor-on';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // FIXME: those globals..
  var display = document.getElementById('display');
  var text = document.getElementById('text');
  var interval = setInterval(cursorBlink, 800);

  document.onkeydown = function(event) {
    switch (event.keyCode) {
      // Backspace
      case 8:
        event.preventDefault();

        if (text.innerText.length > 0) {
          text.innerText = text.innerText.slice(0, -1);
        }
      break;
      // Tab
      case 9:
        event.preventDefault();
      break;
    }
  };

  document.onkeypress = function(event) {
    clearInterval(interval);

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

  interval = setInterval(cursorBlink, 800);
  cursor.scrollIntoView({block: 'end', behavior: 'smooth'});

  };
});
