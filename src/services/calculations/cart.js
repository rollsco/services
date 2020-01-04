export const getTotalPriceFromCartBeforeDiscount = items =>
  items.reduce((sum, { product }) => sum + product.price, 0);

// export const getTotalPriceFromCartAfterDiscount = items =>
//   items.reduce((sum, { product }) => sum + product.price, 0);

export const calculateTotalCost = items =>
  items.reduce((priceSum, item) => priceSum + item.totalPrice, 0);

export const calculateTotalPoints = items => {
  const totalCost = calculateTotalCost(items);

  return Math.floor(totalCost / 1000);
}