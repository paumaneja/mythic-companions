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