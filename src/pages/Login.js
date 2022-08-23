import React, { useContext, useState, useEffect } from "react";
import { Col, Container, Form, Row, Button, Spinner } from "react-bootstrap";
import { useLoginUserMutation, useAddReferralPointMutation, useGoogleLoginMutation } from "../services/appApi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Login.css";
import { AppContext } from "../context/appContext";
import jwt_decode from "jwt-decode";


function Login() {
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { socket } = useContext(AppContext);
    const [loginUser, { isLoading, error }] = useLoginUserMutation();
    const [addReferralPoint] = useAddReferralPointMutation();
    const [googleLogin] = useGoogleLoginMutation();
    const [googleUser, setGoogleUser] = useState('');

    function handleLogin(e) {
        e.preventDefault();
        // login logic
        if (googleUser) {
            googleLogin({ google: googleUser }).then(({ data }) => {
                if (data) {
                    const { user, accessToken, refreshToken } = data;
                    localStorage.setItem("accessToken", accessToken);
                    localStorage.setItem("refreshToken", refreshToken);
                    //check the RefferalFromCode for points update
                    addReferralPoint(user);
                    // socket work
                    socket.emit("new-user");
                    // navigate to the chat
                    navigate("/chat");
                }
            });
        } else {
            loginUser({ email, password }).then(({ data }) => {
                if (data) {
                    const { user, accessToken, refreshToken } = data;
                    localStorage.setItem("accessToken", accessToken);
                    localStorage.setItem("refreshToken", refreshToken);
                    //check the RefferalFromCode for points update
                    addReferralPoint(user);
                    // socket work
                    socket.emit("new-user");
                    // navigate to the chat
                    navigate("/chat");
                }
            });
        }
    }

    function handleCallbackResponse(response) {
        var userObject = jwt_decode(response.credential);
        setGoogleUser(response)
        setEmail(userObject.email)
    }

    useEffect(() => {
        if (location.state?.credential) {
            handleCallbackResponse(location.state)
        } else if (location.state) {
            setEmail(location.state);
        }
        /* global google */
        google.accounts.id.initialize({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            callback: handleCallbackResponse
        })
        google.accounts.id.renderButton(
            document.getElementById("googleSignIn"),
            { theme: "filled_black", size: "large", text: "signin_with" }  // customization attributes
        );
        //google.accounts.id.prompt(); // also display the One Tap dialog

    }, []);


    return (
        <Container>
            <Row>
                <Col md={5} className="login__bg"></Col>
                <Col md={7} className="d-flex align-items-center justify-content-center flex-direction-column">
                    <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={handleLogin}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            {error && <p className="alert alert-danger">{error.data}</p>}
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} value={email} required />
                            <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
                        </Form.Group>

                        {!googleUser && (
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} required />
                            </Form.Group>
                        )}

                        <Button variant="primary" type="submit">
                            {isLoading ? <Spinner animation="grow" /> : "Login"}
                        </Button>
                        <div className="py-4">
                            <p className="text-center">
                                Don't have an account ? <Link to="/signup">Signup</Link>
                            </p>
                        </div>
                        <Row>
                            <div style={{ width: "initial" }} id='googleSignIn'></div>
                        </Row>
                    </Form>

                </Col>
            </Row>
        </Container>
    );
}

export default Login;