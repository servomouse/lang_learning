let layouts = {
    "EN": [
        [["kb-button", "1"], ["kb-button", "2"], ["kb-button", "3"], ["kb-button", "4"], ["kb-button", "5"], ["kb-button", "6"], ["kb-button", "7"], ["kb-button", "8"], ["kb-button", "9"], ["kb-button", "0"], ["kb-button control delete", "Backspace"]],
        [["kb-button", "Q"], ["kb-button", "W"], ["kb-button", "E"], ["kb-button", "R"], ["kb-button", "T"], ["kb-button", "Y"], ["kb-button", "U"], ["kb-button", "I"], ["kb-button", "O"], ["kb-button", "P"]],
        [["kb-button", "A"], ["kb-button", "S"], ["kb-button", "D"], ["kb-button", "F"], ["kb-button", "G"], ["kb-button", "H"], ["kb-button", "J"], ["kb-button", "K"], ["kb-button", "L"]],
        [["kb-button", "Z"], ["kb-button", "X"], ["kb-button", "C"], ["kb-button", "V"], ["kb-button", "B"], ["kb-button", "N"], ["kb-button", "M"]],
    ],
    "RU": [
        [["kb-button", "Ё"], ["kb-button", "1"], ["kb-button", "2"], ["kb-button", "3"], ["kb-button", "4"], ["kb-button", "5"], ["kb-button", "6"], ["kb-button", "7"], ["kb-button", "8"], ["kb-button", "9"], ["kb-button", "0"], ["kb-button control delete", "Backspace"]],
        [["kb-button", "Й"], ["kb-button", "Ц"], ["kb-button", "У"], ["kb-button", "К"], ["kb-button", "Е"], ["kb-button", "Н"], ["kb-button", "Г"], ["kb-button", "Ш"], ["kb-button", "Щ"], ["kb-button", "З"], ["kb-button", "Х"], ["kb-button", "Ъ"]],
        [["kb-button", "Ф"], ["kb-button", "Ы"], ["kb-button", "В"], ["kb-button", "А"], ["kb-button", "П"], ["kb-button", "Р"], ["kb-button", "О"], ["kb-button", "Л"], ["kb-button", "Д"], ["kb-button", "Ж"], ["kb-button", "Э"]],
        [["kb-button", "Я"], ["kb-button", "Ч"], ["kb-button", "С"], ["kb-button", "М"], ["kb-button", "И"], ["kb-button", "Т"], ["kb-button", "Ь"], ["kb-button", "Б"], ["kb-button", "Ю"]],
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
let userText = "";

function addSymbol(text) {
    // let userText = textContainer.innerText;
    userText += text;
    textContainer.innerText = userText;
}

function handleControlKey(key) {
    console.log(`Processing control key ${key}`);
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
    let newKb = ''
    // Add keys from layout:
    let isFirstRow = true;
    
    for(let row=0; row<layouts[currentLang].length; row++) {
        if(isFirstRow) {
            newKb += '<div class="row first">';
            isFirstRow = false;
        } else {
            newKb += '<div class="row">';
        }
        for(let key=0; key<layouts[currentLang][row].length; key++) {
            // console.log(`<div class="${layouts[currentLang][row][key][0]}">${layouts[currentLang][row][key][1]}</div>`)
            newKb += `<button class="${layouts[currentLang][row][key][0]}">${layouts[currentLang][row][key][1]}</button>`;
        }
        newKb += '</div>';
    }

    const langs = Object.keys(layouts);

    let dragKeyboardButton = '<button class="drag-kb-button" id="drag-kb-button">&#10303;</button>';
    let capsLockButton = '<button class="kb-button control capslock">CapsLock</button>';
    let langSwitch = `<div class="dropup"><button class="dropbtn">${currentLang}</button><div class="dropup-content">`;
    for(let i = 0; i < langs.length; i++) {
        langSwitch += `<a href="#" onclick="updateLanguage('${langs[i]}')">${langs[i]}</a>`;
    }
    langSwitch += "</div></div>";
    let spaceButton = '<button class="kb-button control space">Space</button>';
    let enterButton = '<button class="kb-button control enter">Enter</button>';

    let lastRow = '<div class="row">'
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
    // console.log(newLang);
    updateKeyboard(newLang);
}

updateKeyboard("EN");
