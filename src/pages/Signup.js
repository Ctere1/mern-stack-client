import React, { useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { useSignupUserMutation, useGetUsersMutation, useAddReferralPointMutation } from "../services/appApi";
import { Link, useNavigate } from "react-router-dom";
import './Signup.css';
import pp from "../assets/avatar.jpg";



function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [referralCode, setReferralCode] = useState('');

    const [image, setImage] = useState(null);
    const [uploadingImg, setUploadingImg] = useState(false);
    const [imgPreview, setImgPreview] = useState(null);

    const navigate = useNavigate();
    const [signupUser, { isLoading, error }] = useSignupUserMutation();
    const [getUsers] = useGetUsersMutation();
    const [addReferralPoint] = useAddReferralPointMutation();

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
        data.append('upload_preset', 'jmbqiohds'); //cloudify storage name
        try {
            setUploadingImg(true);
            let res = await fetch('https://api.cloudinary.com/v1_1/dyzuhnuw6/image/upload', {
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

        const users = await getUsers();
        //check all codes if there is a match, give the points to matched user
        console.log(users.data.forEach(function (user) {
            if (user.referralCode === referralCode) {
                addReferralPoint(user);
            }
        }));
        //signup
        signupUser({ name, email, password, picture: url }).then(({ data }) => {
            if (data) {
                console.log(data);
                navigate("/chat");
            }
        });
    }

 
    return (
        <Container>
            <Row>
                <Col md={7} className='d-flex allign-items-center justify-content-center flex-direction-column'>
                    <Form style={{ width: '80%', maxWidth: 500 }} onSubmit={handleSignup}>
                        <h1 className='text-center'>Create Account</h1>
                        <div className='signup-pp-container'>
                            <img src={imgPreview || pp} className='signup-pp' ></img>
                            <label htmlFor='image-upload' className='image-upload-label'> <i className='fas fa-plus-circle add-picture-icon'></i>
                            </label>
                            <input type='file' id='image-upload' hidden accept='image/png, image/jpg' onChange={validateImg}></input>
                        </div>
                        <Form.Group className="mb-3" controlId="formBasicName">
                            {error && <p className="alert alert-danger">{error.data}</p>}
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Your Name" onChange={(e) => setName(e.target.value)} value={name} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} value={email} />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicText">
                            <Form.Label>Referral Code</Form.Label>
                            <Form.Control type="text" placeholder="Enter code" onChange={(e) => setReferralCode(e.target.value)} value={referralCode} />
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
                    </Form>
                </Col>

                <Col md={5} className='signup__bg'></Col>

            </Row>

        </Container>
    )
}

export default Signup