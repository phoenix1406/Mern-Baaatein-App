// import logo from './logo.svg';
// import './App.css';

import {BrowserRouter as Router,Routes,Route,Navigate} from "react-router-dom";
import LoginPage from "./scenes/loginPage";
import HomePage from "./scenes/homePage";
import ProfilePage from "./scenes/profilePage";
import Navbar from "./scenes/Navbar";
import {useMemo} from "react";

import {CssBaseline,ThemeProvider} from "@mui/material";
import {createTheme} from "@mui/material/styles";
import {themeSettings} from "./theme.js";
import {useSelector} from "react-redux";


function App() {
  const mode = useSelector((state)=>state.mode);
  const theme = useMemo(()=>createTheme(themeSettings(mode)),[mode]);

  // if token exist then grab it 
  // boolean just convert into boolean value if he has got token it will grab using useSelector hook then it will be converted to boolean
  const isAuth = Boolean(useSelector((state)=>state.token));

  return (
    <div className="App">
      <Router>
        <ThemeProvider theme ={theme}>
          <CssBaseline/>
        <Routes>
          <Route exact path = "/" element = {<LoginPage/>}/>
          <Route exact path = "/home" element = { isAuth ?<HomePage/>: <Navigate to ="/"/>}/>
          <Route exact path = "/profile/:userId" element = { isAuth ? <ProfilePage/>: <Navigate to ="/"/>}/>
        </Routes>
        </ThemeProvider>
      </Router>
    </div>
  );
}

export default App;
