import { itemTemplate } from "./itemTemplate";
import { currency } from "../formatter";

const propertyLabelMap = {
  addChopsticks: "Palillos",
  addWasabiAndGinger: "Wasabi+jengibre",
  addTeriyaki: "Teriyaki",
  addSoy: "Soya",
};

export const orderTemplate = (order, items, total) => `
------
ID: **2019-10-01-${parseInt(Math.random() * 10000) + 1000}**
**${order.userInfo.phone}**
**${order.userInfo.name}**
Dir: **${order.userInfo.address}**; **${order.userInfo.locality}**
Obs: **${order.userInfo.notes}**
Email: **${order.userInfo.email}**
Enviar: **${Object.keys(propertyLabelMap).map(key =>
  order.userInfo[key] ? propertyLabelMap[key] : "",
)}**
\`\`\`
${items.map(item => itemTemplate(item)).join("")}
\`\`\`
Total: \`${currency(total)}\`
`;
