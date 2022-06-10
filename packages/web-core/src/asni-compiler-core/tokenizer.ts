const tokenizer = (input: string) => {
  const ansiReg =
    /(\u001b\[(.+?)J)|(\u001b\[m)|(\u001b\[(.+?)m)|(\u001b\[H)|(\u001b\[(.+?)H)|(\r\n)/g;

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
      console.log(res);
      tokens.push({
        type: 'ansi',
        value: res[0],
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
  console.log(tokens);
  return tokens;
};

export default tokenizer;
