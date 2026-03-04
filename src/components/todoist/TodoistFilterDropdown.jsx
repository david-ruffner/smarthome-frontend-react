import {BACKEND_HOST} from "../Constants.jsx";
import {isStrEmpty} from "../../utils/Utils.js";
import {useUI} from "../../context/UIContext.jsx";


function TodoistFilterDropdown({ top, left, width, isPanelVisible,
                               setIsPanelVisible, data, handler, panelRef }) {

    const {
        setTodoistCurrentViewId
    } = useUI();

    if (!isPanelVisible) {
        return null;
    }

    return <>
        <style>{`
            .todoist-filter-options {
                position: absolute;
                z-index: 50;
                top: ${top};
                left: ${left};
                width: ${width};
                max-height: 325px;
                overflow-y: scroll;
                opacity: 0;
                pointer-events: none;
            }
            
            .todoist-filter-options.visible {
                opacity: 1;
                pointer-events: auto;
            }
        
            .todoist-filter-options > h2 {
                font-size: 24pt;
                font-weight: 400;
            }
            
            .todoist-filter-options > h2:not(:last-child) {
                margin-bottom: 25px;
            }
        `}</style>

        <div id={'todoist-sorting-options'} className={`todoist-filter-options frosted-glass ${isPanelVisible ? 'visible' : ''}`}>
            {data.map((name) => (
                <h2 ref={panelRef} onClick={handler} data-id={name.id}
                    data-param-value={name.paramValue} key={name.id}>{name.name}</h2>
            ))}
        </div>
    </>
}

export default TodoistFilterDropdown;