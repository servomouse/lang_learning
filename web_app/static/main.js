import { initLoginForm, isLoggedIn, currentUser } from './login.js';
import { myreplace, extractSubstring } from './stringlib.js';
import { setNestedValue, firstLetterUpperCase, weightedRandomSelection } from './tools.js';

let dictionary = {};
let scores = {};
let sortedDictionary = [];
let totalWords = 0;
let correctCount = 0;
let incorrectCount = 0;
let currentWord = '';
let expectedAnswer = '';
let baseLang = '';
let learnLang = 'sp';

const modeSelect = document.getElementById('mode');
const languageSelect = document.getElementById('language');
const sentenceSpan = document.querySelector('.sentence');
const userInput = document.getElementById('userInput');
const messageDiv = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');

submitBtn.addEventListener('click', submitAnswer);

languageSelect.addEventListener('change', function() {
    updateLangs();
    prepareDictionary();
    loadNewContent();
});

function loadDictionary() {
    fetch('/api/dictionary')
        .then(response => response.json())
        .then(data => {
            dictionary = data;
            updateLangs();
            prepareDictionary();
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

function selectRandomEntry() {
    return sortedDictionary[weightedRandomSelection(sortedDictionary.length)];
}

function prepareDictionaryForInsertMode() {
    sortedDictionary = [];
    for (const entry of dictionary[baseLang]) {
        const word0 = extractSubstring(entry.sentence).toLowerCase();
        const word1 = entry.translations[learnLang].toLowerCase();
        sortedDictionary.push({
            sentence: entry.sentence,
            translation: entry.translations[learnLang],
            word: entry.word,
            score: getScore(currentUser, baseLang, learnLang, word1, word0)
        });
    }
}

function prepareDictionaryForTranslateMode() {
    sortedDictionary = [];
    for (const entry of dictionary[baseLang]) {
        const word0 = extractSubstring(entry.sentence).toLowerCase();
        const word1 = entry.translations[learnLang].toLowerCase();
        sortedDictionary.push({
            sentence: entry.sentence,
            translation: entry.translations[learnLang],
            word: entry.word,
            score: getScore(currentUser, baseLang, learnLang, word0, word1)
        });
    }
}

function prepareDictionary() {
    sortedDictionary = [];
    if (modeSelect.value === 'insert') {
        prepareDictionaryForInsertMode();
    } else if (modeSelect.value === 'translate') {
        prepareDictionaryForTranslateMode();
    } else {
    }
    if(sortedDictionary.length > 0) {
        sortedDictionary.sort((a, b) => a.age - b.age);
    }
}

function displayInsertContent(word0, word1, sentence) {
    currentWord = word1.toLowerCase();
    expectedAnswer = word0.toLowerCase();
    if (firstLetterUpperCase(word0)) {  // Capitalize the first letter of the word1 if needed
        word1 = word1.charAt(0).toUpperCase() + word1.slice(1);
    }
    sentenceSpan.innerHTML = sentence.replace(`__${word0}__`, `[<span class="gray">${word1}</span>]`);
}

function displayTranslateContent(word0, word1, sentence) {
    currentWord = word0.toLowerCase();
    expectedAnswer = word1.toLowerCase();
    sentenceSpan.innerHTML = sentence.replace(`__${word0}__`, `[<span class="red">${word0}</span>]`);
}

function displayConjugateContent(word0, word1, sentence) {
    sentenceSpan.innerHTML = "Conjugate mode isn't implemented yet";
    translationSpan.classList.add('hidden');
}

function updateCounters() {
    document.getElementById('totalWords').innerText = totalWords;
    document.getElementById('correctCount').innerText = correctCount;
    document.getElementById('incorrectCount').innerText = incorrectCount;
}

function updateScore(user, lang0, lang1, word0, word1, newScore) {
    if (newScore < 0) {
        newScore = 0;
    }
    scores[user][lang0][word0][lang1][word1] = newScore;
    const jsonData = JSON.stringify({
        username: user,
        base_lang: lang0,
        target_lang: lang1,
        word: word0,
        translation: word1,
        new_score: newScore
    });

    // Send data using fetch without awaiting the response
    fetch('/api/update_score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: jsonData,
    }).catch(error => {
        // Handle errors (optional, assumes you care to log them)
        console.error('Error sending telemetry:', error);
    });
}

function getScore(username, lang0, lang1, word0, word1) {
    let currentScore = 0;
    try {
        currentScore = scores[username][lang0][word0][lang1][word1];
    } catch (error) {
        setNestedValue(scores, [username, lang0, word0, lang1, word1], currentScore);
    }
    return currentScore;
}

function submitAnswer() {
    const userAnswer = userInput.value.toLowerCase().trim();
    let scoreInc = 0;
    if (userAnswer === expectedAnswer) {
        messageDiv.innerText = "Correct!";
        correctCount++;
        scoreInc = 1;
    } else {
        messageDiv.innerText = `Incorrect! The correct answer was: ${expectedAnswer}`;
        incorrectCount++;
        scoreInc = -1;
    }
    if (isLoggedIn) {
        if (modeSelect.value === 'insert') {
            let currentScore = getScore(currentUser, baseLang, learnLang, expectedAnswer, currentWord);
            updateScore(currentUser, baseLang, learnLang, expectedAnswer, currentWord, currentScore+scoreInc);
        } else if (modeSelect.value === 'translate') {
            let currentScore = getScore(currentUser, baseLang, learnLang, currentWord, expectedAnswer);
            updateScore(currentUser, baseLang, learnLang, currentWord, expectedAnswer, currentScore+scoreInc);
        } else {
            throw `Handler for ${modeSelect.value} not implemented!`;
        }
        const prettyJson = JSON.stringify(scores, null, 2);
        console.log(`scores: ${prettyJson}`);
    }
    totalWords++;
    updateCounters();
    userInput.value = '';
    loadNewContent();
}

function updateLangs() {
    baseLang = languageSelect.value.slice(0, 2);
    if (modeSelect.value === 'translate') {
        learnLang = languageSelect.value.slice(3, 5);
    } else if (modeSelect.value === 'insert') {
        learnLang = languageSelect.value.slice(3, 5);
    }
}

function loadNewContent() {
    const entry = selectRandomEntry();
    const prettyJson = JSON.stringify(entry, null, 2);
    console.log(`New entry: ${prettyJson}, ${baseLang}, ${learnLang}`);
    let word0 = extractSubstring(entry.sentence);
    let word1 = entry.translation;
    if (modeSelect.value === 'insert') {
        displayInsertContent(word0, word1, entry.sentence);
    } else if (modeSelect.value === 'translate') {
        displayTranslateContent(word0, word1, entry.sentence);
    } else if (modeSelect.value === 'conjugate') {
        displayConjugateContent(word0, word1, entry.sentence);
    } else {
        throw `Handler for ${modeSelect.value} not implemented!`;
    }
}

modeSelect.addEventListener('change', function() {
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
    updateLangs();
    prepareDictionary();
    loadNewContent();
});

initLoginForm();
loadDictionary();
loadScores();
