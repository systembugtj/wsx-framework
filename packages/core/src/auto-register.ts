/**
 * Auto-registration decorator and utilities for web components
 *
 * Provides decorator-based auto-registration for web components
 * to eliminate manual customElements.define() calls.
 */

/**
 * Auto-registration options for web components
 */
export interface AutoRegistrationOptions {
    tagName?: string; // Custom tag name, if not provided, derives from class name
    prefix?: string; // Prefix for tag name (e.g., "my-" -> "my-component")
}

/**
 * Auto-register decorator for web components
 * Usage: @autoRegister() or @autoRegister({ tagName: "custom-name" })
 *
 * @example
 * ```typescript
 * @autoRegister()
 * class MyButton extends WebComponent {
 *   // Will be registered as "my-button-component"
 * }
 *
 * @autoRegister({ tagName: "custom-button" })
 * class MyButton extends WebComponent {
 *   // Will be registered as "custom-button"
 * }
 *
 * @autoRegister({ prefix: "ui-" })
 * class MyButton extends WebComponent {
 *   // Will be registered as "ui-my-button-component"
 * }
 * ```
 */
export function autoRegister(options: AutoRegistrationOptions = {}) {
    return function <T extends CustomElementConstructor>(constructor: T): T {
        const tagName = options.tagName || deriveTagName(constructor.name, options.prefix);

        if (!customElements.get(tagName)) {
            customElements.define(tagName, constructor);
        }

        return constructor;
    };
}

/**
 * Static method to auto-register a web component class
 * Usage: registerComponent(MyComponent) or registerComponent(MyComponent, { tagName: "custom-name" })
 *
 * @example
 * ```typescript
 * class MyButton extends WebComponent {
 *   // ...
 * }
 *
 * registerComponent(MyButton); // Registers as "my-button-component"
 * registerComponent(MyButton, { tagName: "custom-button" }); // Registers as "custom-button"
 * ```
 */
export function registerComponent<T extends CustomElementConstructor>(
    constructor: T,
    options: AutoRegistrationOptions = {}
): void {
    const tagName = options.tagName || deriveTagName(constructor.name, options.prefix);

    if (!customElements.get(tagName)) {
        customElements.define(tagName, constructor);
    }
}

/**
 * Derive tag name from class name
 * Converts PascalCase to kebab-case and adds optional prefix
 * Ensures valid custom element name (must contain hyphen)
 *
 * @param className - The class name to convert
 * @param prefix - Optional prefix to add
 * @returns Valid custom element tag name
 *
 * @example
 * ```typescript
 * deriveTagName("MyButton") // "my-button-component"
 * deriveTagName("HTMLEditor") // "htmleditor-component"
 * deriveTagName("Button") // "button-component"
 * deriveTagName("MyButton", "ui-") // "ui-my-button-component"
 * ```
 */
function deriveTagName(className: string, prefix?: string): string {
    // Convert PascalCase to kebab-case
    let kebabCase = className.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

    // Ensure the tag name contains at least one hyphen (custom element requirement)
    if (!kebabCase.includes("-")) {
        kebabCase = `${kebabCase}-component`;
    }

    return prefix ? `${prefix}${kebabCase}` : kebabCase;
}

/**
 * Register all components in a module
 * Useful for bulk registration of multiple components
 *
 * @param components - Object containing component classes
 * @param options - Default options to apply to all components
 *
 * @example
 * ```typescript
 * import * as Components from './components';
 *
 * registerAll(Components, { prefix: "ui-" });
 * ```
 */
export function registerAll(
    components: Record<string, CustomElementConstructor>,
    options: AutoRegistrationOptions = {}
): void {
    Object.values(components).forEach((component) => {
        if (typeof component === "function" && component.prototype instanceof HTMLElement) {
            registerComponent(component, options);
        }
    });
}

/**
 * Check if a component is already registered
 *
 * @param tagName - The tag name to check
 * @returns True if the component is registered
 */
export function isRegistered(tagName: string): boolean {
    return !!customElements.get(tagName);
}

/**
 * Get the tag name that would be generated for a class
 * Useful for testing or debugging
 *
 * @param className - The class name
 * @param options - Registration options
 * @returns The generated tag name
 */
export function getTagName(className: string, options: AutoRegistrationOptions = {}): string {
    return options.tagName || deriveTagName(className, options.prefix);
}
