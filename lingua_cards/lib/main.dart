import 'package:flutter/material.dart';
import 'package:flutter_flip_card/flutter_flip_card.dart';

import 'sentences.dart';
import 'words.dart';

class FlippingCardExample extends StatefulWidget {
  const FlippingCardExample({Key? key}) : super(key: key);

  @override
  State<FlippingCardExample> createState() => _FlippingCardExampleState();
}

class _FlippingCardExampleState extends State<FlippingCardExample> {
  final FlipCardController _controller = FlipCardController();
  String? _selectedMode;
  String? _selectedLanguage;
  String? expectedAnswer;

  Row getQuestion() {
    if (_selectedMode == "Conjugations") {
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

  List<Widget> getAppBar() {
    return [
      DropdownMenu<String>(
        initialSelection: 'Conjugations', // Optional: Set an initial selected value
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
      ),
      SizedBox(
        width: 50,
      ),
      DropdownMenu<String>(
        initialSelection: 'EN-SP', // Optional: Set an initial selected value
        onSelected: (String? value) {
          setState(() {
            _selectedLanguage = value;
            print('Selected language: $_selectedLanguage');
          });
        },
        dropdownMenuEntries: const <DropdownMenuEntry<String>>[
          DropdownMenuEntry<String>(value: 'EN-SP', label: 'EN-SP'),
          DropdownMenuEntry<String>(value: 'EN-RU', label: 'EN-RU'),
          DropdownMenuEntry<String>(value: 'SP-RU', label: 'SP-RU'),
        ],
      ),
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
                          onPressed: () {_controller.flipcard();},
                          child: Text('Submit'),
                        ),
                      ],
                    ),
                  ),
            ),
          ),
          backWidget: Card(
            color: Colors.red,
            child: Padding(
                padding: const EdgeInsets.all(16.0), // Apply padding to the front content
                child: getBackSideContent(true),
            ),
          ),
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

Container getBackSideContent(bool isCorrect, [String? additionalText]) {
  if(isCorrect) {
    return Container(
      // width: 200,
      height: 300,
      alignment: Alignment.center,
      child: const Text(
        'Correct!',
        style: TextStyle(color: Colors.white, fontSize: 24),
      ),
    );
  }
  return Container(
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
