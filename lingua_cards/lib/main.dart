import 'package:flutter/material.dart';
import 'package:flutter_flip_card/flutter_flip_card.dart';

import 'sentences.dart';
import 'words.dart';
import 'conjugations.dart';

class FlippingCardExample extends StatefulWidget {
  const FlippingCardExample({Key? key}) : super(key: key);

  @override
  State<FlippingCardExample> createState() => _FlippingCardExampleState();
}

class _FlippingCardExampleState extends State<FlippingCardExample> {
  final FlipCardController _controller = FlipCardController();
  final TextEditingController _text_controller = TextEditingController();
  String? _selectedMode = 'Conjugations';
  String? _selectedLanguage;
  String? expectedAnswer;

  DropdownMenu<String> getModes() {
    return DropdownMenu<String>(
      initialSelection: _selectedMode,
      onSelected: (String? value) {
        setState(() {
          _selectedMode = value;
          print('Selected mode: $_selectedMode');
        });
      },
      dropdownMenuEntries: const <DropdownMenuEntry<String>>[
        DropdownMenuEntry<String>(value: 'Conjugations', label: 'Conjugations'),
        DropdownMenuEntry<String>(value: 'Words', label: 'Words'),
        DropdownMenuEntry<String>(value: 'Sentences', label: 'Sentences'),
      ],
    );
  }

  DropdownMenu<String> getLangs() {
    List<DropdownMenuEntry<String>> langOptions = [];
    for (final l in conjugationsGetLangs()) {
      langOptions.add(DropdownMenuEntry<String>(value: l.toUpperCase(), label: l.toUpperCase()));
    }
    return DropdownMenu<String>(
      initialSelection: conjugationsGetLang().toUpperCase(),
      onSelected: (String? value) {
        setState(() {
          _selectedLanguage = value;
          print('Selected language: $_selectedLanguage');
        });
      },
      dropdownMenuEntries: langOptions,
    );
  }

  Row getQuestion() {
    if (_selectedMode == "Conjugations") {
      return conjugationsGetTask(_text_controller);
    } else if (_selectedMode == "Words") {
      return wordsGetTask();
    } else if (_selectedMode == "Sentences") {
      return sentencesGetTask();
    } else {
      return Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            'I ',
            style: TextStyle(fontSize: 24),
          ),
          SizedBox(
            width: 100,
            child: TextField(
              // controller: _controller,
              textAlign: TextAlign.center,
              decoration: InputDecoration(
                border: OutlineInputBorder(),
                hintText: '(to be)',
              ),
            ),
          ),
          Text(
            ' eating an apple.',
            style: TextStyle(fontSize: 24),
          ),
        ],
      );
    }
  }

  bool checkAnswer() {
    String answer = _text_controller.text.trim();
    if (_selectedMode == "Conjugations") {
      return answer.toLowerCase() == conjugationsGetAnswer();
    } else if (_selectedMode == "Words") {
      return false;
    } else if (_selectedMode == "Sentences") {
      return false;
    }
    return false;
  }

  List<Widget> getAppBar() {
    return [
      getModes(),
      SizedBox(
        width: 50,
      ),
      getLangs(),
      SizedBox(
        width: 50,
      ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Lingua Cards'),
        actions: getAppBar(),
      ),
      body: Center(
        child: FlipCard(
          controller: _controller,
          axis: FlipAxis.vertical, // or FlipAxis.vertical
          onTapFlipping: true, // Flip on tap
          rotateSide: RotateSide.left,
          frontWidget: Padding(
                padding: const EdgeInsets.all(16.0), // Apply padding to the front content
                child: Card(
                  color: Colors.blue,
                  child: Container(
                    // width: 200,
                    height: 300,
                    alignment: Alignment.center,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        getQuestion(),
                        SizedBox(height: 20),
                        ElevatedButton(
                          onPressed: () {
                            _controller.flipcard();
                          },
                          child: Text('Submit'),
                        ),
                      ],
                    ),
                  ),
            ),
          ),
          backWidget: getBackSideContent(checkAnswer()),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          _controller.flipcard(); // Programmatically flip the card
        },
        child: const Icon(Icons.flip),
      ),
    );
  }
}

Container getFrontSideContent(String mode, FlipCardController controller) {
  return Container(
    // width: 200,
    height: 300,
    alignment: Alignment.center,
    child: Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'I ',
              style: TextStyle(fontSize: 24),
            ),
            SizedBox(
              width: 100,
              child: TextField(
                // controller: _controller,
                textAlign: TextAlign.center,
                decoration: InputDecoration(
                  border: OutlineInputBorder(),
                  hintText: '(to be)',
                ),
              ),
            ),
            Text(
              ' eating an apple.',
              style: TextStyle(fontSize: 24),
            ),
          ],
        ),
        SizedBox(height: 20),
        ElevatedButton(
          onPressed: () {controller.flipcard();},
          child: Text('Submit'),
        ),
      ],
    ),
  );
}

Card getBackSideContent(bool isCorrect, [String? additionalText]) {
  if(isCorrect) {
    return Card(
            color: Colors.green,
            child: Padding(
                padding: const EdgeInsets.all(16.0), // Apply padding to the front content
                child: Container(
              // width: 200,
              height: 300,
              alignment: Alignment.center,
              child: const Text(
                'Correct!',
                style: TextStyle(color: Colors.white, fontSize: 24),
              ),
            ),
      ),
    );
  }
  return Card(
            color: Colors.red,
            child: Padding(
                padding: const EdgeInsets.all(16.0), // Apply padding to the front content
                child: Container(
              // width: 200,
              height: 300,
              alignment: Alignment.center,
              child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'Wrong!',
                      style: TextStyle(color: Colors.white, fontSize: 24),
                    ),
                    Text(
                      '$additionalText',
                      style: TextStyle(color: Colors.white, fontSize: 24),
                    ),
                ]
              )
            ),
    ),
  );
}

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flipping Card App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const FlippingCardExample(),
    );
  }
}
