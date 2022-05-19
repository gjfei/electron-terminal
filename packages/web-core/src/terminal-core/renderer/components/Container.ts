import BaseComponent from './BaseComponent';

export default class Container extends BaseComponent {
  constructor(canvasCtx: CanvasRenderingContext2D, props: Record<string, any>) {
    super(canvasCtx, props);
  }
}
