export interface SingleSpriteProps {
  name: string;
  big?: boolean;
  shouldBlur?: boolean;
}

export interface SpriteDisplayProps {
  pokemonNames?: string[];
  deckId?: number;
  hidden?: boolean;
  verified?: boolean;
  squishWidth?: boolean;
  big?: boolean;
  shouldBlurSecondSprite?: boolean;
}

export interface SpritesProps extends SpriteDisplayProps {
  shouldHideVerification?: boolean;
}
