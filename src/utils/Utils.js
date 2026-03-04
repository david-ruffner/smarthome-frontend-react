import {useUI} from "../context/UIContext.jsx";
import convert from "color-convert";

export function isStrEmpty(str) {
    return (str === null || str === undefined || str === '');
}

export function isObjEmpty(obj) {
    return (obj === null || obj === undefined);
}

export function isArrayEmpty(arr) {
    return arr == null || !Array.isArray(arr) || arr.length === 0;
}

export function areAnyObjValsEmpty(obj) {
    if (obj == null || typeof obj !== "object") return true;

    return Object.values(obj).some(v => v == null);
}

export function getCurrentDashboardScrollTop() {
    return document.querySelector('#dashboard-container')?.scrollTop;
}

export function logErr({
   errMsg,
   header = "ERROR",
   data = null,
   fileName = null,
   lineNumber = null
} = {}) {
    let dataStr = !isObjEmpty(data) ? " | Data: " + JSON.stringify(data) : "";
    let fileAndLineStr = (!isStrEmpty(fileName) && !isStrEmpty(lineNumber)) ? ` | File And Line: ${fileName}:${lineNumber}` : '';
    console.log(`${header} | ${new Date().toLocaleTimeString()} | ${errMsg}${fileAndLineStr}${dataStr}`);
}

export function fetchToken() {
    let token = localStorage.getItem('token');

    if (isStrEmpty(token)) {
        logErr({
            errMsg: 'token was not found in session storage',
            fileName: 'Utils.js',
            lineNumber: '27'
        });
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
                errMsg: "Invalid timestamp",
                fileName: 'Utils.js',
                lineNumber: '64'
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

export function addMinutesToDT(dateTime, minutes) {
    return new Date(dateTime.getTime() + (minutes * 60_000));
}

export function addHoursToDT(dateTime, hours) {
    return new Date(dateTime.getTime() + (hours * 3_600_000));
}

/**
 *
 * @param due
 * 'due' should have:
 * {
 *     date: '2026-02-04T03:00:00'
 * }
 *
 * @param duration
 * 'duration' should look like:
 * {
 *     amount: 120
 * }
 */
export function processTodoistDueDate(due, duration) {
    if (isObjEmpty(due) || isStrEmpty(due?.date)) {
        let errMsg = 'Tried to call processTodoistDueDate() with malformed \'due\' object.' +
            " Please see the function's description in Utils.js";
        logErr({
            errMsg: errMsg,
            fileName: 'Utils.js',
            lineNumber: '118'
        });
        throw new Error(errMsg);
    }

    let retVal = {
        dueDateFullStr: due.date,
        dueDateStr: null,
        dueDateTimeStr: null,
        durationStr: null,
        durationHours: 0,
        durationMinutes: 0,
        dueDateTimeStart: null,
        dueDateTimeEnd: null
    }

    if (due.date.includes("T")) {
        retVal.dueDateStr = due.date.split("T")[0].trim();
        retVal.dueDateTimeStr = due.date.split("T")[1].trim();
    }

    if (!isObjEmpty(duration?.amount) && duration.amount < 60) {
        retVal.durationStr = `${duration.amount} Minutes`;
        retVal.durationMinutes = duration.amount;
        retVal.dueDateTimeStart = due.date;

        let dt = new Date(due.date);
        dt = addMinutesToDT(dt, retVal.durationMinutes);
        retVal.dueDateTimeEnd = dt.toString();
    } else if (!isObjEmpty(duration?.amount) && duration.amount >= 60) {
        retVal.durationHours = Math.floor(duration.amount / 60);
        retVal.durationMinutes = (duration.amount % 60);
        retVal.durationStr = `${retVal.durationHours} Hours & ${retVal.durationMinutes} Minutes`;
        retVal.dueDateTimeStart = due.date;

        let dt = new Date(due.date);
        dt = addMinutesToDT(dt, retVal.durationMinutes);
        dt = addHoursToDT(dt, retVal.durationHours);
        retVal.dueDateTimeEnd = dt.toString();
    }

    return retVal;
}

const FG_LIGHTNESS_THRESHOLD = 170;

export function determineFGLightness(red, green, blue) {
    return (red > 170 || green > 170 || blue > 170) ? 'black' : 'white';
}

export function rgbToHex(color) {
    if (isObjEmpty(color)) return;

    return "#" + convert.rgb.hex(color.red, color.green, color.blue);
}

export function hexToRgb(hex) {
    const [r, g, b] = convert.hex.rgb(hex);
    return { red: r, green: g, blue: b };
}