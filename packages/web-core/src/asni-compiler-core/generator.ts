import type { Ats } from './typing';
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

const ANSI_MODIFIER = {
  0: 'reset',
  1: 'font-weight: bold',
  2: 'font-weight: lighter',
  3: 'font-style: italic',
  4: 'text-decoration:underline',
  5: 'amimation: blink 1s linear infinite',
  6: 'amimation: blink .3s linear infinite',
  7: 'reverse',
  8: 'visibility: hidden',
  9: 'text-decoration: strikethrough',
  53: 'text-decoration: overline',
} as { [key: string]: string };

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
  (offest = 0, styleKey = 'color') =>
  (styleCode: string) =>
    `${styleKey}:${ANSI_COLOR_MAP[Number(styleCode) - offest]};`;

const replaceAnsiColor = replaceAnsiColorWrap();
const replaceAnsiBgColor = replaceAnsiColorWrap(10, 'background-color');

const replaceAnsiModifier = (styleCode: string) => {
  return `${ANSI_MODIFIER[styleCode]};`;
};

const replaceAnsi256ColorWrap =
  (styleKey = 'color') =>
  (styleCode: string) =>
    `${styleKey}:${ANSI256_COLOR_MAP[styleCode]};`;

const replaceAnsi256Color = replaceAnsi256ColorWrap();
const replaceAnsi256BgColor = replaceAnsi256ColorWrap('background-color');

// 策略
const STYLE_STRATEGY = {
  ansiColor: replaceAnsiColor,
  ansiBgColor: replaceAnsiBgColor,
  ansiModifier: replaceAnsiModifier,
  ansi256Color: replaceAnsi256Color,
  ansi256BgColor: replaceAnsi256BgColor,
};

const generator = (ast: Ats) => {
  const { body } = ast;
  const codes = body.map((item) => {
    const { styles, value } = item;
    const stylesList = styles.map((style) => {
      const { ansiCode, type } = style;
      return STYLE_STRATEGY[type](ansiCode);
    });
    return `<span style="${stylesList.join('')}">${value}</span>`;
  });
  return codes.join('');
};

export default generator;
