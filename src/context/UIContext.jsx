import {createContext, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";

const UIContext = createContext(null);

export function UIProvider({ children }) {
    const [ isLoginPageVisible, setIsLoginPageVisible ] = useState(true);
    const [ isDashboardVisible, setIsDashboardVisible ] = useState(false);
    const [ isNumpadVisible, setIsNumpadVisible ] = useState(false);
    const [ isUserSelectVisible, setIsUserSelectVisible ] = useState(false);
    const [ isWeatherViewVisible, setIsWeatherViewVisible ] = useState(true); // TODO: Revert to false
    const [ friendlyName, setFriendlyName ] = useState('');

    // Weather views
    const [ isCurrentWeatherVisible, setIsCurrentWeatherVisible ] = useState(false); // TODO: Revert to true
    const [ isTodayWeatherVisible, setIsTodayWeatherVisible ] = useState(false);
    const [ isTomorrowWeatherVisible, setIsTomorrowWeatherVisible ] = useState(false);
    const [ is3DayWeatherVisible, setIs3DayWeatherVisible ] = useState(true); // TODO: Revert to false
    const [ is7DayWeatherVisible, setIs7DayWeatherVisible ] = useState(false);
    const [ isWeatherTrendsVisible, setIsWeatherTrendsVisible ] = useState(false);
    const [ currentWeatherView, setCurrentWeatherView ] = useState('current');

    // Weather selectors
    const [ isWeatherViewSelectorVisible, setIsWeatherViewSelectorVisible ] = useState(true);
    const [ isWeatherTrendsSelectorVisible, setIsWeatherTrendsSelectorVisible ] = useState(false);

    // Weather trend views
    const [ isWeatherTrendPrecipitationVisible, setIsWeatherTrendPrecipitationVisible ] = useState(false);
    const [ isWeatherTrendTempVisible, setIsWeatherTrendTempVisible ] = useState(false);
    const [ isWeatherTrendHumidityVisible, setIsWeatherTrendHumidityVisible ] = useState(false);
    const [ isWeatherTrendFeelsLikeVisible, setIsWeatherTrendFeelsLikeVisible ] = useState(false);
    const [ currentWeatherTrendView, setCurrentWeatherTrendView ] = useState('trends-precipitation');

    // Map weather view selectors to weather views
    const weatherViewMap = useMemo(() => ({
        'current': setIsCurrentWeatherVisible,
        'today': setIsTodayWeatherVisible,
        'tomorrow': setIsTomorrowWeatherVisible,
        '3-day': setIs3DayWeatherVisible,
        '7-day': setIs7DayWeatherVisible,
        'trends': setIsWeatherTrendsVisible
    }), []);

    // Map weather trend selectors to weather trend views
    const weatherTrendMap = useMemo(() => ({
        'trends-precipitation': setIsWeatherTrendPrecipitationVisible,
        'trends-temperature': setIsWeatherTrendTempVisible,
        'trends-humidity': setIsWeatherTrendHumidityVisible,
        'trends-feels-like': setIsWeatherTrendFeelsLikeVisible
    }), []);

    const hideAllWeatherViews = useCallback(() => {
        setIsCurrentWeatherVisible(false);
        setIsTodayWeatherVisible(false);
        setIsTomorrowWeatherVisible(false);
        setIs3DayWeatherVisible(false);
        setIs7DayWeatherVisible(false);
    })

    const hideAllWeatherTrendViews = useCallback(() => {
        setIsWeatherTrendPrecipitationVisible(false);
        setIsWeatherTrendTempVisible(false);
        setIsWeatherTrendHumidityVisible(false);
        setIsWeatherTrendFeelsLikeVisible(false);
        setIsWeatherTrendsSelectorVisible(false);
        setIsWeatherTrendsVisible(false);
    })

    // Stuff for the dashboard carousel
    const [ currentDashboardIndex, setCurrentDashboardIndex ] = useState(0);
    const [ newDashboardIndex, setNewDashboardIndex ] = useState(0);
    const [ dashboardOffset, setDashboardOffset ] = useState(-750);
    const [ minDashboardIndex ] = useState(-1); // Has to be manually set here
    const [ maxDashboardIndex ] = useState(1); // Has to be manually set here

    const slideDashboardCarousel = useCallback((newIndex) => {
        if (newIndex < minDashboardIndex || newIndex > maxDashboardIndex) {
            return;
        }

        const steps = Math.abs(newIndex - currentDashboardIndex);
        const delta = 750 * steps;

        if (newIndex < currentDashboardIndex) {
            setDashboardOffset(prev => prev + delta);
        } else if (newIndex > currentDashboardIndex) {
            setDashboardOffset(prev => prev - delta);
        }
        setCurrentDashboardIndex(newIndex);
    })

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        slideDashboardCarousel(newDashboardIndex);
    }, [newDashboardIndex]);

    const toggleWeatherTrendView = useCallback((weatherTrendView) => {
        hideAllWeatherViews();

        if (Object.hasOwn(weatherTrendMap, weatherTrendView)) {
            weatherTrendMap[currentWeatherTrendView](false);
            weatherTrendMap[weatherTrendView](true);
            setCurrentWeatherTrendView(weatherTrendView);
        } else {
            throw new Error(`Weather trend view map doesn't have view '${weatherTrendView}'`);
        }
    }, [currentWeatherTrendView, hideAllWeatherViews, weatherTrendMap])

    const toggleWeatherView = useCallback((weatherView) => {
        hideAllWeatherTrendViews();
        hideAllWeatherViews();

        if (Object.hasOwn(weatherViewMap, weatherView)) {
            // Toggle off current view
            weatherViewMap[currentWeatherView](false);
            weatherViewMap[weatherView](true);
            setCurrentWeatherView(weatherView);

            if (weatherView === 'trends') {
                // Extra toggles required for the trends view
                setIsWeatherViewSelectorVisible(false);
                setIsWeatherTrendsSelectorVisible(true);
                setIsWeatherTrendPrecipitationVisible(true);
            }
        } else {
            throw new Error(`Weather view map doesn't have view '${weatherView}'`);
        }
    }, [hideAllWeatherTrendViews, weatherViewMap, currentWeatherView]);

    const hideAll = useCallback(() => {
        setIsLoginPageVisible(false);
        setIsDashboardVisible(false);
        setIsNumpadVisible(false);
        setIsUserSelectVisible(false);
        setIsWeatherViewVisible(false);
        setIsCurrentWeatherVisible(false);
        setIsTodayWeatherVisible(false);
        setIsTomorrowWeatherVisible(false);
        setIs3DayWeatherVisible(false);
        setIs7DayWeatherVisible(false);
        setIsWeatherTrendsVisible(false);
        setIsWeatherViewSelectorVisible(false);
        setIsWeatherTrendsSelectorVisible(false);
    })

    const showUserSelect = useCallback(() => {
        setIsLoginPageVisible(true)
        setIsUserSelectVisible(true);
    })

    const uiActions = useMemo(
        () => ({
            hideAll,
            showUserSelect,
        }),
        [hideAll, showUserSelect]
    );

    return (
        <UIContext.Provider value={{
            isLoginPageVisible, setIsLoginPageVisible,
            isDashboardVisible, setIsDashboardVisible,
            isNumpadVisible, setIsNumpadVisible,
            isUserSelectVisible, setIsUserSelectVisible,
            isWeatherViewVisible, setIsWeatherViewVisible,
            isCurrentWeatherVisible, setIsCurrentWeatherVisible,
            isTodayWeatherVisible, setIsTodayWeatherVisible,
            isTomorrowWeatherVisible, setIsTomorrowWeatherVisible,
            is3DayWeatherVisible, setIs3DayWeatherVisible,
            is7DayWeatherVisible, setIs7DayWeatherVisible,
            isWeatherTrendsVisible, setIsWeatherTrendsVisible,
            isWeatherViewSelectorVisible, setIsWeatherViewSelectorVisible,
            isWeatherTrendsSelectorVisible, setIsWeatherTrendsSelectorVisible,
            isWeatherTrendPrecipitationVisible, setIsWeatherTrendPrecipitationVisible,
            isWeatherTrendTempVisible, setIsWeatherTrendTempVisible,
            isWeatherTrendHumidityVisible, setIsWeatherTrendHumidityVisible,
            isWeatherTrendFeelsLikeVisible, setIsWeatherTrendFeelsLikeVisible,
            friendlyName, setFriendlyName,
            uiActions, toggleWeatherView,
            currentWeatherView, toggleWeatherTrendView,
            currentWeatherTrendView, hideAllWeatherTrendViews,
            setCurrentWeatherView, dashboardOffset,
            slideDashboardCarousel, currentDashboardIndex,
            setCurrentDashboardIndex, newDashboardIndex,
            setNewDashboardIndex
        }}>
            {children}
        </UIContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUI() {
    const ctx = useContext(UIContext);
    if (!ctx) {
        throw new Error("useUI must be used inside UIProvider");
    }
    return ctx;
}