import type { Compiler } from './Compiler';

type Handler = (
  input: string,
  startIndex: number
) => { tokens?: any[]; endIndex?: number } | void;

export class ParserESC {
  private handlerMap = new Map<string, Handler>();

  constructor(private compiler: Compiler) {
    this.init();
  }

  private init() {
    this.register('7', () => {
      // todo
      // return {
      //   tokens: [
      //     {
      //       type: 'SC',
      //     },
      //   ],
      // };
    });

    this.register('8', () => {
      // TODO
      // return {
      //   tokens: [
      //     {
      //       type: 'RC',
      //     },
      //   ],
      // };
    });

    this.register('#', (input, startIndex) => {
      const current = input[startIndex];
      if (current === '8') {
        return {
          tokens: [
            {
              type: 'DECALN',
            },
          ],
          endIndex: startIndex + 1,
        };
      }
    });

    this.register('D', () => {
      this.compiler.setCursor(this.compiler.rowIndex + 1);
    });

    this.register('E', () => {
      this.compiler.setCursor(this.compiler.rowIndex + 1, 0);
    });

    this.register('H', () => {
      // TODO 	在当前光标位置放置一个制表位。
      // return {
      //   tokens: [
      //     {
      //       type: 'HTS',
      //     },
      //   ],
      // };
    });

    this.register('M', () => {
      this.compiler.setCursor(this.compiler.rowIndex - 1);
    });

    this.register('P', () => {
      // TODO
      // return {
      //   tokens: [
      //     {
      //       type: 'DCS',
      //     },
      //   ],
      // };
    });

    this.register('[', (...args) => this.compiler.parserCSI.write(...args));

    this.register('\\', () => {
      // TODO
      // return {
      //   tokens: [
      //     {
      //       type: 'ST',
      //     },
      //   ],
      // };
    });

    this.register(']', (...args) => this.compiler.parserOSC.write(...args));

    this.register('^', (...args) => this.compiler.parserPM.write(...args));

    this.register('_', (...args) => this.compiler.parserAPC.write(...args));
  }

  private register(code: string, handler: Handler) {
    this.handlerMap.set(code, handler);
  }

  public write(input: string, startIndex: number) {
    const current = input[startIndex];
    startIndex++;
    const handler = this.handlerMap.get(current);
    if (handler) {
      const result = handler(input, startIndex);
      return result;
    }
  }
}
