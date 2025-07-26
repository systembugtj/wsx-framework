# RFC 0006: Light DOM Components in WSX Framework

- **Status**: Implemented
- **Type**: Feature
- **Start Date**: 2025-01-26
- **Author**: WSX Team  

## Summary

This RFC proposes the addition of Light DOM components to the WSX Framework as a complementary approach to the existing Shadow DOM components. Light DOM components enable seamless integration with third-party libraries that require direct DOM access, such as EditorJS, while maintaining the component-based architecture and developer experience of WSX.

## Motivation

The WSX Framework currently uses Shadow DOM exclusively for component encapsulation. While Shadow DOM provides excellent style isolation and encapsulation, it creates barriers when integrating with third-party libraries that:

1. Use global DOM queries (`document.querySelector`)
2. Inject styles into the document head
3. Create floating UI elements (tooltips, popovers, modals)
4. Require access to parent DOM elements
5. Rely on event bubbling across the entire document

### Real-World Example: EditorJS Integration

EditorJS, a popular block-style editor, failed to function properly within Shadow DOM components because:
- Its toolbar/popover system uses `document.querySelector` to find elements
- Floating UI elements are positioned relative to the document body
- Event handlers expect to traverse the entire DOM tree
- Plugin system assumes direct DOM access

## Design Overview

### Core Concept

Light DOM components render directly into the host element without creating a shadow root, while still providing:
- Component lifecycle management
- JSX rendering support
- Reactive state management
- Scoped styling capabilities
- TypeScript type safety

### Architecture

```typescript
// Base class for Light DOM components
export abstract class LightComponent extends HTMLElement {
    // Lifecycle methods matching WebComponent
    abstract render(): HTMLElement;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    
    // Reactive state management
    protected reactive<T extends object>(obj: T): T;
    protected useState<T>(key: string, initialValue: T): [() => T, (value: T) => void];
    
    // Scoped styling
    private applyScopedStyles(styleName: string, cssText: string): void;
}
```

## Implementation Details

### 1. Rendering Strategy

Light DOM components render JSX directly into the host element:

```typescript
connectedCallback(): void {
    // Apply scoped styles
    if (this.config.styles) {
        this.applyScopedStyles(this.config.styleName, this.config.styles);
    }
    
    // Render JSX content to Light DOM
    const content = this.render();
    this.appendChild(content);
    
    // Call lifecycle hook
    this.onConnected?.();
}
```

### 2. Style Scoping

Without Shadow DOM isolation, styles are scoped using data attributes:

```typescript
private applyScopedStyles(styleName: string, cssText: string): void {
    // Check for existing styles to prevent duplication
    const existingStyle = this.querySelector(`style[data-wsx-light-component="${styleName}"]`);
    if (existingStyle) return;
    
    // Create and inject scoped style element
    const styleElement = document.createElement("style");
    styleElement.setAttribute("data-wsx-light-component", styleName);
    styleElement.textContent = cssText;
    
    // Insert as first child for priority
    this.insertBefore(styleElement, this.firstChild);
}
```

### 3. DOM Query Methods

Provide familiar query methods that work within the component:

```typescript
public querySelector<T extends HTMLElement>(selector: string): T | null {
    return HTMLElement.prototype.querySelector.call(this, selector) as T | null;
}

public querySelectorAll<T extends HTMLElement>(selector: string): NodeListOf<T> {
    return HTMLElement.prototype.querySelectorAll.call(this, selector) as NodeListOf<T>;
}
```

### 4. Configuration

Components specify Light DOM usage through configuration:

```typescript
@autoRegister()
export class MyLightComponent extends LightComponent {
    constructor() {
        super({
            styles: componentStyles,
            styleName: "my-light-component",
            lightDOM: true  // Explicit Light DOM flag
        });
    }
}
```

## Usage Patterns

### Basic Light DOM Component

