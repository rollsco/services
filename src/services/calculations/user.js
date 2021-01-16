export const getPoints = (pointEntries) => {
  return pointEntries.reduce((sum, pointsEntry) => sum + pointsEntry.points, 0);
};
