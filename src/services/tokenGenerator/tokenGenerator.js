export const createToken = () => {
  let token = "";
  const length = 24;
  const characters = "0123456789abcdefghijklmnopqrstuvwxyz";
  for (var i = length; i > 0; --i) {
    token += characters[parseInt(Math.random() * characters.length)];
  }

  return token;
};
