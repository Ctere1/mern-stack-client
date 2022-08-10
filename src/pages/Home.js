import React from 'react'
import { Row, Col, Button } from 'react-bootstrap';
import { useSelector } from "react-redux";
import './Home.css';

function Home() {
    const user = useSelector((state) => state.user);

    async function handleRoute(e) {
        e.preventDefault();
        if (user && user.status === 'online') {
            window.location.replace("/chat");
        } else {
            // redirect to login page
            window.location.replace("/login");
        }
    }

    return (
        <Row>
            <Col md={6} className='d-flex flex-direction-column align-items-center justify-content-center'>
                <div className='app-name'>
                    <h1 >Share the world with your friends</h1>
                    <p>Student Metaverse Nightclub Loyalty App</p>
                    <Button variant='success' onClick={handleRoute}>Get Started  <i className='fas fa-comments home-message-icon'></i></Button>
                </div>
            </Col>
            <Col md={6} className='home__bg' >
            </Col>
        </Row >
    )
}

export default Home