var vowels = ['а', 'о', 'и', 'е', 'ё', 'э', 'ы', 'у', 'ю', 'я'];
var highVowels = ['а́', 'о́', 'и́', 'е́', 'ё',' э́', 'ы́', 'у́', 'ю́', 'я́'];
var cap_vowels = ['А', 'О', 'И', 'Е', 'Ё', 'Э', 'Ы', 'У', 'Ю', 'Я'];

var data = JSON.parse(readTextFile("data.json"));
var syllablesSettings = {
  min: 6,
  max: 9
};
var stringsCount = 4;
var rhymeK = 6;

String.prototype.replaceAt = function (index, replacement) {
  return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function readTextFile(file) {
  var rawFile = new XMLHttpRequest();
  var s = "";
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        var allText = rawFile.responseText;
        s = allText;
      }
    }
  }
  rawFile.send(null);
  return s;
}

function countSyllablesInWord(s) {
  var count = 0;
  for (var i = 0; i < vowels.length; i++) {
    count += s.split(vowels[i]).length - 1;
  }
  return count;
}

function getSyllablesCount(s) {
  var count = 0;
  var split = s.split(" ");
  for (var i = 0; i < split.length; i++) {
    count += countSyllablesInWord(split[i]);
  }
  return count;
}

function generateString() {
  var string = "";
  while (getSyllablesCount(string) < syllablesSettings.min) {
    var slovo = data[randomInteger(0, data.length - 1)];
    string += slovo.word.replaceAt(slovo.sress, slovo.word[slovo.sress].toUpperCase()) + " ";
  }
  if (checkString(string)) {
    return string;
  } else {
    return generateString();
  }
}

function doesRhyme(string1, string2) {
  return string1.slice(-rhymeK, string1.length - 1) == string2.slice(-rhymeK, string2.length - 1);
}

function checkString(s) {
  return getSyllablesCount(s) > syllablesSettings.min && getSyllablesCount(s) < syllablesSettings.max;
}

function genetareDoubleString() {
  var s1 = generateString();
  var s2 = generateString();
  while (!doesRhyme(s1, s2) || getSyllablesCount(s1) != getSyllablesCount(s2) || !checkStrings(s2, s1)) {
    s1 = generateString();
    s2 = generateString();
  }
  return [s1, s2];
}

function organizePirog() {
  var strings = [];

  for (var i = 0; i < stringsCount / 2; i++) {
    var t = genetareDoubleString();
    var ok = true;
    for (var j = 0; j < strings.length; j++) {
      if (!checkStrings(t[0], strings[j]) || !checkStrings(t[1], strings[j])) {
        ok = false;
        break;
      }
    }
    if (ok) {
      strings.push(t[0]);
      strings.push(t[1]);
    } else {
      i--;
    }
  }

  if (stringsCount == 4) {
    shuffle(strings);
  }

  for (var i = 0; i < stringsCount; i++) {
    strings[i] = beautyfy(strings[i]);
  }
  strings[stringsCount - 1] = strings[stringsCount - 1].replaceAt(strings[stringsCount - 1].length - 2, ['. ', '? ', '! '][randomInteger(0, 2)]);

  return strings;
}

function checkStrings(s1, s2) {
  var words1 = s1.split(" ");
  var words2 = s2.split(" ");

  for (var i = 0; i < words1.length; i++) {
    for (var j = 0; j < words2.length; j++) {
      if (words1[i] === words2[j] && words1[i] !== "" && words2[j] !== "") {
        return false;
      }
    }
  }
  return true;
}

function generatePirog() {
  document.getElementById("about-container").innerHTML = '<div class="container"><div class="ball"></div><div class="ball"></div><div class="ball"></div><div class="ball"></div><div class="ball"></div><div class="ball"></div><div class="ball"></div></div>';

  setTimeout(function () {
    var text = organizePirog();
    document.getElementById("about-container").innerHTML = "<div id='stix' class='stix'></div>";
    for (var i = 0; i < text.length; i++) {
      document.getElementById("stix").innerHTML += "<div class='stropha'>" + text[i] + "</div>";
    }
    //Это в конце
    document.getElementById("my-button-text").innerHTML = "Ещё сочинить";
  }, 500);
}

function randomInteger(min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1)
  rand = Math.round(rand);
  return rand;
}

function beautyfy(s) {
  var words = s.split(" ").slice(0, -1);
  var a = 0;
  if (words[0][0] in highVowels) {
    a = 1
  }
  for (var i = a; i < words.length; i++) {
    for (var g = 0; g < words[i].length; g++) {
     if (findIndex(cap_vowels, words[i][g]) != -1) {
        words[i] = words[i].substr(0, g) + highVowels[findIndex(vowels, words[i][g].toLowerCase())] + words[i].substr(g + 1);
      }
    }
  }

  ss = "";
  for (var i = 0; i < words.length; i++) {
    ss += words[i] + ', ';
  }
  ss = ss.replaceAt(ss.length - 2, ['. ', '? ', '! ', ': ', '; ', ', '][randomInteger(0, 5)]);
  ss = ss.replaceAt(0, ss[0].toUpperCase());
  return ss;
}

function findIndex(arr, el) {
  for (var i = 0; i < arr.length; i++) {
    if (el === arr[i]) {
      return i;
    }
  }
  return -1;
}