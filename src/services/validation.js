import moment from 'moment';
import RegexPatterns from '../constraints';
export const validateInput = (inputValue, canBeNull, minLength, maxLength, inputType, inputTitle) => {
    if(!canBeNull && inputValue.length === 0){
        return "Wartość pola " + inputTitle + " nie może być pusta";
    }

    if(minLength && inputValue.replace(/ /g,'').length < minLength){
        return "Wartość pola " + inputTitle + " ma za mało znaków";
    }

    if(maxLength && inputValue.replace(/ /g,'').length > maxLength){
        return "Wartość pola " + inputTitle + " ma za dużo znaków";
    }
    
    if(inputType){
        if(!RegexPatterns.projetctFormPattern[inputType].test(inputValue)){
            return "Nie prawidłowy format pola";
        }
    }
    
    return "";
}


export const validateDate = (startDate, endDate) => {
    if(startDate.isAfter(endDate))
        return ["Data rozpoczęcia nie powinna być poźniej niż data zakończenia", 
            "Data zakończenia nie może być wcześniej niż data rozpoczęcia"];
 
    return ["", ""];
}

export const validateReportPages = value => {
    if(!RegexPatterns.projetctFormPattern.number.test(value))
        return "Wartość musi być liczbą";
    
    return "";
}
