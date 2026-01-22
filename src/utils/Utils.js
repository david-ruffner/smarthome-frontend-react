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

// Takes a string like 7 AM or 3 PM, and returns 24hr time.
export function get24HrFromSimpleTimeStr(timeStr) {
    const [_, numStr, period] = timeStr.trim().match(/^(\d{1,2})\s*(AM|PM)$/i) || [];
    if (!numStr || !period) return NaN;

    let num = Number.parseInt(numStr, 10);
    const p = period.toUpperCase();

    if (p === 'AM') {
        if (num === 12) num = 0;      // 12 AM -> 0
    } else { // PM
        if (num !== 12) num += 12;    // 1 PM..11 PM -> 13..23, 12 PM stays 12
    }

    return num;
}

// Takes a full zoned timestamp string, and returns different time formats.
export function getTimeFor24Hr({
   time,
   includeMinutes = false,
   return24Hrs = false
} = {}) {
    if (return24Hrs) {
        const d = new Date(time);
        if (Number.isNaN(d.getTime())) {
            logErr({
                errMsg: "Invalid timestamp"
            })
        } else {
            return d.getHours();
        }
    }

    if (includeMinutes) {
        return new Date(time).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
    } else {
        return new Date(time).toLocaleTimeString("en-US", {
            hour: "numeric",
            hour12: true
        });
    }
}