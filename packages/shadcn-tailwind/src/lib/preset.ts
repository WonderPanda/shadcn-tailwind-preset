import { Config } from 'tailwindcss';
import * as animatePlugin from 'tailwindcss-animate';
import { PresetConfig } from './types';
import { makePlugin } from './plugin';

export const makePreset = (config: PresetConfig): Config => {
  return {
    content: [],
    darkMode: ['class'],
    plugins: [animatePlugin, makePlugin(config)],
    safelist: [
      'dark',
      config.primaryBrandColor,
      `${config.primaryBrandColor}_dark`,
      ...(config.additionalColors ?? []).flatMap((c) => [c, `${c}_dark`]),
    ],
  };
};
