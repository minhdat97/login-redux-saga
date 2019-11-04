import { call, put, takeLatest } from "redux-saga/effects";

import { AUTH_REQUEST, AUTH_SUCCESS, AUTH_FAILURE } from "./reducer";

import axios from "axios";

const fetchAPI = options =>
  new Promise((resolve, reject) => {
    return axios(options)
      .then(response => {
        console.log(response.data.code);
        console.log(response);
        response.data.code !== 1000 ? reject(response) : resolve(response);
      })
      .catch(error => reject(error));
  });

function* authorize({ payload: { account, password } }) {
  console.log(JSON.stringify({ account, password }));
  const options = {
    method: "POST",
    url: "https://sbx-account.payme.vn/Account/Login",
    data: JSON.stringify({ account, password }),
    headers: { "Content-Type": "application/json" }
  };

  try {
    const token = yield call(fetchAPI, options);
    console.log("token", token);
    yield put({ type: AUTH_SUCCESS, payload: token.data.data.accessToken });
    localStorage.setItem("token", token);
  } catch (error) {
    let message;
    console.log("error", error);
    switch (error.data.code) {
      case 400:
        message = error.data.data.message;
        break;
      case 401:
        message = error.data.data.message;
        break;
      case 1001:
        message = error.data.data.message;
        break;
      default:
        message = "Something went wrong!";
    }
    yield put({ type: AUTH_FAILURE, payload: message });
    localStorage.removeItem("token");
  }
}

function* Saga() {
  yield takeLatest(AUTH_REQUEST, authorize);
}

export default Saga;
