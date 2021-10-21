import org.codehaus.groovy.ast.builder.AstBuilder;
import org.codehaus.groovy.ast.ASTNode;
import org.codehaus.groovy.ast.expr.*;
import org.codehaus.groovy.ast.stmt.*;
import org.codehaus.groovy.control.CompilePhase;

import org.json.*;
import java.util.List;
import java.util.Map;
import java.nio.file.Files;
import java.nio.file.Path;

public class Test {
  public static void main(String[] args) {
    try {
      Path f = Path.of("basic.gradle");
      String source = Files.readString(f);

      AstBuilder b = new AstBuilder();
      List<ASTNode> nodes = b.buildFromString(CompilePhase.CONVERSION, true, source);

      Visitor v = new Visitor();
      v.visit(nodes);
      v.outputJson();
    } catch (Exception ex) {
      System.err.println("Unable to parse file");
      ex.printStackTrace();
    }
  }
}

class Visitor {
  private JSONObject tree = new JSONObject();
  public Visitor() {}

  public void outputJson() {
    log(tree.toString());
  }

  public void visit(List<ASTNode> nodes) {
    JSONObject jsonNode = new JSONObject();
    tree.put("root", jsonNode);
    for (ASTNode node : nodes) {
      if (node instanceof BlockStatement) {
        visitBlockStatement((BlockStatement) node, jsonNode);
      }
      // System.out.println(node.getClass());
    }
  }

  private void log(String s) {
    System.out.println(s);
  }

  private void visitBlockStatement(BlockStatement block, JSONObject jsonNode) {
    log("Visiting " + block.getStatements().size());
    log("Statment: @ " + block.getLineNumber() + ":" + block.getColumnNumber() + " to " + block.getLastLineNumber() + ":" + block.getLastColumnNumber());

    JSONArray jsonChildren = new JSONArray();

    for (Statement statement : block.getStatements()) {
      if (statement instanceof ExpressionStatement) {
        JSONObject jsonStatement = visitExpressionStatement((ExpressionStatement) statement);
        jsonChildren.put(jsonStatement);
      }
    }

    jsonNode.put("children", jsonChildren);
  }

  private JSONObject visitExpressionStatement(ExpressionStatement exprStatement) {
    Expression expr = exprStatement.getExpression();

    JSONObject jsonNode = new JSONObject();

    log("Visiting expression " + expr.getClass());
    log("Statment: @ " + exprStatement.getLineNumber() + ":" + exprStatement.getColumnNumber() + " to " + exprStatement.getLastLineNumber() + ":" + exprStatement.getLastColumnNumber());

    addSourceInfo(exprStatement, jsonNode);

    if (expr instanceof MethodCallExpression) {
      MethodCallExpression mcExpr = (MethodCallExpression) expr;
      ConstantExpression method = (ConstantExpression) mcExpr.getMethod();
      log("Got method: " + method.getValue() + " @ " + method.getLineNumber() + ":" + method.getColumnNumber() + " to " + method.getLastLineNumber() + ":" + method.getLastColumnNumber());
    }

    return jsonNode;
    /*
    for (Statement statement : block.getStatements()) {
      if (statement instanceof ExpressionStatement) {
        visitExpressionStatement((ExpressionStatement) statement);
      }
    }
    */
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