```typescript
/** @jsxImportSource @wsxjs/wsx-core */
import { LightComponent, autoRegister } from '@wsxjs/wsx-core';
import styles from './MyComponent.css?inline';

@autoRegister()
export class MyLightComponent extends LightComponent {
    constructor() {
        super({
            styles,
            styleName: "my-component"
        });
    }
    
    render() {
        return (
            <div class="my-component">
                <h1>Light DOM Component</h1>
                <slot></slot>
            </div>
        );
    }
}
```

### Integration with Third-Party Libraries

```typescript
@autoRegister()
export class EditorWrapper extends LightComponent {
    private editor?: EditorJS;
    
    render() {
        return (
            <div class="editor-wrapper">
                <div ref={el => this.editorContainer = el} />
            </div>
        );
    }
    
    onConnected() {
        // Third-party library can access DOM normally
        this.editor = new EditorJS({
            holder: this.editorContainer,
            // EditorJS works because it's in Light DOM
        });
    }
}
```

## Style Scoping Strategies

### 1. CSS Modules Pattern

```css
/* Component styles with unique prefixes */
.my-component__header {
    /* Scoped by convention */
}

.my-component__content {
    /* Avoids global conflicts */
}
```

### 2. Data Attribute Scoping

```typescript
// Automatically scope styles with data attributes
const scopedStyles = cssText.replace(/\.(\w+)/g, `[data-component="${componentId}"] .$1`);
```

### 3. CSS-in-JS Integration

```typescript
// Future: Runtime style generation
const styles = createStyles({
    header: {
        fontSize: '2em',
        color: theme.primary
    }
});
```

## Benefits

### 1. Third-Party Library Compatibility
- Seamless integration with libraries expecting standard DOM
- No workarounds needed for global queries or events
- Full access to document-level features

### 2. Progressive Enhancement
- Can be used alongside Shadow DOM components
- Choose the right tool for each use case
- Gradual migration path for existing applications

### 3. Performance
- No Shadow DOM boundary crossing overhead
- Direct DOM manipulation when needed
- Lighter weight for simple components

### 4. Developer Experience
- Same WSX development patterns
- TypeScript and JSX support
- Reactive state management
- Component lifecycle hooks

## Trade-offs

### 1. Style Isolation
- No automatic style encapsulation
- Requires discipline in CSS naming
- Potential for style conflicts

### 2. DOM Encapsulation
- Component internals are exposed
- External scripts can modify component DOM
- Less protection against unintended modifications

### 3. Global Namespace
- Component styles affect global scope
- Must manage CSS specificity carefully
- Naming collisions possible

## Migration Guide

### From Shadow DOM to Light DOM

```typescript
// Before: Shadow DOM component
export class MyComponent extends WebComponent {
    constructor() {
        super({ styles });
    }
}

// After: Light DOM component
export class MyComponent extends LightComponent {
    constructor() {
        super({ 
            styles,
            styleName: "my-component",
            lightDOM: true
        });
    }
}
```

### Handling Style Conflicts

1. Use unique class prefixes
2. Increase specificity with data attributes
3. Consider CSS Modules or PostCSS plugins
4. Use CSS custom properties for theming

## Best Practices

### 1. Component Design
- Use Light DOM only when necessary
- Document why Light DOM is required
- Minimize global style impact
- Provide clear component boundaries

### 2. Style Management
- Use consistent naming conventions
- Scope styles with component prefixes
- Avoid `!important` declarations
- Test style isolation thoroughly

### 3. Third-Party Integration
- Isolate third-party code in Light DOM wrappers
- Document external dependencies
- Handle cleanup in `disconnectedCallback`
- Test with multiple instances

### 4. Testing
- Test style isolation between components
- Verify third-party library functionality
- Check for memory leaks
- Test component lifecycle

## Future Considerations

### 1. Hybrid Components
- Components that can switch between Shadow and Light DOM
- Runtime detection of requirements
- Automatic adaptation based on context

