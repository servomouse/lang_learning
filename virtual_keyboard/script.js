let layouts = {
    "EN": [
        [["key", "1"], ["key", "2"], ["key", "3"], ["key", "4"], ["key", "5"], ["key", "6"], ["key", "7"], ["key", "8"], ["key", "9"], ["key", "0"], ["key control delete", "Backspace"]],
        [["key", "Q"], ["key", "W"], ["key", "E"], ["key", "R"], ["key", "T"], ["key", "Y"], ["key", "U"], ["key", "I"], ["key", "O"], ["key", "P"]],
        [["key", "A"], ["key", "S"], ["key", "D"], ["key", "F"], ["key", "G"], ["key", "H"], ["key", "J"], ["key", "K"], ["key", "L"]],
        [["key", "Z"], ["key", "X"], ["key", "C"], ["key", "V"], ["key", "B"], ["key", "N"], ["key", "M"]],
    ],
    "RU": [
        [["key", "Ё"], ["key", "1"], ["key", "2"], ["key", "3"], ["key", "4"], ["key", "5"], ["key", "6"], ["key", "7"], ["key", "8"], ["key", "9"], ["key", "0"], ["key control delete", "Backspace"]],
        [["key", "Й"], ["key", "Ц"], ["key", "У"], ["key", "К"], ["key", "Е"], ["key", "Н"], ["key", "Г"], ["key", "Ш"], ["key", "Щ"], ["key", "З"], ["key", "Х"], ["key", "Ъ"]],
        [["key", "Ф"], ["key", "Ы"], ["key", "В"], ["key", "А"], ["key", "П"], ["key", "Р"], ["key", "О"], ["key", "Л"], ["key", "Д"], ["key", "Ж"], ["key", "Э"]],
        [["key", "Я"], ["key", "Ч"], ["key", "С"], ["key", "М"], ["key", "И"], ["key", "Т"], ["key", "Ь"], ["key", "Б"], ["key", "Ю"]],
    ],
}

let textContainer = document.querySelector(".textContainer");
// let deleteKey = document.querySelector(".delete");
// let enterKey = document.querySelector(".enter");
// let spaceKey = document.querySelector(".space");
// let capsLock = document.querySelector(".capslock");
// let allKey = document.querySelectorAll(".key");
let isCaps = false;
let currentLang = "EN";

function addSymbol(text) {
    let userText = textContainer.innerText;
    textContainer.innerText = userText + text;
}

function handleControlKey(key) {
    if(key === "Backspace") {
        let userText = textContainer.innerText;
        textContainer.innerText = userText.substring(0, userText.length - 1);
    } else if(key === "Enter") {
        addSymbol("\n");
    } else if(key === " ") {
        addSymbol(" ");
    } else if(key === "CapsLock") {
        capsLock.click();
    }
}

// Physical keyboard handler
document.addEventListener("keydown", function (event) {
    let key = event.key;

    if(key.length === 1) {
        addSymbol(isCaps ? key.toUpperCase() : key.toLowerCase());
    } else {
        handleControlKey(key);
    }
});

function updateKeyboard(lang) {
    currentLang = lang;
    let kb = document.querySelector(".keyboard");
    kb.innerHTML = "";
    let newKb = ""
    // Add keys from layout:
    console.log(layouts[currentLang].length);
    
    for(let row=0; row<layouts[currentLang].length; row++) {
        newKb += '<div class="row">';
        for(let key=0; key<layouts[currentLang][row].length; key++) {
            console.log(`<div class="${layouts[currentLang][row][key][0]}">${layouts[currentLang][row][key][1]}</div>`)
            newKb += `<div class="${layouts[currentLang][row][key][0]}">${layouts[currentLang][row][key][1]}</div>`;
        }
        newKb += '</div>';
    }

    let lastRow = '<div class="row"><div class="key control capslock">CapsLock</div><div class="dropup">'
    lastRow += `<button class="dropbtn">${currentLang}</button><div class="dropup-content">`;
    const langs = Object.keys(layouts);
    for(let i = 0; i < langs.length; i++) {
        lastRow += `<a href="#" onclick="updateLanguage('${langs[i]}')">${langs[i]}</a>`;
    }
    lastRow += '</div></div><div class="key control space"></div><div class="key control enter">Enter</div></div>';
    newKb += lastRow;
    console.log(newKb);
    kb.innerHTML = newKb;

    // Add event listeners for on-screen keyboard clicks (similar to your existing code)
    for (let key of document.querySelectorAll(".key")) {
        key.addEventListener("click", function () {
            if(key.classList.contains("delete")) {
                handleControlKey("Backspace");
            } else if(key.classList.contains("enter")) {
                handleControlKey("Enter");
            } else if(key.classList.contains("space")) {
                handleControlKey(" ");
            } else if(key.classList.contains("capslock")) {
                handleControlKey("CapsLock");
            } else {
                addSymbol(key.innerText);
            }
        });
    }
}

// Language selector button:
function updateLanguage(newLang) {
    console.log(newLang);
    updateKeyboard(newLang);
}

updateKeyboard("EN");
