

function TodoistTaskEditFeature({ name, iconName, value }) {



    return <>
        <style>{`
            .tte-feature {
                width: 80%;
                margin: auto;
                display: grid;
                grid-template-columns: 15% 15% 70%;
                grid-template-rows: 50px 75px;
                margin-bottom: 35px;
            }
            
            .tte-feature-name {
                grid-row: 1;
                grid-column: 1 / span 2;
                justify-self: left;
                font-size: 20pt;
                align-self: center;
            }
        
            .tte-feature > img {
                width: 75px;
                grid-row: 2;
            }
            
            .vertical-divider {
                height: 100%;
                background-color: white;
                justify-self: center;
                width: 3px;
                grid-row: 2;
            }
            
            .tte-feature-value {
                height: 100%;
                display: grid;
                align-items: center;
                grid-column: 3;
                grid-row:  2;
                align-self: center;
                padding: 15px;
            }
            
            .tte-feature-value > h2 {
                color: var(--btn-soft-cyan);
                font-size: 22pt;
            }
        `}</style>

        <div className={'tte-feature'}>
            <h4 className={'tte-feature-name'}>{name}</h4>
            <img src={`/src/assets/images/todoist/${iconName}`} alt=""/>
            <div className={'vertical-divider'}></div>
            <div className={'tte-feature-value frosted-glass'}>
                <h2>{ value }</h2>
            </div>
        </div>
    </>
}

export default TodoistTaskEditFeature;