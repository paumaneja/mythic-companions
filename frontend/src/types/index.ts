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