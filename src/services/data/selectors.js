export const selectOrderedObjects = (ids, objectMap) => 
  ids.map(id => objectMap[id]).sort((a ,b) => a.order > b.order);
