const version = process.env.REACT_APP_VERSION;

export const getLocalStorageItemV2 = ({
  name,
  defaultValue,
  flush = false,
}) => {
  const value = localStorage.getItem(name);

  if (flush || ["undefined"].includes(value)) {
    return defaultValue;
  }

  const parsedValue = JSON.parse(value);
  const valueVersion = localStorage.getItem(`${name}_version`);

  if (parsedValue && version === valueVersion) {
    return parsedValue;
  }

  return defaultValue;
};

export const getLocalStorageItem = (name, defaultValue) => {
  const value = localStorage.getItem(name);

  if (["undefined"].includes(value)) {
    return defaultValue;
  }

  const parsedValue = JSON.parse(value);
  const valueVersion = localStorage.getItem(`${name}_version`);

  if (parsedValue && version === valueVersion) {
    return parsedValue;
  }

  return defaultValue;
};

export const setLocalStorageItem = (name, value) => {
  localStorage.setItem(name, JSON.stringify(value));
  localStorage.setItem(`${name}_version`, version);
};
