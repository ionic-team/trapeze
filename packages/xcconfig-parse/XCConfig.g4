grammar XCConfig;

xcconfig : Expression* EOF;

Expression
  : IncludeDirective | Assignment;

Assignment
    :  Identifier Whitespace* EQUALS Whitespace* Value ';'?;

EQUALS : '=';

Value
: ~('\n')* ;

Identifier
    :   IdentifierNondigit
        (   IdentifierNondigit
        |   Digit
        | Conditional
        )*
    ;

fragment
IdentifierNondigit
    :   Nondigit
    ;

fragment
Conditional
  : '[' [^\]]* ']'
  ;

fragment
Nondigit
    :   [a-zA-Z_]
    ;

fragment
Digit
    :   [0-9]
    ;

IncludeDirective
    :   '#' Whitespace? 'include' Whitespace? (('"' ~[\r\n]* '"')) Whitespace? Newline
        -> skip
    ;

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

SINGLE_LINE_COMMENT
   : WS* '//' .*? (NEWLINE | EOF) -> skip
   ;

fragment NEWLINE
   : '\r\n'
   | [\r\n\u2028\u2029]
   ;

WS  :   (('\r')? '\n' |  ' ' | '\t')+  -> skip;