import { CO, C1 } from './constants';

type TokenizerHandler = (
  input: string,
  startIndex: number
) => { tokens: any[]; endIndex?: number } | void;

const tokenizerHnalderMap = new Map<string | number, TokenizerHandler>();

const tokenizerRegister = (
  code: string | number,
  handler: TokenizerHandler
) => {
  tokenizerHnalderMap.set(code, handler);
};

type TokenizerCSIHandler = (
  input: string,
  startIndex: number,
  code?: string
) => { tokens: any[]; endIndex?: number } | void;

const TokenizerCSIHnalderMap = new Map<string | number, TokenizerCSIHandler>();

const parserRegisterCSI = (
  code: string | number,
  handler: TokenizerCSIHandler
) => {
  TokenizerCSIHnalderMap.set(code, handler);
};

const TokenizerESCHnalderMap = new Map<string | number, TokenizerHandler>();

const tokenizerRegisterESC = (
  code: string | number,
  handler: TokenizerHandler
) => {
  TokenizerESCHnalderMap.set(code, handler);
};

tokenizerRegister(CO.NUL, () => {
  return {
    tokens: [
      {
        type: 'NUL',
      },
    ],
  };
});

tokenizerRegister(CO.BEL, () => {
  return {
    tokens: [
      {
        type: 'BEL',
      },
    ],
  };
});

tokenizerRegister(CO.BS, () => {
  return {
    tokens: [
      {
        type: 'BS',
      },
    ],
  };
});

tokenizerRegister(CO.HT, () => {
  return {
    tokens: [
      {
        type: 'HT',
      },
    ],
  };
});

tokenizerRegister(CO.LF, () => {
  return {
    tokens: [
      {
        type: 'LF',
      },
    ],
  };
});

tokenizerRegister(CO.VT, () => {
  return {
    tokens: [
      {
        type: 'VT',
      },
    ],
  };
});

tokenizerRegister(CO.FF, () => {
  return {
    tokens: [
      {
        type: 'FF',
      },
    ],
  };
});

tokenizerRegister(CO.CR, () => {
  return {
    tokens: [
      {
        type: 'CR',
      },
    ],
  };
});

tokenizerRegister(CO.SO, () => {
  return {
    tokens: [
      {
        type: 'SO',
      },
    ],
  };
});

tokenizerRegister(CO.SI, () => {
  return {
    tokens: [
      {
        type: 'SI',
      },
    ],
  };
});

tokenizerRegisterESC('7', () => {
  return {
    tokens: [
      {
        type: 'SC',
      },
    ],
  };
});

tokenizerRegisterESC('8', () => {
  return {
    tokens: [
      {
        type: 'RC',
      },
    ],
  };
});

