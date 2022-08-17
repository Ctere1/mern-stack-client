import React, { useState } from 'react'
import { Container, Form, Button } from "react-bootstrap";
import { useDeleteUserMutation, useUpdateUserMutation } from "../services/appApi";
import { useSelector } from "react-redux";
import Card from 'react-bootstrap/Card';
import { useReward } from 'react-rewards';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import "./MyProfile.css";

function MyProfile() {
    const user = useSelector((state) => state.user);
    const email = user.email;
    const [deleteUser] = useDeleteUserMutation();
    const [updateUser] = useUpdateUserMutation();
    const [newName, setNewName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const { reward: confettiReward, isAnimating: isConfettiAnimating } = useReward('confettiReward', 'confetti');
    const { reward: balloonsReward, isAnimating: isBalloonsAnimating } = useReward('balloonsReward', 'balloons');
    const popoverCode = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">Referral Code</Popover.Header>
            <Popover.Body>
                Share <strong>{user.referralCode}</strong> code with your friends and grab the 50 point!
            </Popover.Body>
        </Popover>
    );

    async function handleDelete(e) {
        e.preventDefault();
        await deleteUser(user);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // redirect to home page
        window.location.replace("/");
    }

    async function handleUpdate(e) {
        e.preventDefault();
        if (newName && oldPassword) {
            await updateUser({ newName, email, oldPassword, newPassword });
            // refresh profile page
            alert('Updated');
        } else {
            alert('Enter your current password');
        }
    }

    return (<Container>
        <Card className="text-left" border="dark">
            <Card.Header>
                <Card.Img variant="top" style={{ height: '30px', width: '30px' }} src='https://cdn-icons-png.flaticon.com/512/126/126472.png?w=826&t=st=1660768376~exp=1660768976~hmac=038c41fda2318a9af1c3dae603c9336ccd661327a36dfb7f327475efeecd28fc' />{' '}
                Account Info
            </Card.Header>
            <Card.Body  >
                <Card.Title>
                    <p>User Name: {user.name} </p>
                    <p>Email: {user.email}</p>
                </Card.Title>
                <Card.Text>
                    <Button variant="primary" disabled={isConfettiAnimating || isBalloonsAnimating} onClick={() => { confettiReward(); balloonsReward(); }} className='points'>
                        My Points:  {user.points}
                    </Button>{' '}
                    <span id="confettiReward" />
                    <span id="balloonsReward" />
                    <OverlayTrigger trigger="click" placement="right" overlay={popoverCode}>
                        <Button variant="success">My Referral Code</Button>
                    </OverlayTrigger>
                </Card.Text>
                <Button variant="outline-danger" onClick={handleDelete} style={{ marginTop: '10px' }}>
                    Delete Account
                </Button>
            </Card.Body>
        </Card>

        <Card className="text-left" border="dark" style={{ marginTop: '10px' }} >
            <Card.Header>
                Update Account
            </Card.Header>
            <Card.Body  >
                <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={handleUpdate}>
                    <Form.Group className="mb-3" controlId="formBasicName" >
                        <Form.Label>New User Name</Form.Label>
                        <Form.Control type="text" placeholder="Name" onChange={(e) => setNewName(e.target.value)} value={newName} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={(e) => setOldPassword(e.target.value)} value={oldPassword} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword2">
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