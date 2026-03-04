import {useUI} from "../../context/UIContext.jsx";
import {useTodoistCtx} from "../../context/TodoistContext.jsx";
import {useEffect, useMemo, useState} from "react";
import {getCurrentDashboardScrollTop, isObjEmpty, isStrEmpty} from "../../utils/Utils.js";


function TodoistLabelModal() {

    const {
        setLockDashboard
    } = useUI();

    const {
        isTodoistLabelModalVisible, setIsTodoistLabelModalVisible,
        todoistLabelModalStyles, todoistLabelsActiveMap,
        labelsModalTaskId, setTodoistLabelsActiveMap,
        setTodoistLabelModalStyles
    } = useTodoistCtx();

    // function toggleInspectedLabel(labelName) {
    //     // setInspectedLabelMap(prev => {
    //     //     const next = new Map(prev);
    //     //     const label = next.get(labelName);
    //     //
    //     //     if (!label) return prev;
    //     //
    //     //     next.set(labelName, { ...label, isSelected: !label.isSelected });
    //     //     return next;
    //     // });
    // }

    useEffect(() => {
        if (!isStrEmpty(labelsModalTaskId)) {
            const inspectedLabelMap = new Map(
                todoistLabelsActiveMap.get(labelsModalTaskId)?.map(label => [ label.name, label ])
            )

            setTodoistLabelsActiveMap(inspectedLabelMap);
            setTodoistLabelModalStyles(prev => {
                const next = structuredClone(prev);

                next.bgTop = prev.bgTop + getCurrentDashboardScrollTop();
                next.modalTop = prev.modalTop + getCurrentDashboardScrollTop();
                next.btnTop = prev.btnTop + getCurrentDashboardScrollTop();

                return next;
            })
            setLockDashboard(true);
            setIsTodoistLabelModalVisible(true);
        }
    }, [labelsModalTaskId, setIsTodoistLabelModalVisible, setLockDashboard, setTodoistLabelModalStyles, setTodoistLabelsActiveMap,]);

    function handleLabelModalClick(e) {
        // let labelName = e.currentTarget.innerText;
        // console.log(`After Click - Inspected Label Set:`);
        // console.log(todoistInspectedLabelSet);
        // toggleInspectedLabel(labelName);
    }

    useEffect(() => {
        console.log(`todoistLabelsActiveMap has changed`);
    }, [todoistLabelsActiveMap]);

    return <>
        <style>
            {`
                #todoist-label-modal {
                    margin: auto;
                    width: 75%;
                    height: 65%;
                    position: absolute;
                    z-index: 60;
                    top: 738px;
                    background: rgba(255, 255, 255, 0.15);
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    overflow-y: scroll;
                    align-items: stretch;
                }
                
                #close-todoist-label-model-btn {
                    position: absolute;
                    top: 1663px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 60;
                    font-size: 32pt;
                    font-weight: 500;
                    background: rgba(0, 255, 0, 0.20);
                }
                
                .todoist-task-label {
                    font-size: 26pt;
                    padding: 0;
                    margin: 25px;
                }
            `}
        </style>

        <div
            id={'todoist-label-modal-bg'}
            className={`modal-bg ${isTodoistLabelModalVisible ? 'is-visible' : ''}`}
            style={{ top: todoistLabelModalStyles.bgTop }}
        >

        </div>

        <div id={'todoist-label-modal'} className={`frosted-glass center-x 
        ${isTodoistLabelModalVisible ? 'is-visible' : 'is-hidden'}`}
        style={{ top: todoistLabelModalStyles.modalTop }}>
            {todoistLabelsActiveMap instanceof Map && todoistLabelsActiveMap.size > 0 && (() => {

                return [... todoistLabelsActiveMap.values()].map((label, i) => (
                    <h3
                        key={label.name ?? i}
                        onClick={handleLabelModalClick}
                        data-label-name={label.name}
                        style={label.isActive ? {
                            background: label.rgbaString,
                            color: 'white',
                            border: 'none'
                        } : {
                            border: `2px solid ${label.rgbaString}`,
                            color: label.rgbaString,
                            background: 'rgba(255, 255, 255, 1)'
                        }}
                        className={'todoist-task-label frosted-glass-no-bg'}
                    >
                        {label.name}
                    </h3>
                ));
            })()}
        </div>

        <button className={`frosted-glass-green ${isTodoistLabelModalVisible ? 'is-visible' : 'is-hidden'}`}
            id={'close-todoist-label-model-btn'} style={{ top: todoistLabelModalStyles.btnTop }}>Close</button>
    </>
}

export default TodoistLabelModal;