import { createApp } from './renderer';
export class TerminalCore {
  constructor(root: HTMLElement) {
    createApp(root);
  }
}