tokenizerRegisterESC('#', (input, startIndex) => {
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

tokenizerRegisterESC('D', () => {
  return {
    tokens: [
      {
        type: 'IND',
      },
    ],
  };
});

tokenizerRegisterESC('E', () => {
  return {
    tokens: [
      {
        type: 'NEL',
      },
    ],
  };
});

tokenizerRegisterESC('H', () => {
  return {
    tokens: [
      {
        type: 'HTS',
      },
    ],
  };
});

tokenizerRegisterESC('M', () => {
  return {
    tokens: [
      {
        type: 'IR',
      },
    ],
  };
});

tokenizerRegisterESC('P', (input, startIndex) => {
  return tokenizerHnalderMap.get(C1.DCS)!(input, startIndex);
});

tokenizerRegisterESC('[', (input, startIndex) => {
  return tokenizerHnalderMap.get(C1.CSI)!(input, startIndex);
});

tokenizerRegisterESC('\\', () => {
  return {
    tokens: [
      {
        type: 'ST',
      },
    ],
  };
});

tokenizerRegisterESC(']', (input, startIndex) => {
  const current = input[startIndex];
  if (Number(current) >= 0 || Number(current) <= 4) {
    if (input[startIndex + 1] === ';') {
      let type;

      switch (current) {
        case '0':
          type = 'SET WINDOW TITLE AND ICON NAME';
          break;
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

tokenizerRegisterESC('^', () => {
  return {
    tokens: [
      {
        type: 'PM',
      },
    ],
  };
});

tokenizerRegisterESC('_', () => {
  return {
    tokens: [
      {
        type: 'APC',
      },
    ],
  };
});

tokenizerRegister(CO.ESC, (input, startIndex) => {
  const current = input[startIndex];
  startIndex++;
  const handler = TokenizerESCHnalderMap.get(current);
  if (handler) {
    return handler(input, startIndex);
  }
});

tokenizerRegister(C1.IND, () => {
  return {
    tokens: [
      {
        type: 'IND',
      },
    ],
  };
});

tokenizerRegister(C1.NEL, () => {
  return {
    tokens: [
      {
        type: 'NEL',
      },
    ],
  };
});

tokenizerRegister(C1.HTS, () => {
  return {
    tokens: [
      {
        type: 'HTS',
      },
    ],
  };
});

tokenizerRegister(C1.DCS, () => {
  return {
    tokens: [
      {
        type: 'DCS',
      },
    ],
  };
});

parserRegisterCSI('@', (input, startIndex, code = '1') => {
  return {
    tokens: [
      {
        type: 'ICH',
        value: code,
      },
    ],
  };
});

parserRegisterCSI(' ', (input, startIndex, code = '1') => {
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

parserRegisterCSI('A', (input, startIndex, code = '1') => {
  return {
    tokens: [
      {
        type: 'CUU',
        value: code,
      },
    ],
  };
});

parserRegisterCSI('B', (input, startIndex, code = '1') => {
  return {
    tokens: [
      {
        type: 'CUD',
        value: code,
      },
    ],
  };
});

parserRegisterCSI('C', (input, startIndex, code = '1') => {
  return {
    tokens: [
      {
        type: 'CUF',
        value: code,
      },
    ],
  };
});

parserRegisterCSI('D', (input, startIndex, code = '1') => {
  return {
    tokens: [
      {
        type: 'CUB',
        value: code,
      },
    ],
  };
});

parserRegisterCSI('E', (input, startIndex, code = '1') => {
  return {
    tokens: [
      {
        type: 'CNL',
        value: code,
      },
    ],
  };
});

parserRegisterCSI('F', (input, startIndex, code = '1') => {
  return {
    tokens: [
      {
        type: 'CPL',
        value: code,
      },
    ],
  };
});

parserRegisterCSI('G', (input, startIndex, code) => {
  return {
    tokens: [
      {
        type: 'CHA',
        value: code,
      },
    ],
  };
});

parserRegisterCSI('H', (input, startIndex, code = '1;1') => {
  return {
    tokens: [
      {
        type: 'CUP',
        value: code,
      },
    ],
  };
});

parserRegisterCSI('I', (input, startIndex, code = '1') => {
  return {
    tokens: [
      {
        type: 'CHT',
        value: code,
      },
    ],
  };
});

parserRegisterCSI('J', (input, startIndex, code = '1') => {
  return {
    tokens: [
      {
        type: 'ED',
        value: code,
      },
    ],
  };
});

parserRegisterCSI('K', (input, startIndex, code = '1') => {
  return {
    tokens: [
      {
        type: 'EL',
        value: code,
      },
    ],
  };
});

parserRegisterCSI('L', (input, startIndex, code = '1') => {
  return {
    tokens: [
      {
        type: 'IL',
        value: code,
      },
    ],
  };
});

parserRegisterCSI('M', (input, startIndex, code = '1') => {
  return {
    tokens: [
      {
        type: 'DL',
        value: code,
      },
    ],
  };
});

parserRegisterCSI('P', (input, startIndex, code = '1') => {
  return {
    tokens: [
      {
        type: 'DCH',
        value: code,
      },
    ],
  };
});

parserRegisterCSI('S', (input, startIndex, code = '1') => {
  return {
    tokens: [
      {
        type: 'SU',
        value: code,
      },
    ],
  };
});

parserRegisterCSI('T', (input, startIndex, code = '1') => {
  return {
    tokens: [
      {
        type: 'SD',
        value: code,
      },
    ],
  };
});

parserRegisterCSI('X', (input, startIndex, code = '1') => {
  return {
    tokens: [
      {
        type: 'ECH',
        value: code,
      },
    ],
  };
});

parserRegisterCSI('Z', (input, startIndex, code = '1') => {
  return {
    tokens: [
      {
        type: 'CBT',
        value: code,
      },
    ],
  };
});

parserRegisterCSI('`', (input, startIndex, code = '1') => {
  return {
    tokens: [
      {
        type: 'HPA',
        value: code,
      },
    ],
  };
});

parserRegisterCSI('a', (input, startIndex, code = '1') => {
  return {
    tokens: [
      {
        type: 'HPR',
        value: code,
      },
    ],
  };
});

parserRegisterCSI('b', (input, startIndex, code = '1') => {
  return {
    tokens: [
      {
        type: 'REP',
        value: code,
      },
    ],
  };
});

parserRegisterCSI('c', () => {
  return {
    tokens: [
      {
        type: 'DA1',
      },
    ],
  };
});

parserRegisterCSI('>', (input, startIndex) => {
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

parserRegisterCSI('d', (input, startIndex, code = '1') => {
  return {
    tokens: [
      {
        type: 'VPA',
        value: code,
      },
    ],
  };
});

parserRegisterCSI('e', (input, startIndex, code = '1') => {
  return {
    tokens: [
      {
        type: 'VPR',
        value: code,
      },
    ],
  };
});

parserRegisterCSI('f', (input, startIndex, code = '1;1') => {
  return {
    tokens: [
      {
        type: 'HVP',
        value: code,
      },
    ],
  };
});

parserRegisterCSI('g', (input, startIndex, code = '1') => {
  return {
    tokens: [
      {
        type: 'TBC',
        value: code,
      },
    ],
  };
});

parserRegisterCSI('h', (input, startIndex, code = '1;1') => {
  return {
    tokens: [
      {
        type: 'SM',
        value: code,
      },
    ],
  };
});

parserRegisterCSI('l', (input, startIndex, code = '1;1') => {
  return {
    tokens: [
      {
        type: 'RM',
        value: code,
      },
    ],
  };
});

parserRegisterCSI('m', (input, startIndex, code = '0') => {
  return {
    tokens: [
      {
        type: 'SGR',
        value: code,
      },
    ],
  };
});

parserRegisterCSI('n', (input, startIndex, code = '1') => {
  return {
    tokens: [
      {
        type: 'DSR',
        value: code,
      },
    ],
  };
});

parserRegisterCSI('r', (input, startIndex, code = '1;1') => {
  return {
    tokens: [
      {
        type: 'DECSTBM',
        value: code,
      },
    ],
  };
});

parserRegisterCSI('s', () => {
  return {
    tokens: [
      {
        type: 'SCOSC',
      },
    ],
  };
});

parserRegisterCSI('u', () => {
  return {
    tokens: [
      {
        type: 'SCORC',
      },
    ],
  };
});

parserRegisterCSI("'", (input, startIndex, code = '1') => {
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

parserRegisterCSI('?', (input, startIndex) => {
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

const parserCSI: TokenizerHandler = (input, startIndex) => {
  const len = input.length;
  let code = '';
  while (startIndex < len) {
    const current = input[startIndex];
    startIndex++;
    if (/\d/.test(current) || current === ';') {
      code += current;
    } else {
      const handler = TokenizerCSIHnalderMap.get(current);
      if (handler) {
        const result = handler(input, startIndex, code || undefined);
        if (result) {
          const { tokens, endIndex = startIndex } = result;
          return {
            tokens,
            endIndex,
          };
        }
      }
      break;
    }
  }
};

tokenizerRegister(C1.CSI, parserCSI);

tokenizerRegister(C1.ST, () => {
  return {
    tokens: [
      {
        type: 'ST',
      },
    ],
  };
});

tokenizerRegister(C1.OSC, () => {
  return {
    tokens: [
      {
        type: 'OSC',
      },
    ],
  };
});

tokenizerRegister(C1.PM, () => {
  return {
    tokens: [
      {
        type: 'PM',
      },
    ],
  };
});

tokenizerRegister(C1.APC, () => {
  return {
    tokens: [
      {
        type: 'APC',
      },
    ],
  };
});

const tokenizer = (input: string) => {
  const tokens = [];
  let startIndex = 0;
  while (startIndex < input.length) {
    const current = input[startIndex];
    startIndex++;
    const handler = tokenizerHnalderMap.get(current);
    if (handler) {
      const result = handler(input, startIndex);
      if (result) {
        const { tokens: _tokens, endIndex = startIndex } = result;
        tokens.push(..._tokens);
        startIndex = endIndex;
        continue;
      }
    }
    tokens.push({
      type: 'TEXT',
      value: current,
    });
  }
  return tokens;
};

export default tokenizer;
