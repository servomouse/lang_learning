import 'package:quickalert/quickalert.dart';
import 'dart:math';

mixin DataProcessor {

  Map<String, dynamic> task = {
    "baseWord": "hello",
    "redWord": "Hello",
    "answer": "hola",
    "sentence": "Hello World!"
  };  // Cause dictionaries are good

  var correctCounter = 0;
  var incorrectCounter = 0;
  var result = 0.0;

  Map<String, dynamic> dictionary = {};
  Map<String, dynamic> words = {};
  List<String> langPairs = ["en-ru", "en-sp"];
  var selectedPair = "Select a pair";
  var currentLang = "unknown";

  Random random = Random();

  void notifyListeners(); // Defined in the ChangeNotifier class

  void showAlert(cntx, alert) {
    if(alert == "success") {
      QuickAlert.show(
        context: cntx, 
        type: QuickAlertType.success,
        title: "Correct!"
      );
    } else if(alert == "error") {
      QuickAlert.show(
        context: cntx, 
        type: QuickAlertType.error,
        title: "Correct answer is \"${task["answer"]}\"!"
      );
    } else if(alert == "newWordError") {
      QuickAlert.show(
        context: cntx, 
        type: QuickAlertType.error,
        title: "Dictionary error! Please select another pair."
      );
    }
  }

  void processUserInput(cntx, input) {
    if(input.toLowerCase() == task["answer"].toLowerCase()) {
      correctCounter ++;
      showAlert(cntx, "success");
    } else {
      incorrectCounter ++;
      showAlert(cntx, "error");
    }
    if(correctCounter > 0) {
      if(incorrectCounter > 0) {
        result = 100 * (correctCounter / (correctCounter + incorrectCounter));
      } else {
        result = 100.0;
      }
    } else {
      if(incorrectCounter > 0) {
        result = 0.0;
      } else {
        result = 0.0;
      }
    }
    notifyListeners();
    updateWord();
  }

  Map<String, dynamic>?getNewTask(currentPair) {
    for(var i=0; i<words[currentPair[0]].length; i++) {
      var idx = random.nextInt(words[currentPair[0]].length);
      var newWord = words[currentPair[0]][idx];
      print("New word idx = $idx, the word = $newWord");
      print("dictionary[currentPair[0]]['words'][newWord]['examples'] = ${dictionary[currentPair[0]]['words'][newWord]['examples']}");
      var exampleIdx = random.nextInt(dictionary[currentPair[0]]['words'][newWord]['examples'].length);
      var example = dictionary[currentPair[0]]['words'][newWord]['examples'][exampleIdx];
      if(example['translations'].keys.contains(currentPair[1])) {
        print("New example idx = $exampleIdx, the example = $example");
        var newRedWord = example['example']['word'];
        var newSentence = example['example']['sentence'];
        // print("translations = ${example['translations']}");
        var newAnswer = example['translations'][currentPair[1]];
        print("New newRedWord = $newRedWord, newSentence = $newSentence, newAnswer = $newAnswer");
        return {
          "baseWord": newWord,
          "redWord": newRedWord,
          "answer": newAnswer,
          "sentence": newSentence
        };
      }
    }
    selectedPair = "Select a pair";
    return {
          "baseWord": task['baseWord'],
          "redWord": task['redWord'],
          "answer": task['answer'],
          "sentence": task['sentence']
        };
  }

  void updateSelectedPair(pair) {
    selectedPair = pair;
    print("selectedPair = $selectedPair");
    var langs = selectedPair.split("-");
    if(!langs.contains(currentLang)) {
      currentLang = langs[0];
    }
    notifyListeners();
    updateWord();
  }

  void updateWord() {
    if(selectedPair == "Select a pair") {
      return;
    }
    if(!words.keys.contains(currentLang)) {
      selectedPair = "Select a pair";
      return;
    }
    var langs = selectedPair.split("-");
    var currentPair;
    if(currentLang == langs[0]) {
      currentPair = [langs[1], langs[0]];
    } else {
      currentPair = [langs[0], langs[1]];
    }
    currentLang = currentPair[0];
    // print("Current pair: $currentPair");
    // var idx = random.nextInt(words[currentPair[0]].length);
    // var newWord = words[currentPair[0]][idx];
    // print("New word idx = $idx, the word = $newWord");
    // print("dictionary[currentPair[0]]['words'][newWord]['examples'] = ${dictionary[currentPair[0]]['words'][newWord]['examples']}");
    // var exampleIdx = random.nextInt(dictionary[currentPair[0]]['words'][newWord]['examples'].length);
    // var example = dictionary[currentPair[0]]['words'][newWord]['examples'][exampleIdx];
    // print("New example idx = $exampleIdx, the example = $example");
    // var newRedWord = example['example']['word'];
    // var newSentence = example['example']['sentence'];
    // // print("translations = ${example['translations']}");
    // var newAnswer = example['translations'][currentPair[1]];
    // print("New newRedWord = $newRedWord, newSentence = $newSentence, newAnswer = $newAnswer");
    var newTask = getNewTask(currentPair);
    if(newTask == null) {
      return;
    }

    task["baseWord"] = newTask["baseWord"];
    task["redWord"] = newTask["redWord"];
    task["answer"] = newTask["answer"];
    task["sentence"] = newTask["sentence"];
    notifyListeners();
  }

  void updateDictionary(newDict) {
    dictionary = newDict;
    List<String> langs = [];
    for (var lang in newDict.keys) {
      if(!langs.contains(lang)) {
        langs.add(lang);
      }
    }
    print("New languages: $langs");
    var _pairs = [];
    for(var i=0; i<langs.length-1; i++) {
      for(var j=i+1; j<langs.length; j++) {
        _pairs.add("${langs[i]}-${langs[j]}");
      }
    }
    print("Available pairs: $_pairs");
    langPairs.clear();
    for(var i=0; i<_pairs.length; i++) {
      langPairs.add(_pairs[i]);
    }
    if(!langPairs.contains(selectedPair)) {
      selectedPair = "Select a pair";
    }
    words.clear();
    for(var i=0; i<langs.length; i++) {
      words[langs[i]] = [];
      print("newDict[langs[$i]]['words'].keys: ${newDict[langs[i]]['words'].keys}");
      for (var word in newDict[langs[i]]['words'].keys) {
        words[langs[i]].add(word);
      }
    }
    print("New words: $words");
    updateWord();

    notifyListeners();
  }
}
