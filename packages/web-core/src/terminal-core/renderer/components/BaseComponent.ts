export default class BaseComponent {
  canvasCtx: CanvasRenderingContext2D;
  props: Record<string, any>;
  children: BaseComponent[] = [];
  constructor(canvasCtx: CanvasRenderingContext2D, props: Record<string, any>) {
    this.canvasCtx = canvasCtx;
    this.props = props;
  }

  addChild(child: BaseComponent) {
    child.draw();
    this.children.push(child);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  draw() {}
}
