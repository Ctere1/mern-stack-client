import React from 'react'
import { useSelector } from "react-redux";
import { useGetUsersMutation } from "../services/appApi";
function Board() {
    const user = useSelector((state) => state.user);
    const [getUsers] = useGetUsersMutation();

    return (
        <div className="board">
            <h1 className='leaderboard'>Leaderboard</h1>
        </div>
    )
}

export default Board