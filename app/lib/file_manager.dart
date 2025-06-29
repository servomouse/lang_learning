import 'package:file_picker/file_picker.dart';
import 'dart:convert';  // JsonDecode
import 'dart:io'; // File

mixin FileManager {
  void notifyListeners(); // Defined in the ChangeNotifier class
  void updateDictionary(newDict); // Defined in the DataProcessor class

  var filename = "No file selected";

  void saveFile(fname) {
    print("SaveFile is not implemented!");
    notifyListeners();
  }

  Future openFile() async {
    print('Open file button pressed!');
    FilePickerResult? result = await FilePicker.platform.pickFiles();

    if (result != null) {
      PlatformFile file = result.files.first;
      
      // file.path can be null
      if (file.path != null) {
        try {
          String fileContent = await File(file.path!).readAsString();

          Map<String, dynamic> jsonData = jsonDecode(fileContent);

          filename = file.name;
          print(file.name);
          print(file.size);
          print(file.path);

          updateDictionary(jsonData);

          print('JSON data: $jsonData');
          notifyListeners();
        } catch (e) {
          print("Error: Couldn't read or parse the JSON file. ${e.toString()}");
        }
      } else {
        print("Error: File path is null!");
      }
    } else {  // User canceled the picker
      print("Error: Couldn't open file!");
    }
  }
}