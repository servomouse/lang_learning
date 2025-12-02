
let dictionary = {};
let totalWords = 0;
let correctCount = 0;
let incorrectCount = 0;
let currentWord = '';
let answer = '';
let baseLang = '';
let learnLang = 'sp';
let isLoggedIn = false;
let currentUser = '';

const modeSelect = document.getElementById('mode');
const languageSelect = document.getElementById('language');
const sentenceSpan = document.querySelector('.sentence');
const userInput = document.getElementById('userInput');
const messageDiv = document.getElementById('message');
const loginFormBtn = document.getElementById('login-form-btn');
const loginModal = document.getElementById('loginModal');
const closeModal = document.querySelector('.close-login-form');
const userLogin = document.getElementById('userLogin');

document.addEventListener('DOMContentLoaded', loadDictionary);

function loadDictionary() {
    fetch('/api/dictionary')
        .then(response => response.json())
        .then(data => {
            dictionary = data;
            loadNewContent(); // Load content after dictionary is fetched
        });
}

function selectRandomEntry(language) {
    const entries = dictionary[language];
    const randomIndex = Math.floor(Math.random() * entries.length);
    return entries[randomIndex];
}

function displayContent(entry) {
    const prettyJson = JSON.stringify(entry.translations, null, 2);
    console.log(`${prettyJson}, ${baseLang}, ${learnLang}`);
    if (modeSelect.value === 'insert') {
        sentenceSpan.innerHTML = entry.sentence.replace(`__${entry.word}__`, `<span class="gray">${entry.translations[learnLang].translation}</span>`);
        answer = entry.word;
    } else if (modeSelect.value === 'translate') {
        sentenceSpan.innerHTML = entry.sentence.replace(/__(.*?)__/g, `<span class="red">$1</span>`);
        answer = entry.translations[learnLang].translation;
    } else {
        sentenceSpan.innerHTML = "Not implemented yet";
        translationSpan.classList.add('hidden');
    }
    totalWords++;
    updateCounters();
}

function updateCounters() {
    document.getElementById('totalWords').innerText = totalWords;
    document.getElementById('correctCount').innerText = correctCount;
    document.getElementById('incorrectCount').innerText = incorrectCount;
}

function submitAnswer() {
    const userAnswer = userInput.value.toLowerCase().trim();
    if (userAnswer === answer.toLowerCase()) {
        messageDiv.innerText = "Correct!";
        correctCount++;
    } else {
        messageDiv.innerText = `Incorrect! The correct word was: ${answer}`;
        incorrectCount++;
    }
    updateCounters();
    userInput.value = '';
    loadNewContent();
}

function loadNewContent() {
    baseLang = languageSelect.value.slice(0, 2);
    if (modeSelect.value === 'translate') {
        learnLang = languageSelect.value.slice(3, 5);
    } else if (modeSelect.value === 'insert') {
        learnLang = languageSelect.value.slice(3, 5);
    }
    const entry = selectRandomEntry(baseLang);
    displayContent(entry);
}

modeSelect.addEventListener('change', function() {
    loadNewContent();
    if (this.value === 'conjugate') {
        languageSelect.innerHTML = `
            <option value="en">EN</option>
            <option value="sp">SP</option>
            <option value="ru">RU</option>
        `;
    } else {
        languageSelect.innerHTML = `
            <option value="en-sp" selected>EN-SP</option>
            <option value="sp-en">SP-EN</option>
            <option value="ru-en">RU-EN</option>
            <option value="en-ru">EN-RU</option>
        `;
    }
});

loginFormBtn.addEventListener('click', function() {
    console.log("loginFormBtn.click()");
    if(isLoggedIn) {
        isLoggedIn = false;
        currentUser = '';
        userLogin.innerText = currentUser;
        loginFormBtn.innerText = 'Log in';
    } else {
        loginModal.classList.remove('hidden');
    }
});

closeModal.addEventListener('click', function() {
    console.log("closeModal.click()");
    loginModal.classList.add('hidden');
});

document.getElementById('submit-log-in-btn').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    console.log(`Username: ${username}, password: ${password}`);

    // Prepare data to send
    const data = {
        username: username,
        password: password
    };

    // Send the POST request to the backend
    fetch('/api/verify_user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        let res = response.json();
        const prettyJson = JSON.stringify(res, null, 2);
        return res;
    })
    .then(data => {
        if(data.message === "success") {
            isLoggedIn = true;
            currentUser = username;
            
            userLogin.innerText = currentUser;
            userLogin.classList.remove('hidden');
            loginFormBtn.innerText = 'Log out';
            loginModal.classList.add('hidden');
        } else {
            alert(data.message);
            document.getElementById('username').value = "";
            document.getElementById('password').value = "";
        }
    })
    .catch(error => {
        alert(error.message || 'Unable to log in. Please try again.');
    });
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        isLoggedIn = true;
        currentUser = username;

        userLogin.innerText = currentUser;
        userLogin.classList.remove('hidden');
        loginFormBtn.innerText = 'Log out';
        loginModal.classList.add('hidden');
    }
});

document.getElementById('submit-register-btn').addEventListener('click', function() {
    event.preventDefault(); // Prevent default form submission
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const data = {
        username: username,
        password: password
    };

    fetch('/api/add_user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        let res = response.json();
        const prettyJson = JSON.stringify(res, null, 2);
        return res;
    })
    .then(data => {
        if(data.message === "success") {
            isLoggedIn = true;
            currentUser = username;
            
            userLogin.innerText = currentUser;
            userLogin.classList.remove('hidden');
            loginFormBtn.innerText = 'Log out';
            loginModal.classList.add('hidden');
        } else {
            alert(data.message);
            document.getElementById('username').value = "";
            document.getElementById('password').value = "";
        }
    })
    .catch(error => {
        alert(error.message || 'Unable to log in. Please try again.');
    });
});

window.addEventListener('click', function(event) {
    if (event.target === loginModal) {
        loginModal.classList.add('hidden'); // Closing the modal when clicking outside
    }
});

languageSelect.addEventListener('change', loadNewContent);
document.getElementById('submitBtn').addEventListener('click', submitAnswer);

loadNewContent();