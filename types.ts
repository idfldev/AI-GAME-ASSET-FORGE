export enum CardType {
  ATTACK = 'Attack',
  SKILL = 'Skill',
  RESOURCE = 'Resource',
  CREATURE = 'Creature',
  EVENT = 'Event',
  LOCATION = 'Location',
  EQUIPMENT = 'Equipment',
  CLUE = 'Clue',
  CHARACTER = 'Character',
  TRAP = 'Trap',
  ITEM = 'Item',
}

export enum CardFont {
  FANTASY = 'Fantasy',
  SCIFI = 'Sci-Fi',
  MEDIEVAL = 'Medieval',
  HORROR = 'Horror',
  MODERN = 'Modern',
  COMIC = 'Comic',
  CHILDLIKE = 'Childlike',
  SCRIPT = 'Script',
  TYPING = 'Typing',
}

export enum CardFrame {
  CLASSIC = 'Classic',
  ORNATE = 'Ornate',
  MINIMALIST = 'Minimalist',
  INDUSTRIAL = 'Industrial',
  RUSTIC = 'Rustic',
  EGYPTIAN = 'Egyptian',
  CARTOON = 'Cartoon',
  PARCHMENT = 'Parchment',
  GLASS = 'Glass',
}

export enum CardSize {
  STANDARD = 'Standard (63x88mm)',
  JAPANESE_MINI = 'Japanese Mini (59x86mm)',
  LARGE = 'Large (70x110mm)',
  SQUARE = 'Square (60x60mm)',
  TAROT = 'Tarot (70x120mm)',
}

export enum CardFormat {
  PORTRAIT = 'Portrait',
  HORIZONTAL = 'Horizontal',
}

export enum ArtStyle {
  EPIC_FANTASY = 'Epic Fantasy',
  SCI_FI = 'Sci-Fi',
  STEAMPUNK = 'Steampunk',
  PIXEL_ART = 'Pixel Art',
  OIL_PAINTING = 'Oil Painting',
  WATERCOLOR = 'Watercolor',
  THREE_D_RENDER = '3D Render',
  MINIMALIST = 'Minimalist',
  CARTOON = 'Cartoon',
  ANIME = 'Anime',
}

export interface CardData {
  name: string;
  description: string;
  flavorText: string;
  artUrl: string;
  cardType: CardType;
  cardFont: CardFont;
  cardFrame: CardFrame;
  cardSize: CardSize;
  cardFormat: CardFormat;
}

export enum MapShape {
  SQUARE = 'Square',
  HEXAGON = 'Hexagon',
}

export enum MapTerrain {
    FOREST = 'Forest',
    DESERT = 'Desert',
    SNOW = 'Snow',
    VOLCANO = 'Volcano',
    CITY = 'City'
}