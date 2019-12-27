import request from "request";
import { orderTemplate } from "./orderTemplate";

const createOrderMessage = order => {
  const { items } = order.cart;
  const total = items.reduce((sum, item) => (sum += item.product.price), 0);

  return orderTemplate(order, items, total);
};

const sendMessage = (orderOnFirebase, { onSuccess, onError }) => {
  const method = "sendMessage";
  const text = createOrderMessage(orderOnFirebase);
  let chatId = process.env.REACT_APP_TELEGRAM_GROUP_ID;

  // TODO remove when staging ENV ready
  if (orderOnFirebase.userInfo.notes === "--test") {
    chatId = process.env.REACT_APP_TELEGRAM_DEVELOPMENT_ID;
  }

  request(
    {
      uri: `${process.env.REACT_APP_TELEGRAM_BOT_URL}/${method}`,
      qs: {
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
      },
    },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        onError(error, response);
      } else {
        onSuccess(response, body);
      }
    },
  );

  return;
};

export const telegramBot = {
  sendMessage,
};
