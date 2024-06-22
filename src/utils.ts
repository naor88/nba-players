export const toPascalCaseWithSpaces = (str: string): string => {
  return str.replace(
    /(\w)(\w*)/g,
    (_, firstChar, rest) => firstChar.toUpperCase() + rest.toLowerCase()
  );
};

type IndexedObject = {
  [key: string]: any;
};

export function sortByIdList<T extends IndexedObject>(
  items: T[],
  idList: number[],
  key: string
): T[] {
  const getNestedValue = (obj: T, path: string): any => {
    return path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
  };

  return items.sort((a, b) => {
    const aValue = getNestedValue(a, key);
    const bValue = getNestedValue(b, key);
    return idList.indexOf(aValue) - idList.indexOf(bValue);
  });
}


