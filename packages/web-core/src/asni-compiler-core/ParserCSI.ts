import type { Compiler } from './Compiler';

type Handler = (
  input: string,
  startIndex: number,
  code?: string
) => { tokens?: any[]; endIndex?: number } | void;

export class ParserCSI {
  private buffer = [];
  private styles = [];
  private handlerMap = new Map<string, Handler>();

  constructor(private compiler: Compiler) {
    this.init();
  }

  private init() {
    this.register('@', (input, startIndex, code = '1') => {
      return {
        tokens: [
          {
            type: 'ICH',
            value: code,
          },
        ],
      };
    });

    this.register(' ', (input, startIndex, code = '1') => {
      const current = input[startIndex];
      const endIndex = startIndex + 1;
      if (current === '@') {
        return {
          tokens: [
            {
              type: 'SL',
              value: code,
            },
          ],
          endIndex,
        };
      }

      if (current === 'A') {
        return {
          tokens: [
            {
              type: 'SR',
              value: code,
            },
          ],
          endIndex,
        };
      }

      if (current === 'q') {
        return {
          tokens: [
            {
              type: 'DECSCUSR',
              value: code,
            },
          ],
          endIndex,
        };
      }
    });

    this.register('A', (input, startIndex, code = '1') => {
      return {
        tokens: [
          {
            type: 'CUU',
            value: code,
          },
        ],
      };
    });

    this.register('B', (input, startIndex, code = '1') => {
      return {
        tokens: [
          {
            type: 'CUD',
            value: code,
          },
        ],
      };
    });

    this.register('C', (input, startIndex, code = '1') => {
      return {
        tokens: [
          {
            type: 'CUF',
            value: code,
          },
        ],
      };
    });

    this.register('D', (input, startIndex, code = '1') => {
      return {
        tokens: [
          {
            type: 'CUB',
            value: code,
          },
        ],
      };
    });

    this.register('E', (input, startIndex, code = '1') => {
      return {
        tokens: [
          {
            type: 'CNL',
            value: code,
          },
        ],
      };
    });

    this.register('F', (input, startIndex, code = '1') => {
      return {
        tokens: [
          {
            type: 'CPL',
            value: code,
          },
        ],
      };
    });

    this.register('G', (input, startIndex, code = '1') => {
      return {
        tokens: [
          {
            type: 'CHA',
            value: code,
          },
        ],
      };
    });

    this.register('H', (input, startIndex, code = '1;1') => {
      const [y, x] = code.split(';');
      console.log('code', code);
      this.compiler.setCursor(Number(y) - 1, Number(x) - 1);
    });

    this.register('I', (input, startIndex, code = '1') => {
      return {
        tokens: [
          {
            type: 'CHT',
            value: code,
          },
        ],
      };
    });

    this.register('J', (input, startIndex, code = '0') => {
      this.compiler.eraseInDisplay(code);
      // return {
      //   tokens: [
      //     {
      //       type: 'ED',
      //       value: code,
      //     },
      //   ],
      // };
    });

    this.register('K', (input, startIndex, code = '1') => {
      return {
        tokens: [
          {
            type: 'EL',
            value: code,
          },
        ],
      };
    });

    this.register('L', (input, startIndex, code = '1') => {
      return {
        tokens: [
          {
            type: 'IL',
            value: code,
          },
        ],
      };
    });

    this.register('M', (input, startIndex, code = '1') => {
      return {
        tokens: [
          {
            type: 'DL',
            value: code,
          },
        ],
      };
    });

    this.register('P', (input, startIndex, code = '1') => {
      return {
        tokens: [
          {
            type: 'DCH',
            value: code,
          },
        ],
      };
    });

    this.register('S', (input, startIndex, code = '1') => {
      return {
        tokens: [
          {
            type: 'SU',
            value: code,
          },
        ],
      };
    });

    this.register('T', (input, startIndex, code = '1') => {
      return {
        tokens: [
          {
            type: 'SD',
            value: code,
          },
        ],
      };
    });

    this.register('X', (input, startIndex, code = '1') => {
      return {
        tokens: [
          {
            type: 'ECH',
            value: code,
          },
        ],
      };
    });

    this.register('Z', (input, startIndex, code = '1') => {
      return {
        tokens: [
          {
            type: 'CBT',
            value: code,
          },
        ],
      };
    });

    this.register('`', (input, startIndex, code = '1') => {
      return {
        tokens: [
          {
            type: 'HPA',
            value: code,
          },
        ],
      };
    });

    this.register('a', (input, startIndex, code = '1') => {
      return {
        tokens: [
          {
            type: 'HPR',
            value: code,
          },
        ],
      };
    });

    this.register('b', (input, startIndex, code = '1') => {
      return {
        tokens: [
          {
            type: 'REP',
            value: code,
          },
        ],
      };
    });

    this.register('c', () => {
      return {
        tokens: [
          {
            type: 'DA1',
          },
        ],
      };
    });

    this.register('>', (input, startIndex) => {
      const current = input[startIndex];
      if (current === 'c') {
        return {
          tokens: [
            {
              type: 'DA2',
            },
          ],
          endIndex: startIndex + 1,
        };
      }
    });

    this.register('d', (input, startIndex, code = '1') => {
      return {
        tokens: [
          {
            type: 'VPA',
            value: code,
          },
        ],
      };
    });

    this.register('e', (input, startIndex, code = '1') => {
      return {
        tokens: [
          {
            type: 'VPR',
            value: code,
          },
        ],
      };
    });

    this.register('f', (input, startIndex, code = '1;1') => {
      return {
        tokens: [
          {
            type: 'HVP',
            value: code,
          },
        ],
      };
    });

    this.register('g', (input, startIndex, code = '1') => {
      return {
        tokens: [
          {
            type: 'TBC',
            value: code,
          },
        ],
      };
    });

    this.register('h', (input, startIndex, code = '1;1') => {
      return {
        tokens: [
          {
            type: 'SM',
            value: code,
          },
        ],
      };
    });

    this.register('l', (input, startIndex, code = '1;1') => {
      return {
        tokens: [
          {
            type: 'RM',
            value: code,
          },
        ],
      };
    });

    this.register('m', (input, startIndex, code = '0') => {
      return this.compiler.parserSGR.write(input, startIndex, code);
    });

    this.register('n', (input, startIndex, code = '1') => {
      return {
        tokens: [
          {
            type: 'DSR',
            value: code,
          },
        ],
      };
    });

    this.register('r', (input, startIndex, code = '1;1') => {
      return {
        tokens: [
          {
            type: 'DECSTBM',
            value: code,
          },
        ],
      };
    });

    this.register('s', () => {
      return {
        tokens: [
          {
            type: 'SCOSC',
          },
        ],
      };
    });

    this.register('u', () => {
      return {
        tokens: [
          {
            type: 'SCORC',
          },
        ],
      };
    });

    this.register("'", (input, startIndex, code = '1') => {
      const current = input[startIndex];
      const endIndex = startIndex + 1;
      if (current === '}') {
        return {
          tokens: [
            {
              type: 'DECIC',
              value: code,
            },
          ],
          endIndex,
        };
      } else if (current === '~') {
        return {
          tokens: [
            {
              type: 'DECDC',
              value: code,
            },
          ],
          endIndex,
        };
      }
    });

    this.register('?', (input, startIndex) => {
      const len = input.length;
      let code = '';
      while (startIndex < len) {
        const current = input[startIndex];
        startIndex++;

        if (/\d/.test(current) || current === ';') {
          code += current;
          continue;
        }

        let type = '';

        switch (current) {
          case 'J':
            type = 'DECSED';
            code = code || '1';
            break;
          case 'K':
            code = code || '1';
            type = 'DECSEL';
            break;
          case 'h':
            code = code || '1;1';
            type = 'DECSET';
            break;
          case 'l':
            code = code || '1;1';
            type = 'DECRST';
            break;
          case 'n':
            code = code || '1';
            type = 'DECDSR';
            break;
        }

        if (type) {
          return {
            tokens: [
              {
                type,
                value: code,
              },
            ],
            endIndex: startIndex,
          };
        } else {
          break;
        }
      }
    });
  }

  private register(code: string, handler: Handler) {
    this.handlerMap.set(code, handler);
  }

  public write(input: string, startIndex: number) {
    const len = input.length;
    let code = '';
    while (startIndex < len) {
      const current = input[startIndex];
      startIndex++;
      if (/\d/.test(current) || current === ';') {
        code += current;
      } else {
        const handler = this.handlerMap.get(current);
        if (handler) {
          const result = handler(input, startIndex, code || undefined) || {};
          const { tokens, endIndex = startIndex } = result;
          return {
            tokens,
            endIndex,
          };
        }
        break;
      }
    }
  }
}
