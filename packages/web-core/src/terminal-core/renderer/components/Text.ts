import BaseComponent from './BaseComponent';
export default class Text extends BaseComponent {
  constructor(canvasCtx: CanvasRenderingContext2D, props: Record<string, any>) {
    super(canvasCtx, props);
  }

  draw() {
    const { text } = this.props;
    this.canvasCtx.font = '30px sans-serif';
    this.canvasCtx.fillText(text, 0, 40);
    this.canvasCtx.fillText(text, 0, 40);
  }
}
