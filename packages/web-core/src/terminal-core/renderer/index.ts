import { createRenderer, defineComponent, h } from '@vue/runtime-core';
import { Text, Container } from './components';
import Test from './Test.vue';
let canvasCtx: CanvasRenderingContext2D;
const renderer = createRenderer({
  createElement(type, isSVG, isCustomizedBuiltIn, props) {
    const element = new Text(canvasCtx, props);
    // switch (type) {
    //   case 'Text':
    //     element = new Text(type);
    //     break;
    // }

    return element;
  },

  setElementText(node, text) {
    const cText = new Text(text);
    node.addChild(cText);
  },

  createText(text) {
    return new Text(canvasCtx, { text });
  },

  patchProp(el, key, prevValue, nextValue) {},

  insert(el, parent) {
    parent.addChild(el);
  },
  // 新加
  // 处理注释
  createComment() {},
  // 获取父节点
  parentNode() {},
  // 获取兄弟节点
  nextSibling() {},
  // 删除节点时调用
  remove(el) {
    const parent = el.parent;
    if (parent) {
      parent.removeChild(el);
    }
  },
});

const rootComponent = defineComponent({
  setup() {
    return;
  },
  render() {
    return h('Text', {
      text: 'Hello World WorldWorldWorldWorldWorldWorld',
    });
  },
});

export const createApp = (root: HTMLElement) => {
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 200;
  root.appendChild(canvas);
  canvasCtx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const app = renderer.createApp(Test);
  app.mount(new Container(canvasCtx));
};
