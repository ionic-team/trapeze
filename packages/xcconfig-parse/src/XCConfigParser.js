// Generated from java-escape by ANTLR 4.11.1
// jshint ignore: start
import antlr4 from 'antlr4';
import XCConfigListener from './XCConfigListener.js';
const serializedATN = [4,1,10,67,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,
2,5,7,5,2,6,7,6,1,0,5,0,16,8,0,10,0,12,0,19,9,0,1,0,1,0,1,1,1,1,3,1,25,8,
1,1,1,1,1,3,1,29,8,1,1,1,1,1,3,1,33,8,1,1,1,1,1,1,2,1,2,3,2,39,8,2,1,3,1,
3,5,3,43,8,3,10,3,12,3,46,9,3,1,3,1,3,5,3,50,8,3,10,3,12,3,53,9,3,1,3,3,
3,56,8,3,1,3,3,3,59,8,3,1,4,1,4,1,5,1,5,1,6,1,6,1,6,0,0,7,0,2,4,6,8,10,12,
0,0,68,0,17,1,0,0,0,2,22,1,0,0,0,4,38,1,0,0,0,6,40,1,0,0,0,8,60,1,0,0,0,
10,62,1,0,0,0,12,64,1,0,0,0,14,16,3,4,2,0,15,14,1,0,0,0,16,19,1,0,0,0,17,
15,1,0,0,0,17,18,1,0,0,0,18,20,1,0,0,0,19,17,1,0,0,0,20,21,5,0,0,1,21,1,
1,0,0,0,22,24,5,1,0,0,23,25,5,6,0,0,24,23,1,0,0,0,24,25,1,0,0,0,25,26,1,
0,0,0,26,28,5,2,0,0,27,29,5,6,0,0,28,27,1,0,0,0,28,29,1,0,0,0,29,30,1,0,
0,0,30,32,5,7,0,0,31,33,5,6,0,0,32,31,1,0,0,0,32,33,1,0,0,0,33,34,1,0,0,
0,34,35,5,5,0,0,35,3,1,0,0,0,36,39,3,2,1,0,37,39,3,6,3,0,38,36,1,0,0,0,38,
37,1,0,0,0,39,5,1,0,0,0,40,44,3,8,4,0,41,43,5,6,0,0,42,41,1,0,0,0,43,46,
1,0,0,0,44,42,1,0,0,0,44,45,1,0,0,0,45,47,1,0,0,0,46,44,1,0,0,0,47,51,5,
8,0,0,48,50,5,6,0,0,49,48,1,0,0,0,50,53,1,0,0,0,51,49,1,0,0,0,51,52,1,0,
0,0,52,55,1,0,0,0,53,51,1,0,0,0,54,56,3,10,5,0,55,54,1,0,0,0,55,56,1,0,0,
0,56,58,1,0,0,0,57,59,5,3,0,0,58,57,1,0,0,0,58,59,1,0,0,0,59,7,1,0,0,0,60,
61,3,12,6,0,61,9,1,0,0,0,62,63,3,12,6,0,63,11,1,0,0,0,64,65,5,4,0,0,65,13,
1,0,0,0,9,17,24,28,32,38,44,51,55,58];


const atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map( (ds, index) => new antlr4.dfa.DFA(ds, index) );

const sharedContextCache = new antlr4.PredictionContextCache();

export default class XCConfigParser extends antlr4.Parser {

    static grammarFileName = "java-escape";
    static literalNames = [ null, "'#'", "'include'", "';'", null, null, 
                            null, null, "'='" ];
    static symbolicNames = [ null, null, null, null, "TEXT", "Newline", 
                             "Whitespace", "String", "EQUALS", "SINGLE_LINE_COMMENT", 
                             "WS" ];
    static ruleNames = [ "xcconfig", "includeDirective", "expression", "assignment", 
                         "identifier", "value", "text" ];

    constructor(input) {
        super(input);
        this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
        this.ruleNames = XCConfigParser.ruleNames;
        this.literalNames = XCConfigParser.literalNames;
        this.symbolicNames = XCConfigParser.symbolicNames;
    }

    get atn() {
        return atn;
    }



	xcconfig() {
	    let localctx = new XcconfigContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 0, XCConfigParser.RULE_xcconfig);
	    var _la = 0; // Token type
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 17;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while(_la===1 || _la===4) {
	            this.state = 14;
	            this.expression();
	            this.state = 19;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	        this.state = 20;
	        this.match(XCConfigParser.EOF);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	includeDirective() {
	    let localctx = new IncludeDirectiveContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 2, XCConfigParser.RULE_includeDirective);
	    var _la = 0; // Token type
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 22;
	        this.match(XCConfigParser.T__0);
	        this.state = 24;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===6) {
	            this.state = 23;
	            this.match(XCConfigParser.Whitespace);
	        }

