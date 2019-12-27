import React from "react";

export const utcDate = (
  date = new Date(),
  isoFormat = false,
  includeTime = false,
) => {
  const hours = date
    .getUTCHours()
    .toString()
    .padStart(2, "0");
  const minutes = date
    .getUTCMinutes()
    .toString()
    .padStart(2, "0");
  const timeString = `a las ${hours}:${minutes}`;
  const dateString = date.toDateString();
  const isoDateString = `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`;

  if (isoFormat) {
    return includeTime ? `${isoDateString} ${timeString}` : isoDateString;
  } else {
    return includeTime ? `${dateString} ${timeString}` : dateString;
  }
};

export const date = (date, isoFormat, includeTime) => {
  const hours = date
    .getHours()
    .toString()
    .padStart(2, "0");
  const minutes = date
    .getMinutes()
    .toString()
    .padStart(2, "0");
  const timeString = `a las ${hours}:${minutes}`;
  const dateString = date.toDateString();
  const isoDateString = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

  if (isoFormat) {
    return includeTime ? `${isoDateString} ${timeString}` : isoDateString;
  } else {
    return includeTime ? `${dateString} ${timeString}` : dateString;
  }
};

export const currency = value =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

export const multiline = value => {
  if (value) {
    return value.split("\n").map((line, index) => <p key={index}>{line}</p>);
  }
};
