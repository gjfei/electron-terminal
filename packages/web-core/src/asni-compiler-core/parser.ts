import {
  deleteCacheStyle,
  clearCacheVieport,
  addCacheStyle,
} from './cacheAsni';
import type { Ats, AtsStyle } from './typing';

type ParserHnalder = (value: string) => void;

const parserHnalderMap = new Map<string, ParserHnalder>();

const parserRegister = (code: string, handler: ParserHnalder) => {
  parserHnalderMap.set(code, handler);
};

parserRegister('NUL', () => {});

parserRegister('BEL', () => {});

parserRegister('BS', () => {});

parserRegister('HT', () => {});

parserRegister('LF', () => {});

parserRegister('VT', () => {});

parserRegister('FF', () => {});

parserRegister('CR', () => {});

parserRegister('SO', () => {});

parserRegister('SI', () => {});

parserRegister('SC', () => {});

parserRegister('RC', () => {});

parserRegister('DECALN', () => {});

parserRegister('IND', () => {});

parserRegister('NEL', () => {});

parserRegister('HTS', () => {});

parserRegister('IR', () => {});

parserRegister('ST', () => {});

parserRegister('SET WINDOW TITLE AND ICON NAME', () => {});

parserRegister('SET ICON NAME', () => {});

parserRegister('SET FRAME TITLE', () => {});

parserRegister('CHANGE COLOR', () => {});

parserRegister('PM', () => {});

parserRegister('APC', () => {});

parserRegister('IND', () => {});

parserRegister('NEL', () => {});

parserRegister('HTS', () => {});

parserRegister('DCS', () => {});

parserRegister('ICH', () => {});

parserRegister('SL', () => {});

parserRegister('SR', () => {});

parserRegister('DECSCUSR', () => {});

parserRegister('CUU', () => {});

parserRegister('CUD', () => {});

parserRegister('CUF', () => {});

parserRegister('CUB', () => {});

parserRegister('CNL', () => {});

parserRegister('CPL', () => {});

parserRegister('CHA', () => {});

parserRegister('CUP', () => {});

parserRegister('CHT', () => {});

parserRegister('ED', (value) => {
  if (value === '2') {
    clearCacheVieport();
  }
});

parserRegister('EL', () => {});

parserRegister('IL', () => {});

parserRegister('DL', () => {});

parserRegister('DCH', () => {});

parserRegister('SU', () => {});

parserRegister('SD', () => {});

parserRegister('ECH', () => {});

parserRegister('CBT', () => {});

parserRegister('HPA', () => {});

parserRegister('HPR', () => {});

parserRegister('REP', () => {});

parserRegister('DA1', () => {});

parserRegister('DA2', () => {});

parserRegister('VPA', () => {});

parserRegister('VPR', () => {});

parserRegister('HVP', () => {});

parserRegister('TBC', () => {});

parserRegister('SM', () => {});

parserRegister('RM', () => {});

type ParserSGBHnalder = (value: string) => void;

const parserSGBHnalderList = new Array<[RegExp, ParserSGBHnalder]>();

const parserRegisterSGB = (code: RegExp, handler: ParserSGBHnalder) => {
  parserSGBHnalderList.push([code, handler]);
};

const ANSI_RGBS = [
  // Normal colors
  [
    [0, 0, 0],
    [187, 0, 0],
    [0, 187, 0],
    [187, 187, 0],
    [0, 0, 187],
    [187, 0, 187],
    [0, 187, 187],
    [255, 255, 255],
  ],
  // Bright colors
  [
    [85, 85, 85],
    [255, 85, 85],
    [0, 255, 0],
    [255, 255, 85],
    [85, 85, 255],
    [255, 85, 255],
    [85, 255, 255],
    [255, 255, 255],
  ],
];

// color 30 -> 37  90 -> 97
// background 40 -> 47  100 -> 107
const ANSI_COLOR_MAP = ANSI_RGBS.reduce((obj, group, groupIndex) => {
  group.forEach((rgb, idx) => {
    const color = rgb.join(',');
    const styleCode = 30 + groupIndex * 60 + idx;
    obj[styleCode] = `rgb(${color})`;
  });
  return obj;
}, {} as { [key: string]: string });

