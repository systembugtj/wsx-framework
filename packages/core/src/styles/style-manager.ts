/**
 * Style Manager for TextColorTool Components
 *
 * This class manages CSS styles for Web Components using modern techniques:
 * 1. CSS imports with Vite/bundler support
 * 2. Constructable StyleSheets for better performance
 * 3. Shared style sheets across component instances
 */

export class StyleManager {
  private static styleSheets: Map<string, CSSStyleSheet> = new Map();

  /**
   * Create or get a cached CSSStyleSheet for a component
   */
  static getStyleSheet(componentName: string, cssText: string): CSSStyleSheet {
    if (this.styleSheets.has(componentName)) {
      return this.styleSheets.get(componentName) as CSSStyleSheet;
    }

    // Check if browser supports constructable stylesheets
    if ('adoptedStyleSheets' in Document.prototype && 'CSSStyleSheet' in window) {
      const styleSheet = new CSSStyleSheet();
      styleSheet.replaceSync(cssText);
      this.styleSheets.set(componentName, styleSheet);
      return styleSheet;
    } else {
      // Fallback for older browsers - this won't be cached but works
      throw new Error('Constructable StyleSheets not supported. Use fallback method.');
    }
  }

  /**
   * Apply styles to a shadow root using constructable stylesheets
   */
  static applyStyles(shadowRoot: ShadowRoot, componentName: string, cssText: string): void {
    try {
      const styleSheet = this.getStyleSheet(componentName, cssText);
      shadowRoot.adoptedStyleSheets = [styleSheet];
    } catch {
      // Fallback to traditional <style> element
      this.applyStylesFallback(shadowRoot, cssText);
    }
  }

  /**
   * Fallback method for browsers that don't support constructable stylesheets
   */
  static applyStylesFallback(shadowRoot: ShadowRoot, cssText: string): void {
    const style = document.createElement('style');
    style.textContent = cssText;
    shadowRoot.appendChild(style);
  }
}
