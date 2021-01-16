export const createToken = ({ length = 24 }) => {
  let token = "";
  const characters = "0123456789abcdefghijklmnopqrstuvwxyz";
  for (var i = length; i > 0; --i) {
    token += characters[parseInt(Math.random() * characters.length)];
  }

  return token;
};
