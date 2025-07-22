export type UserDto = {
  id: number;
  username: string;
  email: string;
  avatarUrl: string | null;
  mythicCoins: number;
};

export type LoginResponseDto = {
  token: string;
  user: UserDto;
};

export type CompanionCardDto = {
  id: number;
  name: string;
  speciesId: string;
  status: 'ACTIVE' | 'SICK' | 'HOSPITALIZED';
  imageUrl: string;
  equippedWeaponId: string | null;
};

export type Universe = {
    id: string;
    name: string;
    speciesIds: string[];
};

export type Species = {
    speciesId: string;
    name: string;
    description: string;
    universeId: string;
    allowedWeaponTypes: string[];
};

export type AdoptionSpeciesDto = {
    speciesId: string;
    name: string;
};

export type AdoptionUniverseDto = {
    universeId: string;
    name: string;
    species: AdoptionSpeciesDto[];
};

export type ActionAssetDetails = {
  feed: string;
  play: string;
  sleep: string;
  clean: string;
  train: Record<string, string>;
};

export type SpeciesAssets = {
  static_unequipped: string;
  static_equipped: Record<string, string>;
  actions: ActionAssetDetails;
};

export type SpeciesDto = {
  id: string;
  name: string;
  description: string;
  assets: SpeciesAssets;
};

export type StatsDto = { health: number; energy: number; hunger: number; happiness: number; hygiene: number; };
export type ProgressionDto = { totalXp: number; level: number; currentXpInLevel: number; xpForNextLevel: number; };
export type EquippedWeaponDto = { itemId: string; name: string; imageUrl: string; };
export type CooldownsDto = { feed: string | null; play: string | null; clean: string | null; sleep: string | null; train: string | null; };

export type SanctuaryDto = {
  id: number;
  name: string;
  universeId: string;
  species: SpeciesDto;
  status: 'ACTIVE' | 'SICK' | 'HOSPITALIZED';
  stats: StatsDto;
  progression: ProgressionDto;
  equippedWeapon: EquippedWeaponDto | null;
  cooldowns: CooldownsDto;
};

export type ActionIcons = {
  feed: string;
  play: string;
  clean: string;
  sleep: string;
  train: string;
};

export type UiTheme = {
  action_icons: ActionIcons;
};

export type Item = {
  itemId: string;
  name: string;
  description: string;
  type: 'CONSUMABLE' | 'WEAPON';
  imageUrl: string;
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC';
  forSale: boolean;
  price: number;
  // 'effect' and 'weaponType' are not needed by the shop/inventory card, so we can omit them for now.
};

export type InventoryItemDto = {
  itemId: string;
  name: string;
  description: string;
  type: 'CONSUMABLE' | 'WEAPON';
  imageUrl: string;
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC';
  quantity: number;
  weaponType?: string;
};

export type DisplayableItem = {
  name: string;
  description: string;
  imageUrl: string;
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC';
};

export type Minigame = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
};

export type MinigameResultDto = {
        finalScore: number;
        isNewHighScore: boolean;
        rewards: MinigameRewardDto;
};

export type MinigameRewardDto = {
        mythicCoins: number;
        awardedItemId: string;
        awardedItemQuantity: number;
};

export type SubmitScoreResponseDto = {
  gameResult: MinigameResultDto;
  user: UserDto;
};

export type LoreQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
};

export type ApiError = {
  error: string;
};

export type RankingDto = {
  username: string;
  avatarUrl: string | null;
  score: number;
};