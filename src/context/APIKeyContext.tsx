import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { validateApiKeyAPI } from "../api";
import * as ls from "../secureLS";

interface APIKeyContextProps {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  isValidating: boolean;
}

const APIKeyContext = createContext<APIKeyContextProps | undefined>(undefined);

export const APIKeyProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(true);

  useEffect(() => {
    const storedKey = ls.get("apiKey");
    if (storedKey) {
      validateApiKey(storedKey).then((isValid) => {
        if (isValid) {
          setApiKeyState(storedKey);
        } else {
          ls.remove("apiKey");
        }
        setIsValidating(false);
      });
    } else {
      setIsValidating(false);
    }
  }, []);

  const setApiKey = (key: string) => {
    validateApiKey(key).then((isValid) => {
      if (isValid) {
        ls.set("apiKey", key);
        setApiKeyState(key);
      } else {
        alert("Invalid API Key");
      }
    });
  };

  return (
    <APIKeyContext.Provider value={{ apiKey, setApiKey, isValidating }}>
      {children}
    </APIKeyContext.Provider>
  );
};

export const useApiKey = (): APIKeyContextProps => {
  const context = useContext(APIKeyContext);
  if (context === undefined) {
    throw new Error("useApiKey must be used within an APIKeyProvider");
  }
  return context;
};

const validateApiKey = async (key: string): Promise<boolean> => {
  return await validateApiKeyAPI(key);
};
