const tokenizer = (input: string) => {
  const ansiReg = /\u001b\[(.+?)m/g;

  const tokens = [];

  let lastIndex = 0;

  while (true) {
    const res = ansiReg.exec(input);
    if (res) {
      if (res.index !== lastIndex) {
        tokens.push({
          type: 'text',
          value: input.slice(lastIndex, res.index),
        });
      }

      tokens.push({
        type: 'ansi',
        value: res[1],
      });
      lastIndex = res.index + res[0].length;
    } else {
      break;
    }
  }
  if (lastIndex !== input.length) {
    tokens.push({
      type: 'text',
      value: input.slice(lastIndex),
    });
  }
  return tokens;
};

export default tokenizer;
