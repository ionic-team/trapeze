import antlr4 from 'antlr4';
import MyGrammarLexer from './XCConfigLexer.js';
import MyGrammarParser from './XCConfigParser.js';
import MyGrammarListener from './XCConfigListener.js';

import utilsFs from '@ionic/utils-fs';
const { readFile } = utilsFs;

async function run() {
  const input = await readFile(process.argv[2], { encoding: 'utf-8' });

  const chars = new antlr4.InputStream(input);
  const lexer = new MyGrammarLexer(chars);
  const tokens = new antlr4.CommonTokenStream(lexer);
  const parser = new MyGrammarParser(tokens);
  parser.buildParseTrees = true;
  const tree = parser.xcconfig();
}

run();