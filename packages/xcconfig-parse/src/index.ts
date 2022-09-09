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

  console.log(tree);

  const printer = new AssignementPrinter();

  const t = (antlr4 as any).tree;
  t.ParseTreeWalker.DEFAULT.walk(printer, tree);
  // tree.accept(new Visitor() as any);
  // walkTree(tree);
}

function walkTree(t: any) {
  for (let i = 0; i < t.getChildCount(); i++) {
    const n = t.getChild(i);
    console.log('Node', n);

    if (n.getChildCount() > 0) {
      walkTree(n);
    }
  }
}

class Visitor {
  visitChildren(ctx: any) {
    console.log('Visiting children', ctx);
    if (!ctx) {
      return;
    }

    if (ctx.children) {
      console.log('IN HERE CHILDREN', ctx.children.length);
      return ctx.children.map((child: any) => {
        if (child.children && child.children.length != 0) {
          return child.accept(this);
        } else {
          return child.getText();
        }
      });
    }
  }
}

class AssignementPrinter extends MyGrammarListener {
  // override default listener behavior
  exitRule(ctx: any) {
    console.log('Assignment', ctx);
  }
}

run();