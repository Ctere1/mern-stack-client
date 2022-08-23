import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import Board from "./pages/Board";
import MyProfile from "./pages/MyProfile";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { AppContext, socket } from "./context/appContext";
import jwt_decode from "jwt-decode";


function App() {
    const [rooms, setRooms] = useState([]);
    const [currentRoom, setCurrentRoom] = useState([]);
    const [members, setMembers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [privateMemberMsg, setPrivateMemberMsg] = useState({});
    const [newMessages, setNewMessages] = useState({});
    const user = useSelector((state) => state.user);

    useEffect(() => {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken !== null) {
            const { exp } = jwt_decode(refreshToken)
            if (Date.now() >= (exp * 1000)) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("persist:root");
                alert('Your session expired. Please login again');
                window.location.replace("/");
            }
        }
    }, [])

    return (
        <AppContext.Provider value={{ socket, currentRoom, setCurrentRoom, members, setMembers, messages, setMessages, privateMemberMsg, setPrivateMemberMsg, rooms, setRooms, newMessages, setNewMessages }}>
            <BrowserRouter>
                <Navigation />
                <Routes>
                    <Route path="/" element={<Home />} />
                    {!user ? (
                        <>
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                        </>
                    ) : (
                        <>
                            <Route path="/chat" element={<Chat />} />
                            <Route path="/profile" element={<MyProfile />} />
                            <Route path="/board" element={<Board />} />
                        </>
                    )}

                </Routes>
            </BrowserRouter>
        </AppContext.Provider>
    );
}

export default App;