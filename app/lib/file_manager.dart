import 'package:file_picker/file_picker.dart';
import 'dart:convert';  // JsonDecode
import 'dart:io'; // File

mixin FileManager {
  void notifyListeners(); // Defined in the ChangeNotifier class

  var filename = "dictionary.json";

  void saveFile(fname) {
    print("SaveFile is not implemented!");
    notifyListeners();
  }

  Future<Map<String, dynamic>?> openFile() async {
    print('Open file button pressed!');
    FilePickerResult? result = await FilePicker.platform.pickFiles();

    if (result != null) {
      PlatformFile file = result.files.first;

      filename = file.name;
      print(file.name);
      print(file.size);
      print(file.path);
      
      // file.path can be null
      if (file.path != null) {
        try {
          String fileContent = await File(file.path!).readAsString();

          Map<String, dynamic> jsonData = jsonDecode(fileContent);

          print('JSON data: $jsonData');
          return jsonData;
        } catch (e) {
          print("Error: Couldn't read or parse the JSON file. ${e.toString()}");
        }
      } else {
        print("Error: File path is null!");
      }
    } else {  // User canceled the picker
      print("Error: Couldn't open file!");
    }
    return null;
  }
}