const ANSI256_COLOR_MAP = (() => {
  const ansi256Map = {} as { [key: string]: string };

  // Index 0 -> 15 : Ansi-Colors
  let styleCode = 0;
  ANSI_RGBS.forEach((group) => {
    group.forEach((rgb) => {
      ansi256Map[styleCode] = `rgb(${rgb.join(',')})`;
      styleCode++;
    });
  });

  // Index 16..231 : RGB 6x6x6
  // https://gist.github.com/jasonm23/2868981#file-xterm-256color-yaml
  const levels = [0, 95, 135, 175, 215, 255];
  for (let r = 0; r < 6; ++r) {
    for (let g = 0; g < 6; ++g) {
      for (let b = 0; b < 6; ++b) {
        const color = [levels[r], levels[g], levels[b]].join(',');
        ansi256Map[styleCode] = `rgb(${color})`;
        styleCode++;
      }
    }
  }

  // Index 232..255 : Grayscale
  let greyLevel = 8;
  for (let i = 0; i < 24; ++i, greyLevel += 10) {
    const color = [greyLevel, greyLevel, greyLevel].join(',');
    ansi256Map[styleCode] = `rgb(${color})`;
    styleCode++;
  }

  return ansi256Map;
})();

const replaceAnsiColorWrap =
  (offest = 0) =>
  (styleCode: string) =>
    `${ANSI_COLOR_MAP[Number(styleCode) - offest]}`;

const replaceAnsiColor = replaceAnsiColorWrap();
const replaceAnsiBgColor = replaceAnsiColorWrap(10);

const replaceAnsi256ColorWrap = (styleCode: string) =>
  ANSI256_COLOR_MAP[styleCode];

const replaceAnsi256Color = replaceAnsi256ColorWrap;
const replaceAnsi256BgColor = replaceAnsi256ColorWrap;

parserRegisterSGB(/[3][0-7]|[9][0-7]/, (value) => {
  addCacheStyle({
    key: 'color',
    value: replaceAnsiColor(value),
  });
});

parserRegisterSGB(
  /38;5;([0]|[0-9][0-9]|[1][0-9][0-9]|[2][0-4][0-9]|[2][5][0-5])/,
  (value) => {
    addCacheStyle({
      key: 'color',
      value: replaceAnsi256Color(value),
    });
  }
);

parserRegisterSGB(/[4][0-7]|[1][0][0-7]/, (value) => {
  addCacheStyle({
    key: 'backage-color',
    value: replaceAnsiBgColor(value),
  });
});
parserRegisterSGB(
  /48;5;([0]|[0-9][0-9]|[1][0-9][0-9]|[2][0-4][0-9]|[2][5][0-5])/,
  (value) => {
    addCacheStyle({
      key: 'backage-color',
      value: replaceAnsi256BgColor(value),
    });
  }
);

parserRegisterSGB(/39/, () => {
  deleteCacheStyle('color');
});
parserRegisterSGB(/49/, () => {
  deleteCacheStyle('background-color');
});

parserRegisterSGB(/0/, () => {
  deleteCacheStyle();
});
parserRegisterSGB(/1[2]/, () => {
  addCacheStyle({
    key: 'font-weight',
    value: 'bold',
  });
});

parserRegisterSGB(/2/, () => {
  addCacheStyle({
    key: 'font-weight',
    value: 'lighter',
  });
});

parserRegisterSGB(/3/, () => {
  addCacheStyle({
    key: 'font-style',
    value: 'italic',
  });
});

parserRegisterSGB(/4/, () => {
  addCacheStyle({
    key: 'text-decoration',
    value: 'underline',
  });
});

parserRegisterSGB(/5/, () => {
  addCacheStyle({
    key: 'amimation',
    value: 'blink 1s linear infinite',
  });
});

parserRegisterSGB(/6/, () => {
  addCacheStyle({
    key: 'amimation',
    value: 'blink .3s linear infinite',
  });
});

