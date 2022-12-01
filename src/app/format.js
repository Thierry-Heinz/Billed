export const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const ye = new Intl.DateTimeFormat('fr', { year: 'numeric' }).format(date)
  const mo = new Intl.DateTimeFormat('fr', { month: 'short' }).format(date)
  const da = new Intl.DateTimeFormat('fr', { day: '2-digit' }).format(date)
  const month = mo.charAt(0).toUpperCase() + mo.slice(1)
  return `${parseInt(da)} ${month.substr(0,3)}. ${ye.toString().substr(2,4)}`
}

export function dateFrToFormatDate(date) {
  const monthsDateFR = [
    "Jan.",
    "Fev.",
    "Mar.",
    "Avr.",
    "Mai",
    "Juin",
    "Juil.",
    "Aou.",
    "Sep.",
    "Oct.",
    "Nov.",
    "Dec.",
  ];
  let formatedDate = date;
  let arrFormatedDate = formatedDate.split(" ");
  arrFormatedDate.reverse();

  // format the Year
  arrFormatedDate[0] = "20" + arrFormatedDate[0];
  // format the Month
  arrFormatedDate[1] = monthsDateFR.indexOf(arrFormatedDate[1]) + 1;
  if (arrFormatedDate[1] < 10) {
    arrFormatedDate[1] = "0" + arrFormatedDate[1];
  }
  // format the Day
  if (arrFormatedDate[2] < 10) {
    arrFormatedDate[2] = "0" + arrFormatedDate[2];
  }
  return (
    arrFormatedDate[0] + "-" + arrFormatedDate[1] + "-" + arrFormatedDate[2]
  );
}
 
export const formatStatus = (status) => {
  switch (status) {
    case "pending":
      return "En attente"
    case "accepted":
      return "Accepté"
    case "refused":
      return "Refused"
  }
}