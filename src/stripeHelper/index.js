//================================ React Native Imported Files ======================================//

import React from "react";
import {Platform} from "react-native";

const BASE_URL_TEST = "https://api.stripe.com/v1";
const BASE_URL_FILES_TEST = "https://files.stripe.com/v1";
const API_KEY = "pk_test_51I3zyXJeFP4nLZjMYCce3Mli7uSAqUOCxS0M8MIAJ3A3xjxVqBsdyWCKVTPn6Tqs6ZjtPYSUZiS4SAVTc3smdBBj00kOSZUvuO";


class stripeService {
  constructor(props) {}

  createCustomerNew = (name, email, callback) => {

    let url = BASE_URL_TEST + "/customers";

    let customerBody = {
      "name": name,
      "email": email,
    };

    let formBody = this.createFormBody(customerBody);

    console.log("formBody ====>", formBody);

    fetch(url, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + API_KEY,
      },
      body: formBody
    }).then(response => response.json()).then(data => {
      callback(data)
    }).catch(response => {
      callback("")
    });
  }
  getToken = (data, callback) => {

    let url = BASE_URL_TEST + "/tokens";

    let body = {
        "card[name]":data.name,
        "card[number]":data.number,
        "card[exp_month]": data.exp_month,
        "card[exp_year]": data.exp_year,
        "card[cvc]": data.cvc,
        "card[address_zip]": data.address_zip
    }
    let formBody = this.createFormBody(body);

    console.log("formBody ====>", formBody);

    fetch(url, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + API_KEY,
      },
      body: formBody
    }).then(response => response.json()).then(data => {
      callback(data)
    }).catch(response => {
      callback("")
    });
  }

  getCustomerPaymentMethod = (customerID, callback) => {

    let url = BASE_URL_TEST + "/payment_methods?customer=" + customerID + "&type=card";

    fetch(url, {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + API_KEY,
      },
    }).then(response => response.json()).then(data => {
      callback(data)
    }).catch(response => {
      callback("")
    });

  }


  createPaymentMethod = (cardNumber, exp_month, exp_year, cvc, callback) => {

    let url = BASE_URL_TEST + "/payment_methods";


    let cardDetails = {
      "type": 'card',
      "card[number]": cardNumber,
      "card[exp_month]": exp_month,
      "card[exp_year]": exp_year,
      "card[cvc]": cvc,
    };

    let formBody = this.createFormBody(cardDetails)

    fetch(url, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + API_KEY,
      },
      body: formBody
    }).then(response => response.json()).then(data => {
      console.log("createPaymentMethod ====>", data);
      callback(data)
    }).catch(error => {
      console.log("createPaymentMethod ====>", error);

      callback("")
    });

  }


  attachPaymentMethodToCustomer = (customerID, paymentMethodID, callback) => {

    let url = BASE_URL_TEST + "/payment_methods/" + paymentMethodID + "/attach"

    let customerDetails = {
      "customer": customerID
    };

    let formBody = this.createFormBody(customerDetails)

    fetch(url, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + API_KEY,
      },
      body: formBody
    }).then(response => response.json()).then(data => {
      console.log("attachPaymentMethodToCustomer ====>", data);

      callback(data)
    }).catch(error => {
      console.log("attachPaymentMethodToCustomer ====>", error);

      callback("")
    });


  }


  chargeCustomer = (chargeAmount, customerID, paymentID, callback) => {

    let url = BASE_URL_TEST + "/payment_intents"

    let chargeDetails = {
      "amount": chargeAmount * 100, //To convert dollar to cents
      "currency": "usd",
      "payment_method": paymentID,
      "customer": customerID,
      "confirm": true,
    };

    let formBody = this.createFormBody(chargeDetails)

    fetch(url, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + API_KEY,
      },
      body: formBody
    }).then(response => response.json()).then(data => {
      console.log("chargeCustomer ====>", data);
      callback(data)
    }).catch(error => {
      console.log("chargeCustomer ====>", error);
      callback("")
    });


  }

  updateCustomerCredit = (amount, customerID, callback) => {

    let url = BASE_URL_TEST + "/customers/" + customerID + "/balance_transactions"

    let balanceDetails = {
      "amount": amount * 100, //To convert dollar to cents
      "currency": "usd",
    };

    let formBody = this.createFormBody(balanceDetails)

    fetch(url, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + API_KEY,
      },
      body: formBody
    }).then(response => response.json()).then(data => {
      console.log("updateCustomerCredit ====>", data);
      callback(data)
    }).catch(error => {
      console.log("updateCustomerCredit ====>", error);
      callback("")
    });

  }

  getCustomerDetail = (customerID, callback) => {

    let url = BASE_URL_TEST + "/customers/" + customerID


    fetch(url, {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + API_KEY,
      },
    }).then(response => response.json()).then(data => {
      console.log("getCustomerDetail ====>", data);
      callback(data)
    }).catch(error => {
      console.log("getCustomerDetail ====>", error);
      callback("")
    });

  }

  createConnectedAccount = (
      firstName,
      lastName,
      email,
      phone,
      dob,
      address,
      state,
      city,
      country,
      postalCode,
      accountName,
      accountNumber,
      currency,
      idNumber,
      businessUrl,
      mcc,
      routingNumber,
      documentID,
      callback
  ) => {

    let url = BASE_URL_TEST + "/accounts"

    let accountDetails = {
      "type": "custom",
      "country": country,
      "email": email,
      "capabilities[card_payments][requested]": "true",
      "capabilities[transfers][requested]": "true",
      "business_type": "individual",
      "tos_acceptance[date]": 1609798905,
      "tos_acceptance[ip]": "8.8.8.8",
      "individual[address][state]": state,
      "individual[address][city]": city,
      "individual[address][line1]": address,
      "individual[address][postal_code]": postalCode,
      "individual[dob][day]": dob.day,
      "individual[dob][month]": dob.month,
      "individual[dob][year]": dob.year,
      "individual[first_name]": firstName,
      "individual[last_name]": lastName,
      "individual[phone]": phone,
      "individual[email]": email,
      "individual[id_number]": idNumber,
      "business_profile[url]": businessUrl,
      "business_profile[mcc]": mcc,
      "external_account[object]": "bank_account",
      "external_account[country]": country,
      "external_account[currency]": currency,
      "external_account[account_holder_name]": accountName,
      "external_account[account_number]": accountNumber,
      "external_account[routing_number]": routingNumber,
      "individual[verification][document][front]": documentID,
    };

    let formBody = this.createFormBody(accountDetails)

    fetch(url, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + API_KEY,
      },
      body: formBody
    }).then(response => response.json()).then(data => {
      console.log("createConnectedAccount ====>", data);

      callback(data)
    }).catch(error => {
      console.log("createConnectedAccount ====>", error);
      callback("")
    });



  }

  uploadFile = (file, callback) => {

    let url = BASE_URL_FILES_TEST + "/files"

    const data = new FormData();

    data.append('purpose', "identity_document");
    data.append('file', {
      name: file.fileName,
      type: `image/${file.fileName.split(".")[1]}`,
      uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
    });

    fetch(url, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + API_KEY,
      },
      body: data
    }).then(response => response.json()).then(data => {
      console.log("uploadFile ====>", data);

      callback(data)
    }).catch(error => {
      console.log("uploadFile ====>", error);
      callback("")
    });

  }


  payout = (amount, accountID, callback) => {

    let url = BASE_URL_TEST + "/transfers"

    let payoutDetails = {
      "amount": amount,
      "currency": "usd",
      "destination": accountID,
    };


    let formBody = this.createFormBody(payoutDetails)

    fetch(url, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + API_KEY,
      },
      body: formBody
    }).then(response => response.json()).then(data => {
      console.log("payout ====>", data);

      callback(data)
    }).catch(error => {
      console.log("payout ====>", error);
      callback("")
    });


  }

  getAvailableBalance = (callback) => {

    let url = BASE_URL_TEST + "/balance"

    fetch(url, {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + API_KEY,
      },
    }).then(response => response.json()).then(data => {
      console.log("getAvailableBalance ====>", data);

      callback(data)
    }).catch(error => {
      console.log("getAvailableBalance ====>", error);
      callback("")
    });


  }


  createFormBody = (body) => {
    let formBody = [];
    for (let property in body) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(body[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    return formBody;
  }

}

const apiService = new stripeService();

export default apiService;