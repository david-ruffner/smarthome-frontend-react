import {useEffect} from "react";


function InventoryScanPage({ idName, visibilityToggle }) {

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080/ws");

        socket.onopen = () => {
            console.log(`Connected to Web Socket!`);
        }

        socket.onmessage = (event) => {
            console.log("Received:", event.data);
        };

        socket.onclose = () => {
            console.log("Closed");
        };

        socket.onerror = (event) => {
            console.error("WebSocket error:", event);
        };

        return () => socket.close();
    }, []);

    return <>
        <div id={idName} className={`by-category-page is-stacked ${visibilityToggle ? 'is-visible' : 'is-hidden'}`}>
            <h2>Scan</h2>
        </div>
    </>
}

export default InventoryScanPage;