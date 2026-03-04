import {useUI} from "../context/UIContext.jsx";


function AppTrayIcon({ imgSrc, name, visibilitySetter }) {

    const {
        setIsAppTrayOpen, setLockDashboard,
        hidePanels
    } = useUI();


    function handleIconClick() {
        setIsAppTrayOpen(false);
        setLockDashboard(false);
        hidePanels();
        visibilitySetter(true);
    }

    return <>
        <style>
            {`
                .app-tray-icon {
                    padding: 25px;
                }
            
                .app-tray-icon img {
                    width: 125px;
                    height: 125px;
                }
                
                .app-tray-icon h1 {
                    font-family: Roboto;
                    font-size: 32pt;
                    font-weight: 400;
                }
            `}
        </style>

        <div onClick={handleIconClick} className={`app-tray-icon frosted-glass`}>
            <img src={ imgSrc } alt=""/>
            <h1>{ name }</h1>
        </div>
    </>
}

export default AppTrayIcon;