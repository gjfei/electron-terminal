import { cloneDeep } from 'lodash-es';
import { C0, C1 } from './constants';
import { ParserCSI } from './ParserCSI';
import { ParserESC } from './ParserESC';
import { ParserSGR } from './ParserSGR';

type Handler = (
  input: string,
  startIndex: number
) => { tokens?: any[]; endIndex?: number } | void;

export class Compiler {
  private handlerMap = new Map<string, Handler>();
  public parserSGR = new ParserSGR(this);
  public parserCSI = new ParserCSI(this);
  public parserESC = new ParserESC(this);

  private buffer: any[][] = [[]];
  private rowIndex = 0;
  private cellIndex = 0;
  private currentRow = this.buffer[this.rowIndex];

  constructor() {
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
      return {
        tokens: [
          {
            type: 'BS',
          },
        ],
      };
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

    this.register(C0.LF, () => {
      this.addRow();
    });

    this.register(C0.VT, () => {
      return {
        tokens: [
          {
            type: 'VT',
          },
        ],
      };
    });

    this.register(C0.FF, () => {
      return {
        tokens: [
          {
            type: 'FF',
          },
        ],
      };
    });

    this.register(C0.CR, () => {
      this.cellIndex = 0;
    });

    this.register(C0.SO, () => {
      return {
        tokens: [
          {
            type: 'SO',
          },
        ],
      };
    });

    this.register(C0.SI, () => {
      return {
        tokens: [
          {
            type: 'SI',
          },
        ],
      };
    });
    this.register(C0.ESC, (...args) => this.parserESC.write(...args));
  }

  private registerC1() {
    this.register(C1.IND, () => {
      return {
        tokens: [
          {
            type: 'IND',
          },
        ],
      };
    });

    this.register(C1.NEL, () => {
      return {
        tokens: [
          {
            type: 'NEL',
          },
        ],
      };
    });

    this.register(C1.HTS, () => {
      return {
        tokens: [
          {
            type: 'HTS',
          },
        ],
      };
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
      return {
        tokens: [
          {
            type: 'ST',
          },
        ],
      };
    });

    this.register(C1.OSC, () => {
      return {
        tokens: [
          {
            type: 'OSC',
          },
        ],
      };
    });

    this.register(C1.PM, () => {
      return {
        tokens: [
          {
            type: 'PM',
          },
        ],
      };
    });

    this.register(C1.APC, () => {
      return {
        tokens: [
          {
            type: 'APC',
          },
        ],
      };
    });
  }

  private register(code: string, handler: Handler) {
    this.handlerMap.set(code, handler);
  }

  public setTitle(title: string) {
    console.log('setTitle', title);
  }

  public eraseInDisplay(code: string) {
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
        this.buffer = [[]];
        this.rowIndex = 0;
        this.cellIndex = 0;
        this.currentRow = this.buffer[this.rowIndex];
        this.scrollTop();
        break;
    }
  }

  // TODO 回滚
  public scrollTop() {
    console.log('回到顶部');
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
  }

  private addRow() {
    this.setCursor(this.rowIndex + 1, 0);
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
        const { tokens: _tokens = [], endIndex = startIndex } = result || {};
        startIndex = endIndex;
        continue;
      }
      this.addCell(current);
    }
    return this.buffer;
  }
}
