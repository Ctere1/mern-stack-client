import React, { useEffect, useState } from 'react'
import { Container, Form, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useGetUsersMutation } from "../services/appApi";
import Profiles from '../components/Profiles';
import "./Board.css";

function Board() {
    const user = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [getUsers] = useGetUsersMutation();


    useEffect(() => {
        setLoading(true);
        getUsers().then((data) => {
            setUsers(data.data)
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            setLoading(false);
        });
    }, [])


    if (loading) {
        return <p>Data is loading...</p>;
    }

    return (<Container>
        <div className="board">
            <h1 className='leaderboard'>Leaderboard</h1>

            <Profiles Leaderboard={users}></Profiles>

        </div>
    </Container>

    )
}

export default Board