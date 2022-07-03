#![allow(nonstandard_style)]
// Generated from KotlinParser.g4 by ANTLR 4.8
use antlr_rust::tree::{ParseTreeVisitor,ParseTreeVisitorCompat};
use super::kotlinparser::*;
use std::mem;

/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by {@link KotlinParser}.
 */
pub trait KotlinParserVisitor<'input>: ParseTreeVisitor<'input,KotlinParserContextType>{
	/**
	 * Visit a parse tree produced by {@link KotlinParser#kotlinFile}.
	 * @param ctx the parse tree
	 */
	fn visit_kotlinFile(&mut self, ctx: &KotlinFileContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#script}.
	 * @param ctx the parse tree
	 */
	fn visit_script(&mut self, ctx: &ScriptContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#shebangLine}.
	 * @param ctx the parse tree
	 */
	fn visit_shebangLine(&mut self, ctx: &ShebangLineContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#fileAnnotation}.
	 * @param ctx the parse tree
	 */
	fn visit_fileAnnotation(&mut self, ctx: &FileAnnotationContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#packageHeader}.
	 * @param ctx the parse tree
	 */
	fn visit_packageHeader(&mut self, ctx: &PackageHeaderContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#importList}.
	 * @param ctx the parse tree
	 */
	fn visit_importList(&mut self, ctx: &ImportListContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#importHeader}.
	 * @param ctx the parse tree
	 */
	fn visit_importHeader(&mut self, ctx: &ImportHeaderContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#importAlias}.
	 * @param ctx the parse tree
	 */
	fn visit_importAlias(&mut self, ctx: &ImportAliasContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#topLevelObject}.
	 * @param ctx the parse tree
	 */
	fn visit_topLevelObject(&mut self, ctx: &TopLevelObjectContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#typeAlias}.
	 * @param ctx the parse tree
	 */
	fn visit_typeAlias(&mut self, ctx: &TypeAliasContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#declaration}.
	 * @param ctx the parse tree
	 */
	fn visit_declaration(&mut self, ctx: &DeclarationContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#classDeclaration}.
	 * @param ctx the parse tree
	 */
	fn visit_classDeclaration(&mut self, ctx: &ClassDeclarationContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#primaryConstructor}.
	 * @param ctx the parse tree
	 */
	fn visit_primaryConstructor(&mut self, ctx: &PrimaryConstructorContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#classBody}.
	 * @param ctx the parse tree
	 */
	fn visit_classBody(&mut self, ctx: &ClassBodyContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#classParameters}.
	 * @param ctx the parse tree
	 */
	fn visit_classParameters(&mut self, ctx: &ClassParametersContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#classParameter}.
	 * @param ctx the parse tree
	 */
	fn visit_classParameter(&mut self, ctx: &ClassParameterContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#delegationSpecifiers}.
	 * @param ctx the parse tree
	 */
	fn visit_delegationSpecifiers(&mut self, ctx: &DelegationSpecifiersContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#delegationSpecifier}.
	 * @param ctx the parse tree
	 */
	fn visit_delegationSpecifier(&mut self, ctx: &DelegationSpecifierContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#constructorInvocation}.
	 * @param ctx the parse tree
	 */
	fn visit_constructorInvocation(&mut self, ctx: &ConstructorInvocationContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#annotatedDelegationSpecifier}.
	 * @param ctx the parse tree
	 */
	fn visit_annotatedDelegationSpecifier(&mut self, ctx: &AnnotatedDelegationSpecifierContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#explicitDelegation}.
	 * @param ctx the parse tree
	 */
	fn visit_explicitDelegation(&mut self, ctx: &ExplicitDelegationContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#typeParameters}.
	 * @param ctx the parse tree
	 */
	fn visit_typeParameters(&mut self, ctx: &TypeParametersContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#typeParameter}.
	 * @param ctx the parse tree
	 */
	fn visit_typeParameter(&mut self, ctx: &TypeParameterContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#typeConstraints}.
	 * @param ctx the parse tree
	 */
	fn visit_typeConstraints(&mut self, ctx: &TypeConstraintsContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#typeConstraint}.
	 * @param ctx the parse tree
	 */
	fn visit_typeConstraint(&mut self, ctx: &TypeConstraintContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#classMemberDeclarations}.
	 * @param ctx the parse tree
	 */
	fn visit_classMemberDeclarations(&mut self, ctx: &ClassMemberDeclarationsContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#classMemberDeclaration}.
	 * @param ctx the parse tree
	 */
	fn visit_classMemberDeclaration(&mut self, ctx: &ClassMemberDeclarationContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#anonymousInitializer}.
	 * @param ctx the parse tree
	 */
	fn visit_anonymousInitializer(&mut self, ctx: &AnonymousInitializerContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#companionObject}.
	 * @param ctx the parse tree
	 */
	fn visit_companionObject(&mut self, ctx: &CompanionObjectContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#functionValueParameters}.
	 * @param ctx the parse tree
	 */
	fn visit_functionValueParameters(&mut self, ctx: &FunctionValueParametersContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#functionValueParameter}.
	 * @param ctx the parse tree
	 */
	fn visit_functionValueParameter(&mut self, ctx: &FunctionValueParameterContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#functionDeclaration}.
	 * @param ctx the parse tree
	 */
	fn visit_functionDeclaration(&mut self, ctx: &FunctionDeclarationContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#functionBody}.
	 * @param ctx the parse tree
	 */
	fn visit_functionBody(&mut self, ctx: &FunctionBodyContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#variableDeclaration}.
	 * @param ctx the parse tree
	 */
	fn visit_variableDeclaration(&mut self, ctx: &VariableDeclarationContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#multiVariableDeclaration}.
	 * @param ctx the parse tree
	 */
	fn visit_multiVariableDeclaration(&mut self, ctx: &MultiVariableDeclarationContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#propertyDeclaration}.
	 * @param ctx the parse tree
	 */
	fn visit_propertyDeclaration(&mut self, ctx: &PropertyDeclarationContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#propertyDelegate}.
	 * @param ctx the parse tree
	 */
	fn visit_propertyDelegate(&mut self, ctx: &PropertyDelegateContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#getter}.
	 * @param ctx the parse tree
	 */
	fn visit_getter(&mut self, ctx: &GetterContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#setter}.
	 * @param ctx the parse tree
	 */
	fn visit_setter(&mut self, ctx: &SetterContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#parametersWithOptionalType}.
	 * @param ctx the parse tree
	 */
	fn visit_parametersWithOptionalType(&mut self, ctx: &ParametersWithOptionalTypeContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#functionValueParameterWithOptionalType}.
	 * @param ctx the parse tree
	 */
	fn visit_functionValueParameterWithOptionalType(&mut self, ctx: &FunctionValueParameterWithOptionalTypeContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#parameterWithOptionalType}.
	 * @param ctx the parse tree
	 */
	fn visit_parameterWithOptionalType(&mut self, ctx: &ParameterWithOptionalTypeContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#parameter}.
	 * @param ctx the parse tree
	 */
	fn visit_parameter(&mut self, ctx: &ParameterContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#objectDeclaration}.
	 * @param ctx the parse tree
	 */
	fn visit_objectDeclaration(&mut self, ctx: &ObjectDeclarationContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#secondaryConstructor}.
	 * @param ctx the parse tree
	 */
	fn visit_secondaryConstructor(&mut self, ctx: &SecondaryConstructorContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#constructorDelegationCall}.
	 * @param ctx the parse tree
	 */
	fn visit_constructorDelegationCall(&mut self, ctx: &ConstructorDelegationCallContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#enumClassBody}.
	 * @param ctx the parse tree
	 */
	fn visit_enumClassBody(&mut self, ctx: &EnumClassBodyContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#enumEntries}.
	 * @param ctx the parse tree
	 */
	fn visit_enumEntries(&mut self, ctx: &EnumEntriesContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#enumEntry}.
	 * @param ctx the parse tree
	 */
	fn visit_enumEntry(&mut self, ctx: &EnumEntryContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#rustType}.
	 * @param ctx the parse tree
	 */
	fn visit_rustType(&mut self, ctx: &RustTypeContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#typeReference}.
	 * @param ctx the parse tree
	 */
	fn visit_typeReference(&mut self, ctx: &TypeReferenceContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#nullableType}.
	 * @param ctx the parse tree
	 */
	fn visit_nullableType(&mut self, ctx: &NullableTypeContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#quest}.
	 * @param ctx the parse tree
	 */
	fn visit_quest(&mut self, ctx: &QuestContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#userType}.
	 * @param ctx the parse tree
	 */
	fn visit_userType(&mut self, ctx: &UserTypeContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#simpleUserType}.
	 * @param ctx the parse tree
	 */
	fn visit_simpleUserType(&mut self, ctx: &SimpleUserTypeContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#typeProjection}.
	 * @param ctx the parse tree
	 */
	fn visit_typeProjection(&mut self, ctx: &TypeProjectionContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#typeProjectionModifiers}.
	 * @param ctx the parse tree
	 */
	fn visit_typeProjectionModifiers(&mut self, ctx: &TypeProjectionModifiersContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#typeProjectionModifier}.
	 * @param ctx the parse tree
	 */
	fn visit_typeProjectionModifier(&mut self, ctx: &TypeProjectionModifierContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#functionType}.
	 * @param ctx the parse tree
	 */
	fn visit_functionType(&mut self, ctx: &FunctionTypeContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#functionTypeParameters}.
	 * @param ctx the parse tree
	 */
	fn visit_functionTypeParameters(&mut self, ctx: &FunctionTypeParametersContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#parenthesizedType}.
	 * @param ctx the parse tree
	 */
	fn visit_parenthesizedType(&mut self, ctx: &ParenthesizedTypeContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#receiverType}.
	 * @param ctx the parse tree
	 */
	fn visit_receiverType(&mut self, ctx: &ReceiverTypeContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#parenthesizedUserType}.
	 * @param ctx the parse tree
	 */
	fn visit_parenthesizedUserType(&mut self, ctx: &ParenthesizedUserTypeContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#statements}.
	 * @param ctx the parse tree
	 */
	fn visit_statements(&mut self, ctx: &StatementsContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#statement}.
	 * @param ctx the parse tree
	 */
	fn visit_statement(&mut self, ctx: &StatementContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#label}.
	 * @param ctx the parse tree
	 */
	fn visit_label(&mut self, ctx: &LabelContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#controlStructureBody}.
	 * @param ctx the parse tree
	 */
	fn visit_controlStructureBody(&mut self, ctx: &ControlStructureBodyContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#block}.
	 * @param ctx the parse tree
	 */
	fn visit_block(&mut self, ctx: &BlockContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#loopStatement}.
	 * @param ctx the parse tree
	 */
	fn visit_loopStatement(&mut self, ctx: &LoopStatementContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#forStatement}.
	 * @param ctx the parse tree
	 */
	fn visit_forStatement(&mut self, ctx: &ForStatementContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#whileStatement}.
	 * @param ctx the parse tree
	 */
	fn visit_whileStatement(&mut self, ctx: &WhileStatementContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#doWhileStatement}.
	 * @param ctx the parse tree
	 */
	fn visit_doWhileStatement(&mut self, ctx: &DoWhileStatementContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#assignment}.
	 * @param ctx the parse tree
	 */
	fn visit_assignment(&mut self, ctx: &AssignmentContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#semi}.
	 * @param ctx the parse tree
	 */
	fn visit_semi(&mut self, ctx: &SemiContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#semis}.
	 * @param ctx the parse tree
	 */
	fn visit_semis(&mut self, ctx: &SemisContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#expression}.
	 * @param ctx the parse tree
	 */
	fn visit_expression(&mut self, ctx: &ExpressionContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#disjunction}.
	 * @param ctx the parse tree
	 */
	fn visit_disjunction(&mut self, ctx: &DisjunctionContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#conjunction}.
	 * @param ctx the parse tree
	 */
	fn visit_conjunction(&mut self, ctx: &ConjunctionContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#equality}.
	 * @param ctx the parse tree
	 */
	fn visit_equality(&mut self, ctx: &EqualityContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#comparison}.
	 * @param ctx the parse tree
	 */
	fn visit_comparison(&mut self, ctx: &ComparisonContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#genericCallLikeComparison}.
	 * @param ctx the parse tree
	 */
	fn visit_genericCallLikeComparison(&mut self, ctx: &GenericCallLikeComparisonContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#infixOperation}.
	 * @param ctx the parse tree
	 */
	fn visit_infixOperation(&mut self, ctx: &InfixOperationContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#elvisExpression}.
	 * @param ctx the parse tree
	 */
	fn visit_elvisExpression(&mut self, ctx: &ElvisExpressionContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#elvis}.
	 * @param ctx the parse tree
	 */
	fn visit_elvis(&mut self, ctx: &ElvisContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#infixFunctionCall}.
	 * @param ctx the parse tree
	 */
	fn visit_infixFunctionCall(&mut self, ctx: &InfixFunctionCallContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#rangeExpression}.
	 * @param ctx the parse tree
	 */
	fn visit_rangeExpression(&mut self, ctx: &RangeExpressionContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#additiveExpression}.
	 * @param ctx the parse tree
	 */
	fn visit_additiveExpression(&mut self, ctx: &AdditiveExpressionContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#multiplicativeExpression}.
	 * @param ctx the parse tree
	 */
	fn visit_multiplicativeExpression(&mut self, ctx: &MultiplicativeExpressionContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#asExpression}.
	 * @param ctx the parse tree
	 */
	fn visit_asExpression(&mut self, ctx: &AsExpressionContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#prefixUnaryExpression}.
	 * @param ctx the parse tree
	 */
	fn visit_prefixUnaryExpression(&mut self, ctx: &PrefixUnaryExpressionContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#unaryPrefix}.
	 * @param ctx the parse tree
	 */
	fn visit_unaryPrefix(&mut self, ctx: &UnaryPrefixContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#postfixUnaryExpression}.
	 * @param ctx the parse tree
	 */
	fn visit_postfixUnaryExpression(&mut self, ctx: &PostfixUnaryExpressionContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#postfixUnarySuffix}.
	 * @param ctx the parse tree
	 */
	fn visit_postfixUnarySuffix(&mut self, ctx: &PostfixUnarySuffixContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#directlyAssignableExpression}.
	 * @param ctx the parse tree
	 */
	fn visit_directlyAssignableExpression(&mut self, ctx: &DirectlyAssignableExpressionContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#parenthesizedDirectlyAssignableExpression}.
	 * @param ctx the parse tree
	 */
	fn visit_parenthesizedDirectlyAssignableExpression(&mut self, ctx: &ParenthesizedDirectlyAssignableExpressionContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#assignableExpression}.
	 * @param ctx the parse tree
	 */
	fn visit_assignableExpression(&mut self, ctx: &AssignableExpressionContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#parenthesizedAssignableExpression}.
	 * @param ctx the parse tree
	 */
	fn visit_parenthesizedAssignableExpression(&mut self, ctx: &ParenthesizedAssignableExpressionContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#assignableSuffix}.
	 * @param ctx the parse tree
	 */
	fn visit_assignableSuffix(&mut self, ctx: &AssignableSuffixContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#indexingSuffix}.
	 * @param ctx the parse tree
	 */
	fn visit_indexingSuffix(&mut self, ctx: &IndexingSuffixContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#navigationSuffix}.
	 * @param ctx the parse tree
	 */
	fn visit_navigationSuffix(&mut self, ctx: &NavigationSuffixContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#callSuffix}.
	 * @param ctx the parse tree
	 */
	fn visit_callSuffix(&mut self, ctx: &CallSuffixContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#annotatedLambda}.
	 * @param ctx the parse tree
	 */
	fn visit_annotatedLambda(&mut self, ctx: &AnnotatedLambdaContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#typeArguments}.
	 * @param ctx the parse tree
	 */
	fn visit_typeArguments(&mut self, ctx: &TypeArgumentsContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#valueArguments}.
	 * @param ctx the parse tree
	 */
	fn visit_valueArguments(&mut self, ctx: &ValueArgumentsContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#valueArgument}.
	 * @param ctx the parse tree
	 */
	fn visit_valueArgument(&mut self, ctx: &ValueArgumentContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#primaryExpression}.
	 * @param ctx the parse tree
	 */
	fn visit_primaryExpression(&mut self, ctx: &PrimaryExpressionContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#parenthesizedExpression}.
	 * @param ctx the parse tree
	 */
	fn visit_parenthesizedExpression(&mut self, ctx: &ParenthesizedExpressionContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#collectionLiteral}.
	 * @param ctx the parse tree
	 */
	fn visit_collectionLiteral(&mut self, ctx: &CollectionLiteralContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#literalConstant}.
	 * @param ctx the parse tree
	 */
	fn visit_literalConstant(&mut self, ctx: &LiteralConstantContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#stringLiteral}.
	 * @param ctx the parse tree
	 */
	fn visit_stringLiteral(&mut self, ctx: &StringLiteralContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#lineStringLiteral}.
	 * @param ctx the parse tree
	 */
	fn visit_lineStringLiteral(&mut self, ctx: &LineStringLiteralContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#multiLineStringLiteral}.
	 * @param ctx the parse tree
	 */
	fn visit_multiLineStringLiteral(&mut self, ctx: &MultiLineStringLiteralContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#lineStringContent}.
	 * @param ctx the parse tree
	 */
	fn visit_lineStringContent(&mut self, ctx: &LineStringContentContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#lineStringExpression}.
	 * @param ctx the parse tree
	 */
	fn visit_lineStringExpression(&mut self, ctx: &LineStringExpressionContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#multiLineStringContent}.
	 * @param ctx the parse tree
	 */
	fn visit_multiLineStringContent(&mut self, ctx: &MultiLineStringContentContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#multiLineStringExpression}.
	 * @param ctx the parse tree
	 */
	fn visit_multiLineStringExpression(&mut self, ctx: &MultiLineStringExpressionContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#lambdaLiteral}.
	 * @param ctx the parse tree
	 */
	fn visit_lambdaLiteral(&mut self, ctx: &LambdaLiteralContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#lambdaParameters}.
	 * @param ctx the parse tree
	 */
	fn visit_lambdaParameters(&mut self, ctx: &LambdaParametersContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#lambdaParameter}.
	 * @param ctx the parse tree
	 */
	fn visit_lambdaParameter(&mut self, ctx: &LambdaParameterContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#anonymousFunction}.
	 * @param ctx the parse tree
	 */
	fn visit_anonymousFunction(&mut self, ctx: &AnonymousFunctionContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#functionLiteral}.
	 * @param ctx the parse tree
	 */
	fn visit_functionLiteral(&mut self, ctx: &FunctionLiteralContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#objectLiteral}.
	 * @param ctx the parse tree
	 */
	fn visit_objectLiteral(&mut self, ctx: &ObjectLiteralContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#thisExpression}.
	 * @param ctx the parse tree
	 */
	fn visit_thisExpression(&mut self, ctx: &ThisExpressionContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#superExpression}.
	 * @param ctx the parse tree
	 */
	fn visit_superExpression(&mut self, ctx: &SuperExpressionContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#ifExpression}.
	 * @param ctx the parse tree
	 */
	fn visit_ifExpression(&mut self, ctx: &IfExpressionContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#whenSubject}.
	 * @param ctx the parse tree
	 */
	fn visit_whenSubject(&mut self, ctx: &WhenSubjectContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#whenExpression}.
	 * @param ctx the parse tree
	 */
	fn visit_whenExpression(&mut self, ctx: &WhenExpressionContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#whenEntry}.
	 * @param ctx the parse tree
	 */
	fn visit_whenEntry(&mut self, ctx: &WhenEntryContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#whenCondition}.
	 * @param ctx the parse tree
	 */
	fn visit_whenCondition(&mut self, ctx: &WhenConditionContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#rangeTest}.
	 * @param ctx the parse tree
	 */
	fn visit_rangeTest(&mut self, ctx: &RangeTestContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#typeTest}.
	 * @param ctx the parse tree
	 */
	fn visit_typeTest(&mut self, ctx: &TypeTestContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#tryExpression}.
	 * @param ctx the parse tree
	 */
	fn visit_tryExpression(&mut self, ctx: &TryExpressionContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#catchBlock}.
	 * @param ctx the parse tree
	 */
	fn visit_catchBlock(&mut self, ctx: &CatchBlockContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#finallyBlock}.
	 * @param ctx the parse tree
	 */
	fn visit_finallyBlock(&mut self, ctx: &FinallyBlockContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#jumpExpression}.
	 * @param ctx the parse tree
	 */
	fn visit_jumpExpression(&mut self, ctx: &JumpExpressionContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#callableReference}.
	 * @param ctx the parse tree
	 */
	fn visit_callableReference(&mut self, ctx: &CallableReferenceContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#assignmentAndOperator}.
	 * @param ctx the parse tree
	 */
	fn visit_assignmentAndOperator(&mut self, ctx: &AssignmentAndOperatorContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#equalityOperator}.
	 * @param ctx the parse tree
	 */
	fn visit_equalityOperator(&mut self, ctx: &EqualityOperatorContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#comparisonOperator}.
	 * @param ctx the parse tree
	 */
	fn visit_comparisonOperator(&mut self, ctx: &ComparisonOperatorContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#inOperator}.
	 * @param ctx the parse tree
	 */
	fn visit_inOperator(&mut self, ctx: &InOperatorContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#isOperator}.
	 * @param ctx the parse tree
	 */
	fn visit_isOperator(&mut self, ctx: &IsOperatorContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#additiveOperator}.
	 * @param ctx the parse tree
	 */
	fn visit_additiveOperator(&mut self, ctx: &AdditiveOperatorContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#multiplicativeOperator}.
	 * @param ctx the parse tree
	 */
	fn visit_multiplicativeOperator(&mut self, ctx: &MultiplicativeOperatorContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#asOperator}.
	 * @param ctx the parse tree
	 */
	fn visit_asOperator(&mut self, ctx: &AsOperatorContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#prefixUnaryOperator}.
	 * @param ctx the parse tree
	 */
	fn visit_prefixUnaryOperator(&mut self, ctx: &PrefixUnaryOperatorContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#postfixUnaryOperator}.
	 * @param ctx the parse tree
	 */
	fn visit_postfixUnaryOperator(&mut self, ctx: &PostfixUnaryOperatorContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#excl}.
	 * @param ctx the parse tree
	 */
	fn visit_excl(&mut self, ctx: &ExclContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#memberAccessOperator}.
	 * @param ctx the parse tree
	 */
	fn visit_memberAccessOperator(&mut self, ctx: &MemberAccessOperatorContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#safeNav}.
	 * @param ctx the parse tree
	 */
	fn visit_safeNav(&mut self, ctx: &SafeNavContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#modifiers}.
	 * @param ctx the parse tree
	 */
	fn visit_modifiers(&mut self, ctx: &ModifiersContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#parameterModifiers}.
	 * @param ctx the parse tree
	 */
	fn visit_parameterModifiers(&mut self, ctx: &ParameterModifiersContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#modifier}.
	 * @param ctx the parse tree
	 */
	fn visit_modifier(&mut self, ctx: &ModifierContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#typeModifiers}.
	 * @param ctx the parse tree
	 */
	fn visit_typeModifiers(&mut self, ctx: &TypeModifiersContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#typeModifier}.
	 * @param ctx the parse tree
	 */
	fn visit_typeModifier(&mut self, ctx: &TypeModifierContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#classModifier}.
	 * @param ctx the parse tree
	 */
	fn visit_classModifier(&mut self, ctx: &ClassModifierContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#memberModifier}.
	 * @param ctx the parse tree
	 */
	fn visit_memberModifier(&mut self, ctx: &MemberModifierContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#visibilityModifier}.
	 * @param ctx the parse tree
	 */
	fn visit_visibilityModifier(&mut self, ctx: &VisibilityModifierContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#varianceModifier}.
	 * @param ctx the parse tree
	 */
	fn visit_varianceModifier(&mut self, ctx: &VarianceModifierContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#typeParameterModifiers}.
	 * @param ctx the parse tree
	 */
	fn visit_typeParameterModifiers(&mut self, ctx: &TypeParameterModifiersContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#typeParameterModifier}.
	 * @param ctx the parse tree
	 */
	fn visit_typeParameterModifier(&mut self, ctx: &TypeParameterModifierContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#functionModifier}.
	 * @param ctx the parse tree
	 */
	fn visit_functionModifier(&mut self, ctx: &FunctionModifierContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#propertyModifier}.
	 * @param ctx the parse tree
	 */
	fn visit_propertyModifier(&mut self, ctx: &PropertyModifierContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#inheritanceModifier}.
	 * @param ctx the parse tree
	 */
	fn visit_inheritanceModifier(&mut self, ctx: &InheritanceModifierContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#parameterModifier}.
	 * @param ctx the parse tree
	 */
	fn visit_parameterModifier(&mut self, ctx: &ParameterModifierContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#reificationModifier}.
	 * @param ctx the parse tree
	 */
	fn visit_reificationModifier(&mut self, ctx: &ReificationModifierContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#platformModifier}.
	 * @param ctx the parse tree
	 */
	fn visit_platformModifier(&mut self, ctx: &PlatformModifierContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#annotation}.
	 * @param ctx the parse tree
	 */
	fn visit_annotation(&mut self, ctx: &AnnotationContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#singleAnnotation}.
	 * @param ctx the parse tree
	 */
	fn visit_singleAnnotation(&mut self, ctx: &SingleAnnotationContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#multiAnnotation}.
	 * @param ctx the parse tree
	 */
	fn visit_multiAnnotation(&mut self, ctx: &MultiAnnotationContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#annotationUseSiteTarget}.
	 * @param ctx the parse tree
	 */
	fn visit_annotationUseSiteTarget(&mut self, ctx: &AnnotationUseSiteTargetContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#unescapedAnnotation}.
	 * @param ctx the parse tree
	 */
	fn visit_unescapedAnnotation(&mut self, ctx: &UnescapedAnnotationContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#simpleIdentifier}.
	 * @param ctx the parse tree
	 */
	fn visit_simpleIdentifier(&mut self, ctx: &SimpleIdentifierContext<'input>) { self.visit_children(ctx) }

	/**
	 * Visit a parse tree produced by {@link KotlinParser#identifier}.
	 * @param ctx the parse tree
	 */
	fn visit_identifier(&mut self, ctx: &IdentifierContext<'input>) { self.visit_children(ctx) }

}

pub trait KotlinParserVisitorCompat<'input>:ParseTreeVisitorCompat<'input, Node= KotlinParserContextType>{
	/**
	 * Visit a parse tree produced by {@link KotlinParser#kotlinFile}.
	 * @param ctx the parse tree
	 */
		fn visit_kotlinFile(&mut self, ctx: &KotlinFileContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#script}.
	 * @param ctx the parse tree
	 */
		fn visit_script(&mut self, ctx: &ScriptContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#shebangLine}.
	 * @param ctx the parse tree
	 */
		fn visit_shebangLine(&mut self, ctx: &ShebangLineContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#fileAnnotation}.
	 * @param ctx the parse tree
	 */
		fn visit_fileAnnotation(&mut self, ctx: &FileAnnotationContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#packageHeader}.
	 * @param ctx the parse tree
	 */
		fn visit_packageHeader(&mut self, ctx: &PackageHeaderContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#importList}.
	 * @param ctx the parse tree
	 */
		fn visit_importList(&mut self, ctx: &ImportListContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#importHeader}.
	 * @param ctx the parse tree
	 */
		fn visit_importHeader(&mut self, ctx: &ImportHeaderContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#importAlias}.
	 * @param ctx the parse tree
	 */
		fn visit_importAlias(&mut self, ctx: &ImportAliasContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#topLevelObject}.
	 * @param ctx the parse tree
	 */
		fn visit_topLevelObject(&mut self, ctx: &TopLevelObjectContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#typeAlias}.
	 * @param ctx the parse tree
	 */
		fn visit_typeAlias(&mut self, ctx: &TypeAliasContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#declaration}.
	 * @param ctx the parse tree
	 */
		fn visit_declaration(&mut self, ctx: &DeclarationContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#classDeclaration}.
	 * @param ctx the parse tree
	 */
		fn visit_classDeclaration(&mut self, ctx: &ClassDeclarationContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#primaryConstructor}.
	 * @param ctx the parse tree
	 */
		fn visit_primaryConstructor(&mut self, ctx: &PrimaryConstructorContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#classBody}.
	 * @param ctx the parse tree
	 */
		fn visit_classBody(&mut self, ctx: &ClassBodyContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#classParameters}.
	 * @param ctx the parse tree
	 */
		fn visit_classParameters(&mut self, ctx: &ClassParametersContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#classParameter}.
	 * @param ctx the parse tree
	 */
		fn visit_classParameter(&mut self, ctx: &ClassParameterContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#delegationSpecifiers}.
	 * @param ctx the parse tree
	 */
		fn visit_delegationSpecifiers(&mut self, ctx: &DelegationSpecifiersContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#delegationSpecifier}.
	 * @param ctx the parse tree
	 */
		fn visit_delegationSpecifier(&mut self, ctx: &DelegationSpecifierContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#constructorInvocation}.
	 * @param ctx the parse tree
	 */
		fn visit_constructorInvocation(&mut self, ctx: &ConstructorInvocationContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#annotatedDelegationSpecifier}.
	 * @param ctx the parse tree
	 */
		fn visit_annotatedDelegationSpecifier(&mut self, ctx: &AnnotatedDelegationSpecifierContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#explicitDelegation}.
	 * @param ctx the parse tree
	 */
		fn visit_explicitDelegation(&mut self, ctx: &ExplicitDelegationContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#typeParameters}.
	 * @param ctx the parse tree
	 */
		fn visit_typeParameters(&mut self, ctx: &TypeParametersContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#typeParameter}.
	 * @param ctx the parse tree
	 */
		fn visit_typeParameter(&mut self, ctx: &TypeParameterContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#typeConstraints}.
	 * @param ctx the parse tree
	 */
		fn visit_typeConstraints(&mut self, ctx: &TypeConstraintsContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#typeConstraint}.
	 * @param ctx the parse tree
	 */
		fn visit_typeConstraint(&mut self, ctx: &TypeConstraintContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#classMemberDeclarations}.
	 * @param ctx the parse tree
	 */
		fn visit_classMemberDeclarations(&mut self, ctx: &ClassMemberDeclarationsContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#classMemberDeclaration}.
	 * @param ctx the parse tree
	 */
		fn visit_classMemberDeclaration(&mut self, ctx: &ClassMemberDeclarationContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#anonymousInitializer}.
	 * @param ctx the parse tree
	 */
		fn visit_anonymousInitializer(&mut self, ctx: &AnonymousInitializerContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#companionObject}.
	 * @param ctx the parse tree
	 */
		fn visit_companionObject(&mut self, ctx: &CompanionObjectContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#functionValueParameters}.
	 * @param ctx the parse tree
	 */
		fn visit_functionValueParameters(&mut self, ctx: &FunctionValueParametersContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#functionValueParameter}.
	 * @param ctx the parse tree
	 */
		fn visit_functionValueParameter(&mut self, ctx: &FunctionValueParameterContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#functionDeclaration}.
	 * @param ctx the parse tree
	 */
		fn visit_functionDeclaration(&mut self, ctx: &FunctionDeclarationContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#functionBody}.
	 * @param ctx the parse tree
	 */
		fn visit_functionBody(&mut self, ctx: &FunctionBodyContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#variableDeclaration}.
	 * @param ctx the parse tree
	 */
		fn visit_variableDeclaration(&mut self, ctx: &VariableDeclarationContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#multiVariableDeclaration}.
	 * @param ctx the parse tree
	 */
		fn visit_multiVariableDeclaration(&mut self, ctx: &MultiVariableDeclarationContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#propertyDeclaration}.
	 * @param ctx the parse tree
	 */
		fn visit_propertyDeclaration(&mut self, ctx: &PropertyDeclarationContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#propertyDelegate}.
	 * @param ctx the parse tree
	 */
		fn visit_propertyDelegate(&mut self, ctx: &PropertyDelegateContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#getter}.
	 * @param ctx the parse tree
	 */
		fn visit_getter(&mut self, ctx: &GetterContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#setter}.
	 * @param ctx the parse tree
	 */
		fn visit_setter(&mut self, ctx: &SetterContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#parametersWithOptionalType}.
	 * @param ctx the parse tree
	 */
		fn visit_parametersWithOptionalType(&mut self, ctx: &ParametersWithOptionalTypeContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#functionValueParameterWithOptionalType}.
	 * @param ctx the parse tree
	 */
		fn visit_functionValueParameterWithOptionalType(&mut self, ctx: &FunctionValueParameterWithOptionalTypeContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#parameterWithOptionalType}.
	 * @param ctx the parse tree
	 */
		fn visit_parameterWithOptionalType(&mut self, ctx: &ParameterWithOptionalTypeContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#parameter}.
	 * @param ctx the parse tree
	 */
		fn visit_parameter(&mut self, ctx: &ParameterContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#objectDeclaration}.
	 * @param ctx the parse tree
	 */
		fn visit_objectDeclaration(&mut self, ctx: &ObjectDeclarationContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#secondaryConstructor}.
	 * @param ctx the parse tree
	 */
		fn visit_secondaryConstructor(&mut self, ctx: &SecondaryConstructorContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#constructorDelegationCall}.
	 * @param ctx the parse tree
	 */
		fn visit_constructorDelegationCall(&mut self, ctx: &ConstructorDelegationCallContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#enumClassBody}.
	 * @param ctx the parse tree
	 */
		fn visit_enumClassBody(&mut self, ctx: &EnumClassBodyContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#enumEntries}.
	 * @param ctx the parse tree
	 */
		fn visit_enumEntries(&mut self, ctx: &EnumEntriesContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#enumEntry}.
	 * @param ctx the parse tree
	 */
		fn visit_enumEntry(&mut self, ctx: &EnumEntryContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#rustType}.
	 * @param ctx the parse tree
	 */
		fn visit_rustType(&mut self, ctx: &RustTypeContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#typeReference}.
	 * @param ctx the parse tree
	 */
		fn visit_typeReference(&mut self, ctx: &TypeReferenceContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#nullableType}.
	 * @param ctx the parse tree
	 */
		fn visit_nullableType(&mut self, ctx: &NullableTypeContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#quest}.
	 * @param ctx the parse tree
	 */
		fn visit_quest(&mut self, ctx: &QuestContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#userType}.
	 * @param ctx the parse tree
	 */
		fn visit_userType(&mut self, ctx: &UserTypeContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#simpleUserType}.
	 * @param ctx the parse tree
	 */
		fn visit_simpleUserType(&mut self, ctx: &SimpleUserTypeContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#typeProjection}.
	 * @param ctx the parse tree
	 */
		fn visit_typeProjection(&mut self, ctx: &TypeProjectionContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#typeProjectionModifiers}.
	 * @param ctx the parse tree
	 */
		fn visit_typeProjectionModifiers(&mut self, ctx: &TypeProjectionModifiersContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#typeProjectionModifier}.
	 * @param ctx the parse tree
	 */
		fn visit_typeProjectionModifier(&mut self, ctx: &TypeProjectionModifierContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#functionType}.
	 * @param ctx the parse tree
	 */
		fn visit_functionType(&mut self, ctx: &FunctionTypeContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#functionTypeParameters}.
	 * @param ctx the parse tree
	 */
		fn visit_functionTypeParameters(&mut self, ctx: &FunctionTypeParametersContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#parenthesizedType}.
	 * @param ctx the parse tree
	 */
		fn visit_parenthesizedType(&mut self, ctx: &ParenthesizedTypeContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#receiverType}.
	 * @param ctx the parse tree
	 */
		fn visit_receiverType(&mut self, ctx: &ReceiverTypeContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#parenthesizedUserType}.
	 * @param ctx the parse tree
	 */
		fn visit_parenthesizedUserType(&mut self, ctx: &ParenthesizedUserTypeContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#statements}.
	 * @param ctx the parse tree
	 */
		fn visit_statements(&mut self, ctx: &StatementsContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#statement}.
	 * @param ctx the parse tree
	 */
		fn visit_statement(&mut self, ctx: &StatementContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#label}.
	 * @param ctx the parse tree
	 */
		fn visit_label(&mut self, ctx: &LabelContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#controlStructureBody}.
	 * @param ctx the parse tree
	 */
		fn visit_controlStructureBody(&mut self, ctx: &ControlStructureBodyContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#block}.
	 * @param ctx the parse tree
	 */
		fn visit_block(&mut self, ctx: &BlockContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#loopStatement}.
	 * @param ctx the parse tree
	 */
		fn visit_loopStatement(&mut self, ctx: &LoopStatementContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#forStatement}.
	 * @param ctx the parse tree
	 */
		fn visit_forStatement(&mut self, ctx: &ForStatementContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#whileStatement}.
	 * @param ctx the parse tree
	 */
		fn visit_whileStatement(&mut self, ctx: &WhileStatementContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#doWhileStatement}.
	 * @param ctx the parse tree
	 */
		fn visit_doWhileStatement(&mut self, ctx: &DoWhileStatementContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#assignment}.
	 * @param ctx the parse tree
	 */
		fn visit_assignment(&mut self, ctx: &AssignmentContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#semi}.
	 * @param ctx the parse tree
	 */
		fn visit_semi(&mut self, ctx: &SemiContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#semis}.
	 * @param ctx the parse tree
	 */
		fn visit_semis(&mut self, ctx: &SemisContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#expression}.
	 * @param ctx the parse tree
	 */
		fn visit_expression(&mut self, ctx: &ExpressionContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#disjunction}.
	 * @param ctx the parse tree
	 */
		fn visit_disjunction(&mut self, ctx: &DisjunctionContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#conjunction}.
	 * @param ctx the parse tree
	 */
		fn visit_conjunction(&mut self, ctx: &ConjunctionContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#equality}.
	 * @param ctx the parse tree
	 */
		fn visit_equality(&mut self, ctx: &EqualityContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#comparison}.
	 * @param ctx the parse tree
	 */
		fn visit_comparison(&mut self, ctx: &ComparisonContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#genericCallLikeComparison}.
	 * @param ctx the parse tree
	 */
		fn visit_genericCallLikeComparison(&mut self, ctx: &GenericCallLikeComparisonContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#infixOperation}.
	 * @param ctx the parse tree
	 */
		fn visit_infixOperation(&mut self, ctx: &InfixOperationContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#elvisExpression}.
	 * @param ctx the parse tree
	 */
		fn visit_elvisExpression(&mut self, ctx: &ElvisExpressionContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#elvis}.
	 * @param ctx the parse tree
	 */
		fn visit_elvis(&mut self, ctx: &ElvisContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#infixFunctionCall}.
	 * @param ctx the parse tree
	 */
		fn visit_infixFunctionCall(&mut self, ctx: &InfixFunctionCallContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#rangeExpression}.
	 * @param ctx the parse tree
	 */
		fn visit_rangeExpression(&mut self, ctx: &RangeExpressionContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#additiveExpression}.
	 * @param ctx the parse tree
	 */
		fn visit_additiveExpression(&mut self, ctx: &AdditiveExpressionContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#multiplicativeExpression}.
	 * @param ctx the parse tree
	 */
		fn visit_multiplicativeExpression(&mut self, ctx: &MultiplicativeExpressionContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#asExpression}.
	 * @param ctx the parse tree
	 */
		fn visit_asExpression(&mut self, ctx: &AsExpressionContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#prefixUnaryExpression}.
	 * @param ctx the parse tree
	 */
		fn visit_prefixUnaryExpression(&mut self, ctx: &PrefixUnaryExpressionContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#unaryPrefix}.
	 * @param ctx the parse tree
	 */
		fn visit_unaryPrefix(&mut self, ctx: &UnaryPrefixContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#postfixUnaryExpression}.
	 * @param ctx the parse tree
	 */
		fn visit_postfixUnaryExpression(&mut self, ctx: &PostfixUnaryExpressionContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#postfixUnarySuffix}.
	 * @param ctx the parse tree
	 */
		fn visit_postfixUnarySuffix(&mut self, ctx: &PostfixUnarySuffixContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#directlyAssignableExpression}.
	 * @param ctx the parse tree
	 */
		fn visit_directlyAssignableExpression(&mut self, ctx: &DirectlyAssignableExpressionContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#parenthesizedDirectlyAssignableExpression}.
	 * @param ctx the parse tree
	 */
		fn visit_parenthesizedDirectlyAssignableExpression(&mut self, ctx: &ParenthesizedDirectlyAssignableExpressionContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#assignableExpression}.
	 * @param ctx the parse tree
	 */
		fn visit_assignableExpression(&mut self, ctx: &AssignableExpressionContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#parenthesizedAssignableExpression}.
	 * @param ctx the parse tree
	 */
		fn visit_parenthesizedAssignableExpression(&mut self, ctx: &ParenthesizedAssignableExpressionContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#assignableSuffix}.
	 * @param ctx the parse tree
	 */
		fn visit_assignableSuffix(&mut self, ctx: &AssignableSuffixContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#indexingSuffix}.
	 * @param ctx the parse tree
	 */
		fn visit_indexingSuffix(&mut self, ctx: &IndexingSuffixContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#navigationSuffix}.
	 * @param ctx the parse tree
	 */
		fn visit_navigationSuffix(&mut self, ctx: &NavigationSuffixContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#callSuffix}.
	 * @param ctx the parse tree
	 */
		fn visit_callSuffix(&mut self, ctx: &CallSuffixContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#annotatedLambda}.
	 * @param ctx the parse tree
	 */
		fn visit_annotatedLambda(&mut self, ctx: &AnnotatedLambdaContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#typeArguments}.
	 * @param ctx the parse tree
	 */
		fn visit_typeArguments(&mut self, ctx: &TypeArgumentsContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#valueArguments}.
	 * @param ctx the parse tree
	 */
		fn visit_valueArguments(&mut self, ctx: &ValueArgumentsContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#valueArgument}.
	 * @param ctx the parse tree
	 */
		fn visit_valueArgument(&mut self, ctx: &ValueArgumentContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#primaryExpression}.
	 * @param ctx the parse tree
	 */
		fn visit_primaryExpression(&mut self, ctx: &PrimaryExpressionContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#parenthesizedExpression}.
	 * @param ctx the parse tree
	 */
		fn visit_parenthesizedExpression(&mut self, ctx: &ParenthesizedExpressionContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#collectionLiteral}.
	 * @param ctx the parse tree
	 */
		fn visit_collectionLiteral(&mut self, ctx: &CollectionLiteralContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#literalConstant}.
	 * @param ctx the parse tree
	 */
		fn visit_literalConstant(&mut self, ctx: &LiteralConstantContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#stringLiteral}.
	 * @param ctx the parse tree
	 */
		fn visit_stringLiteral(&mut self, ctx: &StringLiteralContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#lineStringLiteral}.
	 * @param ctx the parse tree
	 */
		fn visit_lineStringLiteral(&mut self, ctx: &LineStringLiteralContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#multiLineStringLiteral}.
	 * @param ctx the parse tree
	 */
		fn visit_multiLineStringLiteral(&mut self, ctx: &MultiLineStringLiteralContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#lineStringContent}.
	 * @param ctx the parse tree
	 */
		fn visit_lineStringContent(&mut self, ctx: &LineStringContentContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#lineStringExpression}.
	 * @param ctx the parse tree
	 */
		fn visit_lineStringExpression(&mut self, ctx: &LineStringExpressionContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#multiLineStringContent}.
	 * @param ctx the parse tree
	 */
		fn visit_multiLineStringContent(&mut self, ctx: &MultiLineStringContentContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#multiLineStringExpression}.
	 * @param ctx the parse tree
	 */
		fn visit_multiLineStringExpression(&mut self, ctx: &MultiLineStringExpressionContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#lambdaLiteral}.
	 * @param ctx the parse tree
	 */
		fn visit_lambdaLiteral(&mut self, ctx: &LambdaLiteralContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#lambdaParameters}.
	 * @param ctx the parse tree
	 */
		fn visit_lambdaParameters(&mut self, ctx: &LambdaParametersContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#lambdaParameter}.
	 * @param ctx the parse tree
	 */
		fn visit_lambdaParameter(&mut self, ctx: &LambdaParameterContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#anonymousFunction}.
	 * @param ctx the parse tree
	 */
		fn visit_anonymousFunction(&mut self, ctx: &AnonymousFunctionContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#functionLiteral}.
	 * @param ctx the parse tree
	 */
		fn visit_functionLiteral(&mut self, ctx: &FunctionLiteralContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#objectLiteral}.
	 * @param ctx the parse tree
	 */
		fn visit_objectLiteral(&mut self, ctx: &ObjectLiteralContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#thisExpression}.
	 * @param ctx the parse tree
	 */
		fn visit_thisExpression(&mut self, ctx: &ThisExpressionContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#superExpression}.
	 * @param ctx the parse tree
	 */
		fn visit_superExpression(&mut self, ctx: &SuperExpressionContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#ifExpression}.
	 * @param ctx the parse tree
	 */
		fn visit_ifExpression(&mut self, ctx: &IfExpressionContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#whenSubject}.
	 * @param ctx the parse tree
	 */
		fn visit_whenSubject(&mut self, ctx: &WhenSubjectContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#whenExpression}.
	 * @param ctx the parse tree
	 */
		fn visit_whenExpression(&mut self, ctx: &WhenExpressionContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#whenEntry}.
	 * @param ctx the parse tree
	 */
		fn visit_whenEntry(&mut self, ctx: &WhenEntryContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#whenCondition}.
	 * @param ctx the parse tree
	 */
		fn visit_whenCondition(&mut self, ctx: &WhenConditionContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#rangeTest}.
	 * @param ctx the parse tree
	 */
		fn visit_rangeTest(&mut self, ctx: &RangeTestContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#typeTest}.
	 * @param ctx the parse tree
	 */
		fn visit_typeTest(&mut self, ctx: &TypeTestContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#tryExpression}.
	 * @param ctx the parse tree
	 */
		fn visit_tryExpression(&mut self, ctx: &TryExpressionContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#catchBlock}.
	 * @param ctx the parse tree
	 */
		fn visit_catchBlock(&mut self, ctx: &CatchBlockContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#finallyBlock}.
	 * @param ctx the parse tree
	 */
		fn visit_finallyBlock(&mut self, ctx: &FinallyBlockContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#jumpExpression}.
	 * @param ctx the parse tree
	 */
		fn visit_jumpExpression(&mut self, ctx: &JumpExpressionContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#callableReference}.
	 * @param ctx the parse tree
	 */
		fn visit_callableReference(&mut self, ctx: &CallableReferenceContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#assignmentAndOperator}.
	 * @param ctx the parse tree
	 */
		fn visit_assignmentAndOperator(&mut self, ctx: &AssignmentAndOperatorContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#equalityOperator}.
	 * @param ctx the parse tree
	 */
		fn visit_equalityOperator(&mut self, ctx: &EqualityOperatorContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#comparisonOperator}.
	 * @param ctx the parse tree
	 */
		fn visit_comparisonOperator(&mut self, ctx: &ComparisonOperatorContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#inOperator}.
	 * @param ctx the parse tree
	 */
		fn visit_inOperator(&mut self, ctx: &InOperatorContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#isOperator}.
	 * @param ctx the parse tree
	 */
		fn visit_isOperator(&mut self, ctx: &IsOperatorContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#additiveOperator}.
	 * @param ctx the parse tree
	 */
		fn visit_additiveOperator(&mut self, ctx: &AdditiveOperatorContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#multiplicativeOperator}.
	 * @param ctx the parse tree
	 */
		fn visit_multiplicativeOperator(&mut self, ctx: &MultiplicativeOperatorContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#asOperator}.
	 * @param ctx the parse tree
	 */
		fn visit_asOperator(&mut self, ctx: &AsOperatorContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#prefixUnaryOperator}.
	 * @param ctx the parse tree
	 */
		fn visit_prefixUnaryOperator(&mut self, ctx: &PrefixUnaryOperatorContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#postfixUnaryOperator}.
	 * @param ctx the parse tree
	 */
		fn visit_postfixUnaryOperator(&mut self, ctx: &PostfixUnaryOperatorContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#excl}.
	 * @param ctx the parse tree
	 */
		fn visit_excl(&mut self, ctx: &ExclContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#memberAccessOperator}.
	 * @param ctx the parse tree
	 */
		fn visit_memberAccessOperator(&mut self, ctx: &MemberAccessOperatorContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#safeNav}.
	 * @param ctx the parse tree
	 */
		fn visit_safeNav(&mut self, ctx: &SafeNavContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#modifiers}.
	 * @param ctx the parse tree
	 */
		fn visit_modifiers(&mut self, ctx: &ModifiersContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#parameterModifiers}.
	 * @param ctx the parse tree
	 */
		fn visit_parameterModifiers(&mut self, ctx: &ParameterModifiersContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#modifier}.
	 * @param ctx the parse tree
	 */
		fn visit_modifier(&mut self, ctx: &ModifierContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#typeModifiers}.
	 * @param ctx the parse tree
	 */
		fn visit_typeModifiers(&mut self, ctx: &TypeModifiersContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#typeModifier}.
	 * @param ctx the parse tree
	 */
		fn visit_typeModifier(&mut self, ctx: &TypeModifierContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#classModifier}.
	 * @param ctx the parse tree
	 */
		fn visit_classModifier(&mut self, ctx: &ClassModifierContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#memberModifier}.
	 * @param ctx the parse tree
	 */
		fn visit_memberModifier(&mut self, ctx: &MemberModifierContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#visibilityModifier}.
	 * @param ctx the parse tree
	 */
		fn visit_visibilityModifier(&mut self, ctx: &VisibilityModifierContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#varianceModifier}.
	 * @param ctx the parse tree
	 */
		fn visit_varianceModifier(&mut self, ctx: &VarianceModifierContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#typeParameterModifiers}.
	 * @param ctx the parse tree
	 */
		fn visit_typeParameterModifiers(&mut self, ctx: &TypeParameterModifiersContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#typeParameterModifier}.
	 * @param ctx the parse tree
	 */
		fn visit_typeParameterModifier(&mut self, ctx: &TypeParameterModifierContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#functionModifier}.
	 * @param ctx the parse tree
	 */
		fn visit_functionModifier(&mut self, ctx: &FunctionModifierContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#propertyModifier}.
	 * @param ctx the parse tree
	 */
		fn visit_propertyModifier(&mut self, ctx: &PropertyModifierContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#inheritanceModifier}.
	 * @param ctx the parse tree
	 */
		fn visit_inheritanceModifier(&mut self, ctx: &InheritanceModifierContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#parameterModifier}.
	 * @param ctx the parse tree
	 */
		fn visit_parameterModifier(&mut self, ctx: &ParameterModifierContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#reificationModifier}.
	 * @param ctx the parse tree
	 */
		fn visit_reificationModifier(&mut self, ctx: &ReificationModifierContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#platformModifier}.
	 * @param ctx the parse tree
	 */
		fn visit_platformModifier(&mut self, ctx: &PlatformModifierContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#annotation}.
	 * @param ctx the parse tree
	 */
		fn visit_annotation(&mut self, ctx: &AnnotationContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#singleAnnotation}.
	 * @param ctx the parse tree
	 */
		fn visit_singleAnnotation(&mut self, ctx: &SingleAnnotationContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#multiAnnotation}.
	 * @param ctx the parse tree
	 */
		fn visit_multiAnnotation(&mut self, ctx: &MultiAnnotationContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#annotationUseSiteTarget}.
	 * @param ctx the parse tree
	 */
		fn visit_annotationUseSiteTarget(&mut self, ctx: &AnnotationUseSiteTargetContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#unescapedAnnotation}.
	 * @param ctx the parse tree
	 */
		fn visit_unescapedAnnotation(&mut self, ctx: &UnescapedAnnotationContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#simpleIdentifier}.
	 * @param ctx the parse tree
	 */
		fn visit_simpleIdentifier(&mut self, ctx: &SimpleIdentifierContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

	/**
	 * Visit a parse tree produced by {@link KotlinParser#identifier}.
	 * @param ctx the parse tree
	 */
		fn visit_identifier(&mut self, ctx: &IdentifierContext<'input>) -> Self::Return {
			self.visit_children(ctx)
		}

}

impl<'input,T> KotlinParserVisitor<'input> for T
where
	T: KotlinParserVisitorCompat<'input>
{
	fn visit_kotlinFile(&mut self, ctx: &KotlinFileContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_kotlinFile(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_script(&mut self, ctx: &ScriptContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_script(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_shebangLine(&mut self, ctx: &ShebangLineContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_shebangLine(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_fileAnnotation(&mut self, ctx: &FileAnnotationContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_fileAnnotation(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_packageHeader(&mut self, ctx: &PackageHeaderContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_packageHeader(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_importList(&mut self, ctx: &ImportListContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_importList(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_importHeader(&mut self, ctx: &ImportHeaderContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_importHeader(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_importAlias(&mut self, ctx: &ImportAliasContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_importAlias(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_topLevelObject(&mut self, ctx: &TopLevelObjectContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_topLevelObject(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_typeAlias(&mut self, ctx: &TypeAliasContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_typeAlias(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_declaration(&mut self, ctx: &DeclarationContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_declaration(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_classDeclaration(&mut self, ctx: &ClassDeclarationContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_classDeclaration(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_primaryConstructor(&mut self, ctx: &PrimaryConstructorContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_primaryConstructor(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_classBody(&mut self, ctx: &ClassBodyContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_classBody(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_classParameters(&mut self, ctx: &ClassParametersContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_classParameters(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_classParameter(&mut self, ctx: &ClassParameterContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_classParameter(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_delegationSpecifiers(&mut self, ctx: &DelegationSpecifiersContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_delegationSpecifiers(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_delegationSpecifier(&mut self, ctx: &DelegationSpecifierContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_delegationSpecifier(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_constructorInvocation(&mut self, ctx: &ConstructorInvocationContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_constructorInvocation(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_annotatedDelegationSpecifier(&mut self, ctx: &AnnotatedDelegationSpecifierContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_annotatedDelegationSpecifier(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_explicitDelegation(&mut self, ctx: &ExplicitDelegationContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_explicitDelegation(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_typeParameters(&mut self, ctx: &TypeParametersContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_typeParameters(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_typeParameter(&mut self, ctx: &TypeParameterContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_typeParameter(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_typeConstraints(&mut self, ctx: &TypeConstraintsContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_typeConstraints(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_typeConstraint(&mut self, ctx: &TypeConstraintContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_typeConstraint(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_classMemberDeclarations(&mut self, ctx: &ClassMemberDeclarationsContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_classMemberDeclarations(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_classMemberDeclaration(&mut self, ctx: &ClassMemberDeclarationContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_classMemberDeclaration(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_anonymousInitializer(&mut self, ctx: &AnonymousInitializerContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_anonymousInitializer(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_companionObject(&mut self, ctx: &CompanionObjectContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_companionObject(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_functionValueParameters(&mut self, ctx: &FunctionValueParametersContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_functionValueParameters(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_functionValueParameter(&mut self, ctx: &FunctionValueParameterContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_functionValueParameter(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_functionDeclaration(&mut self, ctx: &FunctionDeclarationContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_functionDeclaration(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_functionBody(&mut self, ctx: &FunctionBodyContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_functionBody(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_variableDeclaration(&mut self, ctx: &VariableDeclarationContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_variableDeclaration(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_multiVariableDeclaration(&mut self, ctx: &MultiVariableDeclarationContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_multiVariableDeclaration(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_propertyDeclaration(&mut self, ctx: &PropertyDeclarationContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_propertyDeclaration(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_propertyDelegate(&mut self, ctx: &PropertyDelegateContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_propertyDelegate(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_getter(&mut self, ctx: &GetterContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_getter(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_setter(&mut self, ctx: &SetterContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_setter(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_parametersWithOptionalType(&mut self, ctx: &ParametersWithOptionalTypeContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_parametersWithOptionalType(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_functionValueParameterWithOptionalType(&mut self, ctx: &FunctionValueParameterWithOptionalTypeContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_functionValueParameterWithOptionalType(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_parameterWithOptionalType(&mut self, ctx: &ParameterWithOptionalTypeContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_parameterWithOptionalType(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_parameter(&mut self, ctx: &ParameterContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_parameter(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_objectDeclaration(&mut self, ctx: &ObjectDeclarationContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_objectDeclaration(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_secondaryConstructor(&mut self, ctx: &SecondaryConstructorContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_secondaryConstructor(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_constructorDelegationCall(&mut self, ctx: &ConstructorDelegationCallContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_constructorDelegationCall(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_enumClassBody(&mut self, ctx: &EnumClassBodyContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_enumClassBody(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_enumEntries(&mut self, ctx: &EnumEntriesContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_enumEntries(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_enumEntry(&mut self, ctx: &EnumEntryContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_enumEntry(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_rustType(&mut self, ctx: &RustTypeContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_rustType(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_typeReference(&mut self, ctx: &TypeReferenceContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_typeReference(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_nullableType(&mut self, ctx: &NullableTypeContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_nullableType(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_quest(&mut self, ctx: &QuestContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_quest(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_userType(&mut self, ctx: &UserTypeContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_userType(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_simpleUserType(&mut self, ctx: &SimpleUserTypeContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_simpleUserType(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_typeProjection(&mut self, ctx: &TypeProjectionContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_typeProjection(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_typeProjectionModifiers(&mut self, ctx: &TypeProjectionModifiersContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_typeProjectionModifiers(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_typeProjectionModifier(&mut self, ctx: &TypeProjectionModifierContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_typeProjectionModifier(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_functionType(&mut self, ctx: &FunctionTypeContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_functionType(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_functionTypeParameters(&mut self, ctx: &FunctionTypeParametersContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_functionTypeParameters(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_parenthesizedType(&mut self, ctx: &ParenthesizedTypeContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_parenthesizedType(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_receiverType(&mut self, ctx: &ReceiverTypeContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_receiverType(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_parenthesizedUserType(&mut self, ctx: &ParenthesizedUserTypeContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_parenthesizedUserType(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_statements(&mut self, ctx: &StatementsContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_statements(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_statement(&mut self, ctx: &StatementContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_statement(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_label(&mut self, ctx: &LabelContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_label(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_controlStructureBody(&mut self, ctx: &ControlStructureBodyContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_controlStructureBody(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_block(&mut self, ctx: &BlockContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_block(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_loopStatement(&mut self, ctx: &LoopStatementContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_loopStatement(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_forStatement(&mut self, ctx: &ForStatementContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_forStatement(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_whileStatement(&mut self, ctx: &WhileStatementContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_whileStatement(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_doWhileStatement(&mut self, ctx: &DoWhileStatementContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_doWhileStatement(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_assignment(&mut self, ctx: &AssignmentContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_assignment(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_semi(&mut self, ctx: &SemiContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_semi(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_semis(&mut self, ctx: &SemisContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_semis(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_expression(&mut self, ctx: &ExpressionContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_expression(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_disjunction(&mut self, ctx: &DisjunctionContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_disjunction(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_conjunction(&mut self, ctx: &ConjunctionContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_conjunction(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_equality(&mut self, ctx: &EqualityContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_equality(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_comparison(&mut self, ctx: &ComparisonContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_comparison(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_genericCallLikeComparison(&mut self, ctx: &GenericCallLikeComparisonContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_genericCallLikeComparison(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_infixOperation(&mut self, ctx: &InfixOperationContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_infixOperation(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_elvisExpression(&mut self, ctx: &ElvisExpressionContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_elvisExpression(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_elvis(&mut self, ctx: &ElvisContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_elvis(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_infixFunctionCall(&mut self, ctx: &InfixFunctionCallContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_infixFunctionCall(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_rangeExpression(&mut self, ctx: &RangeExpressionContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_rangeExpression(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_additiveExpression(&mut self, ctx: &AdditiveExpressionContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_additiveExpression(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_multiplicativeExpression(&mut self, ctx: &MultiplicativeExpressionContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_multiplicativeExpression(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_asExpression(&mut self, ctx: &AsExpressionContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_asExpression(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_prefixUnaryExpression(&mut self, ctx: &PrefixUnaryExpressionContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_prefixUnaryExpression(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_unaryPrefix(&mut self, ctx: &UnaryPrefixContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_unaryPrefix(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_postfixUnaryExpression(&mut self, ctx: &PostfixUnaryExpressionContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_postfixUnaryExpression(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_postfixUnarySuffix(&mut self, ctx: &PostfixUnarySuffixContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_postfixUnarySuffix(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_directlyAssignableExpression(&mut self, ctx: &DirectlyAssignableExpressionContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_directlyAssignableExpression(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_parenthesizedDirectlyAssignableExpression(&mut self, ctx: &ParenthesizedDirectlyAssignableExpressionContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_parenthesizedDirectlyAssignableExpression(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_assignableExpression(&mut self, ctx: &AssignableExpressionContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_assignableExpression(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_parenthesizedAssignableExpression(&mut self, ctx: &ParenthesizedAssignableExpressionContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_parenthesizedAssignableExpression(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_assignableSuffix(&mut self, ctx: &AssignableSuffixContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_assignableSuffix(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_indexingSuffix(&mut self, ctx: &IndexingSuffixContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_indexingSuffix(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_navigationSuffix(&mut self, ctx: &NavigationSuffixContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_navigationSuffix(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_callSuffix(&mut self, ctx: &CallSuffixContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_callSuffix(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_annotatedLambda(&mut self, ctx: &AnnotatedLambdaContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_annotatedLambda(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_typeArguments(&mut self, ctx: &TypeArgumentsContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_typeArguments(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_valueArguments(&mut self, ctx: &ValueArgumentsContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_valueArguments(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_valueArgument(&mut self, ctx: &ValueArgumentContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_valueArgument(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_primaryExpression(&mut self, ctx: &PrimaryExpressionContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_primaryExpression(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_parenthesizedExpression(&mut self, ctx: &ParenthesizedExpressionContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_parenthesizedExpression(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_collectionLiteral(&mut self, ctx: &CollectionLiteralContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_collectionLiteral(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_literalConstant(&mut self, ctx: &LiteralConstantContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_literalConstant(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_stringLiteral(&mut self, ctx: &StringLiteralContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_stringLiteral(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_lineStringLiteral(&mut self, ctx: &LineStringLiteralContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_lineStringLiteral(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_multiLineStringLiteral(&mut self, ctx: &MultiLineStringLiteralContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_multiLineStringLiteral(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_lineStringContent(&mut self, ctx: &LineStringContentContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_lineStringContent(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_lineStringExpression(&mut self, ctx: &LineStringExpressionContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_lineStringExpression(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_multiLineStringContent(&mut self, ctx: &MultiLineStringContentContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_multiLineStringContent(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_multiLineStringExpression(&mut self, ctx: &MultiLineStringExpressionContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_multiLineStringExpression(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_lambdaLiteral(&mut self, ctx: &LambdaLiteralContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_lambdaLiteral(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_lambdaParameters(&mut self, ctx: &LambdaParametersContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_lambdaParameters(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_lambdaParameter(&mut self, ctx: &LambdaParameterContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_lambdaParameter(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_anonymousFunction(&mut self, ctx: &AnonymousFunctionContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_anonymousFunction(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_functionLiteral(&mut self, ctx: &FunctionLiteralContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_functionLiteral(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_objectLiteral(&mut self, ctx: &ObjectLiteralContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_objectLiteral(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_thisExpression(&mut self, ctx: &ThisExpressionContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_thisExpression(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_superExpression(&mut self, ctx: &SuperExpressionContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_superExpression(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_ifExpression(&mut self, ctx: &IfExpressionContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_ifExpression(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_whenSubject(&mut self, ctx: &WhenSubjectContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_whenSubject(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_whenExpression(&mut self, ctx: &WhenExpressionContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_whenExpression(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_whenEntry(&mut self, ctx: &WhenEntryContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_whenEntry(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_whenCondition(&mut self, ctx: &WhenConditionContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_whenCondition(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_rangeTest(&mut self, ctx: &RangeTestContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_rangeTest(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_typeTest(&mut self, ctx: &TypeTestContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_typeTest(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_tryExpression(&mut self, ctx: &TryExpressionContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_tryExpression(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_catchBlock(&mut self, ctx: &CatchBlockContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_catchBlock(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_finallyBlock(&mut self, ctx: &FinallyBlockContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_finallyBlock(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_jumpExpression(&mut self, ctx: &JumpExpressionContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_jumpExpression(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_callableReference(&mut self, ctx: &CallableReferenceContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_callableReference(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_assignmentAndOperator(&mut self, ctx: &AssignmentAndOperatorContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_assignmentAndOperator(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_equalityOperator(&mut self, ctx: &EqualityOperatorContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_equalityOperator(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_comparisonOperator(&mut self, ctx: &ComparisonOperatorContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_comparisonOperator(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_inOperator(&mut self, ctx: &InOperatorContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_inOperator(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_isOperator(&mut self, ctx: &IsOperatorContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_isOperator(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_additiveOperator(&mut self, ctx: &AdditiveOperatorContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_additiveOperator(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_multiplicativeOperator(&mut self, ctx: &MultiplicativeOperatorContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_multiplicativeOperator(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_asOperator(&mut self, ctx: &AsOperatorContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_asOperator(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_prefixUnaryOperator(&mut self, ctx: &PrefixUnaryOperatorContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_prefixUnaryOperator(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_postfixUnaryOperator(&mut self, ctx: &PostfixUnaryOperatorContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_postfixUnaryOperator(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_excl(&mut self, ctx: &ExclContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_excl(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_memberAccessOperator(&mut self, ctx: &MemberAccessOperatorContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_memberAccessOperator(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_safeNav(&mut self, ctx: &SafeNavContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_safeNav(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_modifiers(&mut self, ctx: &ModifiersContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_modifiers(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_parameterModifiers(&mut self, ctx: &ParameterModifiersContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_parameterModifiers(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_modifier(&mut self, ctx: &ModifierContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_modifier(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_typeModifiers(&mut self, ctx: &TypeModifiersContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_typeModifiers(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_typeModifier(&mut self, ctx: &TypeModifierContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_typeModifier(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_classModifier(&mut self, ctx: &ClassModifierContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_classModifier(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_memberModifier(&mut self, ctx: &MemberModifierContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_memberModifier(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_visibilityModifier(&mut self, ctx: &VisibilityModifierContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_visibilityModifier(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_varianceModifier(&mut self, ctx: &VarianceModifierContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_varianceModifier(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_typeParameterModifiers(&mut self, ctx: &TypeParameterModifiersContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_typeParameterModifiers(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_typeParameterModifier(&mut self, ctx: &TypeParameterModifierContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_typeParameterModifier(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_functionModifier(&mut self, ctx: &FunctionModifierContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_functionModifier(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_propertyModifier(&mut self, ctx: &PropertyModifierContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_propertyModifier(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_inheritanceModifier(&mut self, ctx: &InheritanceModifierContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_inheritanceModifier(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_parameterModifier(&mut self, ctx: &ParameterModifierContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_parameterModifier(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_reificationModifier(&mut self, ctx: &ReificationModifierContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_reificationModifier(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_platformModifier(&mut self, ctx: &PlatformModifierContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_platformModifier(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_annotation(&mut self, ctx: &AnnotationContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_annotation(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_singleAnnotation(&mut self, ctx: &SingleAnnotationContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_singleAnnotation(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_multiAnnotation(&mut self, ctx: &MultiAnnotationContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_multiAnnotation(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_annotationUseSiteTarget(&mut self, ctx: &AnnotationUseSiteTargetContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_annotationUseSiteTarget(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_unescapedAnnotation(&mut self, ctx: &UnescapedAnnotationContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_unescapedAnnotation(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_simpleIdentifier(&mut self, ctx: &SimpleIdentifierContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_simpleIdentifier(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

	fn visit_identifier(&mut self, ctx: &IdentifierContext<'input>){
		let result = <Self as KotlinParserVisitorCompat>::visit_identifier(self, ctx);
        *<Self as ParseTreeVisitorCompat>::temp_result(self) = result;
	}

}