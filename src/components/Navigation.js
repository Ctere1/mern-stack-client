import React from 'react'
import { Container, Navbar, NavDropdown, Nav, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useLogoutUserMutation } from "../services/appApi";
import { useSelector } from "react-redux";
import logo from "../assets/Logo.png";

function Navigation() {
    const user = useSelector((state) => state.user);
    const [logoutUser] = useLogoutUserMutation();

    async function handleLogout(e) {
        e.preventDefault();
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        await logoutUser(user);
        // redirect to home page
        window.location.replace("/");
    }

    return (
        <Navbar bg="light" expand="lg"  >
            <Container >
                <LinkContainer to={'/'}>
                    <Navbar.Brand>
                        <img src={logo} alt="Logo" style={{ width: 200, height: 50 }} />
                    </Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <LinkContainer to="/">
                            <Nav.Link>Home</Nav.Link>
                        </LinkContainer>
                        {!user && (
                            <LinkContainer to="/login">
                                <Nav.Link>Login</Nav.Link>
                            </LinkContainer>
                        )}
                        {user && (
                            <LinkContainer to="/board">
                                <Nav.Link>Leaderboard</Nav.Link>
                            </LinkContainer>
                        )}
                        {user && (
                            <LinkContainer to="/chat">
                                <Nav.Link>Chat</Nav.Link>
                            </LinkContainer>
                        )}
                        {user && (
                            <NavDropdown
                                title={
                                    <>
                                        <img src={user.picture} style={{ width: 30, height: 30, objectFit: "cover", borderRadius: "50%" }} />
                                    </>
                                }
                                id="basic-nav-dropdown"
                            >
                                <NavDropdown.Item href="/profile">My Profile</NavDropdown.Item>
                                <NavDropdown.Item>
                                    <Button variant="danger" onClick={handleLogout}>
                                        Logout
                                    </Button>
                                </NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Navigation