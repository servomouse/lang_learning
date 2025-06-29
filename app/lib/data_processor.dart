import 'package:quickalert/quickalert.dart';

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

  var dictionary;
  List<String> langPairs = ["en-ru", "en-sp"];
  var selectedPair = "en-sp";

  void notifyListeners(); // Defined in the ChangeNotifier class

  void shouAlert(cntx, alert) {
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
    }
  }

  void processUserInput(cntx, input) {
    if(input.toLowerCase() == task["answer"].toLowerCase()) {
      correctCounter ++;
      shouAlert(cntx, "success");
    } else {
      incorrectCounter ++;
      shouAlert(cntx, "error");
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
  }

  void updateSelectedPair(pair) {
    selectedPair = pair;
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
    notifyListeners();
  }
}
