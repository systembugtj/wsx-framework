/**
 * ESLint 规则：web-component-naming
 *
 * 强制 Web Component 命名规范（必须包含连字符）
 */

import { Rule } from "eslint";
import { WSXRuleModule } from "../types";

export const webComponentNaming: WSXRuleModule = {
    meta: {
        type: "suggestion",
        docs: {
            description: "enforce Web Component naming conventions",
            category: "Stylistic Issues",
            recommended: true,
        },
        messages: {
            tagNameNeedsHyphen:
                "Web Component tag name '{{tagName}}' must contain at least one hyphen",
            tagNameReserved: "Tag name '{{tagName}}' conflicts with HTML standard elements",
        },
        schema: [], // 无配置选项
    },
    create(context: Rule.RuleContext) {
        const htmlElements = new Set([
            "div",
            "span",
            "p",
            "a",
            "button",
            "input",
            "form",
            "img",
            "h1",
            "h2",
            "h3",
            "ul",
            "li",
            "table",
            "tr",
            "td",
            "th",
            "section",
            "article",
            "header",
            "footer",
        ]);

        return {
            Decorator(node: import("estree").Decorator) {
                if (
                    node.expression.type === "CallExpression" &&
                    node.expression.callee.type === "Identifier" &&
                    node.expression.callee.name === "autoRegister"
                ) {
                    const args = node.expression.arguments;
                    if (args.length > 0 && args[0].type === "ObjectExpression") {
                        const tagNameProp = args[0].properties.find(
                            (prop: import("estree").Property) =>
                                prop.type === "Property" &&
                                prop.key.type === "Identifier" &&
                                prop.key.name === "tagName"
                        );

                        if (tagNameProp && tagNameProp.value.type === "Literal") {
                            const tagName = tagNameProp.value.value;

                            if (typeof tagName === "string") {
                                if (htmlElements.has(tagName)) {
                                    context.report({
                                        node: tagNameProp.value,
                                        messageId: "tagNameReserved",
                                        data: { tagName },
                                    });
                                } else if (!tagName.includes("-")) {
                                    context.report({
                                        node: tagNameProp.value,
                                        messageId: "tagNameNeedsHyphen",
                                        data: { tagName },
                                    });
                                }
                            }
                        }
                    }
                }
            },
        };
    },
};
