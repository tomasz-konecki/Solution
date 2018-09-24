import moment from "moment";
import RegexPatterns from "../constraints";

export const validateInput = (
  inputValue,
  canBeNull,
  minLength,
  maxLength,
  inputType,
  inputTitle,
  range
) => {
  if (!canBeNull && inputValue.length === 0) {
    return "Wartość pola " + inputTitle + " nie może być pusta";
  }
  if (inputValue !== "" && minLength && inputValue.replace(/ /g, "").length < minLength) {
    return "Wartość pola " + inputTitle + " ma za mało znaków";
  }

  if (maxLength && inputValue.replace(/ /g, "").length > maxLength) {
    return "Wartość pola " + inputTitle + " ma za dużo znaków";
  }

  if(range && inputValue.length > 0){
    const timeValueWithDate = "10-12-1994" + inputValue;
    const momentFormatTime = moment(timeValueWithDate,"DD-MM-YYYY HH:mm");

    const startTimeValue = "10-12-1994" + range.startValue;
    const endTimeValue = "10-12-1994" + range.endValue;

    const momentStartTimeValue = moment(startTimeValue, "DD-MM-YYYY HH:mm");
    const momentEndTimeValue = moment(endTimeValue, "DD-MM-YYYY HH:mm");
    
    if(momentFormatTime.isBefore(momentStartTimeValue))
      return `Podana pora dnia jest zbyt wczesna`;

    if(momentFormatTime.isAfter(momentEndTimeValue))
      return `Podana pora dnia jest zbyt późna`;
  }

  if (inputType && !canBeNull) {
    if (!RegexPatterns.projetctFormPattern[inputType].test(inputValue)) {
      return "Nieprawidłowy format pola";
    }
  }

  return "";
};

export const validateDate = (startDate, endDate) => {
  if (startDate.isAfter(endDate))
    return [
      "Data rozpoczęcia nie powinna być poźniej niż data zakończenia",
      "Data zakończenia nie może być wcześniej niż data rozpoczęcia"
    ];

  return ["", ""];
};

export const validateReportPages = value => {
  if (!RegexPatterns.projetctFormPattern.number.test(value))
    return "Wartość musi być liczbą";

  return "";
};

export const validateDateIsNotFromPast = givenDate => {
  const dateNow = moment();
  if(moment(givenDate, 'DD-MM-YYYY').isBefore(dateNow)){
    return "Podana data nie może odnosić do przeszlości";
  }

  return "";
}