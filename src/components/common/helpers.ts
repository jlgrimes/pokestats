export const getSpriteUrl = (pokedexNumber: string) =>
  `https://www.serebii.net/pokedex-swsh/icon/${pokedexNumber?.padStart(3, '0')}.png`;

export const getHighResSpriteUrl = (pokedexNumber: string) =>
  `https://www.serebii.net/swordshield/pokemon/${pokedexNumber?.padStart(3, '0')}.png`;
