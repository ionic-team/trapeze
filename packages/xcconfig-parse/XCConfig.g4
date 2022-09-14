grammar XCConfig;

xcconfig : expression* EOF;

includeDirective
    :   '#' Whitespace? 'include' Whitespace? String Whitespace? Newline
    ;

expression
  : includeDirective | assignment;

assignment
    :  identifier Whitespace* EQUALS Whitespace* value? ';'?;

identifier
    :   text
    ;

value
: text;


/** Lexer rules **/
text :TEXT;
TEXT: ( 'a' .. 'z' | 'A' .. 'Z' | '_' | '0' .. '9' | '/' | '\\' | ':' | '*' | '.' | ',' | '@' | '[' | ']' | ' ') +;
        //( 'a' .. 'z' | 'A' .. 'Z' | '_' | '0' .. '9' | '/'| '\\' | ':')* 


Newline
    :   (   '\r' '\n'?
        |   '\n'
        )
        -> skip
    ;

Whitespace
    :   [ \t]+
        -> skip
    ;

String : (('"' ~[\r\n]* '"')) ;

EQUALS : '=';

SINGLE_LINE_COMMENT
   : WS* '//' .*? (NEWLINE | EOF) -> skip
   ;

fragment NEWLINE
   : '\r\n'
   | [\r\n\u2028\u2029]
   ;

WS  :   (('\r')? '\n' |  ' ' | '\t')+  -> skip;