function CurrentWeatherBodyValue({ header, value }) {

    return <>
        <style>{`
            .divider {
                grid-row: 3;
                grid-column: 1 / span 3;
                margin: 50px 0 50px 0;
                width: 90%;
                justify-self: center;
                align-self: center;
            }
            
            #current-weather-body-container {
                display: grid;
                grid-template-columns: 35% 1% 64%;
            }
            
            #current-weather-body-container > h1 {
                font-weight: 500;
                font-size: 24pt;
                padding: 25px;
                align-self: center;
            }
            
            #current-weather-body-container > .vertical-divider {
                height: 75%;
                align-self: center;
                width: 3px;
            }
            
            .current-weather-body-value {
                margin: 25px;
                align-self: center;
                padding: 15px;
            }
        `}</style>

        <h1>{header}</h1>
        <div className={'vertical-divider'}></div>
        <div className={'current-weather-body-value frosted-glass'}>
            <h2>{value}</h2>
        </div>
    </>
}

export default CurrentWeatherBodyValue;