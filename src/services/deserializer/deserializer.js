const JSONAPIDeserializer = require("jsonapi-serializer").Deserializer;
const deserializerOptions = { keyForAttribute: "camelCase" };

export const jsonApiDeserialize = async response => {
  const responseData = await response.json();
  return await new JSONAPIDeserializer(deserializerOptions).deserialize(
    responseData
  );
};
