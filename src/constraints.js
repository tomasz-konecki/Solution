const constraints = {
  projetctFormPattern: {
    name: /^[0-9a-z\s-]+$/i,
    client: /(.*?)/,
    firstName: /^[A-Z][a-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+$/i,
    lastName: /^[a-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+$/i,
    email: /^([a-z\d.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/,
    phoneNumber: /^(?=.*\d)[\d ]+$/
  }
};

export default constraints;
