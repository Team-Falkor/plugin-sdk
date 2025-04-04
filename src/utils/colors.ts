/**
 * A modern color utility class for terminal text styling.
 */
export class Colors {
    private str: string;
    private codes: number[] = [];
    private prefix: string = "";
    private prefixColor: Colors | null = null;
    private suffix: string = "";
    private suffixColor: Colors | null = null;
    private showTimestamp = false;
    private timestampColor: Colors | null = null;
  
    constructor(str: string = "") {
      this.str = str;
    }
  
    /**
     * Construct the final string with color codes, prefix, suffix, and optional timestamp.
     */
    private wrap(): string {
      const timestamp = this.showTimestamp
        ? this.timestampColor
          ? Colors.create(`[${new Date().toISOString()}] `).toString()
          : `[${new Date().toISOString()}] `
        : "";
  
      const prefixStr = this.prefixColor
        ? Colors.create(this.prefix).toString()
        : this.prefix;
      const suffixStr = this.suffixColor
        ? Colors.create(this.suffix).toString()
        : this.suffix;
      const coloredStr =
        this.codes.length === 0
          ? this.str
          : `\x1b[${this.codes.join(";")}m${this.str}\x1b[0m`;
  
      return `${timestamp}${prefixStr}${coloredStr}${suffixStr}`;
    }
  
    // Basic foreground colors
    get black(): Colors {
      this.codes.push(30);
      return this;
    }
    get red(): Colors {
      this.codes.push(31);
      return this;
    }
    get green(): Colors {
      this.codes.push(32);
      return this;
    }
    get yellow(): Colors {
      this.codes.push(33);
      return this;
    }
    get blue(): Colors {
      this.codes.push(34);
      return this;
    }
    get magenta(): Colors {
      this.codes.push(35);
      return this;
    }
    get cyan(): Colors {
      this.codes.push(36);
      return this;
    }
    get white(): Colors {
      this.codes.push(37);
      return this;
    }
  
    // Bright foreground colors
    get brightBlack(): Colors {
      this.codes.push(90);
      return this;
    }
    get brightRed(): Colors {
      this.codes.push(91);
      return this;
    }
    get brightGreen(): Colors {
      this.codes.push(92);
      return this;
    }
    get brightYellow(): Colors {
      this.codes.push(93);
      return this;
    }
    get brightBlue(): Colors {
      this.codes.push(94);
      return this;
    }
    get brightMagenta(): Colors {
      this.codes.push(95);
      return this;
    }
    get brightCyan(): Colors {
      this.codes.push(96);
      return this;
    }
    get brightWhite(): Colors {
      this.codes.push(97);
      return this;
    }
  
    // Background colors
    get bgBlack(): Colors {
      this.codes.push(40);
      return this;
    }
    get bgRed(): Colors {
      this.codes.push(41);
      return this;
    }
    get bgGreen(): Colors {
      this.codes.push(42);
      return this;
    }
    get bgYellow(): Colors {
      this.codes.push(43);
      return this;
    }
    get bgBlue(): Colors {
      this.codes.push(44);
      return this;
    }
    get bgMagenta(): Colors {
      this.codes.push(45);
      return this;
    }
    get bgCyan(): Colors {
      this.codes.push(46);
      return this;
    }
    get bgWhite(): Colors {
      this.codes.push(47);
      return this;
    }
  
    // Bright background colors
    get bgBrightBlack(): Colors {
      this.codes.push(100);
      return this;
    }
    get bgBrightRed(): Colors {
      this.codes.push(101);
      return this;
    }
    get bgBrightGreen(): Colors {
      this.codes.push(102);
      return this;
    }
    get bgBrightYellow(): Colors {
      this.codes.push(103);
      return this;
    }
    get bgBrightBlue(): Colors {
      this.codes.push(104);
      return this;
    }
    get bgBrightMagenta(): Colors {
      this.codes.push(105);
      return this;
    }
    get bgBrightCyan(): Colors {
      this.codes.push(106);
      return this;
    }
    get bgBrightWhite(): Colors {
      this.codes.push(107);
      return this;
    }
  
    // Text decorations
    get bold(): Colors {
      this.codes.push(1);
      return this;
    }
    get dim(): Colors {
      this.codes.push(2);
      return this;
    }
    get italic(): Colors {
      this.codes.push(3);
      return this;
    }
    get underline(): Colors {
      this.codes.push(4);
      return this;
    }
    get blink(): Colors {
      this.codes.push(5);
      return this;
    }
    get inverse(): Colors {
      this.codes.push(7);
      return this;
    }
    get hidden(): Colors {
      this.codes.push(8);
      return this;
    }
    get strikethrough(): Colors {
      this.codes.push(9);
      return this;
    }
  
    /**
     * Returns the formatted string.
     */
    public toString(): string {
      return this.wrap();
    }
  
    /**
     * Set an optional prefix.
     */
    public withPrefix(prefix: string, color?: Colors): Colors {
      this.prefix = prefix;
      this.prefixColor = color || null;
      return this;
    }
  
    /**
     * Set an optional suffix.
     */
    public withSuffix(suffix: string, color?: Colors): Colors {
      this.suffix = suffix;
      this.suffixColor = color || null;
      return this;
    }
  
    /**
     * Enable timestamp display.
     */
    public withTimestamp(color?: Colors): Colors {
      this.showTimestamp = true;
      this.timestampColor = color || null;
      return this;
    }
  
    /**
     * Create a new Colors instance for direct usage.
     */
    public static create(str: string = ""): Colors {
      return new Colors(str);
    }
  }
  
  /**
   * A default export of basic color formatting functions.
   */
  export const colors = {
    black: (str: string) => new Colors(str).black.toString(),
    red: (str: string) => new Colors(str).red.toString(),
    green: (str: string) => new Colors(str).green.toString(),
    yellow: (str: string) => new Colors(str).yellow.toString(),
    blue: (str: string) => new Colors(str).blue.toString(),
    magenta: (str: string) => new Colors(str).magenta.toString(),
    cyan: (str: string) => new Colors(str).cyan.toString(),
    white: (str: string) => new Colors(str).white.toString(),
  };
  