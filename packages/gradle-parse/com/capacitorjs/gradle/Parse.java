package com.capacitorjs.gradle;

import org.codehaus.groovy.ast.*;
import org.codehaus.groovy.ast.builder.AstBuilder;
import org.codehaus.groovy.ast.expr.*;
import org.codehaus.groovy.ast.stmt.*;
import org.codehaus.groovy.control.CompilePhase;

import org.json.*;
import java.lang.reflect.Method;
import java.util.List;
import java.util.Map;
import java.nio.file.Files;
import java.nio.file.Path;

public class Parse {
  public static void main(String[] args) {
    try {
      Path f = Path.of(args[0]);
      String source = Files.readString(f);

      AstBuilder b = new AstBuilder();
      List<ASTNode> nodes = b.buildFromString(CompilePhase.CONVERSION, true, source);

      Visitor v = new Visitor();
      v.visit(nodes);
      v.outputJson();
    } catch (Exception ex) {
      System.err.println("Unable to parse file");
      ex.printStackTrace();
      System.exit(1);
    }
  }
}

class Visitor {
  private JSONObject tree = new JSONObject();
  public Visitor() {}

  public void outputJson() {
    log(tree.toString(2));
  }

  public void visit(List<ASTNode> nodes) {
    tree.put("type", "root");
    JSONArray children = new JSONArray();
    tree.put("children", children);
    for (ASTNode node : nodes) {
      if (node instanceof BlockStatement) {
        children.put(visitBlockStatement((BlockStatement) node));
      }
      // System.out.println(node.getClass());
    }
  }

  private void log(String s) {
    System.out.println(s);
  }

  private JSONObject visitBlockStatement(BlockStatement block) {
    JSONObject jsonNode = new JSONObject();
    JSONArray jsonChildren = new JSONArray();

    // log("Visiting " + block.getStatements().size());

    for (Statement statement : block.getStatements()) {
      if (statement instanceof ExpressionStatement) {
        JSONObject jsonStatement = visitExpressionStatement((ExpressionStatement) statement);
        if (jsonStatement != null) {
          jsonChildren.put(jsonStatement);
        }
      }
    }

    jsonNode.put("type", "block");
    addSourceInfo(block, jsonNode);
    jsonNode.put("children", jsonChildren);
    return jsonNode;
  }

  private JSONObject visitExpressionStatement(ExpressionStatement exprStatement) {
    Expression expr = exprStatement.getExpression();

    // log("Visiting expression " + expr.getClass());


    if (expr instanceof MethodCallExpression) {
      MethodCallExpression mcExpr = (MethodCallExpression) expr;

      return visitMethodCallExpression(exprStatement, mcExpr);
    }

    return null;
  }

  private JSONObject visitMethodCallExpression(ExpressionStatement exprStatement, MethodCallExpression mcExpr) {
    JSONObject jsonNode = new JSONObject();
    JSONArray children = new JSONArray();

    // log(mcExpr.getMethodAsString());

    // Expression args = mcExpr.getArguments();
    // log("Args: " + args);
    // List<Expression> expressions = mcExpr.getExpressions();
    ConstantExpression method = (ConstantExpression) mcExpr.getMethod();
    addSourceInfo(exprStatement, jsonNode);
    String methodName = (String) method.getValue();

    TupleExpression args = (TupleExpression) mcExpr.getArguments();

    List<Expression> expressions = args.getExpressions();

    for (Expression ex : expressions) {
      // log("Expression: " + ex.getClass());
      if (ex instanceof ClosureExpression) {
        children.put(visitClosureExpression((ClosureExpression) ex));
      }
    }

    jsonNode.put("children", children);
    jsonNode.put("type", "method");
    jsonNode.put("name", methodName);
    return jsonNode;
  }

  private JSONObject visitClosureExpression(ClosureExpression closureExpr) {
    JSONObject jsonNode = new JSONObject();
    Statement code = closureExpr.getCode();

    if (code instanceof BlockStatement) {
      return visitBlockStatement((BlockStatement) code);
    }

    // log("Closure code: " + code.getClass());
    return jsonNode;
  }

  private void addSourceInfo(ASTNode node, JSONObject jsonNode) {
    JSONObject source = new JSONObject();
    source.put("line", node.getLineNumber());
    source.put("column", node.getColumnNumber());
    source.put("lastLine", node.getLastLineNumber());
    source.put("lastColumn", node.getLastColumnNumber());
    jsonNode.put("source", source);
  }
}