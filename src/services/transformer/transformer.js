export const applyPercentage = (number, discountPercentage) =>
  Math.ceil(number * (1 - discountPercentage / 100));

/**
 * Approximates to nearest divisible by 100, by the ceiling
 */
export const applyDiscountPercentage = (number, discountPercentage) =>
  Math.ceil((number * (1 - discountPercentage / 100)) / 100) * 100;
