import { noop } from 'lodash-es';
import { C0, C1 } from './constants';
import { ParserCSI } from './ParserCSI';
import { ParserESC } from './ParserESC';
import { ParserSGR } from './ParserSGR';
import { ParserOSC } from './ParserOSC';
import { ParserPM } from './ParserPM';
import { ParserAPC } from './ParserAPC';

type Handler = (
  input: string,
  startIndex: number
) => { tokens?: any[]; endIndex?: number } | void;

type CompilerOptions = {
  setTitle: (title: string) => void;
  scrollTop: () => void;
};

const defaultOptions: CompilerOptions = {
  setTitle: noop,
  scrollTop: noop,
};

export class Compiler {
  private handlerMap = new Map<string, Handler>();
  private cacheBuffer: any[][] = [];
  private buffer: any[][] = [[]];
  private termialConfig: Record<string, any> = {};
  private privateTermialConfig: Record<string, any> = {};
  // 修改为get 获取
  public rowIndex = 0;
  public cellIndex = 0;
  public currentRow = this.buffer[this.rowIndex];

  public setTitle: CompilerOptions['setTitle'] = noop;
  public scrollTop: CompilerOptions['scrollTop'] = noop;

  public parserSGR = new ParserSGR(this);
  public parserCSI = new ParserCSI(this);
  public parserESC = new ParserESC(this);
  public parserOSC = new ParserOSC(this);
  public parserPM = new ParserPM(this);
  public parserAPC = new ParserAPC(this);

  constructor(rawOptions: CompilerOptions = defaultOptions) {
    const { setTitle, scrollTop } = { ...defaultOptions, ...rawOptions };
    this.setTitle = setTitle;
    this.scrollTop = scrollTop;
    this.registerC0();
    this.registerC1();
  }

  private registerC0() {
    this.register(C0.NUL, () => {
      return {
        tokens: [
          {
            type: 'NUL',
          },
        ],
      };
    });

    this.register(C0.BEL, () => {
      return {
        tokens: [
          {
            type: 'BEL',
          },
        ],
      };
    });

    this.register(C0.BS, () => {
      const isStart = this.cellIndex === 0;
      const rowIndex = isStart ? this.rowIndex - 1 : this.rowIndex;
      const cellIndex = isStart
        ? this.buffer[rowIndex].length - 1
        : this.cellIndex - 1;
      this.setCursor(rowIndex, cellIndex);
    });

    this.register(C0.HT, () => {
      return {
        tokens: [
          {
            type: 'HT',
          },
        ],
      };
    });

    this.register(C0.LF, (input: string, startIndex: number) => {
      this.addRow();
    });

    this.register(C0.VT, () => {
      this.addRow();
    });

    this.register(C0.FF, () => {
      this.addRow();
    });

    this.register(C0.CR, () => {
      this.cellIndex = 0;
    });

    this.register(C0.SO, () => {
      // TODO
      // return {
      //   tokens: [
      //     {
      //       type: 'SO',
      //     },
      //   ],
      // };
    });

    this.register(C0.SI, () => {
      // TODO
      // return {
      //   tokens: [
      //     {
      //       type: 'SI',
      //     },
      //   ],
      // };
    });
    this.register(C0.ESC, (...args) => this.parserESC.write(...args));
  }

  private registerC1() {
    this.register(C1.IND, () => {
      this.setCursor(this.rowIndex + 1);
    });

    this.register(C1.NEL, () => {
      this.setCursor(this.rowIndex + 1, 0);
    });

    this.register(C1.HTS, () => {
      // TODO
      // return {
      //   tokens: [
      //     {
      //       type: 'HTS',
      //     },
      //   ],
      // };
    });

    this.register(C1.DCS, () => {
      return {
        tokens: [
          {
            type: 'DCS',
          },
        ],
      };
    });

    this.register(C1.CSI, (...args) => this.parserCSI.write(...args));

    this.register(C1.ST, () => {
      // todo
      // return {
      //   tokens: [
      //     {
      //       type: 'ST',
      //     },
      //   ],
      // };
    });

    this.register(C1.OSC, (...args) => this.parserOSC.write(...args));

    this.register(C1.PM, (...args) => this.parserPM.write(...args));

    this.register(C1.APC, (...args) => this.parserAPC.write(...args));
  }

  private register(code: string, handler: Handler) {
    this.handlerMap.set(code, handler);
  }

  public eraseInDisplay(code = '0') {
    switch (code) {
      case '0':
        // todo
        break;
      case '1':
        // todo
        break;
      case '2':
        // todo
        break;
      case '3':
        // this.buffer = [[]];
        // this.rowIndex = 0;
        // this.cellIndex = 0;
        // this.currentRow = this.buffer[this.rowIndex];
        // this.scrollTop();
        break;
    }
  }

  public eraseInLine(code = '0') {
    switch (code) {
      case '0':
        this.currentRow.splice(this.cellIndex, this.currentRow.length);
        break;
      case '1':
        this.currentRow.splice(0, this.cellIndex);
        break;
      case '2':
        this.buffer.pop();
        this.setCursor(
          this.rowIndex - 1,
          this.buffer[this.rowIndex - 1].length
        );
        break;
    }
  }

  // TODO 'DECSET';
  public setPrivateTermialConfig(code = '0', isReset = false) {
    console.log('setPrivateTermialConfig', code, isReset);
  }
  public setCursor(
    rowIndex: number = this.rowIndex,
    cellIndex: number = this.cellIndex
  ) {
    this.cellIndex = cellIndex;

    if (rowIndex !== this.rowIndex) {
      while (rowIndex > this.rowIndex) {
        if (!this.buffer[this.rowIndex]) {
          this.buffer[this.rowIndex] = [];
        }
        this.rowIndex++;
      }

      // 如果rowIndex 小于当前rowIndex，则不会进入while 循环，需要重置rowIndex
      this.rowIndex = rowIndex;
      if (!this.buffer[this.rowIndex]) {
        this.buffer[this.rowIndex] = [];
      }
      this.currentRow = this.buffer[this.rowIndex];
    }
    console.log('setCursor', this.rowIndex, this.cellIndex);
  }

  private addRow() {
    if (this.rowIndex + 1 >= 24) {
      // TODO 滚动
      this.cacheBuffer.push(this.buffer.shift()!);
      this.currentRow = this.buffer[this.rowIndex] = [];
      this.cellIndex = 0;
    } else {
      this.setCursor(this.rowIndex + 1, 0);
    }
  }

  private addCell(current: string) {
    this.currentRow[this.cellIndex] = {
      type: 'TEXT',
      value: current,
      styles: this.parserSGR.styles,
    };
    this.cellIndex++;
  }

  public write(input: string) {
    let startIndex = 0;
    while (startIndex < input.length) {
      const current = input[startIndex];
      startIndex++;
      const handler = this.handlerMap.get(current);
      if (handler) {
        const result = handler(input, startIndex);
        const { tokens, endIndex = startIndex } = result || {};
        if (tokens) {
          console.log(tokens[0]);
        }
        startIndex = endIndex;
        continue;
      }
      this.addCell(current);
    }
    return [...this.cacheBuffer, ...this.buffer];
  }
}
