grammar XCConfig;

xcconfig : (LineComment | Expression )* EOF;

Expression
  : Assignment;

Assignment
    :  Identifier Whitespace* '=' Whitespace* Value ';'?;

Value
: [^\n]* ;

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

LineComment
    :   '//' ~[\r\n]*
        -> skip
    ;