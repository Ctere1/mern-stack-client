import React, { useState } from 'react'
import { Col, Container, Form, Button } from "react-bootstrap";
import { useDeleteUserMutation, useUpdateUserMutation } from "../services/appApi";
import { useSelector } from "react-redux";
import Card from 'react-bootstrap/Card';
import "./MyProfile.css";

function MyProfile() {
    const user = useSelector((state) => state.user);
    const email = user.email;
    const [deleteUser] = useDeleteUserMutation();
    const [updateUser] = useUpdateUserMutation();
    const [newName, setNewName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');

    async function handleDelete(e) {
        e.preventDefault();
        await deleteUser(user);
        // redirect to home page
        window.location.replace("/");
    }

    async function handleUpdate(e) {
        e.preventDefault();
        if (newName && oldPassword) {
            await updateUser({ newName, email, oldPassword, newPassword });
            // refresh profile page
            window.location.replace("/profile");
            alert('Updated');
        } else {
            alert('Enter your current password');
        }
    }

    return (<Container>
        <Card className="text-left">
            <Card.Header>
                Account Info
                <Card.Img variant="top" />
            </Card.Header>
            <Card.Body  >
                <Card.Title>
                    <p>User Name: {user.name} </p>
                    <p>Email: {user.email}</p>
                </Card.Title>
                <Card.Text>
                    <p style={{ color: 'green' }}>My Points: {user.points} </p>
                    <p style={{ color: 'red' }}>My Referral Code: {user.referralCode}</p>
                </Card.Text>
                <Button variant="outline-danger" onClick={handleDelete} style={{ marginTop: '10px' }}>
                    Delete Account
                </Button>
            </Card.Body>
        </Card>

        <Card className="text-left" style={{ marginTop: '10px' }} >
            <Card.Header>
                Update Account
            </Card.Header>
            <Card.Body  >
                <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={handleUpdate}>
                    <Form.Group className="mb-3" controlId="formBasicName" >
                        <Form.Label class="text-left">New User Name</Form.Label>
                        <Form.Control type="text" placeholder="Name" onChange={(e) => setNewName(e.target.value)} value={newName} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={(e) => setOldPassword(e.target.value)} value={oldPassword} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={(e) => setNewPassword(e.target.value)} value={newPassword} />
                    </Form.Group>
                    <Button variant="warning" type="submit">
                        Update Account
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    </Container>

    )
}

export default MyProfile