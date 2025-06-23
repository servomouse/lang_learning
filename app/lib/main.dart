import 'package:english_words/english_words.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:file_picker/file_picker.dart';

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

class MyAppState extends ChangeNotifier {
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

  var files = <String>[];
  void addFileName(fname) {
    if (files.contains(fname)) {
      return;
    }
    files.add(fname);
    notifyListeners();
  }
  void removeFileName(fname) {
    files.remove(fname);
    notifyListeners();
  }
  void saveFile(fname) {
    // TODO: add logic here
    print("SaveFile is not implemented!");
    notifyListeners();
  }
  Future<void> _openFile() async {
    print('Open file button pressed!');
    FilePickerResult? result = await FilePicker.platform.pickFiles();

    if (result != null) {
      PlatformFile file = result.files.first;

      print(file.name);
      print(file.size);
      print(file.path);
      addFileName(file.name);
    } else {
      print("Error: Couldn't open file!");
      // User canceled the picker
    }
  }
}

class MyHomePage extends StatefulWidget {
  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {

  var selectedIndex = 0;

  @override
  Widget build(BuildContext context) {

    Widget page;
    switch (selectedIndex) {
      case 0:
        page = GeneratorPage();
        break;
      case 1:
        page = FavoritesPage();
        break;
      default:
        throw UnimplementedError('no widget for $selectedIndex');
    }

    return Scaffold(
      body: Row(
        children: [
          SafeArea(
            child: NavigationRail(
              extended: false,
              destinations: [
                NavigationRailDestination(
                  icon: Icon(Icons.home),
                  label: Text('Home'),
                ),
                // NavigationRailDestination(
                //   icon: Icon(Icons.favorite),
                //   label: Text('Favorites'),
                // ),
                NavigationRailDestination(
                  icon: Icon(Icons.library_books),
                  label: Text('Language'),
                ),
              ],
              selectedIndex: selectedIndex,
              onDestinationSelected: (value) {
                setState(() {
                  selectedIndex = value;
                });
              },
            ),
          ),
          Expanded(
            child: Container(
              color: Theme.of(context).colorScheme.primaryContainer,
              child: page,
            ),
          ),
        ],
      ),
    );
  }
}

class FavoritesPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    var appState = context.watch<MyAppState>();

    ElevatedButton getOpenFileButton() {
      return ElevatedButton(
        onPressed: appState._openFile,
        child: Text('Open file'),
      );
    }

    if (appState.files.isEmpty) {
      return Center(
        child: getOpenFileButton()
      );
    }

    return ListView(
      children: [
        Padding(
          padding: const EdgeInsets.all(20),
          child: Text('You have '
              '${appState.files.length} files open:'),
        ),
        for (var fname in appState.files)
          ListTile(
            leading: Icon(Icons.favorite),
            title: Text(fname),
          ),
        getOpenFileButton(),
      ],
    );
  }
}

class GeneratorPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    var appState = context.watch<MyAppState>();
    var pair = appState.current;

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,  // end, spaceAround
        children: [
          BigCard(pair: pair),
        ],
      ),
    );
  }
}

class BigCard extends StatelessWidget {
  const BigCard({
    super.key,
    required this.pair,
  });

  final WordPair pair;

  @override
  Widget build(BuildContext context) {
    var theme = Theme.of(context);
    // var style = theme.textTheme.displayMedium!.copyWith(
    //   color: theme.colorScheme.onPrimary,
    // );
    return Card(
      color: theme.colorScheme.primary,
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.start,
          // mainAxisAlignment: MainAxisAlignment.center,  // end, spaceAround
          children: [
            Text("Hello, as in", style: TextStyle(color: Colors.black, fontSize:20)),
            SizedBox(height: 10),
            Row(
              children: [
                RichText(
                  text: TextSpan(
                    children: [
                      TextSpan(
                        text: 'Hello ',
                        style: TextStyle(color: Colors.red, fontSize:20), // Red color for "Hello"
                      ),
                      TextSpan(
                        text: 'World!',
                        style: TextStyle(color: Colors.black, fontSize:20), // Black color for "World!"
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: Container(), // This will take up all available space
                ),
                ElevatedButton(
                  onPressed: () {
                    print('Play button pressed!');
                  },
                  child: Text('Play'),
                ),
              ]
            ),
            SizedBox(height: 10),
            TextInputWidget(),
            // Row(
            //   children: <Widget>[
            //     Flexible(
            //       child: TextField(
            //         decoration: InputDecoration(
            //           border: OutlineInputBorder(),
            //           // labelText: 'Enter your text',
            //           focusedBorder: OutlineInputBorder(),
            //           labelStyle:TextStyle(fontSize:10),
            //           hintStyle: TextStyle(fontSize:10),
            //         ),
            //         showCursor: true,
            //         cursorColor: Colors.black,
            //       )
            //     ),
            //     SizedBox(width: 10),
            //     ElevatedButton(
            //       onPressed: () {
            //         print('Submit button pressed!');
            //       },
            //       child: Text('Submit'),
            //     ),
            //   ],
            // ),
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
                print('Entered text: ${_controller.text}');
              },
              child: Text('Submit'),
            ),
          ],
        ),
      ],
    );
  }
}
