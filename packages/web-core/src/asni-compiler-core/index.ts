import tokenizer from './tokenizer';
import parser from './parser';
import transformer from './transformer';
import generator from './generator';

const compiler = (template: string) => {
  return generator(transformer(parser(tokenizer(template))));
};
export { compiler, tokenizer, parser, transformer, generator };

export default compiler;
