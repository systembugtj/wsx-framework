/**
 * ESLint 规则：no-react-imports
 *
 * 禁止在 WSX 文件中导入 React 相关模块
 */

import { Rule } from "eslint";
import { WSXRuleModule } from "../types";

export const noReactImports: WSXRuleModule = {
    meta: {
        type: "problem",
        docs: {
            description: "disallow React imports in WSX files",
            category: "Best Practices",
            recommended: true,
        },
        fixable: "code",
        messages: {
            noReactImport: "Do not import React in WSX files. Use 'h' function instead",
        },
        schema: [], // 无配置选项
    },
    create(context: Rule.RuleContext) {
        const reactModules = [
            "react",
            "react-dom",
            "react-dom/client",
            "react-hooks",
            "@types/react",
            "@types/react-dom",
        ];

        return {
            ImportDeclaration(node: import("estree").ImportDeclaration) {
                const source = node.source.value;
                if (
                    typeof source === "string" &&
                    reactModules.some(
                        (module) => source === module || source.startsWith(module + "/")
                    )
                ) {
                    context.report({
                        node,
                        messageId: "noReactImport",
                        fix(fixer) {
                            return fixer.remove(node);
                        },
                    });
                }
            },
        };
    },
};
