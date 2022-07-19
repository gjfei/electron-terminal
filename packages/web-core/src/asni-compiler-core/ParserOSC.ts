import { C0, C1 } from './constants';
import type { Compiler } from './Compiler';

export class ParserOSC {
  constructor(private compiler: Compiler) {}

  private parserTitle(input: string, startIndex: number) {
    let title = '';
    while (startIndex < input.length) {
      const current = input[startIndex];
      startIndex++;
      switch (current) {
        case C0.BEL:
        case C1.ST:
          this.compiler.setTitle(title);
          return {
            endIndex: startIndex,
          };
        default:
          title += current;
      }
    }
  }

  public write(input: string, startIndex: number) {
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
  }
}
