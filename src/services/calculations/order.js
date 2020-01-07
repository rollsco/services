export const getPoints = pointEntries =>
  Object.keys(pointEntries).reduce(
    (sum, key) => sum + pointEntries[key].points,
    0,
  );
