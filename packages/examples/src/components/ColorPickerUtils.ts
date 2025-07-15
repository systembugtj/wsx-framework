/**
 * 插件类型定义
 */
export type PluginType = 'text' | 'marker';

/**
 * 节流函数类型定义
 */
export type ThrottleFunction<T extends unknown[]> = (...args: T) => void;

const TEXT_COLOR_CACHE = 'editor-js-text-color-cache';

/**
 * 检查是否为CSS变量
 * @param value 待检查的值
 * @returns 是否为CSS变量
 */
function isColorVariable(value: string): boolean {
  return value.startsWith('var(') && value.endsWith(')');
}

/**
 * 提取CSS变量名
 * @param variable CSS变量字符串
 * @returns 变量名
 */
function extractVariableName(variable: string): string {
  return variable.slice(4, -1).trim();
}

/**
 * 获取CSS属性值
 * @param propertyName CSS属性名
 * @returns CSS属性值
 */
function getCSSPropertyValue(propertyName: string): string {
  const computedStyle = getComputedStyle(document.documentElement);
  return computedStyle.getPropertyValue(propertyName).trim() || propertyName;
}

/**
 * Convert CSS variables to color string.
 * @param colorValue original value provided by users
 * @returns string color string
 */
export function handleCSSVariables(colorValue: string): string {
  if (isColorVariable(colorValue)) {
    const variableName = extractVariableName(colorValue);
    return getCSSPropertyValue(variableName);
  }
  return colorValue;
}

/**
 * Cache the latest text/marker color
 * @param defaultColor 默认颜色值
 * @param pluginType 插件类型
 * @returns 返回设置的默认颜色
 */
export function setDefaultColorCache(defaultColor: string, pluginType: PluginType): string {
  sessionStorage.setItem(`${TEXT_COLOR_CACHE}-${pluginType}`, JSON.stringify(defaultColor));
  return defaultColor;
}

/**
 * Cache custom color
 * @param customColor 自定义颜色值
 * @param pluginType 插件类型
 */
export function setCustomColorCache(customColor: string, pluginType: PluginType): void {
  sessionStorage.setItem(`${TEXT_COLOR_CACHE}-${pluginType}-custom`, JSON.stringify(customColor));
}

/**
 * Get cached custom color
 * @param pluginType 插件类型
 * @returns 缓存的自定义颜色值或null
 */
export function getCustomColorCache(pluginType: PluginType): string | null {
  const cachedCustomColor = sessionStorage.getItem(`${TEXT_COLOR_CACHE}-${pluginType}-custom`);
  return cachedCustomColor ? JSON.parse(cachedCustomColor) : null;
}

/**
 * Throttle function
 * @param fn 要节流的函数
 * @param delay 延迟时间（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends unknown[]>(
  fn: ThrottleFunction<T>,
  delay: number
): (...args: T) => void {
  let id: NodeJS.Timeout | null = null;
  return (...args: T) => {
    if (!id) {
      id = setTimeout(() => {
        fn(...args);
        id = null;
      }, delay);
    }
  };
}
/**
 * Get cached text/marker color
 * @param defaultColor 默认颜色值
 * @param pluginType 插件类型
 * @returns 缓存的颜色值或默认颜色
 */
export function getDefaultColorCache(defaultColor: string, pluginType: PluginType): string {
  const cachedDefaultColor = sessionStorage.getItem(`${TEXT_COLOR_CACHE}-${pluginType}`);
  return cachedDefaultColor ? JSON.parse(cachedDefaultColor) : defaultColor;
}

export const CONVERTER_BTN = 'ce-inline-toolbar__dropdown';
export const CONVERTER_PANEL = 'ce-conversion-toolbar--showed';
