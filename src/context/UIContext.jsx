import {createContext, useCallback, useContext, useMemo, useState} from "react";

const UIContext = createContext(null);

export function UIProvider({ children }) {
    const [ isLoginPageVisible, setIsLoginPageVisible ] = useState(true);
    const [ isDashboardVisible, setIsDashboardVisible ] = useState(false);
    const [ isNumpadVisible, setIsNumpadVisible ] = useState(false);
    const [ isUserSelectVisible, setIsUserSelectVisible ] = useState(false);
    const [ isWeatherViewVisible, setIsWeatherViewVisible ] = useState(true); // TODO: Revert to false
    const [ friendlyName, setFriendlyName ] = useState('');

    // Weather views
    const [ isCurrentWeatherVisible, setIsCurrentWeatherVisible ] = useState(true); // TODO: Revert to false
    const [ isTodayWeatherVisible, setIsTodayWeatherVisible ] = useState(false);
    const [ isTomorrowWeatherVisible, setIsTomorrowWeatherVisible ] = useState(false);
    const [ is3DayWeatherVisible, setIs3DayWeatherVisible ] = useState(false);
    const [ is7DayWeatherVisible, setIs7DayWeatherVisible ] = useState(false);
    const [ currentWeatherView, setCurrentWeatherView ] = useState('current');

    // Map weather view selectors to weather views
    const weatherViewMap = useMemo(() => ({
        'current': setIsCurrentWeatherVisible,
        'today': setIsTodayWeatherVisible,
        'tomorrow': setIsTomorrowWeatherVisible,
        '3-day': setIs3DayWeatherVisible,
        '7-day': setIs7DayWeatherVisible
    }), []);

    const toggleWeatherView = useCallback((weatherView) => {
        if (Object.hasOwn(weatherViewMap, weatherView)) {
            // Toggle off current view
            weatherViewMap[currentWeatherView](false);
            weatherViewMap[weatherView](true);
            setCurrentWeatherView(weatherView);
        } else {
            throw new Error(`Weather view map doesn't have view '${weatherView}'`);
        }
    }, [weatherViewMap, currentWeatherView]);

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
            friendlyName, setFriendlyName,
            uiActions, toggleWeatherView,
            currentWeatherView
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