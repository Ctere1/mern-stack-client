import React from 'react'
import "./Profiles.css";

export default function Profiles({ Leaderboard }) {
    return (
        <div id="profile">
            {Item(Leaderboard)}
        </div>
    )
}

function Item(data) {
    return (
        <>
        {
            data?.map((value, index) => (
                <div className="flex" key={index}>
                    <div className="item">
                        <img src={value.picture} alt="" />
        
                        <div className="info">
                            <h3 className='name text-dark'>{value.name}</h3>    
                            <span>{value.status}</span>
                        </div>                
                    </div>
                    <div className="item">
                        <span>Point: {value.points}</span>
                    </div>
                </div>
                )
            )
        }
    </>
    )
}