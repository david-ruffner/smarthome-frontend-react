import {useUI} from "../context/UIContext.jsx";

export function isStrEmpty(str) {
    return (str === null || str === undefined || str === '');
}

export function logErr({
                           errMsg,
                           header = "ERROR",
                           data = null
                       } = {}) {
    console.log(`${header} | ${new Date().toLocaleTimeString()} | ${errMsg}`);
    if (data !== null) {
        console.log(data);
    }
}

export function fetchToken() {
    let token = localStorage.getItem('token');

    if (isStrEmpty(token)) {
        logErr({errMsg: 'token was not found in session storage'});
        return null;
    }

    return token;
}