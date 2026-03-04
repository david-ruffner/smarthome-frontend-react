import {isArrayEmpty, isObjEmpty, isStrEmpty} from "../../utils/Utils.js";


function TodoistTaskFeature({ imgSrc, title, subHead1, subHead2,
                              subTextColor, subheadFontSize,
                              subheadFontWeight, subheadCarouselItems }) {
    const ICON_WIDTH = 25;

    return <>
        <style>{`
            .todoist-task-feature {
                margin: 25px;
                display: grid;
                grid-template-columns: 15% 85%;
                justify-content: center;
                align-items: center;
                padding: 10px;
                width: 250px;
                max-height: 135px;
                overflow-y: scroll;
            }
            
            .todoist-task-feature > img {
                justify-self: left;
                margin-left: 10px;
            }
            
            .todoist-task-feature > h3 {
                margin: 0 0 0 10px;
                padding: 0;
                font-size: 14pt;
            }
            
            .todoist-task-feature > h3:nth-of-type(1) {
                font-weight: 500;
                justify-self: left;
            }
            
            .todoist-task-feature > h3:nth-of-type(2),
            .todoist-task-feature > h3:nth-of-type(3){
                grid-column: 2;
                text-align: left;
                justify-self: left;
                color: ##7f81e3;
                font-weight: 600;
                margin-top: 5px;
            }
            
            .subhead-carousel {
                display: flex;
                flex-direction: row;
                width: 235px;
                margin: 10px 0 10px 5px;
                overflow-x: scroll;
            }
        `}</style>

        <div className={'todoist-task-feature frosted-glass-dark-gray'}>
            <img src={imgSrc} width={ICON_WIDTH}/>
            <h3>{title}</h3>
            { !isStrEmpty(subHead1) &&
                <h3 style={{
                    color: !isStrEmpty(subTextColor) ? subTextColor : '#7f81e3',
                    fontSize: subheadFontSize,
                    fontWeight: subheadFontWeight
                }}>{subHead1}</h3>
            }
            { !isStrEmpty(subHead2) &&
                <h3 style={{
                    color: !isStrEmpty(subTextColor) ? subTextColor : '#7f81e3',
                    fontSize: subheadFontSize,
                    fontWeight: subheadFontWeight
                }}>{subHead2}</h3>
            }

            { !isArrayEmpty(subheadCarouselItems) &&
                <div className={'subhead-carousel frosted-glass'}>
                    {subheadCarouselItems.map((item, i) => (
                        <span key={i}>{item}</span>
                    ))}
                </div>
            }
        </div>
    </>
}

export default TodoistTaskFeature;