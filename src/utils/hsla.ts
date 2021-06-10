import tinycolor from 'tinycolor2';

type HSLA = {
  h: number;
  s: number;
  l: number;
  a: number;
};

class Hsla {
  hsla!: HSLA;
  h!: number;
  s!: number;
  l!: number;
  a!: number;
  constructor(hsla: HSLA) {
    this.hsla = this.getCappedHsla(hsla);
    this.a = this.hsla.a;
    this.h = this.hsla.h;
    this.s = this.hsla.s;
    this.l = this.hsla.l;
  }

  getCappedHsla = (hsla: HSLA) => {
    return {
      h: hsla.h,
      s: Math.min(hsla.s, 100),
      l: Math.min(hsla.l, 100),
      a: Math.min(hsla.a, 1),
    };
  };

  getHslaString = (
    modHSLA: {h?: number; s?: number; l?: number; a?: number} = {},
  ) => {
    const modifiedHSLA = this.getCappedHsla({...this.hsla, ...modHSLA});
    return `hsla(${modifiedHSLA.h}, ${modifiedHSLA.s}%, ${modifiedHSLA.l}%, ${modifiedHSLA.a})`;
  };

  getHexString = (
    modHSLA: {h?: number; s?: number; l?: number; a?: number} = {},
  ) => {
    const modifiedHSLA = this.getCappedHsla({...this.hsla, ...modHSLA});
    return hslaToHex(
      modifiedHSLA.h,
      modifiedHSLA.s,
      modifiedHSLA.l,
      modifiedHSLA.a,
    );
  };

  isDark = () => {
    return this.l < 50;
  };
}

const hslaToHex = (h: number, s: number, l: number, alpha: number) => {
  // https://gist.github.com/xenozauros/f6e185c8de2a04cdfecf
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  const hexA = Math.round(Math.min(Math.max(alpha || 1, 0), 1) * 255).toString(
    16,
  );
  return `#${f(0)}${f(8)}${f(4)}${hexA}`;
};

export const hexToHsla = (color: string) => {
  const input = tinycolor(color).toHsl();
  return {
    h: (input.h * 360) / 360,
    s: input.s * 100,
    l: input.l * 100,
    a: 1,
  };
};

export default Hsla;
