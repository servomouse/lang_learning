let dictionary = {};
let currentPair = "en-sp";
let pairsIds = [
    "EN-RU-pair",
    "EN-SP-pair",
    "RU-SP-pair"
]

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
    if(currentPair != "en-ru") {
        console.log("Switching language pair to EN-RU");
        updateLangPairs("EN-RU-pair");
        currentPair = "en-ru";
    }
});

document.getElementById('EN-SP-pair').addEventListener('click', function() {
    if(currentPair != "en-sp") {
        console.log("Switching language pair to EN-SP");
        updateLangPairs("EN-SP-pair");
        currentPair = "en-sp";
    }
});

document.getElementById('RU-SP-pair').addEventListener('click', function() {
    if(currentPair != "ru-sp") {
        console.log("Switching language pair to RU-SP");
        updateLangPairs("RU-SP-pair");
        currentPair = "ru-sp";
    }
});

document.getElementById('open-file-button').addEventListener('click', function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
            dictionary = JSON.parse(event.target.result);
            console.log('File loaded:', dictionary);
        };
        reader.readAsText(file);
    };
    input.click();
});

document.getElementById('save-file-button').addEventListener('click', function() {
    const data = JSON.stringify(dictionary, null, 4);
    const blob = new Blob([data], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dictionary.json';
    a.click();
    URL.revokeObjectURL(url);
});