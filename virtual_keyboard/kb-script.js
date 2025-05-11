let layouts = {
    "EN": [
        [["kb-button", "1"], ["kb-button", "2"], ["kb-button", "3"], ["kb-button", "4"], ["kb-button", "5"], ["kb-button", "6"], ["kb-button", "7"], ["kb-button", "8"], ["kb-button", "9"], ["kb-button", "0"], ["kb-button kb-control delete", "Backspace"]],
        [["kb-button", "Q"], ["kb-button", "W"], ["kb-button", "E"], ["kb-button", "R"], ["kb-button", "T"], ["kb-button", "Y"], ["kb-button", "U"], ["kb-button", "I"], ["kb-button", "O"], ["kb-button", "P"]],
        [["kb-button", "A"], ["kb-button", "S"], ["kb-button", "D"], ["kb-button", "F"], ["kb-button", "G"], ["kb-button", "H"], ["kb-button", "J"], ["kb-button", "K"], ["kb-button", "L"]],
        [["kb-button", "Z"], ["kb-button", "X"], ["kb-button", "C"], ["kb-button", "V"], ["kb-button", "B"], ["kb-button", "N"], ["kb-button", "M"]],
    ],
    "SP": [
        [["kb-button", "1"], ["kb-button", "2"], ["kb-button", "3"], ["kb-button", "4"], ["kb-button", "5"], ["kb-button", "6"], ["kb-button", "7"], ["kb-button", "8"], ["kb-button", "9"], ["kb-button", "0"], ["kb-button kb-control delete", "Backspace"]],
        [["kb-button", "Q"], ["kb-button", "W"], ["kb-button", "E"], ["kb-button", "R"], ["kb-button", "T"], ["kb-button", "Y"], ["kb-button", "U"], ["kb-button", "I"], ["kb-button", "O"], ["kb-button", "P"], ["kb-button", "'"]],
        [["kb-button", "A"], ["kb-button", "S"], ["kb-button", "D"], ["kb-button", "F"], ["kb-button", "G"], ["kb-button", "H"], ["kb-button", "J"], ["kb-button", "K"], ["kb-button", "L"], ["kb-button", "¨"], ["kb-button", "~"]],
        [["kb-button", "Z"], ["kb-button", "X"], ["kb-button", "C"], ["kb-button", "V"], ["kb-button", "B"], ["kb-button", "N"], ["kb-button", "M"]],
    ],
    "RU": [
        [["kb-button", "Ё"], ["kb-button", "1"], ["kb-button", "2"], ["kb-button", "3"], ["kb-button", "4"], ["kb-button", "5"], ["kb-button", "6"], ["kb-button", "7"], ["kb-button", "8"], ["kb-button", "9"], ["kb-button", "0"], ["kb-button kb-control delete", "Backspace"]],
        [["kb-button", "Й"], ["kb-button", "Ц"], ["kb-button", "У"], ["kb-button", "К"], ["kb-button", "Е"], ["kb-button", "Н"], ["kb-button", "Г"], ["kb-button", "Ш"], ["kb-button", "Щ"], ["kb-button", "З"], ["kb-button", "Х"], ["kb-button", "Ъ"]],
        [["kb-button", "Ф"], ["kb-button", "Ы"], ["kb-button", "В"], ["kb-button", "А"], ["kb-button", "П"], ["kb-button", "Р"], ["kb-button", "О"], ["kb-button", "Л"], ["kb-button", "Д"], ["kb-button", "Ж"], ["kb-button", "Э"]],
        [["kb-button", "Я"], ["kb-button", "Ч"], ["kb-button", "С"], ["kb-button", "М"], ["kb-button", "И"], ["kb-button", "Т"], ["kb-button", "Ь"], ["kb-button", "Б"], ["kb-button", "Ю"]],
    ],
}

let spModTable = {
    "a": {"'": "á"},
    "A": {"'": "Á"},
    "e": {"'": "é"},
    "i": {"'": "í"},
    "y": {"'": "ý"},
    "o": {"'": "ó"},
    "O": {"'": "Ó"},
    "u": {"¨": "ü"},
    "n": {"~": "ñ"},
    "N": {"~": "Ñ"},
}

let textContainer = null;
// let deleteKey = document.querySelector(".delete");
// let enterKey = document.querySelector(".enter");
// let spaceKey = document.querySelector(".space");
// let capsLock = document.querySelector(".capslock");
// let allKey = document.querySelectorAll(".key");
let isCaps = false;
let isModifier = false;
let lastModKey = null;
let currentLang = "EN";
let userText = "";

// Make keyboard draggable:


