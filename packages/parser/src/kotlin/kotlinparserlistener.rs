#![allow(nonstandard_style)]
// Generated from KotlinParser.g4 by ANTLR 4.8
use antlr_rust::tree::ParseTreeListener;
use super::kotlinparser::*;

pub trait KotlinParserListener<'input> : ParseTreeListener<'input,KotlinParserContextType>{
/**
 * Enter a parse tree produced by {@link KotlinParser#kotlinFile}.
 * @param ctx the parse tree
 */
fn enter_kotlinFile(&mut self, _ctx: &KotlinFileContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#kotlinFile}.
 * @param ctx the parse tree
 */
fn exit_kotlinFile(&mut self, _ctx: &KotlinFileContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#script}.
 * @param ctx the parse tree
 */
fn enter_script(&mut self, _ctx: &ScriptContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#script}.
 * @param ctx the parse tree
 */
fn exit_script(&mut self, _ctx: &ScriptContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#shebangLine}.
 * @param ctx the parse tree
 */
fn enter_shebangLine(&mut self, _ctx: &ShebangLineContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#shebangLine}.
 * @param ctx the parse tree
 */
fn exit_shebangLine(&mut self, _ctx: &ShebangLineContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#fileAnnotation}.
 * @param ctx the parse tree
 */
fn enter_fileAnnotation(&mut self, _ctx: &FileAnnotationContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#fileAnnotation}.
 * @param ctx the parse tree
 */
fn exit_fileAnnotation(&mut self, _ctx: &FileAnnotationContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#packageHeader}.
 * @param ctx the parse tree
 */
fn enter_packageHeader(&mut self, _ctx: &PackageHeaderContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#packageHeader}.
 * @param ctx the parse tree
 */
fn exit_packageHeader(&mut self, _ctx: &PackageHeaderContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#importList}.
 * @param ctx the parse tree
 */
fn enter_importList(&mut self, _ctx: &ImportListContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#importList}.
 * @param ctx the parse tree
 */
fn exit_importList(&mut self, _ctx: &ImportListContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#importHeader}.
 * @param ctx the parse tree
 */
fn enter_importHeader(&mut self, _ctx: &ImportHeaderContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#importHeader}.
 * @param ctx the parse tree
 */
fn exit_importHeader(&mut self, _ctx: &ImportHeaderContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#importAlias}.
 * @param ctx the parse tree
 */
fn enter_importAlias(&mut self, _ctx: &ImportAliasContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#importAlias}.
 * @param ctx the parse tree
 */
fn exit_importAlias(&mut self, _ctx: &ImportAliasContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#topLevelObject}.
 * @param ctx the parse tree
 */
fn enter_topLevelObject(&mut self, _ctx: &TopLevelObjectContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#topLevelObject}.
 * @param ctx the parse tree
 */
fn exit_topLevelObject(&mut self, _ctx: &TopLevelObjectContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#typeAlias}.
 * @param ctx the parse tree
 */
fn enter_typeAlias(&mut self, _ctx: &TypeAliasContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#typeAlias}.
 * @param ctx the parse tree
 */
fn exit_typeAlias(&mut self, _ctx: &TypeAliasContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#declaration}.
 * @param ctx the parse tree
 */
fn enter_declaration(&mut self, _ctx: &DeclarationContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#declaration}.
 * @param ctx the parse tree
 */
fn exit_declaration(&mut self, _ctx: &DeclarationContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#classDeclaration}.
 * @param ctx the parse tree
 */
fn enter_classDeclaration(&mut self, _ctx: &ClassDeclarationContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#classDeclaration}.
 * @param ctx the parse tree
 */
fn exit_classDeclaration(&mut self, _ctx: &ClassDeclarationContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#primaryConstructor}.
 * @param ctx the parse tree
 */
fn enter_primaryConstructor(&mut self, _ctx: &PrimaryConstructorContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#primaryConstructor}.
 * @param ctx the parse tree
 */
fn exit_primaryConstructor(&mut self, _ctx: &PrimaryConstructorContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#classBody}.
 * @param ctx the parse tree
 */
fn enter_classBody(&mut self, _ctx: &ClassBodyContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#classBody}.
 * @param ctx the parse tree
 */
fn exit_classBody(&mut self, _ctx: &ClassBodyContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#classParameters}.
 * @param ctx the parse tree
 */
fn enter_classParameters(&mut self, _ctx: &ClassParametersContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#classParameters}.
 * @param ctx the parse tree
 */
fn exit_classParameters(&mut self, _ctx: &ClassParametersContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#classParameter}.
 * @param ctx the parse tree
 */
fn enter_classParameter(&mut self, _ctx: &ClassParameterContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#classParameter}.
 * @param ctx the parse tree
 */
fn exit_classParameter(&mut self, _ctx: &ClassParameterContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#delegationSpecifiers}.
 * @param ctx the parse tree
 */
fn enter_delegationSpecifiers(&mut self, _ctx: &DelegationSpecifiersContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#delegationSpecifiers}.
 * @param ctx the parse tree
 */
fn exit_delegationSpecifiers(&mut self, _ctx: &DelegationSpecifiersContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#delegationSpecifier}.
 * @param ctx the parse tree
 */
fn enter_delegationSpecifier(&mut self, _ctx: &DelegationSpecifierContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#delegationSpecifier}.
 * @param ctx the parse tree
 */
fn exit_delegationSpecifier(&mut self, _ctx: &DelegationSpecifierContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#constructorInvocation}.
 * @param ctx the parse tree
 */
fn enter_constructorInvocation(&mut self, _ctx: &ConstructorInvocationContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#constructorInvocation}.
 * @param ctx the parse tree
 */
fn exit_constructorInvocation(&mut self, _ctx: &ConstructorInvocationContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#annotatedDelegationSpecifier}.
 * @param ctx the parse tree
 */
fn enter_annotatedDelegationSpecifier(&mut self, _ctx: &AnnotatedDelegationSpecifierContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#annotatedDelegationSpecifier}.
 * @param ctx the parse tree
 */
fn exit_annotatedDelegationSpecifier(&mut self, _ctx: &AnnotatedDelegationSpecifierContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#explicitDelegation}.
 * @param ctx the parse tree
 */
fn enter_explicitDelegation(&mut self, _ctx: &ExplicitDelegationContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#explicitDelegation}.
 * @param ctx the parse tree
 */
fn exit_explicitDelegation(&mut self, _ctx: &ExplicitDelegationContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#typeParameters}.
 * @param ctx the parse tree
 */
fn enter_typeParameters(&mut self, _ctx: &TypeParametersContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#typeParameters}.
 * @param ctx the parse tree
 */
fn exit_typeParameters(&mut self, _ctx: &TypeParametersContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#typeParameter}.
 * @param ctx the parse tree
 */
fn enter_typeParameter(&mut self, _ctx: &TypeParameterContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#typeParameter}.
 * @param ctx the parse tree
 */
fn exit_typeParameter(&mut self, _ctx: &TypeParameterContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#typeConstraints}.
 * @param ctx the parse tree
 */
fn enter_typeConstraints(&mut self, _ctx: &TypeConstraintsContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#typeConstraints}.
 * @param ctx the parse tree
 */
fn exit_typeConstraints(&mut self, _ctx: &TypeConstraintsContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#typeConstraint}.
 * @param ctx the parse tree
 */
fn enter_typeConstraint(&mut self, _ctx: &TypeConstraintContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#typeConstraint}.
 * @param ctx the parse tree
 */
fn exit_typeConstraint(&mut self, _ctx: &TypeConstraintContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#classMemberDeclarations}.
 * @param ctx the parse tree
 */
fn enter_classMemberDeclarations(&mut self, _ctx: &ClassMemberDeclarationsContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#classMemberDeclarations}.
 * @param ctx the parse tree
 */
fn exit_classMemberDeclarations(&mut self, _ctx: &ClassMemberDeclarationsContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#classMemberDeclaration}.
 * @param ctx the parse tree
 */
fn enter_classMemberDeclaration(&mut self, _ctx: &ClassMemberDeclarationContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#classMemberDeclaration}.
 * @param ctx the parse tree
 */
fn exit_classMemberDeclaration(&mut self, _ctx: &ClassMemberDeclarationContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#anonymousInitializer}.
 * @param ctx the parse tree
 */
fn enter_anonymousInitializer(&mut self, _ctx: &AnonymousInitializerContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#anonymousInitializer}.
 * @param ctx the parse tree
 */
fn exit_anonymousInitializer(&mut self, _ctx: &AnonymousInitializerContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#companionObject}.
 * @param ctx the parse tree
 */
fn enter_companionObject(&mut self, _ctx: &CompanionObjectContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#companionObject}.
 * @param ctx the parse tree
 */
fn exit_companionObject(&mut self, _ctx: &CompanionObjectContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#functionValueParameters}.
 * @param ctx the parse tree
 */
fn enter_functionValueParameters(&mut self, _ctx: &FunctionValueParametersContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#functionValueParameters}.
 * @param ctx the parse tree
 */
fn exit_functionValueParameters(&mut self, _ctx: &FunctionValueParametersContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#functionValueParameter}.
 * @param ctx the parse tree
 */
fn enter_functionValueParameter(&mut self, _ctx: &FunctionValueParameterContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#functionValueParameter}.
 * @param ctx the parse tree
 */
fn exit_functionValueParameter(&mut self, _ctx: &FunctionValueParameterContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#functionDeclaration}.
 * @param ctx the parse tree
 */
fn enter_functionDeclaration(&mut self, _ctx: &FunctionDeclarationContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#functionDeclaration}.
 * @param ctx the parse tree
 */
fn exit_functionDeclaration(&mut self, _ctx: &FunctionDeclarationContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#functionBody}.
 * @param ctx the parse tree
 */
fn enter_functionBody(&mut self, _ctx: &FunctionBodyContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#functionBody}.
 * @param ctx the parse tree
 */
fn exit_functionBody(&mut self, _ctx: &FunctionBodyContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#variableDeclaration}.
 * @param ctx the parse tree
 */
fn enter_variableDeclaration(&mut self, _ctx: &VariableDeclarationContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#variableDeclaration}.
 * @param ctx the parse tree
 */
fn exit_variableDeclaration(&mut self, _ctx: &VariableDeclarationContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#multiVariableDeclaration}.
 * @param ctx the parse tree
 */
fn enter_multiVariableDeclaration(&mut self, _ctx: &MultiVariableDeclarationContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#multiVariableDeclaration}.
 * @param ctx the parse tree
 */
fn exit_multiVariableDeclaration(&mut self, _ctx: &MultiVariableDeclarationContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#propertyDeclaration}.
 * @param ctx the parse tree
 */
fn enter_propertyDeclaration(&mut self, _ctx: &PropertyDeclarationContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#propertyDeclaration}.
 * @param ctx the parse tree
 */
fn exit_propertyDeclaration(&mut self, _ctx: &PropertyDeclarationContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#propertyDelegate}.
 * @param ctx the parse tree
 */
fn enter_propertyDelegate(&mut self, _ctx: &PropertyDelegateContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#propertyDelegate}.
 * @param ctx the parse tree
 */
fn exit_propertyDelegate(&mut self, _ctx: &PropertyDelegateContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#getter}.
 * @param ctx the parse tree
 */
fn enter_getter(&mut self, _ctx: &GetterContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#getter}.
 * @param ctx the parse tree
 */
fn exit_getter(&mut self, _ctx: &GetterContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#setter}.
 * @param ctx the parse tree
 */
fn enter_setter(&mut self, _ctx: &SetterContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#setter}.
 * @param ctx the parse tree
 */
fn exit_setter(&mut self, _ctx: &SetterContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#parametersWithOptionalType}.
 * @param ctx the parse tree
 */
fn enter_parametersWithOptionalType(&mut self, _ctx: &ParametersWithOptionalTypeContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#parametersWithOptionalType}.
 * @param ctx the parse tree
 */
fn exit_parametersWithOptionalType(&mut self, _ctx: &ParametersWithOptionalTypeContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#functionValueParameterWithOptionalType}.
 * @param ctx the parse tree
 */
fn enter_functionValueParameterWithOptionalType(&mut self, _ctx: &FunctionValueParameterWithOptionalTypeContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#functionValueParameterWithOptionalType}.
 * @param ctx the parse tree
 */
fn exit_functionValueParameterWithOptionalType(&mut self, _ctx: &FunctionValueParameterWithOptionalTypeContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#parameterWithOptionalType}.
 * @param ctx the parse tree
 */
fn enter_parameterWithOptionalType(&mut self, _ctx: &ParameterWithOptionalTypeContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#parameterWithOptionalType}.
 * @param ctx the parse tree
 */
fn exit_parameterWithOptionalType(&mut self, _ctx: &ParameterWithOptionalTypeContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#parameter}.
 * @param ctx the parse tree
 */
fn enter_parameter(&mut self, _ctx: &ParameterContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#parameter}.
 * @param ctx the parse tree
 */
fn exit_parameter(&mut self, _ctx: &ParameterContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#objectDeclaration}.
 * @param ctx the parse tree
 */
fn enter_objectDeclaration(&mut self, _ctx: &ObjectDeclarationContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#objectDeclaration}.
 * @param ctx the parse tree
 */
fn exit_objectDeclaration(&mut self, _ctx: &ObjectDeclarationContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#secondaryConstructor}.
 * @param ctx the parse tree
 */
fn enter_secondaryConstructor(&mut self, _ctx: &SecondaryConstructorContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#secondaryConstructor}.
 * @param ctx the parse tree
 */
fn exit_secondaryConstructor(&mut self, _ctx: &SecondaryConstructorContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#constructorDelegationCall}.
 * @param ctx the parse tree
 */
fn enter_constructorDelegationCall(&mut self, _ctx: &ConstructorDelegationCallContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#constructorDelegationCall}.
 * @param ctx the parse tree
 */
fn exit_constructorDelegationCall(&mut self, _ctx: &ConstructorDelegationCallContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#enumClassBody}.
 * @param ctx the parse tree
 */
fn enter_enumClassBody(&mut self, _ctx: &EnumClassBodyContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#enumClassBody}.
 * @param ctx the parse tree
 */
fn exit_enumClassBody(&mut self, _ctx: &EnumClassBodyContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#enumEntries}.
 * @param ctx the parse tree
 */
fn enter_enumEntries(&mut self, _ctx: &EnumEntriesContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#enumEntries}.
 * @param ctx the parse tree
 */
fn exit_enumEntries(&mut self, _ctx: &EnumEntriesContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#enumEntry}.
 * @param ctx the parse tree
 */
fn enter_enumEntry(&mut self, _ctx: &EnumEntryContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#enumEntry}.
 * @param ctx the parse tree
 */
fn exit_enumEntry(&mut self, _ctx: &EnumEntryContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#rustType}.
 * @param ctx the parse tree
 */
fn enter_rustType(&mut self, _ctx: &RustTypeContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#rustType}.
 * @param ctx the parse tree
 */
fn exit_rustType(&mut self, _ctx: &RustTypeContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#typeReference}.
 * @param ctx the parse tree
 */
fn enter_typeReference(&mut self, _ctx: &TypeReferenceContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#typeReference}.
 * @param ctx the parse tree
 */
fn exit_typeReference(&mut self, _ctx: &TypeReferenceContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#nullableType}.
 * @param ctx the parse tree
 */
fn enter_nullableType(&mut self, _ctx: &NullableTypeContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#nullableType}.
 * @param ctx the parse tree
 */
fn exit_nullableType(&mut self, _ctx: &NullableTypeContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#quest}.
 * @param ctx the parse tree
 */
fn enter_quest(&mut self, _ctx: &QuestContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#quest}.
 * @param ctx the parse tree
 */
fn exit_quest(&mut self, _ctx: &QuestContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#userType}.
 * @param ctx the parse tree
 */
fn enter_userType(&mut self, _ctx: &UserTypeContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#userType}.
 * @param ctx the parse tree
 */
fn exit_userType(&mut self, _ctx: &UserTypeContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#simpleUserType}.
 * @param ctx the parse tree
 */
fn enter_simpleUserType(&mut self, _ctx: &SimpleUserTypeContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#simpleUserType}.
 * @param ctx the parse tree
 */
fn exit_simpleUserType(&mut self, _ctx: &SimpleUserTypeContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#typeProjection}.
 * @param ctx the parse tree
 */
fn enter_typeProjection(&mut self, _ctx: &TypeProjectionContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#typeProjection}.
 * @param ctx the parse tree
 */
fn exit_typeProjection(&mut self, _ctx: &TypeProjectionContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#typeProjectionModifiers}.
 * @param ctx the parse tree
 */
fn enter_typeProjectionModifiers(&mut self, _ctx: &TypeProjectionModifiersContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#typeProjectionModifiers}.
 * @param ctx the parse tree
 */
fn exit_typeProjectionModifiers(&mut self, _ctx: &TypeProjectionModifiersContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#typeProjectionModifier}.
 * @param ctx the parse tree
 */
fn enter_typeProjectionModifier(&mut self, _ctx: &TypeProjectionModifierContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#typeProjectionModifier}.
 * @param ctx the parse tree
 */
fn exit_typeProjectionModifier(&mut self, _ctx: &TypeProjectionModifierContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#functionType}.
 * @param ctx the parse tree
 */
fn enter_functionType(&mut self, _ctx: &FunctionTypeContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#functionType}.
 * @param ctx the parse tree
 */
fn exit_functionType(&mut self, _ctx: &FunctionTypeContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#functionTypeParameters}.
 * @param ctx the parse tree
 */
fn enter_functionTypeParameters(&mut self, _ctx: &FunctionTypeParametersContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#functionTypeParameters}.
 * @param ctx the parse tree
 */
fn exit_functionTypeParameters(&mut self, _ctx: &FunctionTypeParametersContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#parenthesizedType}.
 * @param ctx the parse tree
 */
fn enter_parenthesizedType(&mut self, _ctx: &ParenthesizedTypeContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#parenthesizedType}.
 * @param ctx the parse tree
 */
fn exit_parenthesizedType(&mut self, _ctx: &ParenthesizedTypeContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#receiverType}.
 * @param ctx the parse tree
 */
fn enter_receiverType(&mut self, _ctx: &ReceiverTypeContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#receiverType}.
 * @param ctx the parse tree
 */
fn exit_receiverType(&mut self, _ctx: &ReceiverTypeContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#parenthesizedUserType}.
 * @param ctx the parse tree
 */
fn enter_parenthesizedUserType(&mut self, _ctx: &ParenthesizedUserTypeContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#parenthesizedUserType}.
 * @param ctx the parse tree
 */
fn exit_parenthesizedUserType(&mut self, _ctx: &ParenthesizedUserTypeContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#statements}.
 * @param ctx the parse tree
 */
fn enter_statements(&mut self, _ctx: &StatementsContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#statements}.
 * @param ctx the parse tree
 */
fn exit_statements(&mut self, _ctx: &StatementsContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#statement}.
 * @param ctx the parse tree
 */
fn enter_statement(&mut self, _ctx: &StatementContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#statement}.
 * @param ctx the parse tree
 */
fn exit_statement(&mut self, _ctx: &StatementContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#label}.
 * @param ctx the parse tree
 */
fn enter_label(&mut self, _ctx: &LabelContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#label}.
 * @param ctx the parse tree
 */
fn exit_label(&mut self, _ctx: &LabelContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#controlStructureBody}.
 * @param ctx the parse tree
 */
fn enter_controlStructureBody(&mut self, _ctx: &ControlStructureBodyContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#controlStructureBody}.
 * @param ctx the parse tree
 */
fn exit_controlStructureBody(&mut self, _ctx: &ControlStructureBodyContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#block}.
 * @param ctx the parse tree
 */
fn enter_block(&mut self, _ctx: &BlockContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#block}.
 * @param ctx the parse tree
 */
fn exit_block(&mut self, _ctx: &BlockContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#loopStatement}.
 * @param ctx the parse tree
 */
fn enter_loopStatement(&mut self, _ctx: &LoopStatementContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#loopStatement}.
 * @param ctx the parse tree
 */
fn exit_loopStatement(&mut self, _ctx: &LoopStatementContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#forStatement}.
 * @param ctx the parse tree
 */
fn enter_forStatement(&mut self, _ctx: &ForStatementContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#forStatement}.
 * @param ctx the parse tree
 */
fn exit_forStatement(&mut self, _ctx: &ForStatementContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#whileStatement}.
 * @param ctx the parse tree
 */
fn enter_whileStatement(&mut self, _ctx: &WhileStatementContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#whileStatement}.
 * @param ctx the parse tree
 */
fn exit_whileStatement(&mut self, _ctx: &WhileStatementContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#doWhileStatement}.
 * @param ctx the parse tree
 */
fn enter_doWhileStatement(&mut self, _ctx: &DoWhileStatementContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#doWhileStatement}.
 * @param ctx the parse tree
 */
fn exit_doWhileStatement(&mut self, _ctx: &DoWhileStatementContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#assignment}.
 * @param ctx the parse tree
 */
fn enter_assignment(&mut self, _ctx: &AssignmentContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#assignment}.
 * @param ctx the parse tree
 */
fn exit_assignment(&mut self, _ctx: &AssignmentContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#semi}.
 * @param ctx the parse tree
 */
fn enter_semi(&mut self, _ctx: &SemiContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#semi}.
 * @param ctx the parse tree
 */
fn exit_semi(&mut self, _ctx: &SemiContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#semis}.
 * @param ctx the parse tree
 */
fn enter_semis(&mut self, _ctx: &SemisContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#semis}.
 * @param ctx the parse tree
 */
fn exit_semis(&mut self, _ctx: &SemisContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#expression}.
 * @param ctx the parse tree
 */
fn enter_expression(&mut self, _ctx: &ExpressionContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#expression}.
 * @param ctx the parse tree
 */
fn exit_expression(&mut self, _ctx: &ExpressionContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#disjunction}.
 * @param ctx the parse tree
 */
fn enter_disjunction(&mut self, _ctx: &DisjunctionContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#disjunction}.
 * @param ctx the parse tree
 */
fn exit_disjunction(&mut self, _ctx: &DisjunctionContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#conjunction}.
 * @param ctx the parse tree
 */
fn enter_conjunction(&mut self, _ctx: &ConjunctionContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#conjunction}.
 * @param ctx the parse tree
 */
fn exit_conjunction(&mut self, _ctx: &ConjunctionContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#equality}.
 * @param ctx the parse tree
 */
fn enter_equality(&mut self, _ctx: &EqualityContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#equality}.
 * @param ctx the parse tree
 */
fn exit_equality(&mut self, _ctx: &EqualityContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#comparison}.
 * @param ctx the parse tree
 */
fn enter_comparison(&mut self, _ctx: &ComparisonContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#comparison}.
 * @param ctx the parse tree
 */
fn exit_comparison(&mut self, _ctx: &ComparisonContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#genericCallLikeComparison}.
 * @param ctx the parse tree
 */
fn enter_genericCallLikeComparison(&mut self, _ctx: &GenericCallLikeComparisonContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#genericCallLikeComparison}.
 * @param ctx the parse tree
 */
fn exit_genericCallLikeComparison(&mut self, _ctx: &GenericCallLikeComparisonContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#infixOperation}.
 * @param ctx the parse tree
 */
fn enter_infixOperation(&mut self, _ctx: &InfixOperationContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#infixOperation}.
 * @param ctx the parse tree
 */
fn exit_infixOperation(&mut self, _ctx: &InfixOperationContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#elvisExpression}.
 * @param ctx the parse tree
 */
fn enter_elvisExpression(&mut self, _ctx: &ElvisExpressionContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#elvisExpression}.
 * @param ctx the parse tree
 */
fn exit_elvisExpression(&mut self, _ctx: &ElvisExpressionContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#elvis}.
 * @param ctx the parse tree
 */
fn enter_elvis(&mut self, _ctx: &ElvisContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#elvis}.
 * @param ctx the parse tree
 */
fn exit_elvis(&mut self, _ctx: &ElvisContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#infixFunctionCall}.
 * @param ctx the parse tree
 */
fn enter_infixFunctionCall(&mut self, _ctx: &InfixFunctionCallContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#infixFunctionCall}.
 * @param ctx the parse tree
 */
fn exit_infixFunctionCall(&mut self, _ctx: &InfixFunctionCallContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#rangeExpression}.
 * @param ctx the parse tree
 */
fn enter_rangeExpression(&mut self, _ctx: &RangeExpressionContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#rangeExpression}.
 * @param ctx the parse tree
 */
fn exit_rangeExpression(&mut self, _ctx: &RangeExpressionContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#additiveExpression}.
 * @param ctx the parse tree
 */
fn enter_additiveExpression(&mut self, _ctx: &AdditiveExpressionContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#additiveExpression}.
 * @param ctx the parse tree
 */
fn exit_additiveExpression(&mut self, _ctx: &AdditiveExpressionContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#multiplicativeExpression}.
 * @param ctx the parse tree
 */
fn enter_multiplicativeExpression(&mut self, _ctx: &MultiplicativeExpressionContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#multiplicativeExpression}.
 * @param ctx the parse tree
 */
fn exit_multiplicativeExpression(&mut self, _ctx: &MultiplicativeExpressionContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#asExpression}.
 * @param ctx the parse tree
 */
fn enter_asExpression(&mut self, _ctx: &AsExpressionContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#asExpression}.
 * @param ctx the parse tree
 */
fn exit_asExpression(&mut self, _ctx: &AsExpressionContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#prefixUnaryExpression}.
 * @param ctx the parse tree
 */
fn enter_prefixUnaryExpression(&mut self, _ctx: &PrefixUnaryExpressionContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#prefixUnaryExpression}.
 * @param ctx the parse tree
 */
fn exit_prefixUnaryExpression(&mut self, _ctx: &PrefixUnaryExpressionContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#unaryPrefix}.
 * @param ctx the parse tree
 */
fn enter_unaryPrefix(&mut self, _ctx: &UnaryPrefixContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#unaryPrefix}.
 * @param ctx the parse tree
 */
fn exit_unaryPrefix(&mut self, _ctx: &UnaryPrefixContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#postfixUnaryExpression}.
 * @param ctx the parse tree
 */
fn enter_postfixUnaryExpression(&mut self, _ctx: &PostfixUnaryExpressionContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#postfixUnaryExpression}.
 * @param ctx the parse tree
 */
fn exit_postfixUnaryExpression(&mut self, _ctx: &PostfixUnaryExpressionContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#postfixUnarySuffix}.
 * @param ctx the parse tree
 */
fn enter_postfixUnarySuffix(&mut self, _ctx: &PostfixUnarySuffixContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#postfixUnarySuffix}.
 * @param ctx the parse tree
 */
fn exit_postfixUnarySuffix(&mut self, _ctx: &PostfixUnarySuffixContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#directlyAssignableExpression}.
 * @param ctx the parse tree
 */
fn enter_directlyAssignableExpression(&mut self, _ctx: &DirectlyAssignableExpressionContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#directlyAssignableExpression}.
 * @param ctx the parse tree
 */
fn exit_directlyAssignableExpression(&mut self, _ctx: &DirectlyAssignableExpressionContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#parenthesizedDirectlyAssignableExpression}.
 * @param ctx the parse tree
 */
fn enter_parenthesizedDirectlyAssignableExpression(&mut self, _ctx: &ParenthesizedDirectlyAssignableExpressionContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#parenthesizedDirectlyAssignableExpression}.
 * @param ctx the parse tree
 */
fn exit_parenthesizedDirectlyAssignableExpression(&mut self, _ctx: &ParenthesizedDirectlyAssignableExpressionContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#assignableExpression}.
 * @param ctx the parse tree
 */
fn enter_assignableExpression(&mut self, _ctx: &AssignableExpressionContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#assignableExpression}.
 * @param ctx the parse tree
 */
fn exit_assignableExpression(&mut self, _ctx: &AssignableExpressionContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#parenthesizedAssignableExpression}.
 * @param ctx the parse tree
 */
fn enter_parenthesizedAssignableExpression(&mut self, _ctx: &ParenthesizedAssignableExpressionContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#parenthesizedAssignableExpression}.
 * @param ctx the parse tree
 */
fn exit_parenthesizedAssignableExpression(&mut self, _ctx: &ParenthesizedAssignableExpressionContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#assignableSuffix}.
 * @param ctx the parse tree
 */
fn enter_assignableSuffix(&mut self, _ctx: &AssignableSuffixContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#assignableSuffix}.
 * @param ctx the parse tree
 */
fn exit_assignableSuffix(&mut self, _ctx: &AssignableSuffixContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#indexingSuffix}.
 * @param ctx the parse tree
 */
fn enter_indexingSuffix(&mut self, _ctx: &IndexingSuffixContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#indexingSuffix}.
 * @param ctx the parse tree
 */
fn exit_indexingSuffix(&mut self, _ctx: &IndexingSuffixContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#navigationSuffix}.
 * @param ctx the parse tree
 */
fn enter_navigationSuffix(&mut self, _ctx: &NavigationSuffixContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#navigationSuffix}.
 * @param ctx the parse tree
 */
fn exit_navigationSuffix(&mut self, _ctx: &NavigationSuffixContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#callSuffix}.
 * @param ctx the parse tree
 */
fn enter_callSuffix(&mut self, _ctx: &CallSuffixContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#callSuffix}.
 * @param ctx the parse tree
 */
fn exit_callSuffix(&mut self, _ctx: &CallSuffixContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#annotatedLambda}.
 * @param ctx the parse tree
 */
fn enter_annotatedLambda(&mut self, _ctx: &AnnotatedLambdaContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#annotatedLambda}.
 * @param ctx the parse tree
 */
fn exit_annotatedLambda(&mut self, _ctx: &AnnotatedLambdaContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#typeArguments}.
 * @param ctx the parse tree
 */
fn enter_typeArguments(&mut self, _ctx: &TypeArgumentsContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#typeArguments}.
 * @param ctx the parse tree
 */
fn exit_typeArguments(&mut self, _ctx: &TypeArgumentsContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#valueArguments}.
 * @param ctx the parse tree
 */
fn enter_valueArguments(&mut self, _ctx: &ValueArgumentsContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#valueArguments}.
 * @param ctx the parse tree
 */
fn exit_valueArguments(&mut self, _ctx: &ValueArgumentsContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#valueArgument}.
 * @param ctx the parse tree
 */
fn enter_valueArgument(&mut self, _ctx: &ValueArgumentContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#valueArgument}.
 * @param ctx the parse tree
 */
fn exit_valueArgument(&mut self, _ctx: &ValueArgumentContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#primaryExpression}.
 * @param ctx the parse tree
 */
fn enter_primaryExpression(&mut self, _ctx: &PrimaryExpressionContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#primaryExpression}.
 * @param ctx the parse tree
 */
fn exit_primaryExpression(&mut self, _ctx: &PrimaryExpressionContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#parenthesizedExpression}.
 * @param ctx the parse tree
 */
fn enter_parenthesizedExpression(&mut self, _ctx: &ParenthesizedExpressionContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#parenthesizedExpression}.
 * @param ctx the parse tree
 */
fn exit_parenthesizedExpression(&mut self, _ctx: &ParenthesizedExpressionContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#collectionLiteral}.
 * @param ctx the parse tree
 */
fn enter_collectionLiteral(&mut self, _ctx: &CollectionLiteralContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#collectionLiteral}.
 * @param ctx the parse tree
 */
fn exit_collectionLiteral(&mut self, _ctx: &CollectionLiteralContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#literalConstant}.
 * @param ctx the parse tree
 */
fn enter_literalConstant(&mut self, _ctx: &LiteralConstantContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#literalConstant}.
 * @param ctx the parse tree
 */
fn exit_literalConstant(&mut self, _ctx: &LiteralConstantContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#stringLiteral}.
 * @param ctx the parse tree
 */
fn enter_stringLiteral(&mut self, _ctx: &StringLiteralContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#stringLiteral}.
 * @param ctx the parse tree
 */
fn exit_stringLiteral(&mut self, _ctx: &StringLiteralContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#lineStringLiteral}.
 * @param ctx the parse tree
 */
fn enter_lineStringLiteral(&mut self, _ctx: &LineStringLiteralContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#lineStringLiteral}.
 * @param ctx the parse tree
 */
fn exit_lineStringLiteral(&mut self, _ctx: &LineStringLiteralContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#multiLineStringLiteral}.
 * @param ctx the parse tree
 */
fn enter_multiLineStringLiteral(&mut self, _ctx: &MultiLineStringLiteralContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#multiLineStringLiteral}.
 * @param ctx the parse tree
 */
fn exit_multiLineStringLiteral(&mut self, _ctx: &MultiLineStringLiteralContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#lineStringContent}.
 * @param ctx the parse tree
 */
fn enter_lineStringContent(&mut self, _ctx: &LineStringContentContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#lineStringContent}.
 * @param ctx the parse tree
 */
fn exit_lineStringContent(&mut self, _ctx: &LineStringContentContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#lineStringExpression}.
 * @param ctx the parse tree
 */
fn enter_lineStringExpression(&mut self, _ctx: &LineStringExpressionContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#lineStringExpression}.
 * @param ctx the parse tree
 */
fn exit_lineStringExpression(&mut self, _ctx: &LineStringExpressionContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#multiLineStringContent}.
 * @param ctx the parse tree
 */
fn enter_multiLineStringContent(&mut self, _ctx: &MultiLineStringContentContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#multiLineStringContent}.
 * @param ctx the parse tree
 */
fn exit_multiLineStringContent(&mut self, _ctx: &MultiLineStringContentContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#multiLineStringExpression}.
 * @param ctx the parse tree
 */
fn enter_multiLineStringExpression(&mut self, _ctx: &MultiLineStringExpressionContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#multiLineStringExpression}.
 * @param ctx the parse tree
 */
fn exit_multiLineStringExpression(&mut self, _ctx: &MultiLineStringExpressionContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#lambdaLiteral}.
 * @param ctx the parse tree
 */
fn enter_lambdaLiteral(&mut self, _ctx: &LambdaLiteralContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#lambdaLiteral}.
 * @param ctx the parse tree
 */
fn exit_lambdaLiteral(&mut self, _ctx: &LambdaLiteralContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#lambdaParameters}.
 * @param ctx the parse tree
 */
fn enter_lambdaParameters(&mut self, _ctx: &LambdaParametersContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#lambdaParameters}.
 * @param ctx the parse tree
 */
fn exit_lambdaParameters(&mut self, _ctx: &LambdaParametersContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#lambdaParameter}.
 * @param ctx the parse tree
 */
fn enter_lambdaParameter(&mut self, _ctx: &LambdaParameterContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#lambdaParameter}.
 * @param ctx the parse tree
 */
fn exit_lambdaParameter(&mut self, _ctx: &LambdaParameterContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#anonymousFunction}.
 * @param ctx the parse tree
 */
fn enter_anonymousFunction(&mut self, _ctx: &AnonymousFunctionContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#anonymousFunction}.
 * @param ctx the parse tree
 */
fn exit_anonymousFunction(&mut self, _ctx: &AnonymousFunctionContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#functionLiteral}.
 * @param ctx the parse tree
 */
fn enter_functionLiteral(&mut self, _ctx: &FunctionLiteralContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#functionLiteral}.
 * @param ctx the parse tree
 */
fn exit_functionLiteral(&mut self, _ctx: &FunctionLiteralContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#objectLiteral}.
 * @param ctx the parse tree
 */
fn enter_objectLiteral(&mut self, _ctx: &ObjectLiteralContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#objectLiteral}.
 * @param ctx the parse tree
 */
fn exit_objectLiteral(&mut self, _ctx: &ObjectLiteralContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#thisExpression}.
 * @param ctx the parse tree
 */
fn enter_thisExpression(&mut self, _ctx: &ThisExpressionContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#thisExpression}.
 * @param ctx the parse tree
 */
fn exit_thisExpression(&mut self, _ctx: &ThisExpressionContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#superExpression}.
 * @param ctx the parse tree
 */
fn enter_superExpression(&mut self, _ctx: &SuperExpressionContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#superExpression}.
 * @param ctx the parse tree
 */
fn exit_superExpression(&mut self, _ctx: &SuperExpressionContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#ifExpression}.
 * @param ctx the parse tree
 */
fn enter_ifExpression(&mut self, _ctx: &IfExpressionContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#ifExpression}.
 * @param ctx the parse tree
 */
fn exit_ifExpression(&mut self, _ctx: &IfExpressionContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#whenSubject}.
 * @param ctx the parse tree
 */
fn enter_whenSubject(&mut self, _ctx: &WhenSubjectContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#whenSubject}.
 * @param ctx the parse tree
 */
fn exit_whenSubject(&mut self, _ctx: &WhenSubjectContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#whenExpression}.
 * @param ctx the parse tree
 */
fn enter_whenExpression(&mut self, _ctx: &WhenExpressionContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#whenExpression}.
 * @param ctx the parse tree
 */
fn exit_whenExpression(&mut self, _ctx: &WhenExpressionContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#whenEntry}.
 * @param ctx the parse tree
 */
fn enter_whenEntry(&mut self, _ctx: &WhenEntryContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#whenEntry}.
 * @param ctx the parse tree
 */
fn exit_whenEntry(&mut self, _ctx: &WhenEntryContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#whenCondition}.
 * @param ctx the parse tree
 */
fn enter_whenCondition(&mut self, _ctx: &WhenConditionContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#whenCondition}.
 * @param ctx the parse tree
 */
fn exit_whenCondition(&mut self, _ctx: &WhenConditionContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#rangeTest}.
 * @param ctx the parse tree
 */
fn enter_rangeTest(&mut self, _ctx: &RangeTestContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#rangeTest}.
 * @param ctx the parse tree
 */
fn exit_rangeTest(&mut self, _ctx: &RangeTestContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#typeTest}.
 * @param ctx the parse tree
 */
fn enter_typeTest(&mut self, _ctx: &TypeTestContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#typeTest}.
 * @param ctx the parse tree
 */
fn exit_typeTest(&mut self, _ctx: &TypeTestContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#tryExpression}.
 * @param ctx the parse tree
 */
fn enter_tryExpression(&mut self, _ctx: &TryExpressionContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#tryExpression}.
 * @param ctx the parse tree
 */
fn exit_tryExpression(&mut self, _ctx: &TryExpressionContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#catchBlock}.
 * @param ctx the parse tree
 */
fn enter_catchBlock(&mut self, _ctx: &CatchBlockContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#catchBlock}.
 * @param ctx the parse tree
 */
fn exit_catchBlock(&mut self, _ctx: &CatchBlockContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#finallyBlock}.
 * @param ctx the parse tree
 */
fn enter_finallyBlock(&mut self, _ctx: &FinallyBlockContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#finallyBlock}.
 * @param ctx the parse tree
 */
fn exit_finallyBlock(&mut self, _ctx: &FinallyBlockContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#jumpExpression}.
 * @param ctx the parse tree
 */
fn enter_jumpExpression(&mut self, _ctx: &JumpExpressionContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#jumpExpression}.
 * @param ctx the parse tree
 */
fn exit_jumpExpression(&mut self, _ctx: &JumpExpressionContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#callableReference}.
 * @param ctx the parse tree
 */
fn enter_callableReference(&mut self, _ctx: &CallableReferenceContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#callableReference}.
 * @param ctx the parse tree
 */
fn exit_callableReference(&mut self, _ctx: &CallableReferenceContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#assignmentAndOperator}.
 * @param ctx the parse tree
 */
fn enter_assignmentAndOperator(&mut self, _ctx: &AssignmentAndOperatorContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#assignmentAndOperator}.
 * @param ctx the parse tree
 */
fn exit_assignmentAndOperator(&mut self, _ctx: &AssignmentAndOperatorContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#equalityOperator}.
 * @param ctx the parse tree
 */
fn enter_equalityOperator(&mut self, _ctx: &EqualityOperatorContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#equalityOperator}.
 * @param ctx the parse tree
 */
fn exit_equalityOperator(&mut self, _ctx: &EqualityOperatorContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#comparisonOperator}.
 * @param ctx the parse tree
 */
fn enter_comparisonOperator(&mut self, _ctx: &ComparisonOperatorContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#comparisonOperator}.
 * @param ctx the parse tree
 */
fn exit_comparisonOperator(&mut self, _ctx: &ComparisonOperatorContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#inOperator}.
 * @param ctx the parse tree
 */
fn enter_inOperator(&mut self, _ctx: &InOperatorContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#inOperator}.
 * @param ctx the parse tree
 */
fn exit_inOperator(&mut self, _ctx: &InOperatorContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#isOperator}.
 * @param ctx the parse tree
 */
fn enter_isOperator(&mut self, _ctx: &IsOperatorContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#isOperator}.
 * @param ctx the parse tree
 */
fn exit_isOperator(&mut self, _ctx: &IsOperatorContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#additiveOperator}.
 * @param ctx the parse tree
 */
fn enter_additiveOperator(&mut self, _ctx: &AdditiveOperatorContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#additiveOperator}.
 * @param ctx the parse tree
 */
fn exit_additiveOperator(&mut self, _ctx: &AdditiveOperatorContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#multiplicativeOperator}.
 * @param ctx the parse tree
 */
fn enter_multiplicativeOperator(&mut self, _ctx: &MultiplicativeOperatorContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#multiplicativeOperator}.
 * @param ctx the parse tree
 */
fn exit_multiplicativeOperator(&mut self, _ctx: &MultiplicativeOperatorContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#asOperator}.
 * @param ctx the parse tree
 */
fn enter_asOperator(&mut self, _ctx: &AsOperatorContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#asOperator}.
 * @param ctx the parse tree
 */
fn exit_asOperator(&mut self, _ctx: &AsOperatorContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#prefixUnaryOperator}.
 * @param ctx the parse tree
 */
fn enter_prefixUnaryOperator(&mut self, _ctx: &PrefixUnaryOperatorContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#prefixUnaryOperator}.
 * @param ctx the parse tree
 */
fn exit_prefixUnaryOperator(&mut self, _ctx: &PrefixUnaryOperatorContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#postfixUnaryOperator}.
 * @param ctx the parse tree
 */
fn enter_postfixUnaryOperator(&mut self, _ctx: &PostfixUnaryOperatorContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#postfixUnaryOperator}.
 * @param ctx the parse tree
 */
fn exit_postfixUnaryOperator(&mut self, _ctx: &PostfixUnaryOperatorContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#excl}.
 * @param ctx the parse tree
 */
fn enter_excl(&mut self, _ctx: &ExclContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#excl}.
 * @param ctx the parse tree
 */
fn exit_excl(&mut self, _ctx: &ExclContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#memberAccessOperator}.
 * @param ctx the parse tree
 */
fn enter_memberAccessOperator(&mut self, _ctx: &MemberAccessOperatorContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#memberAccessOperator}.
 * @param ctx the parse tree
 */
fn exit_memberAccessOperator(&mut self, _ctx: &MemberAccessOperatorContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#safeNav}.
 * @param ctx the parse tree
 */
fn enter_safeNav(&mut self, _ctx: &SafeNavContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#safeNav}.
 * @param ctx the parse tree
 */
fn exit_safeNav(&mut self, _ctx: &SafeNavContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#modifiers}.
 * @param ctx the parse tree
 */
fn enter_modifiers(&mut self, _ctx: &ModifiersContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#modifiers}.
 * @param ctx the parse tree
 */
fn exit_modifiers(&mut self, _ctx: &ModifiersContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#parameterModifiers}.
 * @param ctx the parse tree
 */
fn enter_parameterModifiers(&mut self, _ctx: &ParameterModifiersContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#parameterModifiers}.
 * @param ctx the parse tree
 */
fn exit_parameterModifiers(&mut self, _ctx: &ParameterModifiersContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#modifier}.
 * @param ctx the parse tree
 */
fn enter_modifier(&mut self, _ctx: &ModifierContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#modifier}.
 * @param ctx the parse tree
 */
fn exit_modifier(&mut self, _ctx: &ModifierContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#typeModifiers}.
 * @param ctx the parse tree
 */
fn enter_typeModifiers(&mut self, _ctx: &TypeModifiersContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#typeModifiers}.
 * @param ctx the parse tree
 */
fn exit_typeModifiers(&mut self, _ctx: &TypeModifiersContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#typeModifier}.
 * @param ctx the parse tree
 */
fn enter_typeModifier(&mut self, _ctx: &TypeModifierContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#typeModifier}.
 * @param ctx the parse tree
 */
fn exit_typeModifier(&mut self, _ctx: &TypeModifierContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#classModifier}.
 * @param ctx the parse tree
 */
fn enter_classModifier(&mut self, _ctx: &ClassModifierContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#classModifier}.
 * @param ctx the parse tree
 */
fn exit_classModifier(&mut self, _ctx: &ClassModifierContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#memberModifier}.
 * @param ctx the parse tree
 */
fn enter_memberModifier(&mut self, _ctx: &MemberModifierContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#memberModifier}.
 * @param ctx the parse tree
 */
fn exit_memberModifier(&mut self, _ctx: &MemberModifierContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#visibilityModifier}.
 * @param ctx the parse tree
 */
fn enter_visibilityModifier(&mut self, _ctx: &VisibilityModifierContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#visibilityModifier}.
 * @param ctx the parse tree
 */
fn exit_visibilityModifier(&mut self, _ctx: &VisibilityModifierContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#varianceModifier}.
 * @param ctx the parse tree
 */
fn enter_varianceModifier(&mut self, _ctx: &VarianceModifierContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#varianceModifier}.
 * @param ctx the parse tree
 */
fn exit_varianceModifier(&mut self, _ctx: &VarianceModifierContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#typeParameterModifiers}.
 * @param ctx the parse tree
 */
fn enter_typeParameterModifiers(&mut self, _ctx: &TypeParameterModifiersContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#typeParameterModifiers}.
 * @param ctx the parse tree
 */
fn exit_typeParameterModifiers(&mut self, _ctx: &TypeParameterModifiersContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#typeParameterModifier}.
 * @param ctx the parse tree
 */
fn enter_typeParameterModifier(&mut self, _ctx: &TypeParameterModifierContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#typeParameterModifier}.
 * @param ctx the parse tree
 */
fn exit_typeParameterModifier(&mut self, _ctx: &TypeParameterModifierContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#functionModifier}.
 * @param ctx the parse tree
 */
fn enter_functionModifier(&mut self, _ctx: &FunctionModifierContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#functionModifier}.
 * @param ctx the parse tree
 */
fn exit_functionModifier(&mut self, _ctx: &FunctionModifierContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#propertyModifier}.
 * @param ctx the parse tree
 */
fn enter_propertyModifier(&mut self, _ctx: &PropertyModifierContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#propertyModifier}.
 * @param ctx the parse tree
 */
fn exit_propertyModifier(&mut self, _ctx: &PropertyModifierContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#inheritanceModifier}.
 * @param ctx the parse tree
 */
fn enter_inheritanceModifier(&mut self, _ctx: &InheritanceModifierContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#inheritanceModifier}.
 * @param ctx the parse tree
 */
fn exit_inheritanceModifier(&mut self, _ctx: &InheritanceModifierContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#parameterModifier}.
 * @param ctx the parse tree
 */
fn enter_parameterModifier(&mut self, _ctx: &ParameterModifierContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#parameterModifier}.
 * @param ctx the parse tree
 */
fn exit_parameterModifier(&mut self, _ctx: &ParameterModifierContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#reificationModifier}.
 * @param ctx the parse tree
 */
fn enter_reificationModifier(&mut self, _ctx: &ReificationModifierContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#reificationModifier}.
 * @param ctx the parse tree
 */
fn exit_reificationModifier(&mut self, _ctx: &ReificationModifierContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#platformModifier}.
 * @param ctx the parse tree
 */
fn enter_platformModifier(&mut self, _ctx: &PlatformModifierContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#platformModifier}.
 * @param ctx the parse tree
 */
fn exit_platformModifier(&mut self, _ctx: &PlatformModifierContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#annotation}.
 * @param ctx the parse tree
 */
fn enter_annotation(&mut self, _ctx: &AnnotationContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#annotation}.
 * @param ctx the parse tree
 */
fn exit_annotation(&mut self, _ctx: &AnnotationContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#singleAnnotation}.
 * @param ctx the parse tree
 */
fn enter_singleAnnotation(&mut self, _ctx: &SingleAnnotationContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#singleAnnotation}.
 * @param ctx the parse tree
 */
fn exit_singleAnnotation(&mut self, _ctx: &SingleAnnotationContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#multiAnnotation}.
 * @param ctx the parse tree
 */
fn enter_multiAnnotation(&mut self, _ctx: &MultiAnnotationContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#multiAnnotation}.
 * @param ctx the parse tree
 */
fn exit_multiAnnotation(&mut self, _ctx: &MultiAnnotationContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#annotationUseSiteTarget}.
 * @param ctx the parse tree
 */
fn enter_annotationUseSiteTarget(&mut self, _ctx: &AnnotationUseSiteTargetContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#annotationUseSiteTarget}.
 * @param ctx the parse tree
 */
fn exit_annotationUseSiteTarget(&mut self, _ctx: &AnnotationUseSiteTargetContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#unescapedAnnotation}.
 * @param ctx the parse tree
 */
fn enter_unescapedAnnotation(&mut self, _ctx: &UnescapedAnnotationContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#unescapedAnnotation}.
 * @param ctx the parse tree
 */
fn exit_unescapedAnnotation(&mut self, _ctx: &UnescapedAnnotationContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#simpleIdentifier}.
 * @param ctx the parse tree
 */
fn enter_simpleIdentifier(&mut self, _ctx: &SimpleIdentifierContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#simpleIdentifier}.
 * @param ctx the parse tree
 */
fn exit_simpleIdentifier(&mut self, _ctx: &SimpleIdentifierContext<'input>) { }
/**
 * Enter a parse tree produced by {@link KotlinParser#identifier}.
 * @param ctx the parse tree
 */
fn enter_identifier(&mut self, _ctx: &IdentifierContext<'input>) { }
/**
 * Exit a parse tree produced by {@link KotlinParser#identifier}.
 * @param ctx the parse tree
 */
fn exit_identifier(&mut self, _ctx: &IdentifierContext<'input>) { }

}

antlr_rust::coerce_from!{ 'input : KotlinParserListener<'input> }


