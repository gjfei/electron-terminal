export type AtsStyle = {
  type:
    | 'ansi256BgColor'
    | 'ansi256Color'
    | 'ansiBgColor'
    | 'ansiColor'
    | 'ansiModifier';
  ansiCode: string;
};

export type Ats = {
  type: string;
  body: {
    type: 'StringLiteral';
    styles: AtsStyle[];
    value: string;
  }[];
};
