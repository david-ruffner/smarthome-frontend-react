import Numpad from "../components/Numpad.jsx";
import UserSelect from "../components/UserSelect.jsx";
import "/src/css/Login.css"
import {useState} from "react";

function Login({ isLoginPageVisible, setIsLoginPageVisible, setIsDashboardVisible,
               setFriendlyName }) {
    const [ isNumpadVisible, setIsNumpadVisible ] = useState(true); // TODO: Revert to false
    const [ isUserSelectVisible, setIsUserSelectVisible ] = useState(false); // TODO: Revert to true

    return (
        <>
            <div id={'login-page'} className={`login-stage ${isLoginPageVisible ? 'is-visible' : ''}`}>
                <UserSelect
                    setNumpadIsVisible={setIsNumpadVisible}
                    isUserSelectVisible={isUserSelectVisible}
                    setIsUserSelectVisible={setIsUserSelectVisible}
                />
                <Numpad
                    isVisible={isNumpadVisible}
                    setIsNumpadVisible={setIsNumpadVisible}
                    setIsUserSelectVisible={setIsUserSelectVisible}
                    isLoginPageVisible={isLoginPageVisible}
                    setIsLoginPageVisible={setIsLoginPageVisible}
                    setIsDashboardVisible={setIsDashboardVisible}
                    setFriendlyName={setFriendlyName}
                />
            </div>
        </>
    )
}

export default Login