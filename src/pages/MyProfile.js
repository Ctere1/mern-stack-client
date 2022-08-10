import React from 'react'
import { Col, Container, Row, Button } from "react-bootstrap";
import { useDeleteUserMutation } from "../services/appApi";
import { useSelector } from "react-redux";
import Card from 'react-bootstrap/Card';
import "./MyProfile.css";

function MyProfile() {
    const user = useSelector((state) => state.user);
    const [deleteUser] = useDeleteUserMutation();

    async function handleDelete(e) {
        e.preventDefault();
        await deleteUser(user);
        // redirect to home page
        window.location.replace("/");
    }

    return (<Container>
        <Card className="text-center">
            <Card.Header>
                <Card.Img variant="top" src={user.picture} alt="User Picture" style={{ width: 190, height: 140 }} />
            </Card.Header>
            <Card.Body  >
                <Card.Title>
                    <p>User Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                </Card.Title>
                <Card.Text>
                    <p style={{ color: 'green' }}>My Points: {user.points} </p>
                    <p style={{ color: 'red' }}>My Referral Code: {user.referralCode}</p>
                </Card.Text>
                <Button variant="outline-danger" onClick={handleDelete} style={{ marginTop: '100px' }}>
                    Delete Account
                </Button>
            </Card.Body>
        </Card>

    </Container>
    )
}

export default MyProfile