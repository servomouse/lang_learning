let dictionary = null;
let currentPair = null;
let pairsIds = [
    "EN-RU-pair",
    "EN-SP-pair",
    "RU-SP-pair"
]
let correctAnswer = "";

let langPairs = {
    "EN-RU": ["en", "ru"],
    "EN-SP": ["en", "sp"],
    "SP-RU": ["sp", "ru"],
}

function updateDictionary(new_dict) {
    let langs = [];
    for (const [key, value] of Object.entries(new_dict)) {
        langs.push(key);
    }
    console.log("Detected languages: ", langs);
    let pairs = [];
    for(let i=0; i<langs.length; i++) {
        for(let j=i+1; j<langs.length; j++) {
            pairs.push(`${langs[i]} - ${langs[j]}`);
        }
    }
    console.log(`Available language pairs: ${pairs}`);
}

function updateLangPairs(selectedPair) {
    pairsIds.forEach(function (value, index, array) {
        // May be insecure, but here the text is hardcoded, so ok
        document.getElementById(value).innerHTML=value.replace("-pair", "");
    });
    // May be insecure, but here the text is hardcoded, so ok
    document.getElementById(selectedPair).innerHTML=selectedPair.replace("-pair", " &#9658;");
    document.getElementById("lang-pair-selector").innerHTML=selectedPair.replace("-pair", "");
}

document.getElementById('EN-RU-pair').addEventListener('click', function() {
    if(currentPair != "EN-RU") {
        console.log("Switching language pair to EN-RU");
        updateLangPairs("EN-RU-pair");
        currentPair = "EN-RU";
        setNewWord();
    }
});

document.getElementById('EN-SP-pair').addEventListener('click', function() {
    if(currentPair != "EN-SP") {
        console.log("Switching language pair to EN-SP");
        updateLangPairs("EN-SP-pair");
        currentPair = "EN-SP";
        setNewWord();
    }
});

document.getElementById('RU-SP-pair').addEventListener('click', function() {
    if(currentPair != "RU-SP") {
        console.log("Switching language pair to RU-SP");
        updateLangPairs("RU-SP-pair");
        currentPair = "RU-SP";
        setNewWord();
    }
});

function openFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
            dictionary = JSON.parse(event.target.result);
            console.log('File loaded:', dictionary);
            updateDictionary(dictionary);
        };
        reader.readAsText(file);
    };
    input.click();
}

function saveFile() {
    const data = JSON.stringify(dictionary, null, 4);
    const blob = new Blob([data], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dictionary.json';
    a.click();
    URL.revokeObjectURL(url);
}

function getRandomInteger(N) {
    return Math.floor(Math.random() * N);
}

function getRandomKey(dict) {
    const keys = Object.keys(dict);
    return keys[getRandomInteger(keys.length)];
}

function updateWord(newWord, sentense, wordInSentence) {
    let a = 'Word "<span style="color:#FF0000";>hello</span >" as in <span style="color:#FF0000";>Hello</span > world!';
    let newSentence = sentense.replace(wordInSentence, `<span style="color:#FF0000";>${wordInSentence}</span >`);
    let newHtml = `Word "<span style="color:#FF0000";>${newWord}</span >" as in ${newSentence}`;
    document.getElementById("read-only-text").innerHTML = newHtml;
}

function pickNewWord() {
    let found = false;   // dictionary
    let counter = 0;
    while(!found) {
        let dict = dictionary[langPairs[currentPair][0]]['words']
        let word = getRandomKey(dict);
        let example = getRandomInteger(dict[word]['examples'].length);
        if(langPairs[currentPair][1] in dict[word]['examples'][example]['translations']) {
            found = true;
            let retval = {
                'word': word,
                'sentense': [
                    dict[word]['examples'][example]['example']['sentence'],
                    dict[word]['examples'][example]['example']['word']
                ],
                'answer': dict[word]['examples'][example]['translations'][langPairs[currentPair][1]]
            }
            let temp = langPairs[currentPair][0];
            langPairs[currentPair][0] = langPairs[currentPair][1];
            langPairs[currentPair][1] = temp;
            return retval;
        }
        counter += 1;
        if(counter > 1000) {
            alert("Error: Cannot find new pair!");
            return null;
        }
    }
}

function setNewWord() {
    if(!currentPair) {
        alert("Select a language pair!");
        return;
    }
    newWord = pickNewWord();
    updateWord(newWord['word'], newWord['sentense'][0], newWord['sentense'][1]);
    correctAnswer = newWord['answer'];
}

function submit() {
    if(dictionary) {
        let userAnswer = document.getElementById("textInput").value;
        if(userAnswer.localeCompare(correctAnswer) === 0) {
            alert("Correct!");
        } else {
            alert(`Wrong! Correct answer is ${correctAnswer}, your answer: ${userAnswer}`);
        }
        setNewWord();
    } else {
        alert("Open a dictionary file first!");
    }
}
