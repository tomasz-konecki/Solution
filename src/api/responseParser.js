import en from '../translations/en';
import pl from '../translations/pl';
import storeCreator from "./../store";
import redux from "redux";
import storage from "redux-persist/lib/storage";


const { store } = storeCreator;

store.subscribe(listener);

const selectLang = state =>
  state.languageReducer.language !== undefined ? state.languageReducer.language : "pl";

let t = () => {};

function listener() {
  switch(selectLang(store.getState())){
    case "pl":
      t = (key) => {
        return pl['ResultBlock'][key];
      };
      break;
    case "en":
      t = (key) => {
        return en['ResultBlock'][key];
      };
      break;
  }
}

class ResponseParser {
  constructor(replyBlock, successMessage = 'OK!', customErrors = {}) {
    const defaultServerError = t("InternalServerError");
    const {
      _400 = t("BadRequest"),
      _401 = t("Unauthorized"),
      _403 = t("Forbidden"),
      _404 = t("NotFound"),
      _406 = t("NotAcceptable"),
      _500 = defaultServerError,
      _501 = t("NotImplemented"),
      _502 = defaultServerError,
      _503 = t("ServiceUnavailable"),
      _504 = t("GatewayTimeout")
    } = customErrors;

    this.diagnoses = {
      400: _400,
      401: _401,
      403: _403,
      404: _404,
      406: _406,
      500: _500,
      501: _501,
      502: _502,
      503: _503,
      504: _504,
    };

    this.replyBlock = replyBlock;
    this.original = replyBlock;
    this.responseLevel = -2;
    this.successMessage = successMessage;
    this.proper = false;
    this.parsed = false;
    this._errors = [];

    return this;
  }
  checkLevel = () => {
    if(this.replyBlock.response === undefined && this.replyBlock.request !== undefined && this.replyBlock.data === undefined) return this.responseLevel = -1;
    if(this.replyBlock.data !== undefined) this.responseLevel = 0;
    if(this.replyBlock.response !== undefined) this.responseLevel = 1;
    this.proper = true;
  }
  diagnosis = () => {
    let status = this.statusCode();
    let message = '';
    switch (true) {
      case (status > 199) && (status < 400):
        message = this.successMessage;
        break;
      case status >= 400: {
        message = this.diagnoses[status];
        break;
      }
      default:
        message = t("UnexpectedError");
        break;
    }
    this.message = message;
  }
  statusCode = () => {
    return this.replyBlock.status;
  }
  isSequential = () => {
    return this.replyBlock.data.dtoObjects !== undefined;
  }
  extractData = () => {
    if(this.isSequential()) return this.replyBlock.data.dtoObjects;
    else return this.replyBlock.data.dtoObject;
  }
  errorOccurred = () => {
    if(this.responseLevel === 0) return false;
    if(this.responseLevel === -1) return true;
    if(this.proper && this.replyBlock.data !== undefined){
      return this.replyBlock.data.errorOccurred;
    }
    else throw "Tried to determine error status without a proper response block";
  }
  getMostSignificantText = () => {
    if(this.responseLevel === -1) return this.original.message;

    if(this.errorOccurred()){
      if(this._errors !== undefined) return this._errors[0]['message'];
      else throw 'An error occurred, but no error was present.';
    }
    else return this.successMessage;
  }
  getMostSignificantErrorText = () => {
    if(!this.errorOccurred()) throw "Tried to pull an error when no such occurred";
    if(this.responseLevel === -1) return this.original.message;

    return this._errors[0]['message'];
  }
  errors = () => {
    return {
      [Symbol.iterator]() {
        return {
          next() {
            return {
              done: this._errors.length === 0,
              value: this._errors.pop()
            };
          }
        };
      }
    };
  }
  jsErrorString = () => {
    if(!this.errorOccurred()) throw "Tried to pull an error when no such occurred";
    return this.original.toString();
  }
  jsError = () => {
    if(!this.errorOccurred()) throw "Tried to pull an error when no such occurred";
    return this.original;
  }
  colorBlock = () => {
    return {
      color: this.errorOccurred() ? 'red': 'green',
      text: this.getMostSignificantText()
    };
  }
  parse = () => {
    if(!this.parsed){
      this.checkLevel();

      switch(this.responseLevel) {
        case -2: {
          return {
            success: false,
            data: null,
            status: 0,
            message: 'Fatal parser error',
            errors: [],
            diagnosis: 'Fatal parser error'
          };
        }
        case -1:
          return {
            success: false,
            data: null,
            status: 0,
            message: this.jsErrorString().split('Error: ')[1],
            errors: this._errors,
            diagnosis: this.jsErrorString().split('Error: ')[1]
          };
        case 0:
          this.replyBlock = this.replyBlock;
          break;
        case 1:
          if(
            this.replyBlock.response === undefined
            ||
            this.replyBlock.response.data === undefined
            ||
            this.replyBlock.response.data.errorObjects === undefined) {
            this.replyBlock = this.replyBlock.response;
            break;
          }
          Object.entries(this.replyBlock.response.data.errorObjects).map(([index, modelEntry], _index) => {
            Object.entries(modelEntry.errors).map(([code, message], index) => {
              this._errors.push({code, message});
            });
          });
          this.replyBlock = this.replyBlock.response;
          break;
        case 2:
          this.replyBlock = this.replyBlock.response.response;
          break;
        case 3:
          this.replyBlock = this.replyBlock.response.response.response;
          break;
      }

      this.diagnosis();
      this.parsed = true;
    }

    return {
      success: !this.errorOccurred(),
      data: this.extractData(),
      status: this.statusCode(),
      message: this.getMostSignificantText(),
      errors: this.errors,
      diagnosis: this.message,
      originalMessage: this.errorOccurred() ? this.original.message : this.successMessage,
      colorBlock: this.colorBlock()
    };
  }
}

export default ResponseParser;
