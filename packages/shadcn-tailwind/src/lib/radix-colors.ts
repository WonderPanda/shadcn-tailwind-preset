const regexPattern = /hsl\(|\)|,/g;
import * as radixColors from '@radix-ui/colors';

export type BrandColorName =
  | 'tomato'
  | 'red'
  | 'ruby'
  | 'crimson'
  | 'pink'
  | 'plum'
  | 'purple'
  | 'violet'
  | 'iris'
  | 'indigo'
  | 'blue'
  | 'sky'
  | 'cyan'
  | 'mint'
  | 'teal'
  | 'jade'
  | 'green'
  | 'grass'
  | 'lime'
  | 'yellow'
  | 'amber'
  | 'orange'
  | 'brown';

export type GrayName = 'gray' | 'mauve' | 'slate' | 'sage' | 'olive' | 'sand';

type DarkColorName<Scale extends string> = `${Scale}Dark`;

type ScaleNumbers = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

type ColorScale<T extends string> = {
  [K in `${T}${ScaleNumbers}`]: string;
};

const convertHslToCssVar = (hsl: string) => hsl.replace(regexPattern, '');

const getGrayNameForBrand = (brandColor: BrandColorName): GrayName => {
  const mauveColors = [
    'tomato',
    'red',
    'ruby',
    'crimson',
    'pink',
    'plum',
    'purple',
    'violet',
  ];
  const slateColors = ['iris', 'indigo', 'blue', 'sky', 'cyan'];
  const sageColors = ['mint', 'teal', 'jade', 'green'];
  const oliveColors = ['grass', 'lime'];
  const sandColors = ['yellow', 'amber', 'orange', 'brown'];

  if (mauveColors.some((c) => brandColor.startsWith(c))) {
    return 'mauve';
  }

  if (slateColors.some((c) => brandColor.startsWith(c))) {
    return 'slate';
  }
  if (sageColors.some((c) => brandColor.startsWith(c))) {
    return 'sage';
  }
  if (oliveColors.some((c) => brandColor.startsWith(c))) {
    return 'olive';
  }
  if (sandColors.some((c) => brandColor.startsWith(c))) {
    return 'sand';
  }

  return 'gray';
};

function getDarkColorName<T extends string>(color: T): DarkColorName<T> {
  return `${color}Dark`;
}

function makeColorFactory<T extends string>(
  colorName: T,
  colorScale: ColorScale<T>
) {
  return (number: ScaleNumbers) =>
    convertHslToCssVar(colorScale[`${colorName}${number}`]);
}

type Options = {
  lightClassName?: string;
  darkClassName?: string;
};

export const radixSemanticScaleColor: Record<
  string,
  { brand?: ScaleNumbers; gray?: ScaleNumbers }
> = {
  'app-bg': {
    brand: 1,
  },
  'subtle-bg': {
    brand: 2,
  },
  'ui-bg': {
    brand: 3,
  },
  'ui-bg-hovered': {
    brand: 4,
  },
  'ui-bg-active': {
    brand: 5,
  },
  'subtle-border': {
    brand: 6,
  },
  'ui-border': {
    brand: 7,
  },
  'ui-border-hovered': {
    brand: 8,
  },
  'solid-bg': {
    brand: 9,
  },
  'solid-bg-hovered': {
    brand: 10,
  },
  foreground: {
    brand: 11,
  },
  'foreground-high-contrast': {
    brand: 12,
  },
  'solid-contrast': {
    gray: 2,
  },
  'solid-high-contrast': {
    gray: 1,
  },
};

