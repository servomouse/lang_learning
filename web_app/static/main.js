import { initLoginForm, isLoggedIn, currentUser } from './login.js';
import { myreplace, extractSubstring } from './stringlib.js';

let dictionary = {};
let scores = {};
let totalWords = 0;
let correctCount = 0;
let incorrectCount = 0;
let currentWord = '';
let answer = '';
let baseLang = '';
let learnLang = 'sp';

const modeSelect = document.getElementById('mode');
const languageSelect = document.getElementById('language');
const sentenceSpan = document.querySelector('.sentence');
const userInput = document.getElementById('userInput');
const messageDiv = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');

languageSelect.addEventListener('change', loadNewContent);
submitBtn.addEventListener('click', submitAnswer);

function loadDictionary() {
    fetch('/api/dictionary')
        .then(response => response.json())
        .then(data => {
            dictionary = data;
            loadNewContent(); // Load content after dictionary is fetched
        });
}

function loadScores() {
    fetch('/api/scores')
        .then(response => response.json())
        .then(data => {
            scores = data;
        });
}

function selectRandomEntry(language) {
    const entries = dictionary[language];
    const randomIndex = Math.floor(Math.random() * entries.length);
    return entries[randomIndex];
}

function displayContent(entry) {
    const prettyJson = JSON.stringify(entry, null, 2);
    console.log(`${prettyJson}, ${baseLang}, ${learnLang}`);
    if (modeSelect.value === 'insert') {
        let substring = extractSubstring(entry.sentence);
        let replacement = entry.translations[learnLang].translation;
        if (substring.length > 0 && substring[0].toUpperCase() === substring[0]) {
            // Capitalize the first letter of the replacement if needed
            replacement = replacement.charAt(0).toUpperCase() + replacement.slice(1);
        }
        sentenceSpan.innerHTML = entry.sentence.replace(`__${substring}__`, `<span class="gray">${replacement}</span>`);
        answer = entry.word;
    } else if (modeSelect.value === 'translate') {
        let substring = extractSubstring(entry.sentence);
        sentenceSpan.innerHTML = entry.sentence.replace(`__${substring}__`, `<span class="red">${substring}</span>`);
        answer = entry.translations[learnLang].translation;
    } else {
        sentenceSpan.innerHTML = "Not implemented yet";
        translationSpan.classList.add('hidden');
    }
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
    totalWords++;
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

// document.addEventListener('DOMContentLoaded', loadNewContent);
initLoginForm();
loadDictionary();
if (isLoggedIn) {
    loadScores();
}

// loadNewContent();