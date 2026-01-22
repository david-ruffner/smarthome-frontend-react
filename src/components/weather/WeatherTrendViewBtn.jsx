import {useUI} from "../../context/UIContext.jsx";


function WeatherTrendViewBtn({ name, trendView, customBtnStyle,
                             btnBackground, btnForeground, btnActiveForeground,
                             btnActiveBackground, imgName, customImgStyle }) {

    const {
        toggleWeatherTrendView
    } = useUI();

    function onClick() {
        toggleWeatherTrendView(trendView);
    }

    const buttonStyle = {
        ...(btnBackground && { '--btn-bg': btnBackground }),
        ...(btnForeground && { '--btn-fg': btnForeground }),
        ...(btnActiveForeground || btnForeground
            ? { '--btn-active-fg' : btnActiveForeground ?? btnBackground }
            : {}),
        ...(btnActiveBackground || btnBackground
            ? { '--btn-active-bg' : btnActiveBackground ?? btnForeground }
            : {}),
        ...customBtnStyle
    }

    return <>
        <style>{`
            button {
                display: grid;
                grid-template-columns: 75% 25%;
                background-color: var(--btn-bg);
                color: var(--btn-fg);
            }
            
            button:active {
                background-color: var(--btn-active-bg);
                color: var(--btn-active-fg);
                border: 2px solid var(--btn-active-bg);
            }
        
            button > h1 {
                font-weight: 400;
                font-size: 24pt;
                padding: 5px;
            }
            
            button > img {
                width: 35px;
                justify-self: right;
                align-self: center;
            }
        `}</style>

        <button onClick={onClick} className={'weather-trend-view-btn'}
                data-weather-view={trendView} style={buttonStyle}>
            <h1>{name}</h1>
            <img style={customImgStyle} src={`/src/assets/images/weather-icons/trend-buttons/${imgName}.png`} />
        </button>
    </>
}

export default WeatherTrendViewBtn;