function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById("drag-kb-button")) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById("drag-kb-button").onmousedown = dragMouseDown;
    } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function addSymbol(text) {
    // let userText = textContainer.innerText;
    if(text === "¨" || text === "'" || text === "~") {
        isModifier = true;
        lastModKey = text;
        return;
    }
    if(isModifier && text in spModTable && lastModKey in spModTable[text]) {
        text = spModTable[text][lastModKey];
    }
    isModifier = false;
    userText += text;
    textContainer.innerText = userText;
}

function switchCaps() {
    let capsKeySpan = document.querySelector(".caps-span");
    if(isCaps) {
        capsKeySpan.style.color = "gray";
    } else {
        capsKeySpan.style.color = "red";
    }
    isCaps = !isCaps;
}

function handleControlKey(key) {
    // console.log(`Processing control key ${key}`);
    if(key === "Backspace") {
        // let userText = textContainer.innerText;
        console.log(`Initial text content: ${textContainer.innerText}`);
        if(userText.length > 0) {
            userText = userText.substring(0, userText.length - 1);
            console.log(`Updated text: ${userText}`);
            textContainer.innerText = userText;
            console.log(`Updated text content: ${textContainer.innerText}`);
        }
    } else if(key === "Enter") {
        addSymbol("\n");
    } else if(key === " ") {
        addSymbol(" ");
    } else if(key === "CapsLock") {
        switchCaps();
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
    let newKb = ''
    // Add keys from layout:
    let isFirstRow = true;
    
    for(let row=0; row<layouts[currentLang].length; row++) {
        if(isFirstRow) {
            newKb += '<div class="kb-row kb-row-first">';
            isFirstRow = false;
        } else {
            newKb += '<div class="kb-row">';
        }
        for(let key=0; key<layouts[currentLang][row].length; key++) {
            // console.log(`<div class="${layouts[currentLang][row][key][0]}">${layouts[currentLang][row][key][1]}</div>`)
            newKb += `<button class="${layouts[currentLang][row][key][0]}">${layouts[currentLang][row][key][1]}</button>`;
        }
        newKb += '</div>';
    }

    const langs = Object.keys(layouts);

    let dragKeyboardButton = '<button class="drag-kb-button" id="drag-kb-button">&#10303;</button>';
    let capsLockButton = '<button class="kb-button kb-control capslock">CapsLock <span style="color:grey;" class="caps-span">&#9679;</span></button>';
    let langSwitch = `<div class="dropup"><button class="dropbtn">${currentLang}</button><div class="dropup-content">`;
    for(let i = 0; i < langs.length; i++) {
        langSwitch += `<a href="#" onclick="updateLanguage('${langs[i]}')">${langs[i]}</a>`;
    }
    langSwitch += "</div></div>";
    let spaceButton = '<button class="kb-button kb-control kb-space">Space</button>';
    let enterButton = '<button class="kb-button kb-control enter">Enter</button>';

    let lastRow = '<div class="kb-row">'
    lastRow += dragKeyboardButton;
    lastRow += capsLockButton;
    lastRow += langSwitch;
    lastRow += spaceButton;
    lastRow += enterButton;
    lastRow += "</div>";

    newKb += lastRow;
    kb.innerHTML = newKb;

    // Add event listeners for on-screen keyboard clicks (similar to your existing code)
    for (let key of document.querySelectorAll(".kb-button")) {
        key.addEventListener("click", function () {
            if(key.classList.contains("delete")) {
                handleControlKey("Backspace");
            } else if(key.classList.contains("enter")) {
                handleControlKey("Enter");
            } else if(key.classList.contains("kb-space")) {
                handleControlKey(" ");
            } else if(key.classList.contains("capslock")) {
                handleControlKey("CapsLock");
            } else {
                addSymbol(isCaps ? key.innerText.toUpperCase() : key.innerText.toLowerCase());
            }
        });
    }
    dragElement(document.getElementById("keyboard"));   // Make keyboard draggable
    isCaps = false;
    isModifier = false;
}

// Language selector button:
function updateLanguage(newLang) {
    // console.log(newLang);
    updateKeyboard(newLang);
}

// Show/hide keyboard:
function keyboardToggleVisibility() {
    var x = document.getElementById("keyboard");
    console.log(x.style.display);
    if (x.style.display === "none") {
        x.style.display = "flex";
    } else {
        x.style.display = "none";
    }
}

// Creates a hidden virtual keyboard
function createKeyboard(inputFieldClass) {
    textContainer = document.querySelector(inputFieldClass);
    updateKeyboard("EN");
    document.getElementById("keyboard").style.display = "none";
}

createKeyboard(".textContainer");
