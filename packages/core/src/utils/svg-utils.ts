/**
 * SVG utilities for namespace-aware element creation
 */

// SVG namespace URI
export const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

// SVG专用元素 - 只存在于SVG中的元素
export const SVG_ONLY_ELEMENTS = new Set([
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
    "marker",
    "mask",
    "metadata",
    "switch",
    "desc",
]);

// 既存在于HTML又存在于SVG的元素 - 默认使用HTML版本
export const DUAL_ELEMENTS = new Set(["image", "style", "title", "text"]);

// 强制使用HTML版本的元素（即使在SVG上下文中）
export const FORCE_HTML_ELEMENTS = new Set(["a"]);

// 所有SVG元素的集合
export const SVG_ELEMENTS = new Set([
    ...SVG_ONLY_ELEMENTS,
    ...DUAL_ELEMENTS,
    ...FORCE_HTML_ELEMENTS,
]);

// SVG上下文追踪
let svgContext = false;

/**
 * 检查标签名是否为SVG专用元素
 */
export function isSVGOnlyElement(tagName: string): boolean {
    return SVG_ONLY_ELEMENTS.has(tagName);
}

/**
 * 检查标签名是否为双重元素（HTML和SVG都有）
 */
export function isDualElement(tagName: string): boolean {
    return DUAL_ELEMENTS.has(tagName);
}

/**
 * 检查标签名是否为强制HTML元素
 */
export function isForceHTMLElement(tagName: string): boolean {
    return FORCE_HTML_ELEMENTS.has(tagName);
}

/**
 * 检查标签名是否为SVG元素（保持向后兼容）
 */
export function isSVGElement(tagName: string): boolean {
    return SVG_ELEMENTS.has(tagName);
}

/**
 * 设置SVG上下文状态
 */
export function setSVGContext(inSVG: boolean): void {
    svgContext = inSVG;
}

/**
 * 获取当前SVG上下文状态
 */
export function getSVGContext(): boolean {
    return svgContext;
}

/**
 * 创建元素 - 基于上下文和元素类型智能选择命名空间
 */
export function createElement(tagName: string): HTMLElement | SVGElement {
    // 强制HTML元素始终使用HTML版本
    if (isForceHTMLElement(tagName)) {
        return document.createElement(tagName) as HTMLElement;
    }

    // SVG专用元素始终使用SVG命名空间
    if (isSVGOnlyElement(tagName)) {
        setSVGContext(true); // 进入SVG上下文
        return document.createElementNS(SVG_NAMESPACE, tagName) as SVGElement;
    }

    // 双重元素根据上下文决定
    if (isDualElement(tagName)) {
        if (svgContext) {
            return document.createElementNS(SVG_NAMESPACE, tagName) as SVGElement;
        }
    }

    // 默认创建HTML元素
    return document.createElement(tagName) as HTMLElement;
}

/**
 * 检测元素是否需要在SVG上下文中处理
 */
export function shouldUseSVGNamespace(tagName: string): boolean {
    return isSVGOnlyElement(tagName) || (isDualElement(tagName) && svgContext);
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
