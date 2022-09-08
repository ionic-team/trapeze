// Generated from java-escape by ANTLR 4.11.1
// jshint ignore: start
import antlr4 from 'antlr4';
import XCConfigListener from './XCConfigListener.js';
const serializedATN = [4,1,8,11,2,0,7,0,1,0,5,0,4,8,0,10,0,12,0,7,9,0,1,
0,1,0,1,0,0,0,1,0,0,1,2,0,1,1,8,8,10,0,5,1,0,0,0,2,4,7,0,0,0,3,2,1,0,0,0,
4,7,1,0,0,0,5,3,1,0,0,0,5,6,1,0,0,0,6,8,1,0,0,0,7,5,1,0,0,0,8,9,5,0,0,1,
9,1,1,0,0,0,1,5];


const atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map( (ds, index) => new antlr4.dfa.DFA(ds, index) );

const sharedContextCache = new antlr4.PredictionContextCache();

export default class XCConfigParser extends antlr4.Parser {

    static grammarFileName = "java-escape";
    static literalNames = [  ];
    static symbolicNames = [ null, "Expression", "Assignment", "Value", 
                             "Identifier", "IncludeDirective", "Newline", 
                             "Whitespace", "LineComment" ];
    static ruleNames = [ "xcconfig" ];

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
	        this.state = 5;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while(_la===1 || _la===8) {
	            this.state = 2;
	            _la = this._input.LA(1);
	            if(!(_la===1 || _la===8)) {
	            this._errHandler.recoverInline(this);
	            }
	            else {
	            	this._errHandler.reportMatch(this);
	                this.consume();
	            }
	            this.state = 7;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	        this.state = 8;
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


}

XCConfigParser.EOF = antlr4.Token.EOF;
XCConfigParser.Expression = 1;
XCConfigParser.Assignment = 2;
XCConfigParser.Value = 3;
XCConfigParser.Identifier = 4;
XCConfigParser.IncludeDirective = 5;
XCConfigParser.Newline = 6;
XCConfigParser.Whitespace = 7;
XCConfigParser.LineComment = 8;

XCConfigParser.RULE_xcconfig = 0;

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

	LineComment = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(XCConfigParser.LineComment);
	    } else {
	        return this.getToken(XCConfigParser.LineComment, i);
	    }
	};


	Expression = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(XCConfigParser.Expression);
	    } else {
	        return this.getToken(XCConfigParser.Expression, i);
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




XCConfigParser.XcconfigContext = XcconfigContext; 
