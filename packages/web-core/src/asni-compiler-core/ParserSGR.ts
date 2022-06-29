import type { Compiler } from './Compiler';

type Handler = (value: string) => void;

export class ParserSGR {
  private cacheStyle = new Map<string, string>();
  private handlerList = new Array<[RegExp, Handler]>();

  constructor(private compiler: Compiler) {
    this.init();
  }

  private init() {
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

    this.register(/^[3][0-7]|[9][0-7]$/, (value) => {
      this.addCacheStyle({
        key: 'color',
        value: replaceAnsiColor(value),
      });
    });

    this.register(
      /^38;5;([0]|[0-9][0-9]|[1][0-9][0-9]|[2][0-4][0-9]|[2][5][0-5])$/,
      (value) => {
        this.addCacheStyle({
          key: 'color',
          value: replaceAnsi256Color(value),
        });
      }
    );

    this.register(/^[4][0-7]|[1][0][0-7]$/, (value) => {
      this.addCacheStyle({
        key: 'background-color',
        value: replaceAnsiBgColor(value),
      });
    });
    this.register(
      /^48;5;([0]|[0-9][0-9]|[1][0-9][0-9]|[2][0-4][0-9]|[2][5][0-5])$/,
      (value) => {
        this.addCacheStyle({
          key: 'background-color',
          value: replaceAnsi256BgColor(value),
        });
      }
    );

    this.register(/^39$/, () => {
      this.deleteCacheStyle('color');
    });
    this.register(/^49$/, () => {
      this.deleteCacheStyle('background-color');
    });

    this.register(/^0$/, () => {
      this.deleteCacheStyle();
    });
    this.register(/^1[2]$/, () => {
      this.addCacheStyle({
        key: 'font-weight',
        value: 'bold',
      });
    });

    this.register(/^2$/, () => {
      this.addCacheStyle({
        key: 'font-weight',
        value: 'lighter',
      });
    });

    this.register(/^3$/, () => {
      this.addCacheStyle({
        key: 'font-style',
        value: 'italic',
      });
    });

    this.register(/^4$/, () => {
      this.addCacheStyle({
        key: 'text-decoration',
        value: 'underline',
      });
    });

    this.register(/^5$/, () => {
      this.addCacheStyle({
        key: 'amimation',
        value: 'blink 1s linear infinite',
      });
    });

    this.register(/^6$/, () => {
      this.addCacheStyle({
        key: 'amimation',
        value: 'blink .3s linear infinite',
      });
    });

    this.register(/^7$/, () => {
      // TODO 反转颜色
      const color = this.getCacheStye('color') || '#cccccc';
      const bgColor = this.getCacheStye('background-color') || '#000000';

      if (color) {
        this.addCacheStyle({
          key: 'background-color',
          value: color,
        });
      }

      if (bgColor) {
        this.addCacheStyle({
          key: 'color',
          value: bgColor,
        });
      }
    });
    this.register(/^8$/, () => {
      this.addCacheStyle({
        key: 'visibility',
        value: 'hidden',
      });
    });
    this.register(/^9$/, () => {
      this.addCacheStyle({
        key: 'text-decoration',
        value: 'strikethrough',
      });
    });
    this.register(/^22$/, () => {
      this.deleteCacheStyle('font-weight');
    });
    this.register(/^23$/, () => {
      this.deleteCacheStyle('font-style');
    });
    this.register(/^24$/, () => {
      this.deleteCacheStyle('text-decoration');
    });
    this.register(/^25$/, () => {
      this.deleteCacheStyle('animation');
    });
    this.register(/^27$/, () => {
      // TODO 反转颜色
      const color = this.getCacheStye('color') || '#cccccc';
      const bgColor = this.getCacheStye('background-color') || '#000000';

      if (color) {
        this.addCacheStyle({
          key: 'background-color',
          value: color,
        });
      }

      if (bgColor) {
        this.addCacheStyle({
          key: 'color',
          value: bgColor,
        });
      }
    });

    this.register(/^28$/, () => {
      this.deleteCacheStyle('visibility');
    });
    this.register(/^29$/, () => {
      this.deleteCacheStyle('text-decoration');
    });
    this.register(/^53$/, () => {
      this.addCacheStyle({
        key: 'text-decoration',
        value: 'overline',
      });
    });
    this.register(/^55$/, () => {
      this.deleteCacheStyle('text-decoration');
    });
  }

  get styles() {
    const styles: string[] = [];
    this.cacheStyle.forEach((value, key) => {
      styles.push(`${key}:${value}`);
    });
    return styles;
  }

  private addCacheStyle({ key, value }: { key: string; value: string }) {
    this.cacheStyle.set(key, value);
  }

  private deleteCacheStyle(key?: string) {
    if (key) {
      this.cacheStyle.delete(key);
    } else {
      this.cacheStyle.clear();
    }
  }

  private getCacheStye(key: string) {
    return this.cacheStyle.get(key);
  }

  public getCacheStyes() {
    const styles: string[] = [];
    this.cacheStyle.forEach((value, key) => {
      styles.push(`${key}:${value}`);
    });
    return styles;
  }

  private register(reg: RegExp, handler: Handler) {
    this.handlerList.push([reg, handler]);
  }

  public write(input: string, startIndex: number, code: string) {
    for (const [reg, handler] of this.handlerList) {
      if (reg.test(code)) {
        handler(code);
        return {
          endIndex: startIndex,
        };
        break;
      }
    }
  }
}
