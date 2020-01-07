export const fetchEmail = async ({ emailAddress, setEmail, firebase }) => {
  if (emailAddress === "") {
    return;
  }
  const email = await getEmail({ emailAddress, firebase });

  setEmail(email);
};

export const getEmail = async ({ emailAddress, firebase }) => {
  const email = await firebase.getDocument({
    path: "emails",
    document: emailAddress,
  });

  if (email) {
    return email;
  }

  const newEmail = {
    orders: {},
  };

  firebase.set({
    path: "emails",
    document: emailAddress,
    data: newEmail,
  });

  return newEmail;
};
