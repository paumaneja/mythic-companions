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

export type StatsDto = { health: number; energy: number; hunger: number; happiness: number; hygiene: number; };
export type ProgressionDto = { totalXp: number; level: number; currentXpInLevel: number; xpForNextLevel: number; };
export type EquippedWeaponDto = { itemId: string; name: string; imageUrl: string; };
export type CooldownsDto = { feed: string | null; play: string | null; clean: string | null; sleep: string | null; train: string | null; };
export type SpeciesDto = { id: string; name: string; description: string; };

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