/**
 * SVG utilities for namespace-aware element creation
 */

// SVG namespace URI
export const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

// SVG元素名称集合 - 完整的SVG 2.0规范元素列表
export const SVG_ELEMENTS = new Set([
    // 结构元素 (Structural elements)
    "svg",
    "defs",
    "g",
    "symbol",
    "use",

    // 图形元素 (Graphics elements)
    "circle",
    "ellipse",
    "line",
    "path",
    "polygon",
    "polyline",
    "rect",

    // 文本元素 (Text elements)
    "text",
    "textPath",
    "tspan",

    // 渐变和模式 (Gradients and patterns)
    "linearGradient",
    "radialGradient",
    "stop",
    "pattern",

    // 滤镜 (Filter elements)
    "filter",
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feDistantLight",
    "feDropShadow",
    "feFlood",
    "feFuncA",
    "feFuncB",
    "feFuncG",
    "feFuncR",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMergeNode",
    "feMorphology",
    "feOffset",
    "fePointLight",
    "feSpecularLighting",
    "feSpotLight",
    "feTile",
    "feTurbulence",

    // 动画元素 (Animation elements)
    "animate",
    "animateMotion",
    "animateTransform",
    "set",

    // 其他元素 (Other elements)
    "clipPath",
    "foreignObject",
    "image",
    "marker",
    "mask",
    "metadata",
    "style",
    "switch",
    "title",
    "desc",
    "a",
]);

/**
 * 检查标签名是否为SVG元素
 */
export function isSVGElement(tagName: string): boolean {
    return SVG_ELEMENTS.has(tagName);
}

/**
 * 创建元素 - 自动检测是否需要SVG命名空间
 */
export function createElement(tagName: string): HTMLElement | SVGElement {
    if (isSVGElement(tagName)) {
        return document.createElementNS(SVG_NAMESPACE, tagName) as SVGElement;
    }
    return document.createElement(tagName);
}

/**
 * SVG特殊属性映射 - 处理SVG和HTML属性差异
 */
export const SVG_ATTRIBUTE_MAP = new Map([
    ["className", "class"],
    ["htmlFor", "for"],
]);

/**
 * 获取SVG元素的正确属性名
 */
export function getSVGAttributeName(attributeName: string): string {
    return SVG_ATTRIBUTE_MAP.get(attributeName) || attributeName;
}
