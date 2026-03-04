import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'
import App from './App.jsx'
import {UIProvider} from "./context/UIContext.jsx";
import {TodoistCtxProvider} from "./context/TodoistContext.jsx";

createRoot(document.getElementById('root')).render(
    <UIProvider>
        <TodoistCtxProvider>
            <App />
        </TodoistCtxProvider>
    </UIProvider>,
)
