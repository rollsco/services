export const getDocWithId = queryDocumentSnapshot => {
  if (!queryDocumentSnapshot.exists) {
    return;
  }

  return {
    id: queryDocumentSnapshot.id,
    ...queryDocumentSnapshot.data(),
  };
};

export const getDocsWithId = collection => {
  return collection.docs.map(doc => getDocWithId(doc));
};

export const logError = (response, body) => {
  console.log("--There was an Error on Firebase");
  console.log("--response", response);
  console.log("--body", body);
};
