import React, { useEffect, useState } from 'react'
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useGetUsersMutation } from "../services/appApi";
import Profiles from '../components/Profiles';
import "./Board.css";

function Board() {
    const user = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [period, setPeriod] = useState(0);
    const [getUsers] = useGetUsersMutation();

    useEffect(() => {
        if (user) {
            setLoading(true);
            getUsers(user).unwrap().then((data) => {
                setUsers(data)
            }).catch((err) => {
                console.log(err);
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [])


    if (loading) {
        return <p className='text-center'>Data is loading...</p>;
    }


    const handleClick = (e) => {
        setPeriod(e.target.dataset.id)
    }

    function sortPoints(data, between) {
        const today = new Date();
        const previous = new Date(today);
        previous.setDate(previous.getDate() - (between + 1));

        let filter = data?.filter(val => {
            let userDate = new Date(val.createdAt);
            if (between == 0) return val;
            return previous <= userDate && today >= userDate;
        })

        // sort with asending order
        return filter?.sort((a, b) => {
            if (a.points === b.points) {
                return b.points - a.points;
            } else {
                return b.points - a.points;
            }
        })
    }

    return (<Container>
        <div className="board">
            <h1 className='leaderboard'>Leaderboard</h1>
            <div className="duration">
                <button onClick={handleClick} data-id='7'>7 Days</button>
                <button onClick={handleClick} data-id='30'>30 Days</button>
                <button onClick={handleClick} data-id='0'>All-Time</button>
            </div>
            <Profiles Leaderboard={sortPoints(users, period)}></Profiles>

        </div>
    </Container>

    )
}

export default Board