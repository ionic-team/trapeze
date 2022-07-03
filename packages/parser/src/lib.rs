mod kotlin;
use crate::kotlin::*;
use crate::kotlinlexer::KotlinLexer;
use antlr_rust::InputStream;
use antlr_rust::common_token_stream::CommonTokenStream;
use kotlin::kotlinparser::KotlinParser;

pub fn parse() {
    // KotlinParser::with_strategy();
    let input = r#"package org.kotlinlang.play
fun main() {
    println("Hello, World!")
}"#.to_owned();

    let lexer = KotlinLexer::new(InputStream::new(&*input));
    let token_source = CommonTokenStream::new(lexer);
    let mut parser = KotlinParser::new(token_source);
    let result = parser.kotlinFile();
    println!("Parsed file");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        println!("Running parse test");
        parse();
    }
}
