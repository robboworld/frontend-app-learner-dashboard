// Robbo: plain Date instead of moment — moment shipped all 137 locales in the
// bundle just to parse ISO strings. Like moment(), an undefined date means now.
export const dateFormatter = (formatDate, date) => formatDate(
  date === undefined ? new Date() : new Date(date),
  {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
);

export default dateFormatter;
