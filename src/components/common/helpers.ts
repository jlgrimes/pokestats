export const getSpriteUrl = (pokedexNumber: string, regionFlag?: string) =>
  `https://www.serebii.net/pokedex-swsh/icon/${pokedexNumber?.padStart(
    3,
    '0'
  )}${regionFlag ?? ''}.png`;

export const getHighResSpriteUrl = (
  pokedexNumber: string,
  regionFlag?: string
) =>
  `https://www.serebii.net/swordshield/pokemon/${pokedexNumber?.padStart(
    3,
    '0'
  )}${regionFlag ?? ''}.png`;

export const removeRegionFlag = (name: string) =>
  name.indexOf('-') > 0
    ? name.toLowerCase().substring(0, name.indexOf('-'))
    : name;
export const getRegionFlag = (name: string) =>
  name.indexOf('-') > 0 ? name.substring(name.indexOf('-')) : undefined;

export const LOW_RES_SUBSTITUTE_URL =
  'https://archives.bulbagarden.net/media/upload/a/a5/SubstituteG5f.png';

export const HIGH_RES_SUBSTITUTE_URL =
  'https://www.pokencyclopedia.info/sprites/misc/spr_substitute/art__substitute.png';
