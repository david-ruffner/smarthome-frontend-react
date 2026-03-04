import {createContext, useCallback, useContext, useState} from "react";
import {getCurrentDashboardScrollTop, isArrayEmpty, isObjEmpty, logErr} from "../utils/Utils.js";
import {useUI} from "./UIContext.jsx";
import {TODOIST_LABELS_MODAL_BTN_OFFSET, TODOIST_LABELS_MODAL_OFFSET} from "../components/Constants.jsx";


const TodoistContext = createContext(null);

export function TodoistCtxProvider({ children }) {

    const [ todoistLabels, setTodoistLabels ] = useState([]); // TODO: Safely Remove
    const [ taskLabelMap, setTaskLabelMap ] = useState(() => new Map()); // TODO: Safely Remove
    const [ todoistInspectedLabelSet, setTodoistInspectedLabelSet ] = useState([]); // TODO: Safely Remove

    // State Stuff
    const [ todoistLabelsActiveMap, setTodoistLabelsActiveMap ] = useState(() => new Map());
    const [ todoistMasterLabelsList, setTodoistMasterLabelsList ] = useState([]);

    // View States
    const [todoistEditTaskModalState, setTodoistEditTaskModalState] = useState(null);
    const isTodoistEditTaskModalVisible = !!todoistEditTaskModalState;
    const [ isTodoistFilterContainerVisible, setIsTodoistFilterContainerVisible ] = useState(false);



    // View Toggle Actions
    const openTodoistEditTaskModal = (
        {
            taskName,
            priority,
            labels = null,
            dueDate = null,
            deadline = null,
            description = null,
            reminders = null
        }
    ) => {
        const scrollTop = getCurrentDashboardScrollTop();

        setTodoistEditTaskModalState({
            taskName: taskName,
            priority: priority,
            priorityIconPath: `/src/assets/images/todoist/priority-icon-${priority.toLowerCase().trim()}.png`,
            labels: labels,
            dueDate: dueDate,
            deadline: deadline,
            description: description,
            reminders: reminders,
            bgTop: scrollTop,
            modalTop: TODOIST_LABELS_MODAL_OFFSET + scrollTop,
            btnTop: TODOIST_LABELS_MODAL_BTN_OFFSET + scrollTop,
        });
    };
    const closeTodoistEditTaskModal = (() => {
        setTodoistEditTaskModalState(null);
    });






    /**
     * Used to fill out the labels layout of the modal when a task's label is clicked on.
     * This will be set TodoistView, and listened for in TodoistLabelModal
     */
    const [ labelsModalTaskId, setLabelsModalTaskId ] = useState('');

    function fillTodoistLabelsActiveMap({ tasks }) {
        if (isArrayEmpty(tasks)) {
            return null;
        }

        // For each task, append the task and a list of all potential labels to the 'todoistLabelsActiveMap'.
        tasks.forEach(task => {
            appendToTodoistLabelsActiveMap({ taskId: task.id, activatedLabels: task?.labels ?? [] })
        })
    }

    function appendToTodoistLabelsActiveMap({ taskId, activatedLabels = new Map() }) {
        const processedLabels = [];

        todoistMasterLabelsList.forEach(masterLabel => {
            processedLabels.push({
                name: masterLabel.name,
                colorName: masterLabel.colorName,
                rgbaString: masterLabel.rgbaString,
                isActive: ( [ ...activatedLabels.values() ].filter(l => l === masterLabel.name).length > 0 )
            })
        })

        let retVal = null;
        setTodoistLabelsActiveMap(prev => {
            const next = new Map(prev);
            next.set(taskId, processedLabels);
            retVal = next;
            return next;
        })

        return retVal;
    }

    // Modal Stuff
    const [ isTodoistLabelModalVisible, setIsTodoistLabelModalVisible ] = useState(false);
    const [ todoistLabelModalStyles, setTodoistLabelModalStyles ] = useState({
        bgTop: 0,
        modalTop: TODOIST_LABELS_MODAL_OFFSET,
        btnTop: TODOIST_LABELS_MODAL_BTN_OFFSET
    })

    const upsertTaskLabel = useCallback((taskId, labels) => {
        setTaskLabelMap(prev => {
            const next = new Map(prev);
            next.set(taskId, labels);

            return next;
        })
    }, []);

    function removeTaskLabels(taskId) {
        setTaskLabelMap(prev => {
            const next = new Map(prev);
            next.delete(taskId);

            return next;
        })
    }

    return (
        <TodoistContext.Provider value={{
            taskLabelMap, upsertTaskLabel,
            isTodoistLabelModalVisible, setIsTodoistLabelModalVisible,
            todoistInspectedLabelSet, setTodoistInspectedLabelSet,
            todoistLabelModalStyles, setTodoistLabelModalStyles,
            todoistLabelsActiveMap, setTodoistLabelsActiveMap,
            todoistMasterLabelsList, setTodoistMasterLabelsList,
            fillTodoistLabelsActiveMap,
            labelsModalTaskId, setLabelsModalTaskId,
            todoistEditTaskModalState, openTodoistEditTaskModal, closeTodoistEditTaskModal, isTodoistEditTaskModalVisible,
            isTodoistFilterContainerVisible, setIsTodoistFilterContainerVisible
        }}>
            {children}
        </TodoistContext.Provider>
    );
}

export function useTodoistCtx() {
    const ctx = useContext(TodoistContext);

    if (!ctx) {
        let errMsg = 'useTodoistCtx() must be used inside TodoistCtxProvider';
        logErr({
            errMsg: errMsg,
            fileName: 'TodoistContext.jsx',
            lineNumber: '45'
        })

        throw new Error(errMsg);
    }

    return ctx;
}