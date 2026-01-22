import '/src/css/components/Numpad.css'
import {useEffect, useState} from "react";
import {BACKEND_HOST} from "./Constants.jsx";
import {notify} from "../services/NotificationService.jsx";
import {isStrEmpty} from "../utils/Utils.js";

function Numpad({ isVisible, setIsNumpadVisible, setIsUserSelectVisible,
                isLoginPageVisible, setIsLoginPageVisible, setIsDashboardVisible,
                setFriendlyName }) {
    const [numpadVal, setNumpadVal] = useState("");
    const [ inErrState, setInErrState ] = useState(false);

    function onNumpadValUpdate(numpadVal) {
        console.log(`Numpad Val: ${numpadVal}`);
        if (numpadVal.length === 4) {
            userLogin(numpadVal)
                .then((data) => {
                    handleLoginData(data);
                })
        }
    }

    async function userLogin(numpadVal) {
        let username = sessionStorage.getItem('currentUser');

        if (isStrEmpty(username)) {
            notify("Please select the user again");
            setIsNumpadVisible(false);
            setIsUserSelectVisible(true);
        }

        const res = await fetch(`${BACKEND_HOST}/userSettings/getUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pinNumber: numpadVal,
                username: username
            })
        });

        if (!res.ok) {
            notify("There was a problem logging in. Please see the console.");
            const err = await res.json();
            console.log(`Error while logging in: ${JSON.stringify(err)}`);
        }

        return await res.json();
    }

    function handleLoginData(data) {
        console.log(data);

        switch (data.shortCode) {
            case "NON_EXISTENT_USER":
                // Incorrect PIN
                setInErrState(true);
                notify("Incorrect PIN");
                break;

            case "SUCCESS":
                console.log(`Login Successful!`);
                setIsLoginPageVisible(false);
                setIsDashboardVisible(true);
                setFriendlyName(data.name);
                localStorage.setItem('token', data.jwtToken);
        }
    }

    useEffect(() => {
        onNumpadValUpdate(numpadVal);
    }, [numpadVal]);

    // if (!isVisible) return null;

    function numBtnOnClick(e) {
        let target = e.currentTarget;
        let val = target.dataset.value;

        switch (val) {
            case 'C':
                setNumpadVal(""); // Clear numpadVal
                break;

            case 'BK':
                setNumpadVal(prev => prev.slice(0, -1)); // backspace
                break;

            default:
                // String is only allowed to be 4 digits long
                setNumpadVal(prev => (prev.length >= 4) ? prev : prev + val); // append digit
        }
    }

    function onBackBtnClick() {
        setIsNumpadVisible(false);
        setIsUserSelectVisible(true);
    }

    function onBkBtnClick(e) {
        numBtnOnClick(e);

        if (inErrState) {
            setInErrState(false);
        }
    }

    return (
        <>
            <div className={`numpad ${isVisible && isLoginPageVisible ? "is-visible" : ""}`}>
                <p data-value={'1'} onClick={numBtnOnClick} className={"frosted-glass numpad-btn"}>1</p>
                <p data-value={'2'} onClick={numBtnOnClick} className={'frosted-glass numpad-btn'}>2</p>
                <p data-value={'3'} onClick={numBtnOnClick} className={'frosted-glass numpad-btn'}>3</p>
                <p data-value={'4'} onClick={numBtnOnClick} className={'frosted-glass numpad-btn'}>4</p>
                <p data-value={'5'} onClick={numBtnOnClick} className={'frosted-glass numpad-btn'}>5</p>
                <p data-value={'6'} onClick={numBtnOnClick} className={'frosted-glass numpad-btn'}>6</p>
                <p data-value={'7'} onClick={numBtnOnClick} className={'frosted-glass numpad-btn'}>7</p>
                <p data-value={'8'} onClick={numBtnOnClick} className={'frosted-glass numpad-btn'}>8</p>
                <p data-value={'9'} onClick={numBtnOnClick} className={'frosted-glass numpad-btn'}>9</p>
                <p data-value={'C'} onClick={numBtnOnClick} className={'frosted-glass'}>C</p>
                <p data-value={'0'} onClick={numBtnOnClick} className={'frosted-glass'}>9</p>
                <p data-value={'BK'} onClick={onBkBtnClick} className={'frosted-glass'}>Bk</p>

                <div className="numpad-input">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <p key={index} className={inErrState ? 'err-state' : ''}>
                            {numpadVal[index] ?? ""}
                        </p>
                    ))}
                </div>

                <p id={'numpad-back-btn'} onClick={onBackBtnClick} className={'frosted-glass'}>Back</p>
            </div>
        </>
    )
}

export default Numpad