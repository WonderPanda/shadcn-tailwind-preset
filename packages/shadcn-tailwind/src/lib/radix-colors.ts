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

type BrandColorWithAlphaName = `${BrandColorName}A`;

export type GrayName = 'gray' | 'mauve' | 'slate' | 'sage' | 'olive' | 'sand';

type DarkColorName<Scale extends string> = `${Scale}Dark`;

type ScaleNumbers = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

type ColorScale<T extends string> = {
  [K in `${T}${ScaleNumbers}`]: string;
};

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
  return (number: ScaleNumbers) => colorScale[`${colorName}${number}`];
}

type Options = {
  lightClassName?: string;
  darkClassName?: string;
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
    typeof darkGrayName
  >;

  const grayAlphaScale = radixColors[
    `${grayName}A`
  ] as unknown as ColorScale<`${typeof grayName}A`>;
  const darkGrayAlphaScale = radixColors[
    `${darkGrayName}A`
  ] as unknown as ColorScale<`${typeof grayName}A`>;

  radixColors.slateDarkA;

  const brandColorScale = radixColors[
    brandColor
  ] as unknown as ColorScale<BrandColorName>;

  const brandAlphaColorScale = radixColors[
    `${brandColor}A`
  ] as unknown as ColorScale<BrandColorWithAlphaName>;

  const darkBrandColorScale = radixColors[
    getDarkColorName(brandColor)
  ] as unknown as ColorScale<BrandColorName>;

  const darkBrandAlphaColorScale = radixColors[
    `${brandColor}DarkA`
  ] as unknown as ColorScale<BrandColorWithAlphaName>;

  const makeGrayColor = makeColorFactory(grayName, grayScale);
  const makeDarkGrayColor = makeColorFactory(darkGrayName, darkGrayScale);

  const makeGrayAlphaColor = makeColorFactory(`${grayName}A`, grayAlphaScale);
  const makeDarkGrayAlphaColor = makeColorFactory(
    `${grayName}A`,
    darkGrayAlphaScale
  );

  const makeBrandColor = makeColorFactory(brandColor, brandColorScale);
  const makeBrandAlphaColor = makeColorFactory(
    `${brandColor}A`,
    brandAlphaColorScale
  );
  const makeDarkBrandColor = makeColorFactory(brandColor, darkBrandColorScale);
  const makeDarkBrandAlphaColor = makeColorFactory(
    `${brandColor}A`,
    darkBrandAlphaColorScale
  );

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

  const grayAlphaColorVariables = makeScaleVariables(
    'gray-alpha',
    makeGrayAlphaColor
  );

  const darkGrayAlphaColorVariables = makeScaleVariables(
    'gray-alpha',
    makeDarkGrayAlphaColor
  );

  return {
    [lightClassName]: {
      '--background': makeGrayColor(1),
      '--foreground': makeBrandColor(11),
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
      ...grayAlphaColorVariables,
      ...makeScaleVariables('brand', makeBrandColor),
      ...makeScaleVariables('brand-alpha', makeBrandAlphaColor),
      ...makeScaleVariables('gray', makeGrayColor),
    },
    [darkClassName]: {
      '--background': makeDarkGrayColor(1),
      '--foreground': makeDarkBrandColor(11),
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
      ...darkGrayAlphaColorVariables,
      ...makeScaleVariables('brand', makeDarkBrandColor),
      ...makeScaleVariables('brand-alpha', makeDarkBrandAlphaColor),
      ...makeScaleVariables('gray', makeDarkGrayColor),
    },
  };
};
