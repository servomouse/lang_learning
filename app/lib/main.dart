// import 'package:confetti/confetti.dart';
import 'package:english_words/english_words.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
// import 'package:file_picker/file_picker.dart';
// import 'dart:convert';  // JsonDecode
// import 'dart:io'; // File
import './file_manager.dart';
import './data_processor.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => MyAppState(),
      child: MaterialApp(
        title: 'Namer App',
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(seedColor: const Color.fromARGB(255, 4, 14, 70)),
        ),
        home: MyHomePage(),
      ),
    );
  }
}

class MyAppState extends ChangeNotifier with FileManager, DataProcessor {

  var current = WordPair.random();
  void getNext() {
    current = WordPair.random();
    notifyListeners();
  }
  var favorites = <WordPair>[];

  void toggleFavorite() {
    if (favorites.contains(current)) {
      favorites.remove(current);
    } else {
      favorites.add(current);
    }
    notifyListeners();
  }
}

class MyHomePage extends StatefulWidget {
  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {

  @override
  Widget build(BuildContext context) {
    var appState = context.watch<MyAppState>();

    List<DropdownMenuEntry> availablePairs = [];
    for (var pair in appState.langPairs) {
      availablePairs.add(
        DropdownMenuEntry(value: pair, label: pair),
      );
    }

    return Scaffold(
      appBar: AppBar(
        // title: Text("AppBar Title"),
        // actions: navItems,
        actions: [
          Expanded(
            child: Center(
              child: DropdownMenu(
                // label: const Text("Select language pair"),
                hintText: "Select language pair",
                requestFocusOnTap: false, // Do not open keyboard
                enableSearch: false,
                dropdownMenuEntries: availablePairs,
                onSelected: (value) {
                  print('Selected option: $value');
                  appState.updateSelectedPair(value);
                },
              )
            )
          ),
          PopupMenuButton(
            // label: const Text("Select language pair"),
            onSelected: (value) {
              print("Selected function: $value");
              if(value == "open_file") {
                appState.openFile();
              } else if(value == "save_file") {
                appState.saveFile(appState.filename);
                // showConfetti();
              }
            },
            itemBuilder: (context) => [
              PopupMenuItem(
                value: "open_file",
                child: Text("Open file"),
              ),
              PopupMenuItem(
                value: "save_file",
                child: Text("Save file"),
              ),
            ]
          )
        ]
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,  // end, spaceAround, spaceBetween, center
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.start, // Align this text to the left
              children: [
                Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('File name: ${appState.filename}'),
                      Text('Correct answers: ${appState.correctCounter}'),
                      Text('Incorrect answers: ${appState.incorrectCounter}'),
                      Text('Average result: ${appState.result.toStringAsFixed(1)}%'),
                    ]
                  )
                )
              ],
            ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: BigCard(),
            ),
            Padding(
                  padding: const EdgeInsets.all(20),
                  child: Text('Hello World Inc.')
            )
          ],
        ),
      ),
    );
  }
}

class BigCard extends StatelessWidget {

  @override
  Widget build(BuildContext context) {
    var theme = Theme.of(context);
    var appState = context.watch<MyAppState>();

    List<TextSpan> getSentence() {
      var parts = appState.task["sentence"].split(appState.task["redWord"]);
      List<TextSpan> retVal = [];
      for (var part in parts) {
        retVal.add(
          TextSpan(
            text: part,
            style: TextStyle(color: Colors.black, fontSize:20), // Black color for "World!"
          )
        );
        retVal.add(
          TextSpan(
            text: appState.task["redWord"],
            style: TextStyle(color: Colors.red, fontSize:20), // Black color for "World!"
          )
        );
      }
      retVal.removeLast();
      return retVal;
    }

    Text getFirstLine() {
      // print("The word = ${appState.task["baseWord"]}");
      return Text("\"${appState.task["baseWord"]}\", as in", style: TextStyle(color: Colors.black, fontSize:20));
    }
    var sentence = getSentence();
    var firstLine = getFirstLine();

    return Card(
      color: theme.colorScheme.primary,
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: appState.selectedPair == "Select a pair"? Text("Select a language pair"): Column(
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            firstLine,
            SizedBox(height: 10),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Flexible(
                  child: RichText(
                    text: TextSpan(
                      children: sentence,
                    ),
                    overflow: TextOverflow.visible, // Ensure overflow is handled
                  ),
                ),
                // Expanded(
                //   child: Container(), // This will take up all available space
                // ),
                ElevatedButton(
                  onPressed: null,
                  // onPressed: () {
                  //   print('Play button pressed!');
                  // },
                  child: Text('Play'),
                ),
              ]
            ),
            SizedBox(height: 10),
            TextInputWidget(),
          ],
        ),
      )
    );
  }
}

class TextInputWidget extends StatefulWidget {
  @override
  TextInputWidgetState createState() => TextInputWidgetState();
}

class TextInputWidgetState extends State<TextInputWidget> {
  final TextEditingController _controller = TextEditingController();

  @override
  Widget build(BuildContext context) {
    
    var appState = context.watch<MyAppState>();
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Row(
          children: <Widget>[
            Flexible(
              child: TextField(
                controller: _controller,
                decoration: InputDecoration(
                  border: OutlineInputBorder(),
                  // labelText: 'Enter your text',
                  focusedBorder: OutlineInputBorder(),
                  labelStyle:TextStyle(fontSize:10),
                  hintStyle: TextStyle(fontSize:10),
                ),
                showCursor: true,
                cursorColor: Colors.black,
              )
            ),
            SizedBox(width: 10),
            ElevatedButton(
              onPressed: () {
                appState.processUserInput(context, _controller.text);
                print('Entered text: ${_controller.text}');
                _controller.clear();
              },
              child: Text('Submit'),
            ),
          ],
        ),
      ],
    );
  }
}
