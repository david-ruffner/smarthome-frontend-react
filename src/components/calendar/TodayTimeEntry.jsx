

function TodayTimeEntry({ startTime, endTime }) {
    const PX_HEIGHT_1_HR = 150;

    const startOfDay = new Date(startTime);
    startOfDay.setHours(0, 0, 0, 0);
    const startDateTime = new Date(startTime);
    const endDateTime = new Date(endTime);

    const minutes = (endDateTime - startDateTime) / 60000;
    const minutesTo5 = Math.round(minutes / 5) * 5;

    const height = Math.round((minutesTo5 / 5) * 12.5);

    const minutesFromStartOfDay = (startDateTime - startOfDay) / 60000;
    const minutesFromStartOfDayTo5 = Math.round(minutesFromStartOfDay / 5) * 5;
    const top = Math.round((minutesFromStartOfDayTo5 / 5) * 12.5) + 110;
    
    return <>
        <div style={{height: `${height}px`, top: top}} className={'today-time-entry frosted-glass-blue'}>
            <h3>Test</h3>
        </div>
    </>
}

export default TodayTimeEntry;