/**
 * WSX Slot 功能单元测试
 * 验证 WSX 框架的 slot 支持和功能
 */

import { WebComponent } from '../WebComponent';
import { autoRegister } from '../auto-register';
import { h } from '../jsx-factory';

// 测试用的 Slot 组件
@autoRegister({ tagName: 'test-slot-component' })
class TestSlotComponent extends WebComponent {
  constructor() {
    super({
      styleName: 'test-slot-component',
      styles: `
                .slot-container {
                    display: block;
                    padding: 10px;
                }
                .default-slot {
                    border: 1px solid #ccc;
                    padding: 5px;
                    margin: 5px 0;
                }
                .named-slot {
                    border: 1px solid #666;
                    padding: 5px;
                    margin: 5px 0;
                    background: #f0f0f0;
                }
                ::slotted(.test-content) {
                    color: blue;
                }
                ::slotted([slot="header"]) {
                    font-weight: bold;
                    color: red;
                }
            `,
    });
  }

  render(): HTMLElement {
    return h(
      'div',
      { className: 'slot-container' },
      h('div', { className: 'header-area' }, h('slot', { name: 'header' })),
      h('div', { className: 'default-slot' }, h('slot', null)),
      h('div', { className: 'named-slot' }, h('slot', { name: 'footer' }))
    );
  }
}

// 另一个测试组件 - 多个默认 slot
@autoRegister({ tagName: 'test-multi-slot-component' })
class TestMultiSlotComponent extends WebComponent {
  constructor() {
    super({
      styleName: 'test-multi-slot-component',
    });
  }

  render(): HTMLElement {
    return h(
      'div',
      { className: 'multi-container' },
      h('section', { className: 'section-1' }, h('slot', null)),
      h('section', { className: 'section-2' }, h('slot', { name: 'special' })),
      h('section', { className: 'section-3' }, h('slot', null))
    );
  }
}

