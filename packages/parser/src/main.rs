use parser::parse;

fn main() {
    use std::time::Instant;
    let now = Instant::now();

    println!("Running");
    parse();
    println!("Parsed");

    let elapsed = now.elapsed();
    println!("Elapsed: {:.2?}", elapsed);
}