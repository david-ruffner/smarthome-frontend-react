import './css/App.css'
import Login from "./pages/Login.jsx";
import NotificationHost from "./components/NotificationHost.jsx";
import {useEffect} from "react";
import Dashboard from "./pages/Dashboard.jsx";
import {BACKEND_HOST} from "./components/Constants.jsx";
import {isStrEmpty} from "./utils/Utils.js";
import {notify} from "./services/NotificationService.jsx";
import {useUI} from "./context/UIContext.jsx";

function App() {
    // const [ isLoginPageVisible, setIsLoginPageVisible ] = useState(true);
    // const [ isDashboardVisible, setIsDashboardVisible ] = useState(false);
    // const [ friendlyName, setFriendlyName ] = useState('');

    const {
        isLoginPageVisible, setIsLoginPageVisible,
        isDashboardVisible, setIsDashboardVisible,
        friendlyName, setFriendlyName,
        setIsUserSelectVisible
    } = useUI();

    async function checkLogin() {
        // Check if there's an existing token, and if it's valid.
        let token = localStorage.getItem('token');

        if (isStrEmpty(token)) {
            setIsDashboardVisible(false);
            setIsLoginPageVisible(true);
        }

       const resp = await fetch(`${BACKEND_HOST}/userSettings/verifyToken?token=${token}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

       if (!resp.ok) {
           notify("There was a problem logging in. Please see the console.");
           let err = await resp.body;
           console.log(`Login Error: ${err}`);
           setIsUserSelectVisible(true);

           return;
       }

        let data = await resp.json();
        console.log(data); // TODO: Remove
        setFriendlyName(data.name);
        setIsLoginPageVisible(false);
        setIsDashboardVisible(true);
    }

    useEffect(() => {
        checkLogin();
    }, []);

  return (
      <>
          <NotificationHost/>

          <div id={'app-stage'}>
              <Login
                  isLoginPageVisible={isLoginPageVisible}
                  setIsLoginPageVisible={setIsLoginPageVisible}
                  setIsDashboardVisible={setIsDashboardVisible}
                  setFriendlyName={setFriendlyName}
              />

              <Dashboard
                  isDashboardVisible={isDashboardVisible}
                  setIsDashboardVisible={setIsDashboardVisible}
                  friendlyName={friendlyName}
              />
          </div>

          <script src="https://code.jquery.com/jquery-3.7.1.js" integrity="sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4="
                  crossOrigin="anonymous"></script>
      </>
  )
}

export default App
