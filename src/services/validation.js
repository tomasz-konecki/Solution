import moment from "moment";
import RegexPatterns from "../constraints";

export const validateInput = (
inputValue, canBeNull, minLength, maxLength, inputType, inputTitle, range, validateDateRangeIsHigherThanObject) => {
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
  
  if(validateDateRangeIsHigherThanObject){
    const inputValueWithDate = "10-12-1994" + inputValue;
    const momentedInputValue = moment(inputValueWithDate, "DD-MM-YYYY HH:mm");

    const startTimeWithDate = "10-12-1994" + validateDateRangeIsHigherThanObject.startValue.time;
    const startTimeWithDateMomented = moment(startTimeWithDate, "DD-MM-YYYY HH:mm");
    
    if(validateDateRangeIsHigherThanObject.startValue.isHelpOnly && momentedInputValue.isBefore(startTimeWithDateMomented))
      return "Podana pora dnia jest zbyt wczesna";
    if(!validateDateRangeIsHigherThanObject.startValue.isHelpOnly && momentedInputValue.isSameOrBefore(startTimeWithDateMomented.add(1, "hours")))
      return "Podana data nie może być równa lub mniejsza niż poprzednia data";

    const endTimeWithDate = "10-12-1994" + validateDateRangeIsHigherThanObject.endValue.time;
    const endTimeWithDateMomented = moment(endTimeWithDate, "DD-MM-YYYY HH:mm");
    
    if(momentedInputValue.isSameOrAfter(endTimeWithDateMomented)){
      return "Podana data nie może być równa lub większa od następnej daty";
    }

      const difference = momentedInputValue.diff(endTimeWithDateMomented);
      const hours = Math.abs(moment.duration(difference).hours());
      if(hours === 0){
        return "Odległość czasowa pomiędzy datami powinna mieć conajmniej godzinę";
      }
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
  if(moment(givenDate, 'DD-MM-YYYY').isSameOrBefore(dateNow)){
    return "Podana data nie może odnosić do przeszlości";
  }

  return "";
}
