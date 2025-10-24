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
  MINIMALIST = 'Minimalist',
  ORNATE = 'Ornate',
  INDUSTRIAL = 'Industrial',
  RUSTIC = 'Rustic',
  CARTOON = 'Cartoon',
  PARCHMENT = 'Parchment',
  EGYPTIAN = 'Egyptian',
  GLASS = 'Glass',
}

export enum CardSize {
  STANDARD = 'Standard (2.5x3.5)',
  SQUARE = 'Square (1x1)',
  TAROT = 'Tarot (70x120mm)',
}

export enum CardFormat {
  PORTRAIT = 'Portrait',
  HORIZONTAL = 'Horizontal',
}

export enum ArtStyle {
  EPIC_FANTASY = 'Epic Fantasy',
  SCI_FI = 'Sci-Fi',
  ANIME = 'Anime',
  WATERCOLOR = 'Watercolor',
  PIXEL_ART = 'Pixel Art',
  CARTOON = 'Cartoon',
  PHOTOREALISTIC = 'Photorealistic',
  ABSTRACT = 'Abstract',
  STEAMPUNK = 'Steampunk',
  CYBERPUNK = 'Cyberpunk',
  HORROR = 'Horror',
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

// Map related types
export enum MapType {
  WORLD = 'World',
  CONTINENT = 'Continent',
  KINGDOM = 'Kingdom',
  CITY = 'City',
  DUNGEON = 'Dungeon',
  CAVERN = 'Cavern',
}

export enum MapStyle {
  SATELLITE = 'Satellite',
  FANTASY_ATLAS = 'Fantasy Atlas',
  PARCHMENT = 'Parchment',
  BLUEPRINT = 'Blueprint',
  PIXEL_ART = 'Pixel Art',
  SCI_FI_HOLO = 'Sci-Fi Hologram',
  HAND_DRAWN = 'Hand-drawn',
}

export enum GridType {
  NONE = 'None',
  SQUARE = 'Square',
  HEX = 'Hexagonal',
}

export interface MapData {
  mapUrl: string;
  mapType: MapType;
  mapStyle: MapStyle;
  gridType: GridType;
}
