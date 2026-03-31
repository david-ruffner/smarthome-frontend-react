import TodoistFilterDropdown from "../components/todoist/TodoistFilterDropdown.jsx";
import {useEffect, useRef, useState} from "react";
import {useUI} from "../context/UIContext.jsx";
import {BACKEND_HOST} from "../components/Constants.jsx";
import {isArrayEmpty, isObjEmpty, isStrEmpty} from "../utils/Utils.js";
import TodoistTask from "../components/todoist/TodoistTask.jsx";
import {useTodoistCtx} from "../context/TodoistContext.jsx";
import {notify} from "../services/NotificationService.jsx";


async function fetchProjectNames() {
    const projectsResp = await fetch(`${BACKEND_HOST}/todoist/getProjects`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    return await projectsResp.json();
}

function TodoistView() {
    const {
        isTodoistViewVisible,
        setIsTodoistViewVisible,
        isTodoistViewPanelVisible,
        setIsTodoistViewPanelVisible,
        isTodoistSortPanelVisible,
        setIsTodoistSortPanelVisible,
        todoistSortingOption,
        setTodoistSortingOption,
        todoistPartitionKeys,
        setTodoistPartitionKeys
    } = useUI();

    const {
        fillTodoistLabelsActiveMap,
        todoistMasterLabelsList, setTodoistMasterLabelsList,
        openTodoistEditTaskModal, closeTodoistEditTaskModal,
        isTodoistFilterContainerVisible, setIsTodoistFilterContainerVisible
    } = useTodoistCtx();

    const [ projectNames, setProjectNames ] = useState([]);
    const [ todoistCurrentViewName, setTodoistCurrentViewName ] = useState('');
    const [ todoistCurrentViewId, setTodoistCurrentViewId ] = useState('');
    const [ todoistCurrentProjectTasks, setTodoistCurrentProjectTasks ] = useState([]);
    const [ activePageIndex, setActivePageIndex ] = useState(0);
    const todoistSortingOptionRef = useRef(null);

    function handleViewElementClick(e) {
        setIsTodoistViewPanelVisible(false);

        if (!isStrEmpty(e.currentTarget.innerText)) {
            setTodoistCurrentViewName(e.currentTarget.innerText);
        } else {
            setTodoistCurrentViewName("Error");
        }

        if (!isStrEmpty(e.currentTarget.dataset.id)) {
            setTodoistCurrentViewId(e.currentTarget.dataset.id);
        } else {
            setTodoistCurrentViewId("Error");
        }
    }

    function handleViewPanelClick() {
        setIsTodoistViewPanelVisible(!isTodoistViewPanelVisible);
        setIsTodoistSortPanelVisible(false);
    }

    function handleSortPanelClick() {
        setIsTodoistSortPanelVisible(!isTodoistSortPanelVisible);
        setIsTodoistViewPanelVisible(false);
    }

    function handleSortElementClick(e) {
        setIsTodoistSortPanelVisible(false);
        setTodoistSortingOption(e.currentTarget.dataset.paramValue);
    }

    function handlePageLabelClick(e) {
        let paginationToken = e.currentTarget.dataset.paginationKey;
        setActivePageIndex(Number.parseInt(e.currentTarget.dataset.index ?? "0"));

        fetchPaginatedTasks(paginationToken);
    }

    async function fetchProjectTasks() {
        if (!isTodoistViewVisible) return null;

        if (!isStrEmpty(todoistCurrentViewId)) {
            let url = `${BACKEND_HOST}/todoist/getTasksByProjectId/${todoistCurrentViewId}`;

            if (!isStrEmpty(todoistSortingOption)) {
                url += `?sortingAction=${todoistSortingOption}`;
            }

            console.log(`Fetch Project Tasks URL: ${url}`); // TODO: Remove

            const tasksResp = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const data = await tasksResp.json();

            switch (data.shortCode) {
                case 'SUCCESS':
                    setIsTodoistFilterContainerVisible(true);
                    return data;

                case 'NO_TASKS':
                    notify('There are no tasks in the selected project');
                    setIsTodoistFilterContainerVisible(false);
                    return null;
            }
        }

        return null;
    }

    // TODO: Remove
    // Testing TodoistEditTaskModal
    // useEffect(() => {
    //     openTodoistEditTaskModal({
    //         taskName: 'Look into health insurance',
    //         priority: 'Medium',
    //         labels: [
    //             '30 Minutes or less',
    //             '30 Minutes - 1 Hour',
    //             "berry red",
    //             "blue",
    //             "charcoal",
    //             "grape",
    //         ],
    //         dueDate: {
    //             string: 'Feb 4 3:00 AM'
    //         },
    //         deadline: {
    //             friendlyYear: '2026',
    //             friendlyMonthAndDay: 'Feb 4'
    //         },
    //         description: 'This is just a simple description'
    //     });
    // }, []);


    async function fetchLabels() {
        if (!isTodoistViewVisible) return null;

        const labelsResp = await fetch(`${BACKEND_HOST}/todoist/getLabels`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        return await labelsResp.json();
    }

    async function fetchPaginatedTasks(paginationToken) {
        if (!isTodoistViewVisible) return null;

        const tasksResp = await fetch(`${BACKEND_HOST}/todoist/getPaginatedTasks/${paginationToken}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const data = await tasksResp.json();

        switch (data.shortCode) {
            case 'SUCCESS':
                setTodoistCurrentProjectTasks(data.tasks);
                console.log(`Partition Keys:`); // TODO: Remove
                console.log(todoistPartitionKeys);
                break;

            case 'PAGINATION_EXPIRED':
                fetchProjectTasks()
                    .then(refreshData => {
                        if (refreshData !== null) {
                            setTodoistCurrentProjectTasks(refreshData.tasks);
                            setTodoistPartitionKeys(refreshData.partitionKeys);
                        }
                    })
                break;

            case 'NO_TASKS':
                notify('There are no tasks in the selected project');
                break;
        }
    }

    useEffect(() => {
        // Get all project names
        fetchProjectNames()
            .then(data => {
                // Default todoist view to load will be 'Inbox'
                let inboxProjectId = data.filter(i => { return i.name === 'Inbox' })[0]?.id;
                if (!isStrEmpty(inboxProjectId)) {
                    setTodoistCurrentViewId(inboxProjectId);
                }

                setProjectNames(data);
                setTodoistCurrentViewName('Inbox');
            })

        // Populate todoistMasterLabelsList
        fetchLabels()
            .then(data => {
                if (data !== null && !isArrayEmpty(data.labels)) {
                    setTodoistMasterLabelsList(data.labels);
                }
            })
    }, []);

    // Grab filtered tasks by project ID when the variable changes and is present
    useEffect(() => {
        fetchProjectTasks()
            .then(data => {
                if (data !== null) {
                    fillTodoistLabelsActiveMap({ tasks: data.tasks })

                    setTodoistCurrentProjectTasks(data.tasks);
                    setTodoistPartitionKeys(data.partitionKeys);
                }
            })
    }, [ todoistCurrentViewId, todoistSortingOption ]);

    return <>
        <style>{`
            #todoist-filter-container {
                width: 100%;
                margin-top: 50px;
                display: grid;
                grid-template-columns: repeat(2, 1fr);
            }
            
            .todoist-filter {
                display: grid;
                grid-template-columns: repeat(2, auto);
                width: 65%;
                justify-self: center;
            }
            
            .todoist-filter-options {
                width: 65%;
                justify-self: center;
            }
            
            .todoist-filter > h2 {
                font-size: 26pt;
                font-weight: 400;
                justify-self: right;
                text-align: center;
                align-self: center;
                margin-right: 25px;
            }
            
            .todoist-filter > img {
                width: 35px;
                transform: rotate(90deg);
                align-self: center;
            }
            
            .todoist-filter > img.down {
                transform: rotate(270deg);
            }
            
            #todoist-view-label {
                grid-column: 1 / span 2;
                font-size: 32pt;
                font-weight: 400;
                margin-top: 50px;
                max-width: 65%;
                justify-self: center;
            }
            
            #todoist-view-divider {
                grid-column: 1 / span 2;
                width: 80%;
            }
            
            #todoist-body-container {
                grid-column: 1 / span 2;
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                width: 100%;
            }
            
            #todoist-pagination-container {
                display: grid;
                grid-template-columns: repeat(6, 1fr);
                grid-row-gap: 25px;
                width: 80%;
                justify-self: center;
                grid-column: 1 / span 2;
                justify-content: space-around;
                margin: 25px 0 25px 0;
            }
            
            #todoist-pagination-container > h2 {
                font-size: 32pt;
                font-weight: 400;
            }
            
            .todoist-current-page-label {
                font-size: 36pt;
                font-weight: 800;
                color: white;
                background: rgba(0, 0, 255, 0.15); /* translucent white */
                backdrop-filter: blur(10px);          /* creates the frosted look */
                -webkit-backdrop-filter: blur(10px);  /* for Safari support */
                border-radius: 10px;
                border: 1px solid rgba(255, 255, 255, 0.3);
                box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                height: fit-content;
            }
            
            #todoist-view-search {
                grid-column: 1 / span 2;
                justify-self: center;
                margin-top: 25px;
                padding: 15px;
                font-size: 24pt;
                width: 75%;
            }
            
        `}</style>

        <div className={`${isTodoistViewVisible ? 'is-visible' : 'is-hidden'}`}>
            <h1>Todoist</h1>

            <div id={'todoist-filter-container'}>
                <div onClick={handleViewPanelClick} className={`todoist-filter frosted-glass`} id={'todoist-view-filter'}>
                    <h2>View</h2>
                    <img className={`${isTodoistViewPanelVisible ? 'down' : ''}`} src={'/src/assets/images/common/simple_back_button_white.png'} />
                </div>

                <div onClick={handleSortPanelClick} className={'todoist-filter frosted-glass'} id={'todoist-sort-filter'}>
                    <h2>Sort By</h2>
                    <img className={`${isTodoistSortPanelVisible ? 'down' : ''}`} src={'/src/assets/images/common/simple_back_button_white.png'} />
                </div>

                {/* 'View' Panel Dropdown */}
                <TodoistFilterDropdown
                    top={'165px'}
                    left={'60px'}
                    width={'236px'}
                    isPanelVisible={isTodoistViewPanelVisible}
                    setIsPanelVisible={setIsTodoistViewPanelVisible}
                    // isPanelVisible={true}
                    data={projectNames}
                    handler={handleViewElementClick}
                />

                <TodoistFilterDropdown
                    top={'165px'}
                    left={'420px'}
                    width={'236px'}
                    isPanelVisible={isTodoistSortPanelVisible}
                    setIsPanelVisible={setIsTodoistSortPanelVisible}
                    data={[ // 'Alphabetical', 'Due Date'
                        {
                            name: "Alphabetical",
                            paramValue: 'alphabetically',
                            key: "Alphabetical_ID"
                        },
                        {
                            name: 'Due Date',
                            paramValue: 'due_date',
                            key: 'Due_Date_ID'
                        }
                    ]}
                    handler={handleSortElementClick}
                    panelRef={todoistSortingOptionRef}
                />

                <h2 id={'todoist-view-label'}>{todoistCurrentViewName}</h2>
                <hr id={'todoist-view-divider'}/>

                <div id={'todoist-body-container'} className={`fadable ${isTodoistFilterContainerVisible ? 'is-visible' : 'is-hidden'}`}>
                    {!isArrayEmpty(todoistCurrentProjectTasks) &&
                        todoistCurrentProjectTasks.map((task, i) => (
                            <TodoistTask
                                key={i}
                                id={task.id}
                                projectId={task.projectId ?? null}
                                // sectionId={} TODO: Hook this up
                                labels={task.labels ?? null}
                                deadline={task.deadline ?? null}
                                duration={task.duration ?? null}
                                due={task.due ?? null}
                                priority={task.priority ?? null}
                                content={task.content}
                                description={task.description ?? null}
                                reminders={task.reminders ?? null}
                                subTasks={task.subTasks ?? null}
                            />
                        ))
                    }

                    {!isArrayEmpty(todoistPartitionKeys) && todoistPartitionKeys.length > 1 &&
                        <div id={'todoist-pagination-container'}>
                            {todoistPartitionKeys.map((paginationKey, index) => (
                                <h2
                                    onClick={handlePageLabelClick}
                                    className={index === activePageIndex ? 'todoist-current-page-label' : ''}
                                    data-pagination-key={paginationKey}
                                    data-index={index}
                                >{index + 1}
                                </h2>
                            ))}
                        </div>
                    }
                </div>
            </div>
        </div>
    </>
}

export default TodoistView;