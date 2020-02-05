import {
  daysOfMonth,
  getDateFromTimestamp,
  getDateString,
  getCurrentDayOfMonth,
  getCurrentYear,
  getCurrentMonth,
} from "../datetime/date";
import { getTotalCost } from "../calculations/cart";

export const fetchReports = async ({
  year = getCurrentYear(),
  month = getCurrentMonth(),
  setReports,
  firebase,
}) => {
  const intYear = parseInt(year);
  const intMonth = parseInt(month);
  const isMonthOver = ((intYear*100)+intMonth) < ((getCurrentYear()*100)+getCurrentMonth());

  const maxDay = isMonthOver ? 32 : getCurrentDayOfMonth();
  const reports = await Promise.all(
    daysOfMonth.map(day => {
      if (day < maxDay) {
        const dayString = day.toString().padStart(2, "0");
        const monthString = month.toString().padStart(2, "0");
        const dateString = `${year}-${monthString}-${dayString}T00:00:00`;
        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
          return null;
        } else {
          return getReport({ date, firebase });
        }
      }

      return null;
    }),
  );

  setReports(reports.filter(report => report));
};

export const getReport = async ({ date = new Date(), firebase }) => {
  const report = await firebase.getDocument({
    path: "reports/daily/reports",
    document: getDateString(date),
  });

  if (report) {
    return report;
  }

  const nextDay = new Date(date);
  nextDay.setHours(nextDay.getHours() + 24);

  const orders = await firebase.getList({
    path: "orders",
    orderBy: ["created-desc"],
    limit: 999,
    where: [["created", ">", date], ["created", "<", nextDay]],
  });

  if (!orders || orders.length === 0) {
    return;
  }

  const newReport = getNewReport({ orders, firebase });

  firebase.set({
    path: "reports/daily/reports",
    document: getDateString(date),
    data: newReport,
  });

  return newReport;
};

const getNewReport = ({ orders }) => {
  const newReport = {
    orders: orders.length,
    totalPriceBeforeDiscount: 0,
    hours: {},
    clients: {},
    products: {},
    ratings: [],
    comments: [],
    numberUniqueClients: 0,
    averageRating: [],
    averagePriceBeforeDiscount: 0,
  };

  orders.map(order => {
    newReport.totalPriceBeforeDiscount += getTotalCost(order.cart.items);

    const userEmail = order.userInfo.email;
    newReport.clients[userEmail] = newReport.clients[userEmail]
      ? newReport.clients[userEmail] + 1
      : 1;

    const orderedAtHour = getDateFromTimestamp(order.created).getHours();
    newReport.hours[orderedAtHour] = newReport.hours[orderedAtHour]
      ? newReport.hours[orderedAtHour] + 1
      : 1;

    order.cart.items.map(({ main }) => {
      newReport.products[main.name] = newReport.products[main.name]
        ? newReport.products[main.name] + 1
        : 1;

        return null;
    });

    if (order.rating) {
      newReport.ratings.push(order.rating);
    }

    if (order.comments) {
      newReport.comments.push({
        name: order.userInfo.name,
        email: order.userInfo.email,
        rating: order.rating,
        comments: order.comments,
      });
    }

    return null;
  });

  newReport.numberUniqueClients = Object.keys(newReport.clients).length;
  const totalRating = newReport.ratings.reduce(
    (sum, rating) => sum + rating,
    0,
  );
  newReport.averageRating = (totalRating / newReport.ratings.length).toFixed(1);
  newReport.averagePriceBeforeDiscount =
    newReport.totalPriceBeforeDiscount / newReport.orders;

  return newReport;
};
