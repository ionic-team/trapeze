mod kotlin;
use std::any::Any;

use crate::kotlin::*;
use crate::kotlinlexer::KotlinLexer;
use antlr_rust::InputStream;
use antlr_rust::common_token_stream::CommonTokenStream;
use antlr_rust::parser_rule_context::ParserRuleContext;
use antlr_rust::token::{GenericToken, Token};
use antlr_rust::tree::{ParseTree, ParseTreeListener, TerminalNode, Tree};
use kotlin::kotlinparser::{KotlinParser, KotlinParserContextType, KotlinParserContext};
use kotlin::kotlinparserlistener::KotlinParserListener;

struct Listener {}

impl<'input> ParseTreeListener<'input, KotlinParserContextType> for Listener {
    fn visit_terminal(&mut self, node: &TerminalNode<'input, KotlinParserContextType>) {
        let s = &node.symbol;
        let line = s.get_line();
        let col = s.get_column();
        
        // println!("terminal node {} @ {}:{} start char: {} end char: {}, end line: {}, end char: {}", s.get_text(), line, col, s.get_start(), s.get_stop(), s.get_end_line(), s.get_end_col());
        /*
        let start = node.get_parent().unwrap().get_child(s.get_start());
        let end = node.get_parent().unwrap().get_child(s.get_stop());
        println!("Terminal node start end {}", start.unwrap());
        */
    }

    fn enter_every_rule(&mut self, ctx: &dyn KotlinParserContext<'input>) {
        /*
        if let Some(rule) = kotlinparser::ruleNames.get(ctx.get_rule_index()) {
            if rule == kotlineparser::ruleNames
        }
        */
        /* println!(
            "rule entered {}",
            kotlinparser::ruleNames
                .get(ctx.get_rule_index())
                .unwrap_or(&"error")
        );
        */
    }
}

impl<'input> KotlinParserListener<'input> for Listener {}


pub fn parse() {
    // KotlinParser::with_strategy();
    let input = r#"
plugins {
    id("org.jetbrains.kotlin.jvm") version "1.5.31" 

    application 
}

repositories {
    mavenCentral() 
}

dependencies {
    implementation(platform("org.jetbrains.kotlin:kotlin-bom")) 

    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8") 

    implementation("com.google.guava:guava:30.1.1-jre") 

    testImplementation("org.jetbrains.kotlin:kotlin-test") 

    testImplementation("org.jetbrains.kotlin:kotlin-test-junit") 
}

application {
    mainClass.set("demo.AppKt") 
}"#.trim().to_owned();

    let lexer = KotlinLexer::new(InputStream::new(&*input));
    let token_source = CommonTokenStream::new(lexer);
    let mut parser = KotlinParser::new(token_source);
    // parser.add_parse_listener(Box::new(Listener {}));
    let result = parser.script();

    let r = result.unwrap();

    // println!("{}", result.unwrap())
    // println!("Parsed file: {}", r.get_children().count());

    /*
    for i in r.get_children() {
        println!("Child has {}", i.get_children().count());
    }
    */
}

/*
fn walk_tree<'input>(tree: dyn Tree<'input>) {
}
*/

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        println!("Running parse test");
        parse();
    }
}
