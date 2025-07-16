/**
 * ESLint 规则：render-method-required
 *
 * 确保继承 WebComponent 的类实现 render() 方法
 */

import { Rule } from "eslint";
import { WSXRuleModule } from "../types";

export const renderMethodRequired: WSXRuleModule = {
    meta: {
        type: "problem",
        docs: {
            description: "require WSX components to implement render method",
            category: "Possible Errors",
            recommended: true,
        },
        messages: {
            missingRenderMethod:
                "WSX component '{{componentName}}' must implement a render() method",
        },
        schema: [], // 无配置选项
    },
    create(context: Rule.RuleContext) {
        return {
            ClassDeclaration(node: import("estree").ClassDeclaration) {
                // 检查是否继承自 WebComponent
                const isWebComponent =
                    node.superClass &&
                    node.superClass.type === "Identifier" &&
                    node.superClass.name === "WebComponent";

                if (!isWebComponent) return;

                const componentName = node.id?.name || "Unknown";
                const hasRenderMethod = node.body.body.some(
                    (member: any) =>
                        member.type === "MethodDefinition" &&
                        member.key.type === "Identifier" &&
                        member.key.name === "render" &&
                        member.value.body !== null
                );

                if (!hasRenderMethod) {
                    context.report({
                        node,
                        messageId: "missingRenderMethod",
                        data: { componentName },
                    });
                }
            },
        };
    },
};
