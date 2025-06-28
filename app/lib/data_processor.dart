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
  List<String> pairs = ["en-ru", "en-sp"];
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
}
