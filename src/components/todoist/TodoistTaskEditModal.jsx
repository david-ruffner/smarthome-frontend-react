import {useTodoistCtx} from "../../context/TodoistContext.jsx";
import {useEffect, useState} from "react";
import {getCurrentDashboardScrollTop, isArrayEmpty, isObjEmpty, isStrEmpty} from "../../utils/Utils.js";
import {TODOIST_LABELS_MODAL_BTN_OFFSET, TODOIST_LABELS_MODAL_OFFSET} from "../Constants.jsx";
import TodoistTaskEditFeature from "./TodoistTaskEditFeature.jsx";

const FADE_MS = 500;

function TodoistTaskEditModal() {
    const {
        todoistEditTaskModalState,
        isTodoistEditTaskModalVisible
    } = useTodoistCtx();

    const [shouldRender, setShouldRender] = useState(false);

    // Mount immediately when opening
    useEffect(() => {
        if (isTodoistEditTaskModalVisible) {
            setShouldRender(true);
        }
    }, [isTodoistEditTaskModalVisible]);

    // Unmount *after* fade-out when closing
    useEffect(() => {
        if (!isTodoistEditTaskModalVisible && shouldRender) {
            const timeout = setTimeout(() => {
                setShouldRender(false);
            }, FADE_MS);

            return () => clearTimeout(timeout);
        }
    }, [isTodoistEditTaskModalVisible, shouldRender]);

    if (!shouldRender) return null;

    return <>
        <style>
            {`
                #todoist-task-edit-modal {
                    margin: auto;
                    width: 85%;
                    height: 80%;
                    position: absolute;
                    z-index: 60;
                    top: 738px;
                    background: rgba(255, 255, 255, 0.15);
                    overflow-y: scroll;
                    align-items: stretch;
                    border-radius: 50px;
                }
                
                #close-todoist-te-model-btn {
                    position: absolute;
                    top: 1663px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 60;
                    font-size: 32pt;
                    font-weight: 500;
                    background: rgba(0, 255, 0, 0.20);
                }
                
                #tte-header-container {
                    width: 90%;
                    margin: auto;
                    display: grid;
                    grid-template-columns: 90% 10%;
                }
                
                #tte-header-container > h1 {
                    font-size: 38pt;
                    font-weight: 400;
                    text-align: center;
                    justify-self: left;
                    margin: 25px 0 0 65px;
                }
                
                #tte-header-container > img {
                    align-self: center;
                }
                
                .tte-feature-scroll-container {
                    width: 80%;
                    margin: auto;
                    display: grid;
                    grid-column-gap: 25px;
                    overflow-x: scroll;
                }
                
                .tte-feature-scroll-container > h3 {
                    font-size: 18pt;
                    padding: 10px;
                }
                
            `}
        </style>

        <div
            id="todoist-task-edit-modal-bg"
            className={`modal-bg ${isTodoistEditTaskModalVisible ? "is-visible" : ""}`}
            style={{ top: todoistEditTaskModalState?.bgTop ?? 0 }}
        />

        {/* Used for confirmation screens */}
        <div
            id={'tte-higher-modal-bg'}
            className={``}
        />

        <div id={'todoist-task-edit-modal'} className={`frosted-glass center-x 
        ${isTodoistEditTaskModalVisible ? 'is-visible' : 'is-hidden'}`}
        style={{ top: todoistEditTaskModalState.modalTop }}>
            <div id={'tte-header-container'}>
                <h1>{ todoistEditTaskModalState.taskName }</h1>
                <img src={todoistEditTaskModalState.priorityIconPath} width={55} alt=""/>
                <div style={{height: '1px', backgroundColor: 'white', margin: '35px'}} className={'divider'}></div>
            </div>

            <div id={'tte-features-container'}>
                {!isObjEmpty(todoistEditTaskModalState.dueDate) &&
                    <TodoistTaskEditFeature
                        name={'Due Date'}
                        iconName={'due-icon.png'}
                        value={todoistEditTaskModalState.dueDate.string}
                    />
                }

                { !isObjEmpty(todoistEditTaskModalState.deadline) &&
                    <TodoistTaskEditFeature
                        name={'Deadline'}
                        iconName={'deadline-icon.png'}
                        value={`${todoistEditTaskModalState.deadline.friendlyMonthAndDay} ${todoistEditTaskModalState.deadline.friendlyYear}`}
                    />
                }

                { !isStrEmpty(todoistEditTaskModalState.description) &&
                    <TodoistTaskEditFeature
                        name={'Description'}
                        iconName={'description-icon.png'}
                        value={todoistEditTaskModalState.description}
                    />
                }

                <h2>Labels</h2>
                { !isArrayEmpty(todoistEditTaskModalState.labels) &&
                    <div style={{ gridTemplateColumns: `repeat(${todoistEditTaskModalState.labels.length}, max-content)` }}
                     className={'tte-feature-scroll-container frosted-glass'}>
                        { todoistEditTaskModalState.labels.map(label => (
                            <h3 className={'frosted-glass-red'}>{label}</h3>
                        )) }
                    </div>
                }
            </div>
        </div>

        <button className={`frosted-glass-green ${isTodoistEditTaskModalVisible ? 'is-visible' : 'is-hidden'}`}
                id={'close-todoist-te-model-btn'} style={{ top: todoistEditTaskModalState.btnTop }}>Close</button>
    </>
}

export default TodoistTaskEditModal;