export const fetchOrders = async ({ options, setOrders, firebase }) => {
  const orders = await getOrders({ options, firebase });

  setOrders(orders);
};

export const getOrders = async ({ options, firebase }) => {
  const orders = await firebase.getList({
    path: "orders",
    ...options,
  });

  return orders;
};
