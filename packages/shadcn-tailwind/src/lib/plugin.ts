import plugin from 'tailwindcss/plugin';
import { PresetConfig } from './types';
import { convertRadixColorToShadTheme } from './radix-colors';

const makeColorScale = (name: string) => {
  return {
    1: `hsl(var(--${name}-1))`,
    2: `hsl(var(--${name}-2))`,
    3: `hsl(var(--${name}-3))`,
    4: `hsl(var(--${name}-4))`,
    5: `hsl(var(--${name}-5))`,
    6: `hsl(var(--${name}-6))`,
    7: `hsl(var(--${name}-7))`,
    8: `hsl(var(--${name}-8))`,
    9: `hsl(var(--${name}-9))`,
    10: `hsl(var(--${name}-10))`,
    11: `hsl(var(--${name}-11))`,
    12: `hsl(var(--${name}-12))`,
  };
};

export const makePlugin = (config: PresetConfig) =>
  plugin(
    ({ addBase }) => {
      addBase({
        ...convertRadixColorToShadTheme(config.primaryBrandColor, {
          lightClassName: ':root',
          darkClassName: '.dark',
        }),
      });

      (config.additionalColors ?? []).forEach((c) =>
        addBase({
          ...convertRadixColorToShadTheme(c),
        })
      );

      addBase({
        '*': {
          '@apply border-border': {},
        },
        body: {
          '@apply bg-background text-foreground': {},
          'font-feature-settings': '"rlig" 1, "calt" 1',
        },
      });
    },
    {
      darkMode: ['class'],
      theme: {
        container: {
          center: true,
          padding: '2rem',
          screens: {
            '2xl': '1400px',
          },
        },
        extend: {
          colors: {
            border: 'hsl(var(--border))',
            input: 'hsl(var(--input))',
            ring: 'hsl(var(--ring))',
            background: 'hsl(var(--background))',
            foreground: 'hsl(var(--foreground))',
            primary: {
              DEFAULT: 'hsl(var(--primary))',
              foreground: 'hsl(var(--primary-foreground))',
            },
            secondary: {
              DEFAULT: 'hsl(var(--secondary))',
              foreground: 'hsl(var(--secondary-foreground))',
            },
            brand: {
              ...makeColorScale('brand'),
            },
            gray: {
              ...makeColorScale('gray'),
            },
            destructive: {
              DEFAULT: 'hsl(var(--destructive))',
              foreground: 'hsl(var(--destructive-foreground))',
            },
            muted: {
              DEFAULT: 'hsl(var(--muted))',
              foreground: 'hsl(var(--muted-foreground))',
            },
            accent: {
              DEFAULT: 'hsl(var(--accent))',
              foreground: 'hsl(var(--accent-foreground))',
            },
            popover: {
              DEFAULT: 'hsl(var(--popover))',
              foreground: 'hsl(var(--popover-foreground))',
            },
            card: {
              DEFAULT: 'hsl(var(--card))',
              foreground: 'hsl(var(--card-foreground))',
            },
          },
          borderRadius: {
            lg: `var(--radius)`,
            md: `calc(var(--radius) - 2px)`,
            sm: 'calc(var(--radius) - 4px)',
          },
          // fontFamily: {
          //   sans: ['var(--font-inter)', ...fontFamily.sans],
          // },
          keyframes: {
            'accordion-down': {
              from: { height: '0' },
              to: { height: 'var(--radix-accordion-content-height)' },
            },
            'accordion-up': {
              from: { height: 'var(--radix-accordion-content-height)' },
              to: { height: '0' },
            },
          },
          animation: {
            'accordion-down': 'accordion-down 0.2s ease-out',
            'accordion-up': 'accordion-up 0.2s ease-out',
          },
        },
      },
    }
  );
