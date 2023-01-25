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
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

/**
 * A utility for building a limited AST of a given Gradle/Groovy file. This AST
 * *does not* contain adequate data to reconstruct the file accurately. Instead,
 * it's used to correctly track gradle methods including nested ones along with
 * source location information, to make it easy to apply basic string injection
 * to modify the file without breaking the structure of the source file.
 *
 * It currently only handles Block statements, Closures, and Methods and ignores
 * all other AST Nodes
 */
public class Parse {
  public static void main(String[] args) {
    try {
      String source = readFile(args[0]);

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

  private static String readFile(String path) throws IOException {
    byte[] encoded = Files.readAllBytes(Paths.get(path));
    return new String(encoded, StandardCharsets.UTF_8);
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
    }
  }

  /**
   * a block statement contains a list of other statements. For example, the top level of
   * the file is a Block with a statement for each Gradle construct
   */
  private JSONObject visitBlockStatement(BlockStatement block) {
    JSONObject jsonNode = new JSONObject();
    JSONArray jsonChildren = new JSONArray();

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

  /**
   * Upon finding an Expression, visit that and look for Method calls (such as buildscript or dependencies)
   */
  private JSONObject visitExpressionStatement(ExpressionStatement exprStatement) {
    Expression expr = exprStatement.getExpression();

    if (expr instanceof MethodCallExpression) {
      MethodCallExpression mcExpr = (MethodCallExpression) expr;
      return visitMethodCallExpression(exprStatement, mcExpr);
    } if (expr instanceof BinaryExpression) {
      BinaryExpression binExpr = (BinaryExpression) expr;
      return visitBinaryExpression(exprStatement, binExpr);
    }

    return null;
  }

  private JSONObject visitBinaryExpression(ExpressionStatement exprStatement, BinaryExpression binExpr) {
    Expression leftExpr = binExpr.getLeftExpression();
    Expression rightExpr = binExpr.getRightExpression();

    if (leftExpr instanceof VariableExpression && rightExpr instanceof ConstantExpression) {
      VariableExpression varExpr = (VariableExpression) leftExpr;
      ConstantExpression constExpr = (ConstantExpression) rightExpr;

      String varName = varExpr.getName();

      String constValue = constExpr.getText();

      JSONObject jsonNode = new JSONObject();
      jsonNode.put("type", "variable");
      jsonNode.put("name", varName);
      jsonNode.put("value", constExpr.getValue());
      jsonNode.put("children", new JSONArray());
      addSourceInfo(binExpr, jsonNode);

      return jsonNode;
    }

    return null;
  }

  /**
   * A method call is what we're looking for. These are the primary Gradle constructs in the Groovy DSL
   * that makes up Gradle: https://docs.gradle.org/current/dsl/index.html
   */
  private JSONObject visitMethodCallExpression(ExpressionStatement exprStatement, MethodCallExpression mcExpr) {
    JSONObject jsonNode = new JSONObject();
    JSONArray children = new JSONArray();
    addSourceInfo(exprStatement, jsonNode);

    ConstantExpression method = (ConstantExpression) mcExpr.getMethod();
    String methodName = (String) method.getValue();

    // Get the "arguments" for the MethodCallExpression, which are a list of expressions
    // passed to the method, such as a nested Closure expression (aka a method body)
    TupleExpression args = (TupleExpression) mcExpr.getArguments();

    List<Expression> expressions = args.getExpressions();

    for (Expression ex : expressions) {
      if (ex instanceof ClosureExpression) {
        // Descend into the closure expression to handle nested method calls
        children.put(visitClosureExpression((ClosureExpression) ex));
      }
    }

    jsonNode.put("children", children);
    jsonNode.put("type", "method");
    jsonNode.put("name", methodName);
    return jsonNode;
  }

  /**
   * Visit a Closure expression (the body of a method call) and descend into any block statements,
   * this enables us to recursively define the basic structure of the Gradle file
   */
  private JSONObject visitClosureExpression(ClosureExpression closureExpr) {
    JSONObject jsonNode = new JSONObject();
    Statement code = closureExpr.getCode();

    if (code instanceof BlockStatement) {
      return visitBlockStatement((BlockStatement) code);
    }

    return jsonNode;
  }

  private JSONObject visitExpression(Expression expr) {
    return new JSONObject();
  }

  /**
   * Apply source location information for the ASTNode to the collector JSONObject
   */
  private void addSourceInfo(ASTNode node, JSONObject jsonNode) {
    JSONObject source = new JSONObject();
    source.put("line", node.getLineNumber());
    source.put("column", node.getColumnNumber());
    source.put("lastLine", node.getLastLineNumber());
    source.put("lastColumn", node.getLastColumnNumber());
    jsonNode.put("source", source);
  }

  private void log(String s) {
    System.out.println(s);
  }

}