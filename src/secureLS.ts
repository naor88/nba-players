import secureLocalStorage from "react-secure-storage";

const get = (key: string): any => {
  return secureLocalStorage.getItem(key);
};

const set = (key: string, value: any) => {
  secureLocalStorage.setItem(key, value);
};

const remove = (key: string) => {
  secureLocalStorage.removeItem(key);
};

export { get, set, remove };
