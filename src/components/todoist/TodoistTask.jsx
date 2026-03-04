import TodoistTaskFeature from "./TodoistTaskFeature.jsx";
import {
    areAnyObjValsEmpty,
    getCurrentDashboardScrollTop,
    isArrayEmpty,
    isObjEmpty,
    isStrEmpty,
    processTodoistDueDate
} from "../../utils/Utils.js";
import {useUI} from "../../context/UIContext.jsx";
import {TODOIST_PRIORITY_COLORS} from "../Constants.jsx";
import {useTodoistCtx} from "../../context/TodoistContext.jsx";
import {useEffect, useMemo, useState} from "react";


function TodoistTask({ id, projectId, sectionId, labels, deadline,
                     duration, due, priority, content, description,
                     reminders, subTasks, key }) {

    function handleCompleteBubbleClick(e) {

    }

    const {
        setLockDashboard
    } = useUI();

    const {
        upsertTaskLabel,
        taskLabelMap,
        setIsTodoistLabelModalVisible,
        todoistInspectedLabelSet, setTodoistInspectedLabelSet,
        todoistLabelModalStyles, setTodoistLabelModalStyles,
        // todoistLabels, setTodoistLabels
        todoistMasterLabelsList, setLabelsModalTaskId
    } = useTodoistCtx();

    const labelColors = useMemo(() => {
        if (!labels?.length) return [];

        return labels.map(label =>
            todoistMasterLabelsList.find(tLabel => tLabel.name === label)
        );
    }, [ labels, todoistMasterLabelsList ]);

    function handleTaskLabelClick(e) {
        let parentId = e.currentTarget.dataset.parentId;
        setLabelsModalTaskId(parentId);
    }

    useEffect(() => {
        upsertTaskLabel(id, labelColors);
    }, [id, labelColors, upsertTaskLabel]);

    // TODO: Remove
    useEffect(() => {
        // setTimeout(() => {
        //     document.querySelector('.auto-click:nth-of-type(2)').click()
        // }, 1000);
    }, [])

    let dueDate = null;
    if (!isObjEmpty(due) && !isStrEmpty(due.date)) {
        dueDate = processTodoistDueDate(due, duration);
    }

    let priorityImgName, priorityTextColor = null;
    let prioritySubheadFontSize = '14pt';
    let prioritySubheadFontWeight = '600';
    if (!isStrEmpty(priority)) {
        priorityImgName = `priority-icon-${priority.toLowerCase()}.png`;
        priorityTextColor = TODOIST_PRIORITY_COLORS[priority] ?? '#ffffff';

        if (priority.toLowerCase() === 'high') {
            prioritySubheadFontSize = '16pt';
            prioritySubheadFontWeight = '800';
        }
    }

    return <>
        <style>{`
            .todoist-task {
                justify-self: center;
                grid-column: 1 / span 2;
                width: 80%;
                display: grid;
                grid-template-columns: auto;
                margin-top: 25px;
                max-height: 200px;
                overflow: scroll;
            }
            
            .todoist-task-title-container {
                display: grid;
                grid-template-columns: 15% 85%;
            }
            
            .todoist-task-title-container > h1 {
                padding: 25px;
                font-size: 24pt;
                text-align: left;
                font-weight: 500;
            }
            
            .todoist-task-title-container > img {
                justify-self: center;
                align-self: center;
                margin-left: 15px;
            }
            
            .todoist-task-labels {
                padding: 0 25px 0 25px;
                display: grid;
                grid-template-columns: repeat(4, auto);
                grid-column-gap: 25px;
                grid-column: 1;
            }
            
            .todoist-task-label {
                padding: 5px;
            }
            
            #todoist-task-feature-carousel {
                display: grid;
                grid-template-columns: repeat(5, auto);
                max-width: 550px;
                overflow-x: scroll;
            }
        `}</style>

        <div key={key} className={'todoist-task frosted-glass'}>
            <div className={'todoist-task-title-container'}>
                <img data-id={id} src="/src/assets/images/todoist/task-complete-bubble.png" width={50} />
                <h1>{content}</h1>
            </div>

            {labels.length > 0 &&
                <div className={'todoist-task-labels'}>

                    {labels.map((label, i) => (
                        <h3 onClick={handleTaskLabelClick} style={{ background: labelColors[i].rgbaString }}
                            className={'todoist-task-label frosted-glass-no-bg auto-click'} // TODO: Remove auto-click class
                            data-parent-id={id}>{label}</h3>
                    ))}
                </div>
            }

            {/* At least one of these 5  */}
            {(!isStrEmpty(description) || !isObjEmpty(deadline) ||
                !isObjEmpty(dueDate) || !isObjEmpty(priority)) &&
                <div id={'todoist-task-feature-carousel'}>
                    {!isStrEmpty(description) &&
                        <TodoistTaskFeature
                            imgSrc={'/src/assets/images/todoist/description-icon.png'}
                            title={'Description'}
                            subHead1={description}
                        />
                    }

                    {!areAnyObjValsEmpty(deadline) &&
                        <TodoistTaskFeature
                            imgSrc={'/src/assets/images/todoist/deadline-icon.png'}
                            title={'Deadline'}
                            subHead1={`${deadline.friendlyMonthAndDay} ${deadline.friendlyYear}`}
                        />
                    }

                    {!areAnyObjValsEmpty(dueDate) &&
                        <TodoistTaskFeature
                            imgSrc={'/src/assets/images/todoist/due-icon.png'}
                            title={'Due'}
                            subHead1={due.string}
                        />
                    }

                    {!areAnyObjValsEmpty(priority) &&
                        <TodoistTaskFeature
                            imgSrc={`/src/assets/images/todoist/${priorityImgName}`}
                            title={'Priority'}
                            subHead1={priority}
                            subTextColor={priorityTextColor}
                            subheadFontWeight={prioritySubheadFontWeight}
                            subheadFontSize={prioritySubheadFontSize}
                        />
                    }

                    {!isArrayEmpty(reminders) &&
                        <TodoistTaskFeature
                            imgSrc={'/src/assets/images/todoist/reminder-icon.png'}
                            title={'Reminders'}
                            subheadCarouselItems={reminders.map((r, i) => (
                                <h4 key={i} style={{
                                    padding: '10px',
                                    margin: '15px',
                                    width: 'max-content'
                                }} className={'frosted-glass'}>{r.string}</h4>
                            ))}
                        />
                    }
                </div>
            }
        </div>
    </>
}

export default TodoistTask;