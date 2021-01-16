/**
 * Returns an Array of the object's properties' values. Useful to convert maps into lists
 */
export const getListFromObject = (object) =>
  Object.keys(object).map((key) => object[key]);

export const applyPercentage = (number, discountPercentage) =>
  Math.ceil(number * (1 - discountPercentage / 100));

/**
 * Approximates to nearest divisible by 100, by the ceiling
 */
export const applyDiscountPercentage = (number, discountPercentage) =>
  Math.ceil((number * (1 - discountPercentage / 100)) / 100) * 100;
