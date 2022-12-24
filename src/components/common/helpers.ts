export const getSpriteUrl = (pokedexNumber: string, regionFlag?: string) =>
  `https://www.serebii.net/pokedex-swsh/icon/${pokedexNumber?.padStart(
    3,
    '0'
  )}${regionFlag ?? ''}.png`;

export const getHighResSpriteUrl = (pokedexNumber: string, regionFlag?: string) =>
  `https://www.serebii.net/swordshield/pokemon/${pokedexNumber?.padStart(
    3,
    '0'
  )}${regionFlag ?? ''}.png`;

export const removeRegionFlag = (name: string) => (name.indexOf('-') > 0) ? name.toLowerCase().substring(0, name.indexOf('-')) : name;
export const getRegionFlag = (name: string) => (name.indexOf('-') > 0) ? name.substring(name.indexOf('-')) : undefined;