	        this.state = 26;
	        this.match(XCConfigParser.T__1);
	        this.state = 28;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===6) {
	            this.state = 27;
	            this.match(XCConfigParser.Whitespace);
	        }

	        this.state = 30;
	        this.match(XCConfigParser.String);
	        this.state = 32;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===6) {
	            this.state = 31;
	            this.match(XCConfigParser.Whitespace);
	        }

	        this.state = 34;
	        this.match(XCConfigParser.Newline);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	expression() {
	    let localctx = new ExpressionContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 4, XCConfigParser.RULE_expression);
	    try {
	        this.state = 38;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case 1:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 36;
	            this.includeDirective();
	            break;
	        case 4:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 37;
	            this.assignment();
	            break;
	        default:
	            throw new antlr4.error.NoViableAltException(this);
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	assignment() {
	    let localctx = new AssignmentContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 6, XCConfigParser.RULE_assignment);
	    var _la = 0; // Token type
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 40;
	        this.identifier();
	        this.state = 44;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while(_la===6) {
	            this.state = 41;
	            this.match(XCConfigParser.Whitespace);
	            this.state = 46;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	        this.state = 47;
	        this.match(XCConfigParser.EQUALS);
	        this.state = 51;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while(_la===6) {
	            this.state = 48;
	            this.match(XCConfigParser.Whitespace);
	            this.state = 53;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	        this.state = 55;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,7,this._ctx);
	        if(la_===1) {
	            this.state = 54;
	            this.value();

	        }
	        this.state = 58;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===3) {
	            this.state = 57;
	            this.match(XCConfigParser.T__2);
	        }

	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	identifier() {
	    let localctx = new IdentifierContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 8, XCConfigParser.RULE_identifier);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 60;
	        this.text();
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	value() {
	    let localctx = new ValueContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 10, XCConfigParser.RULE_value);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 62;
	        this.text();
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	text() {
	    let localctx = new TextContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 12, XCConfigParser.RULE_text);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 64;
	        this.match(XCConfigParser.TEXT);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


}

XCConfigParser.EOF = antlr4.Token.EOF;
XCConfigParser.T__0 = 1;
XCConfigParser.T__1 = 2;
XCConfigParser.T__2 = 3;
XCConfigParser.TEXT = 4;
XCConfigParser.Newline = 5;
XCConfigParser.Whitespace = 6;
XCConfigParser.String = 7;
XCConfigParser.EQUALS = 8;
XCConfigParser.SINGLE_LINE_COMMENT = 9;
XCConfigParser.WS = 10;

XCConfigParser.RULE_xcconfig = 0;
XCConfigParser.RULE_includeDirective = 1;
XCConfigParser.RULE_expression = 2;
XCConfigParser.RULE_assignment = 3;
XCConfigParser.RULE_identifier = 4;
XCConfigParser.RULE_value = 5;
XCConfigParser.RULE_text = 6;

class XcconfigContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = XCConfigParser.RULE_xcconfig;
    }

	EOF() {
	    return this.getToken(XCConfigParser.EOF, 0);
	};

	expression = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(ExpressionContext);
	    } else {
	        return this.getTypedRuleContext(ExpressionContext,i);
	    }
	};

	enterRule(listener) {
	    if(listener instanceof XCConfigListener ) {
	        listener.enterXcconfig(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof XCConfigListener ) {
	        listener.exitXcconfig(this);
		}
	}


}



class IncludeDirectiveContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = XCConfigParser.RULE_includeDirective;
    }

	String() {
	    return this.getToken(XCConfigParser.String, 0);
	};

	Newline() {
	    return this.getToken(XCConfigParser.Newline, 0);
	};

	Whitespace = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(XCConfigParser.Whitespace);
	    } else {
	        return this.getToken(XCConfigParser.Whitespace, i);
	    }
	};


	enterRule(listener) {
	    if(listener instanceof XCConfigListener ) {
	        listener.enterIncludeDirective(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof XCConfigListener ) {
	        listener.exitIncludeDirective(this);
		}
	}


}



class ExpressionContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = XCConfigParser.RULE_expression;
    }

	includeDirective() {
	    return this.getTypedRuleContext(IncludeDirectiveContext,0);
	};

	assignment() {
	    return this.getTypedRuleContext(AssignmentContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof XCConfigListener ) {
	        listener.enterExpression(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof XCConfigListener ) {
	        listener.exitExpression(this);
		}
	}


}



class AssignmentContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = XCConfigParser.RULE_assignment;
    }

	identifier() {
	    return this.getTypedRuleContext(IdentifierContext,0);
	};

	EQUALS() {
	    return this.getToken(XCConfigParser.EQUALS, 0);
	};

	Whitespace = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(XCConfigParser.Whitespace);
	    } else {
	        return this.getToken(XCConfigParser.Whitespace, i);
	    }
	};


	value() {
	    return this.getTypedRuleContext(ValueContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof XCConfigListener ) {
	        listener.enterAssignment(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof XCConfigListener ) {
	        listener.exitAssignment(this);
		}
	}


}



class IdentifierContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = XCConfigParser.RULE_identifier;
    }

	text() {
	    return this.getTypedRuleContext(TextContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof XCConfigListener ) {
	        listener.enterIdentifier(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof XCConfigListener ) {
	        listener.exitIdentifier(this);
		}
	}


}



class ValueContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = XCConfigParser.RULE_value;
    }

	text() {
	    return this.getTypedRuleContext(TextContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof XCConfigListener ) {
	        listener.enterValue(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof XCConfigListener ) {
	        listener.exitValue(this);
		}
	}


}



class TextContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = XCConfigParser.RULE_text;
    }

	TEXT() {
	    return this.getToken(XCConfigParser.TEXT, 0);
	};

	enterRule(listener) {
	    if(listener instanceof XCConfigListener ) {
	        listener.enterText(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof XCConfigListener ) {
	        listener.exitText(this);
		}
	}


}




XCConfigParser.XcconfigContext = XcconfigContext; 
XCConfigParser.IncludeDirectiveContext = IncludeDirectiveContext; 
XCConfigParser.ExpressionContext = ExpressionContext; 
XCConfigParser.AssignmentContext = AssignmentContext; 
XCConfigParser.IdentifierContext = IdentifierContext; 
XCConfigParser.ValueContext = ValueContext; 
XCConfigParser.TextContext = TextContext; 
