import type { Ats, AtsStyle } from './typing';

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

  while (current < tokens.length) {
    const token = tokens[current];
    current++;
    if (token.type === 'ansi') {
      const ansiCode = token.value;
      for (const item of ANSI_COLOR) {
        const { type, openReg, closeReg } = item;
        if (!openReg) {
          styles.length = 0;
          break;
        }
        const openMatch = ansiCode.match(openReg);
        if (openMatch) {
          styles.push({
            type,
            ansiCode: openMatch[0],
          });
          break;
        }
        if (closeReg.test(ansiCode)) {
          styles = styles.filter(
            (item) => !openReg.test(item.ansiCode) && item.type === type
          );
          break;
        }
      }
    } else if (token.type === 'text') {
      ast.body.push({
        type: 'StringLiteral',
        styles: [...styles],
        value: token.value,
      });
    }
  }
  return ast;
};

export default parser;
