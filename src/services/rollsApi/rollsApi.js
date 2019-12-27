import queryString from "query-string";
import { jsonApiDeserialize } from "./deserializer/deserializer";
const rollsApiUrl = `http://${process.env.REACT_APP_API_ROUTE}`;

export const rollsApiGet = async (endpoint, queryParams, options) => {
  const stringifiedQueryParams = queryString.stringify(queryParams, {
    arrayFormat: "index"
  });
  const route = `${rollsApiUrl}/${endpoint}?${stringifiedQueryParams}`;

  const response = await fetch(route);
  const deserializedResponse = await jsonApiDeserialize(response);

  return deserializedResponse;
};
