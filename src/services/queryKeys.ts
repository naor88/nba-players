export const QUERY_KEYS = {
  PLAYERS: (nextCursor: number, itemsPerPage: number, deferredQueryStr: string) => ["Players", nextCursor, itemsPerPage, deferredQueryStr],
  FAVORITES: (nextCursor: number, itemsPerPage: number, deferredQueryStr: string, favoritesIds: number[]) => ["Favorites", nextCursor, itemsPerPage, deferredQueryStr, ...favoritesIds],
  STATS: (nextCursor: number, itemsPerPage: number, deferredQueryStr: string, favoritesIds: number[]) => ["Stats", nextCursor, itemsPerPage, deferredQueryStr, ...favoritesIds],
  AVATAR: (id: number) => ["Avatar", id],
};
