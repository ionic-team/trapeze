import utilsFs from '@ionic/utils-fs';
const { readFile } = utilsFs;

import antlr4 from 'antlr4';
import KotlinLexer from './kotlin/KotlinLexer.js';
import KotlinParser from './kotlin/KotlinParser.js';
import KotlinParserListener from './kotlin/KotlinParserListener.js';

export async function parseFromArgs() {
  parse(await readFile(process.argv[2], { encoding: 'utf-8' }));
}

export function parse(contents: string) {
  console.log('Parsing', contents);

  const before = +new Date;

  const chars = new antlr4.InputStream(contents);
  const lexer = new KotlinLexer(chars);
  const tokens = new antlr4.CommonTokenStream(lexer);
  const parser = new KotlinParser(tokens);
  // parser.buildParseTrees = true;
  const tree = parser.script();

  const after = +new Date;

  console.log('Parsed in', (after - before) / 1000.0, 'seconds');

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
    if (!ctx) {
      return;
    }

    if (ctx.children) {
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
