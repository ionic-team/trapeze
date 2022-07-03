mod kotlin;
use crate::kotlin::*;
use crate::kotlinlexer::KotlinLexer;
use antlr_rust::InputStream;
use antlr_rust::common_token_stream::CommonTokenStream;
use antlr_rust::tree::{ParseTree, ParseTreeListener};
use kotlin::kotlinparser::{KotlinParser, KotlinParserContextType, KotlinParserContext};
use kotlin::kotlinparserlistener::KotlinParserListener;

struct Listener {}

impl<'input> ParseTreeListener<'input, KotlinParserContextType> for Listener {
    fn enter_every_rule(&mut self, ctx: &dyn KotlinParserContext<'input>) {
        println!(
            "rule entered {}",
            kotlinparser::ruleNames
                .get(ctx.get_rule_index())
                .unwrap_or(&"error")
        )
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
}"#.to_owned();

    let lexer = KotlinLexer::new(InputStream::new(&*input));
    let token_source = CommonTokenStream::new(lexer);
    let mut parser = KotlinParser::new(token_source);
    parser.add_parse_listener(Box::new(Listener {}));
    let result = parser.script();
    // println!("{}", result.unwrap())
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
