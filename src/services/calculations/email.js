import { getPoints as getPointsOrder } from "./order";

export const getPoints = orders => {
  const ordersPoints = Object.keys(orders).map(key =>
    getPointsOrder(orders[key].pointEntries),
  );

  return ordersPoints.reduce((sum, orderPoints) => sum + orderPoints, 0);
};