parserRegisterSGB(/7/, () => {
  // TODO: reverse
});
parserRegisterSGB(/8/, () => {
  addCacheStyle({
    key: 'visibility',
    value: 'hidden',
  });
});
parserRegisterSGB(/9/, () => {
  addCacheStyle({
    key: 'text-decoration',
    value: 'strikethrough',
  });
});
parserRegisterSGB(/22/, () => {
  deleteCacheStyle('font-weight');
});
parserRegisterSGB(/23/, () => {
  deleteCacheStyle('font-style');
});
parserRegisterSGB(/24/, () => {
  deleteCacheStyle('text-decoration');
});
parserRegisterSGB(/25/, () => {
  deleteCacheStyle('animation');
});
parserRegisterSGB(/27/, () => {
  // TODO: close reverse
});
parserRegisterSGB(/28/, () => {
  deleteCacheStyle('visibility');
});
parserRegisterSGB(/29/, () => {
  deleteCacheStyle('text-decoration');
});
parserRegisterSGB(/53/, () => {
  addCacheStyle({
    key: 'text-decoration',
    value: 'overline',
  });
});
parserRegisterSGB(/55/, () => {
  deleteCacheStyle('text-decoration');
});

parserRegister('SGR', (value) => {
  for (const [reg, handler] of parserSGBHnalderList) {
    if (reg.test(value)) {
      handler(value);
      break;
    }
  }
});

parserRegister('DSR', () => {});

parserRegister('DECSTBM', () => {});

parserRegister('SCOSC', () => {});

parserRegister('SCORC', () => {});

parserRegister('DECIC', () => {});

parserRegister('DECDC', () => {});

parserRegister('DECSED', () => {});

parserRegister('DECSEL', () => {});

parserRegister('DECSET', () => {});

parserRegister('DECRST', () => {});

parserRegister('DECDSR', () => {});

parserRegister('ST', () => {});

parserRegister('OSC', () => {});

parserRegister('PM', () => {});

parserRegister('APC', () => {});

parserRegister('TEXT', () => {});

const ANSI_COLOR = [
  { type: 'ansiColor', openReg: /[3][0-7]|[9][0-7]/, closeReg: /39/ },
  {
    type: 'ansi256Color',
    openReg: /38;5;([0]|[0-9][0-9]|[1][0-9][0-9]|[2][0-4][0-9]|[2][5][0-5])/,
    closeReg: /39/,
  },
  { type: 'ansiBgColor', openReg: /[4][0-7]|[1][0][0-7]/, closeReg: /49/ },
  {
    type: 'ansi256BgColor',
    openReg: /48;5;([0]|[0-9][0-9]|[1][0-9][0-9]|[2][0-4][0-9]|[2][5][0-5])/,
    closeReg: /49/,
  },
  { type: 'ansiModifier', openReg: /0/, closeReg: /0/ },
  { type: 'ansiModifier', openReg: /[1][2]/, closeReg: /22/ },
  { type: 'ansiModifier', openReg: /3/, closeReg: /23/ },
  { type: 'ansiModifier', openReg: /4/, closeReg: /24/ },
  { type: 'ansiModifier', openReg: /[5][6]/, closeReg: /25/ },
  { type: 'ansiModifier', openReg: /7/, closeReg: /27/ },
  { type: 'ansiModifier', openReg: /8/, closeReg: /28/ },
  { type: 'ansiModifier', openReg: /9/, closeReg: /29/ },
  { type: 'ansiModifier', openReg: /53/, closeReg: /55/ },
] as const;

const parser = (tokens: { value: string; type: string }[]) => {
  let current = 0;
  const ast: Ats = {
    type: 'Program',
    body: [],
  };

  let styles: AtsStyle[] = [];
  const len = tokens.length;

  console.log(tokens);

  while (current < len) {
    const { type, value } = tokens[current];
    current++;
    if (type === 'TEXT') {
      ast.body.push({
        type: 'StringLiteral',
        styles: [...styles],
        value,
      });
    } else if (type === 'SGR') {
      for (const item of ANSI_COLOR) {
        const { type, openReg, closeReg } = item;
        if (!openReg) {
          styles.length = 0;
          break;
        }
        const openMatch = value.match(openReg);
        if (openMatch) {
          styles.push({
            type,
            ansiCode: openMatch[0],
          });
          break;
        }
        if (closeReg.test(value)) {
          styles = styles.filter(
            (item) => !openReg.test(item.ansiCode) && item.type === type
          );
          break;
        }
      }
    }
  }

  return ast;
};

export default parser;