describe('WSX Slot 功能测试', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  describe('基础 Slot 功能', () => {
    it('应该支持默认 slot', () => {
      const component = new TestSlotComponent();

      // 添加默认 slot 内容
      const defaultContent = document.createElement('p');
      defaultContent.textContent = '默认 slot 内容';
      component.appendChild(defaultContent);

      container.appendChild(component);

      // 验证默认 slot 内容被正确渲染
      const slotElement = component.shadowRoot?.querySelector('slot:not([name])');
      expect(slotElement).toBeTruthy();

      // 检查 slotted 内容
      const assignedNodes = (slotElement as HTMLSlotElement)?.assignedNodes();
      expect(assignedNodes).toHaveLength(1);
      expect(assignedNodes[0].textContent).toBe('默认 slot 内容');
    });

    it('应该支持命名 slot', () => {
      const component = new TestSlotComponent();

      // 添加命名 slot 内容
      const headerContent = document.createElement('h1');
      headerContent.setAttribute('slot', 'header');
      headerContent.textContent = 'Header 内容';
      component.appendChild(headerContent);

      const footerContent = document.createElement('div');
      footerContent.setAttribute('slot', 'footer');
      footerContent.textContent = 'Footer 内容';
      component.appendChild(footerContent);

      container.appendChild(component);

      // 验证命名 slot 内容
      const headerSlot = component.shadowRoot?.querySelector(
        'slot[name="header"]'
      ) as HTMLSlotElement;
      const footerSlot = component.shadowRoot?.querySelector(
        'slot[name="footer"]'
      ) as HTMLSlotElement;

      expect(headerSlot).toBeTruthy();
      expect(footerSlot).toBeTruthy();

      expect(headerSlot.assignedNodes()[0].textContent).toBe('Header 内容');
      expect(footerSlot.assignedNodes()[0].textContent).toBe('Footer 内容');
    });

    it('应该支持混合 slot 内容', () => {
      const component = new TestSlotComponent();

      // 添加多种类型的内容
      const headerEl = document.createElement('span');
      headerEl.setAttribute('slot', 'header');
      headerEl.textContent = '标题';
      component.appendChild(headerEl);

      const defaultEl1 = document.createElement('p');
      defaultEl1.textContent = '默认内容1';
      component.appendChild(defaultEl1);

      const defaultEl2 = document.createElement('div');
      defaultEl2.textContent = '默认内容2';
      component.appendChild(defaultEl2);

      const footerEl = document.createElement('small');
      footerEl.setAttribute('slot', 'footer');
      footerEl.textContent = '底部';
      component.appendChild(footerEl);

      container.appendChild(component);

      // 验证各个 slot
      const headerSlot = component.shadowRoot?.querySelector(
        'slot[name="header"]'
      ) as HTMLSlotElement;
      const defaultSlot = component.shadowRoot?.querySelector(
        'slot:not([name])'
      ) as HTMLSlotElement;
      const footerSlot = component.shadowRoot?.querySelector(
        'slot[name="footer"]'
      ) as HTMLSlotElement;

      expect(headerSlot.assignedNodes()).toHaveLength(1);
      expect(defaultSlot.assignedNodes()).toHaveLength(2);
      expect(footerSlot.assignedNodes()).toHaveLength(1);

      expect(headerSlot.assignedNodes()[0].textContent).toBe('标题');
      expect(defaultSlot.assignedNodes()[0].textContent).toBe('默认内容1');
      expect(defaultSlot.assignedNodes()[1].textContent).toBe('默认内容2');
      expect(footerSlot.assignedNodes()[0].textContent).toBe('底部');
    });
  });

  describe('Slot 事件和交互', () => {
    it('应该正确处理 slotchange 事件', () => {
      const component = new TestSlotComponent();
      container.appendChild(component);

      const defaultSlot = component.shadowRoot?.querySelector(
        'slot:not([name])'
      ) as HTMLSlotElement;
      const slotChangeHandler = jest.fn();
      defaultSlot.addEventListener('slotchange', slotChangeHandler);

      // 动态添加内容应该触发 slotchange
      const newContent = document.createElement('div');
      newContent.textContent = '新内容';
      component.appendChild(newContent);

      // 等待事件触发
      return new Promise((resolve) => {
        setTimeout(() => {
          expect(slotChangeHandler).toHaveBeenCalled();
          resolve(void 0);
        }, 0);
      });
    });

    it('应该支持动态修改 slot 内容', () => {
      const component = new TestSlotComponent();

      const content = document.createElement('p');
      content.textContent = '原始内容';
      component.appendChild(content);

      container.appendChild(component);

      const defaultSlot = component.shadowRoot?.querySelector(
        'slot:not([name])'
      ) as HTMLSlotElement;
      expect(defaultSlot.assignedNodes()[0].textContent).toBe('原始内容');

      // 修改内容
      content.textContent = '修改后的内容';
      expect(defaultSlot.assignedNodes()[0].textContent).toBe('修改后的内容');
    });

    it('应该支持动态切换 slot 属性', () => {
      const component = new TestSlotComponent();

      const content = document.createElement('div');
      content.textContent = '可移动内容';
      component.appendChild(content);

      container.appendChild(component);

      // 初始在默认 slot
      const defaultSlot = component.shadowRoot?.querySelector(
        'slot:not([name])'
      ) as HTMLSlotElement;
      const headerSlot = component.shadowRoot?.querySelector(
        'slot[name="header"]'
      ) as HTMLSlotElement;

      expect(defaultSlot.assignedNodes()).toHaveLength(1);
      expect(headerSlot.assignedNodes()).toHaveLength(0);

      // 移动到 header slot
      content.setAttribute('slot', 'header');

      // 需要等待浏览器更新 slot 分配
      return new Promise((resolve) => {
        setTimeout(() => {
          expect(defaultSlot.assignedNodes()).toHaveLength(0);
          expect(headerSlot.assignedNodes()).toHaveLength(1);
          expect(headerSlot.assignedNodes()[0].textContent).toBe('可移动内容');
          resolve(void 0);
        }, 0);
      });
    });
  });

  describe('多 Slot 场景', () => {
    it('应该正确处理多个默认 slot', () => {
      const component = new TestMultiSlotComponent();

      const content1 = document.createElement('div');
      content1.textContent = '内容1';
      component.appendChild(content1);

      const content2 = document.createElement('div');
      content2.textContent = '内容2';
      component.appendChild(content2);

      const specialContent = document.createElement('div');
      specialContent.setAttribute('slot', 'special');
      specialContent.textContent = '特殊内容';
      component.appendChild(specialContent);

      container.appendChild(component);

      // 验证 special slot
      const specialSlot = component.shadowRoot?.querySelector(
        'slot[name="special"]'
      ) as HTMLSlotElement;
      expect(specialSlot.assignedNodes()).toHaveLength(1);
      expect(specialSlot.assignedNodes()[0].textContent).toBe('特殊内容');

      // 验证默认 slot（注意：在 Web Components 中，只有第一个默认 slot 会接收到内容）
      const defaultSlots = component.shadowRoot?.querySelectorAll(
        'slot:not([name])'
      ) as NodeListOf<HTMLSlotElement>;
      expect(defaultSlots).toHaveLength(2);

      // 只有第一个默认 slot 应该包含分配的内容
      expect(defaultSlots[0].assignedNodes()).toHaveLength(2);
      expect(defaultSlots[1].assignedNodes()).toHaveLength(0);

      // 验证第一个 slot 的内容
      expect(defaultSlots[0].assignedNodes()[0].textContent).toBe('内容1');
      expect(defaultSlots[0].assignedNodes()[1].textContent).toBe('内容2');
    });
  });

  describe('Slot 错误处理', () => {
    it('应该优雅处理空 slot', () => {
      const component = new TestSlotComponent();
      container.appendChild(component);

      // 所有 slot 都应该存在，即使没有内容
      const headerSlot = component.shadowRoot?.querySelector(
        'slot[name="header"]'
      ) as HTMLSlotElement;
      const defaultSlot = component.shadowRoot?.querySelector(
        'slot:not([name])'
      ) as HTMLSlotElement;
      const footerSlot = component.shadowRoot?.querySelector(
        'slot[name="footer"]'
      ) as HTMLSlotElement;

      expect(headerSlot).toBeTruthy();
      expect(defaultSlot).toBeTruthy();
      expect(footerSlot).toBeTruthy();

      expect(headerSlot.assignedNodes()).toHaveLength(0);
      expect(defaultSlot.assignedNodes()).toHaveLength(0);
      expect(footerSlot.assignedNodes()).toHaveLength(0);
    });

    it('应该忽略不存在的命名 slot', () => {
      const component = new TestSlotComponent();

      const content = document.createElement('div');
      content.setAttribute('slot', 'nonexistent');
      content.textContent = '孤儿内容';
      component.appendChild(content);

      container.appendChild(component);

      // 不存在的命名 slot 内容不应该在任何 slot 中显示
      const allSlots = component.shadowRoot?.querySelectorAll(
        'slot'
      ) as NodeListOf<HTMLSlotElement>;
      let totalAssigned = 0;
      allSlots.forEach((slot) => {
        totalAssigned += slot.assignedNodes().length;
      });

      expect(totalAssigned).toBe(0);
    });
  });
});
