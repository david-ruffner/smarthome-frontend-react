import {useUI} from "../context/UIContext.jsx";


function AppTray() {

    const {
        isAppTrayOpen, setIsAppTrayOpen, toggleAppTray
    } = useUI();

    function onAppTrayClick() {
        toggleAppTray();
    }

    return <>
        <style>{`
            #app-tray-icon {
                width: 75px;
                height: 75px;
                margin: 25px auto 25px auto;
            }
            
            .app-tray-hamburger-line {
                width: 100%;
                height: 15%;
                background-color: white;
                border-radius: 25px;
                margin-bottom: 15px;
                transition: width 300ms ease-in-out;
            }
            
            .app-tray-hamburger-line:nth-of-type(2).app-tray-open {
                width: 66%;
            }
            
            .app-tray-hamburger-line:nth-of-type(3).app-tray-open {
                width: 33%;
            }
        `}</style>

        <div id={'app-tray-icon'} onClick={onAppTrayClick}>
            <div className={'app-tray-hamburger-line'}></div>
            <div className={`app-tray-hamburger-line ${isAppTrayOpen ? 'app-tray-open' : ''}`}></div>
            <div className={`app-tray-hamburger-line ${isAppTrayOpen ? 'app-tray-open' : ''}`}></div>
        </div>
    </>
}

export default AppTray;