### 2. Style Scoping Tools
- Build-time CSS transformation
- Runtime style isolation
- PostCSS plugin for automatic scoping
- CSS-in-JS integration

### 3. Developer Tools
- VSCode extensions for Light DOM components
- Linting rules for style conflicts
- Runtime warnings for global pollution
- Performance profiling tools

## Implementation Status

- ✅ Core `LightComponent` base class
- ✅ JSX rendering support
- ✅ Reactive state management
- ✅ Scoped style injection
- ✅ EditorJS integration example
- 🔄 Documentation and examples
- 📋 Additional third-party integrations
- 📋 Build-time style scoping tools

## Conclusion

Light DOM components provide a necessary escape hatch for scenarios where Shadow DOM's isolation becomes a barrier. By offering both Shadow DOM and Light DOM options, WSX Framework becomes more versatile while maintaining its core principles of component-based development, type safety, and excellent developer experience.

The addition of Light DOM components makes WSX suitable for a wider range of applications, from isolated widget development to complex integrations with existing libraries and frameworks.

## References

- [Web Components Specification](https://www.w3.org/TR/components-intro/)
- [Shadow DOM v1](https://developers.google.com/web/fundamentals/web-components/shadowdom)
- [Custom Elements v1](https://developers.google.com/web/fundamentals/web-components/customelements)
- [EditorJS Documentation](https://editorjs.io/)
- [WSX Framework Documentation](https://github.com/wsxjs/wsxjs)

## Appendix: Code Examples

### Complete Light DOM Component Example

```typescript
/** @jsxImportSource @wsxjs/wsx-core */
import { LightComponent, autoRegister, createLogger } from '@wsxjs/wsx-core';
import styles from './RichEditor.css?inline';

const logger = createLogger('RichEditor');

@autoRegister()
export class RichEditor extends LightComponent {
    private editor?: any;
    private content = '';
    
    constructor() {
        super({
            styles,
            styleName: 'rich-editor',
            lightDOM: true
        });
    }
    
    render() {
        return (
            <div class="rich-editor">
                <div class="toolbar">
                    <button onClick={this.save}>Save</button>
                    <button onClick={this.clear}>Clear</button>
                </div>
                <div 
                    class="editor-container"
                    ref={el => this.initializeEditor(el)}
                />
                <div class="status">
                    {this.content ? `${this.content.length} characters` : 'Empty'}
                </div>
            </div>
        );
    }
    
    private initializeEditor(container: HTMLElement) {
        if (!container || this.editor) return;
        
        // Third-party editor initialization
        this.editor = new SomeEditor({
            element: container,
            onChange: (content) => {
                this.content = content;
                this.rerender();
            }
        });
        
        logger.info('Editor initialized');
    }
    
    private save = () => {
        this.dispatchEvent(new CustomEvent('save', {
            detail: { content: this.content }
        }));
    };
    
    private clear = () => {
        this.editor?.clear();
        this.content = '';
        this.rerender();
    };
    
    disconnectedCallback() {
        super.disconnectedCallback();
        this.editor?.destroy();
    }
}
```

### Testing Light DOM Components

```typescript
import { RichEditor } from './RichEditor';

describe('RichEditor Light DOM Component', () => {
    let element: RichEditor;
    
    beforeEach(() => {
        element = new RichEditor();
        document.body.appendChild(element);
    });
    
    afterEach(() => {
        element.remove();
    });
    
    test('renders in light DOM', () => {
        expect(element.shadowRoot).toBeNull();
        expect(element.querySelector('.rich-editor')).toBeTruthy();
    });
    
    test('applies scoped styles', () => {
        const style = element.querySelector('style[data-wsx-light-component]');
        expect(style).toBeTruthy();
        expect(style?.getAttribute('data-wsx-light-component')).toBe('rich-editor');
    });
    
    test('integrates with third-party library', () => {
        const container = element.querySelector('.editor-container');
        expect(container?.querySelector('.third-party-element')).toBeTruthy();
    });
});
```
