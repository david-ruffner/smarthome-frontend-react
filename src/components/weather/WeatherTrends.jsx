import {useUI} from "../../context/UIContext.jsx";
import {useCollapseTransition} from "../../utils/ui.jsx";
import PrecipitationWeatherTrend from "./trend-views/PrecipitationWeatherTrend.jsx";
import {useState} from "react";
import TemperatureWeatherTrend from "./trend-views/TemperatureWeatherTrend.jsx";
import HumidityWeatherChart from "./trend-views/HumidityWeatherChart.jsx";
import HumidityWeatherTrend from "./trend-views/HumidityWeatherTrend.jsx";
import FeelsLikeWeatherChart from "./trend-views/FeelsLikeWeatherChart.jsx";
import FeelsLikeWeatherTrend from "./trend-views/FeelsLikeWeatherTrend.jsx";


function WeatherTrends() {

    const {
        isWeatherTrendsVisible,
        hideAllWeatherTrendViews,
        setIsCurrentWeatherVisible,
        setCurrentWeatherView,
        setIsWeatherViewSelectorVisible
    } = useUI();
    const isCollapsed = useCollapseTransition(isWeatherTrendsVisible, 500);

    const [ activeTrendBtnColor, setActiveTrendBtnColor ] = useState('transparent')
    const [ trendType, setTrendType ] = useState('one-day');
    const [ trendTitle, setTrendTitle ] = useState('');

    const className = [
        'weather-panel',
        !isWeatherTrendsVisible ? 'is-hiding' : '',
        isCollapsed ? 'is-collapsed' : ''
    ].filter(Boolean).join(' ');

    function handleTrendTypeOnClick(e) {
        const trendType = e.currentTarget.dataset.trendType;
        setTrendType(trendType);
    }

    function onBackBtnClick(e) {
        hideAllWeatherTrendViews();
        setCurrentWeatherView('current');
        setIsCurrentWeatherVisible(true);
        setIsWeatherViewSelectorVisible(true);
    }

    return <>
        <style>{`
            #weather-trends-nav-container {
                display: grid;
                grid-template-columns: 5% 95%;
            }
            
            #weather-trends-nav-container > img {
                width: 40px;
                padding: 25px 0 0 15px;
            }
        
            #weather-trends-nav-container > h1 {
                font-size: 36pt;
                font-weight: 500;
                padding: 15px;
                width: 75%;
                justify-self: center;
                margin: 15px 0 0 0;
            }
            
            #weather-trends-btns-container {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                margin-top: 10px;
            }
            
            #weather-trends-btns-container > h1 {
                width: 50%;
                padding: 10px;
                font-size: 24pt;
                justify-self: center;
                margin: 25px 0 25px 0;
            }
            
            .active-trend-btn {
                background: var(--active-trend-btn-color);
            }
        `}</style>

        <div id={'weather-trends-container'} className={className}
         style={{ '--active-trend-btn-color': activeTrendBtnColor }}
        >
            <div id={'weather-trends-nav-container'}>
                <img onClick={onBackBtnClick} src={'/src/assets/images/common/simple_back_button_white.png'} />
                <h1 className={'frosted-glass'}>{trendTitle}</h1>
            </div>

            <div id={'weather-trends-inner-container'}>
                <PrecipitationWeatherTrend
                    setTrendTitle={setTrendTitle}
                    setActiveTrendBtnColor={setActiveTrendBtnColor}
                    trendType={trendType}
                    setTrendType={setTrendType}
                    trendColor={'rgb(111, 192, 63)'}
                />

                <TemperatureWeatherTrend
                    setTrendTitle={setTrendTitle}
                    setActiveTrendBtnColor={setActiveTrendBtnColor}
                    trendType={trendType}
                    setTrendType={setTrendType}
                    trendColor={'rgb(55, 147, 255)'}
                />

                <HumidityWeatherTrend
                    setTrendTitle={setTrendTitle}
                    setActiveTrendBtnColor={setActiveTrendBtnColor}
                    trendType={trendType}
                    setTrendType={setTrendType}
                    trendColor={'rgb(169, 255, 247)'}
                />

                <FeelsLikeWeatherTrend
                    setTrendTitle={setTrendTitle}
                    setActiveTrendBtnColor={setActiveTrendBtnColor}
                    trendType={trendType}
                    setTrendType={setTrendType}
                    trendColor={'rgb(218, 102, 123)'}
                />
            </div>

            <div id={'weather-trends-btns-container'} className={'frosted-glass'}>
                <h1
                    onClick={handleTrendTypeOnClick}
                    data-trend-type={'one-day'}
                    className={`frosted-glass-faded-blue ${
                        trendType === 'one-day' ? 'active-trend-btn' : ''
                    }`}
                >One Day</h1>

                <h1
                    onClick={handleTrendTypeOnClick}
                    data-trend-type={'two-day'}
                    className={`frosted-glass-faded-blue ${
                        trendType === 'two-day' ? 'active-trend-btn' : ''
                    }`}
                >Two Day</h1>

                <h1
                    onClick={handleTrendTypeOnClick}
                    data-trend-type={'three-day'}
                    className={`frosted-glass-faded-blue ${
                        trendType === 'three-day' ? 'active-trend-btn' : ''
                    }`}
                >Three Day</h1>

                <h1
                    onClick={handleTrendTypeOnClick}
                    data-trend-type={'five-day'}
                    className={`frosted-glass-faded-blue ${
                        trendType === 'five-day' ? 'active-trend-btn' : ''
                    }`}
                >Five Day</h1>

                <h1
                    onClick={handleTrendTypeOnClick}
                    data-trend-type={'seven-day'}
                    className={`frosted-glass-faded-blue ${
                        trendType === 'seven-day' ? 'active-trend-btn' : ''
                    }`}
                >Seven Day</h1>
            </div>
        </div>
    </>
}

export default WeatherTrends;