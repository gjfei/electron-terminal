import { C0 } from './constants';
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
      return {
        tokens: [
          {
            type: 'SC',
          },
        ],
      };
    });

    this.register('8', () => {
      return {
        tokens: [
          {
            type: 'RC',
          },
        ],
      };
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
      return {
        tokens: [
          {
            type: 'IND',
          },
        ],
      };
    });

    this.register('E', () => {
      return {
        tokens: [
          {
            type: 'NEL',
          },
        ],
      };
    });

    this.register('H', () => {
      return {
        tokens: [
          {
            type: 'HTS',
          },
        ],
      };
    });

    this.register('M', () => {
      return {
        tokens: [
          {
            type: 'IR',
          },
        ],
      };
    });

    this.register('P', () => {
      return {
        tokens: [
          {
            type: 'DCS',
          },
        ],
      };
    });

    this.register('[', (...args) => this.compiler.parserCSI.write(...args));

    this.register('\\', () => {
      return {
        tokens: [
          {
            type: 'ST',
          },
        ],
      };
    });

    this.register(']', (input, startIndex) => {
      const current = input[startIndex];
      if (Number(current) >= 0 || Number(current) <= 4) {
        if (input[startIndex + 1] === ';') {
          let type;

          switch (current) {
            case '0':
              return this.parserTitle(input, startIndex + 2);
            case '1':
              type = 'SET ICON NAME';
              break;
            case '2':
              type = 'SET FRAME TITLE';
              break;
            case '4':
              type = 'CHANGE COLOR';
              break;
          }

          return {
            tokens: [
              {
                type,
              },
            ],
            endIndex: startIndex + 2,
          };
        }
      }
    });

    this.register('^', () => {
      return {
        tokens: [
          {
            type: 'PM',
          },
        ],
      };
    });

    this.register('_', () => {
      return {
        tokens: [
          {
            type: 'APC',
          },
        ],
      };
    });
  }

  private parserTitle(input: string, startIndex: number) {
    let title = '';
    while (startIndex < input.length) {
      const current = input[startIndex];
      startIndex++;
      switch (current) {
        case C0.BEL:
          this.compiler.setTitle(title);
          return {
            endIndex: startIndex,
          };
        default:
          title += current;
      }
    }
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
