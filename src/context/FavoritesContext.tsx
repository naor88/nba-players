import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";

interface FavoritesContextType {
  favorites: number[];
  addFavorite: (id: number) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  handleFavoriteToggle: (id: number) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

const FAVORITES_KEY = "favoritePlayers";

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_KEY);
      return storedFavorites ? JSON.parse(storedFavorites) : [];
    } catch (error) {
      console.error("Failed to load favorites from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error("Failed to save favorites to localStorage", error);
    }
  }, [favorites]);

  const addFavorite = useCallback((id: number) => {
    setFavorites((prevFavorites) => {
      const updatedFavorites = Array.from(new Set([id, ...prevFavorites])).sort(
        (a, b) => a - b
      );
      return updatedFavorites;
    });
  }, []);

  const removeFavorite = useCallback((id: number) => {
    setFavorites((prevFavorites) => {
      const updatedFavorites = prevFavorites.filter(
        (favoriteId) => favoriteId !== id
      );
      return updatedFavorites;
    });
  }, []);

  const isFavorite = useCallback(
    (id: number): boolean => {
      return favorites.includes(id);
    },
    [favorites]
  );

  const handleFavoriteToggle = useCallback(
    (id: number) => {
      if (isFavorite(id)) {
        removeFavorite(id);
      } else {
        addFavorite(id);
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        handleFavoriteToggle,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
