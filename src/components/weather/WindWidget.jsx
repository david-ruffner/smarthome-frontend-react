const dirToDeg = {
    N: 0,
    NNE: 22.5,
    NE: 45,
    ENE: 67.5,
    E: 90,
    ESE: 112.5,
    SE: 135,
    SSE: 157.5,
    S: 180,
    SSW: 202.5,
    SW: 225,
    W: 270,
    WSW: 247.5,
    WNW: 292.5,
    NW: 315,
    NNW: 337.5
};

function WindWidget({ windDirection, customClass = '' }) {
    return (
        <>
            <div className={`wind-speed-container frosted-glass-blue ${customClass !== '' ? customClass : ''}`}>
                <svg
                    className="wind-speed-arrow"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
                    <g id="SVGRepo_iconCarrier" style={{
                        "transformBox": "fill-box",
                        "transformOrigin": "center",
                        "transform": `rotate(${dirToDeg[windDirection]}deg)`
                    }}>
                        <path
                            d="M11 18.5858L6.70711 14.2929C6.31658 13.9024 5.68342 13.9024 5.29289 14.2929C4.90237 14.6834 4.90237 15.3166 5.29289 15.7071L11.2929 21.7071C11.6834 22.0976 12.3166 22.0976 12.7071 21.7071L18.7071 15.7071C19.0976 15.3166 19.0976 14.6834 18.7071 14.2929C18.3166 13.9024 17.6834 13.9024 17.2929 14.2929L13 18.5858L13 3C13 2.44771 12.5523 2 12 2C11.4477 2 11 2.44771 11 3L11 18.5858Z"
                            fill="#dddddd"
                            data-noir-inline-fill=""
                            style={{
                                "--noir-inline-fill": "#e8e6e3"
                            }}
                        />
                    </g>
                </svg>
            </div>
        </>
    )
}

export default WindWidget;