import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { useSignupUserMutation, useGoogleSignupMutation } from "../services/appApi";
import { Link, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

import './Signup.css';
import pp from "../assets/avatar.jpg";


function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [referralFromCode, setReferralFromCode] = useState('');

    const [image, setImage] = useState(null);
    const [uploadingImg, setUploadingImg] = useState(false);
    const [imgPreview, setImgPreview] = useState(null);

    const navigate = useNavigate();
    const [signupUser, { error }] = useSignupUserMutation();
    const [googleSignup] = useGoogleSignupMutation();
    const [googleUser, setGoogleUser] = useState('');

    function validateImg(e) {
        const file = e.target.files[0];
        if (file.size > 1048576) {
            return alert('Max file size must be 1mb')
        } else {
            setImage(file);
            setImgPreview(URL.createObjectURL(file))
        }
    }

    async function uploadeImg(e) {
        const data = new FormData();
        data.append('file', image);
        data.append('upload_preset', process.env.REACT_APP_CLOUDINARY_STORAGE_NAME);
        const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_USER_NAME}/image/upload`
        try {
            setUploadingImg(true);
            let res = await fetch(url, {
                method: 'post',
                body: data
            });
            const urlData = await res.json();
            setUploadingImg(false);
            return urlData.url
        } catch (error) {
            setUploadingImg(false);
            console.log(error);
        }
    }

    async function handleSignup(e) {
        e.preventDefault();
        const url = await uploadeImg(image)
        console.log(url);
        //signup
        if (googleUser) {
            googleSignup({ google: googleUser, referralFromCode }).then(({ data }) => {
                if (data) {
                    alert('Account created. Please login now.');
                    navigate("/login", { state: googleUser });
                }
            });
        } else {
            signupUser({ name, email, password, picture: url, referralFromCode }).then(({ data }) => {
                if (data) {
                    alert('Account created. Please login now.');
                    navigate("/login", { state: email });
                }
            });
        }
    }

    function handleCallbackGoogleResponse(response) {
        var userObject = jwt_decode(response.credential);
        setGoogleUser(response)
        setName(userObject.name)
        setEmail(userObject.email)
        setImage(userObject.picture)
    }

    useEffect(() => {
        /* global google */
        google.accounts.id.initialize({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            callback: handleCallbackGoogleResponse
        })
        google.accounts.id.renderButton(
            document.getElementById("googleSignIn"),
            { theme: "filled_black.", size: "large", text: "Sign up with Google" }  // customization attributes
        );
        // google.accounts.id.prompt(); // also display the One Tap dialog
    }, []);


    return (
        <Container>
            <Row>
                <Col md={7} className='d-flex allign-items-center justify-content-center flex-direction-column'>
                    <Form style={{ width: '80%', maxWidth: 500 }} onSubmit={handleSignup}>
                        <h1 className='text-center'>Create Account</h1>
                        <div className='signup-pp-container'>
                            <img src={imgPreview || pp} alt='PP' className='signup-pp' ></img>
                            <label htmlFor='image-upload' className='image-upload-label'> <i className='fas fa-plus-circle add-picture-icon'></i>
                            </label>
                            <input type='file' id='image-upload' hidden accept='image/png, image/jpg' onChange={validateImg}></input>
                        </div>
                        <Form.Group className="mb-3" controlId="formBasicName">
                            {error && <p className="alert alert-danger">{error.data}</p>}
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Your Name" onChange={(e) => setName(e.target.value)} value={name} required />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} value={email} required />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        {!googleUser && (
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} required />
                            </Form.Group>
                        )}

                        <Form.Group className="mb-3" controlId="formBasicText">
                            <Form.Label>Referral Code</Form.Label>
                            <Form.Control type="text" placeholder="Enter code" onChange={(e) => setReferralFromCode(e.target.value)} value={referralFromCode} />
                            <Form.Text className="text-muted">
                                (optional)
                            </Form.Text>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {uploadingImg ? 'Signing you up..' : 'Signup'}
                        </Button>
                        <div className='py-4'>
                            <p className='text-center'>Already have an account ? <Link to='/login'>Login</Link></p>
                        </div>
                        <div id='googleSignIn'></div>
                    </Form>
                </Col>

                <Col md={5} className='signup__bg'></Col>

            </Row>

        </Container>
    )
}

export default Signup