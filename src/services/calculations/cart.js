export const getTotalPriceFromCartBeforeDiscount = cart =>
cart.items.reduce((sum, { product }) => sum + product.price, 0);

// export const getTotalPriceFromCartAfterDiscount = cart =>
// cart.items.reduce((sum, { product }) => sum + product.price, 0);