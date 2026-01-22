import "/src/css/components/UserSelect.css"
import {useEffect, useState} from "react";
import {BACKEND_HOST} from "./Constants.jsx";
import {notify} from "../services/NotificationService.jsx";
import {useUI} from "../context/UIContext.jsx";

function User({ letter, name, username, onSelect, setIsUserSettingsVisible }) {
    function onUserClick(e) {
        let target = e.currentTarget;
        let username = target.dataset.username;
        sessionStorage.setItem('currentUser', username);

        onSelect();
        setIsUserSettingsVisible(false);
    }

    return (
        <>
            <div data-username={username} onClick={onUserClick} className={"user"}>
                <svg width="200" height="200" viewBox="0 0 100 100">
                    <defs>
                        <filter id="frosted">
                            <feGaussianBlur stdDeviation="2" />
                        </filter>
                    </defs>

                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="rgba(255,255,255,0.1)"
                        filter="url(#frosted)"
                    />

                    <text
                        x="52"
                        y="52"
                        fontSize={"28pt"}
                        fill={"white"}
                        className="user-letter"
                        dominantBaseline="middle"
                        textAnchor="middle"
                    >
                        { letter }
                    </text>
                </svg>
                <h1>{ name }</h1>
                <h2>({ username })</h2>
            </div>
        </>
    )
}

async function getUsers(hideAll, setIsUserSelectVisible) {
    const res = await fetch(`${BACKEND_HOST}/userSettings/getAllUsers`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) {
        notify("There was a problem logging in. Please see the console.");
        const err = await res.body;
        console.log(`Error while fetching users: ${err}`);

        hideAll();
        setIsUserSelectVisible(true);
    }

    return await res.json();
}

function UserSelect() {

    const {
        setIsNumpadVisible, isUserSelectVisible,
        setIsUserSelectVisible, hideAll
    } = useUI();

    const [ users, setUsers ] = useState([]);
    // const [ isUserSelectVisible, setIsUserSelectVisible ] = useState(false); // TODO: Revert to true

    useEffect(() => {
        getUsers(hideAll, setIsUserSelectVisible)
            .then(data => {
                console.log(data);
                setUsers(data)
            })
    }, []);

    return (
        <>
            <div id="users-container" className={isUserSelectVisible ? "is-visible" : ""}>
                {users.map((user) => (
                    <User
                        key={user.username}
                        letter={user.nameFirstLetter}
                        name={user.name}
                        username={user.username}
                        onSelect={() => setIsNumpadVisible(true)}
                        setIsUserSettingsVisible={setIsUserSelectVisible}
                    />
                ))}
            </div>
        </>
    );
}

export default UserSelect