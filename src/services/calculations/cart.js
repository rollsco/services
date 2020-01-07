export const getTotalCost = items =>
  items.reduce((priceSum, item) => priceSum + item.totalPrice, 0);

export const getTotalPoints = items => {
  const totalCost = getTotalCost(items);

  return Math.floor(totalCost / 1000);
};