export const convertRadixColorToShadTheme = (
  brandColor: BrandColorName,
  options?: Options
) => {
  const {
    darkClassName = `.${brandColor}_dark`,
    lightClassName = `.${brandColor}`,
  } = options ?? {};
  const grayName = getGrayNameForBrand(brandColor);
  const darkGrayName = getDarkColorName(grayName);

  const grayScale = radixColors[grayName] as unknown as ColorScale<
    typeof grayName
  >;
  const darkGrayScale = radixColors[darkGrayName] as unknown as ColorScale<
    typeof grayName
  >;

  const brandColorScale = radixColors[
    brandColor
  ] as unknown as ColorScale<BrandColorName>;

  const darkBrandColorScale = radixColors[
    getDarkColorName(brandColor)
  ] as unknown as ColorScale<BrandColorName>;

  const makeGrayColor = makeColorFactory(grayName, grayScale);
  const makeDarkGrayColor = makeColorFactory(grayName, darkGrayScale);

  const makeBrandColor = makeColorFactory(brandColor, brandColorScale);
  const makeDarkBrandColor = makeColorFactory(brandColor, darkBrandColorScale);

  const makeScaleVariables = (
    name: string,
    factory: (scaleNumber: ScaleNumbers) => string
  ) => {
    const seed = Array(12)
      .fill(0)
      .map((_, i) => {
        const scaleNumber = (i + 1) as ScaleNumbers;
        return [`--${name}-${i + 1}`, factory(scaleNumber)];
      });

    return Object.fromEntries(seed) as Record<string, string>;
  };

  const makeSemanticScaleVariables = (
    colorFactory: (scaleNumber: ScaleNumbers) => string,
    grayFactory: (scaleNumber: ScaleNumbers) => string,
    name?: string
  ) => {
    const colorScaleEntries = Object.entries(radixSemanticScaleColor).map(
      ([semanticName, semanticScale]) => {
        const { brand, gray } = semanticScale;
        const color = brand ? colorFactory(brand) : grayFactory(gray || 1);
        return [`--${semanticName}${name ? `-${name}` : ''}`, color];
      }
    );

    return Object.fromEntries(colorScaleEntries) as Record<string, string>;
  };

  return {
    [lightClassName]: {
      '--background': makeGrayColor(1),
      '--card': makeGrayColor(2),
      '--card-foreground': makeGrayColor(11),
      '--popover': '0 0% 100%',
      '--popover-foreground': '224 71.4% 4.1%',
      '--primary': makeBrandColor(9),
      '--primary-foreground': makeBrandColor(12),
      '--secondary': '220 14.3% 95.9%',
      '--secondary-foreground': '220.9 39.3% 11%',
      '--muted': makeGrayColor(3),
      '--muted-foreground': '220 8.9% 46.1%',
      '--accent': makeBrandColor(10),
      '--accent-foreground': '220.9 39.3% 11%',
      '--destructive': '0 84.2% 60.2%',
      '--destructive-foreground': '210 20% 98%',
      '--border': makeGrayColor(7),
      '--input': '220 13% 91%',
      '--ring': makeBrandColor(8),
      '--radius': '0.5rem',
      '--brand-1': makeBrandColor(1),
      ...makeScaleVariables('brand', makeBrandColor),
      ...makeScaleVariables('gray', makeGrayColor),
      ...makeSemanticScaleVariables(makeBrandColor, makeGrayColor),
      ...makeSemanticScaleVariables(makeGrayColor, makeGrayColor, 'gray'),
    },
    [darkClassName]: {
      '--background': makeDarkGrayColor(1),
      '--card': makeDarkGrayColor(2),
      '--card-foreground': makeDarkGrayColor(11),
      '--popover': '0 0% 100%',
      '--popover-foreground': '224 71.4% 4.1%',
      '--primary': makeDarkBrandColor(9),
      '--primary-foreground': makeDarkBrandColor(12),
      '--secondary': '220 14.3% 95.9%',
      '--secondary-foreground': '220.9 39.3% 11%',
      '--muted': makeDarkGrayColor(3),
      '--muted-foreground': '220 8.9% 46.1%',
      '--accent': makeDarkBrandColor(10),
      '--accent-foreground': '220.9 39.3% 11%',
      '--destructive': '0 84.2% 60.2%',
      '--destructive-foreground': '210 20% 98%',
      '--border': makeDarkGrayColor(7),
      '--input': '220 13% 91%',
      '--ring': makeDarkBrandColor(8),
      '--radius': '0.5rem',
      ...makeScaleVariables('brand', makeDarkBrandColor),
      ...makeScaleVariables('gray', makeDarkGrayColor),
      ...makeSemanticScaleVariables(makeDarkBrandColor, makeGrayColor),
      ...makeSemanticScaleVariables(makeGrayColor, makeGrayColor, 'gray'),
    },
  };
};
