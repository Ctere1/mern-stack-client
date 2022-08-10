import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import MessageForm from '../components/MessageForm'
import Sidebar from '../components/Sidebar'

function Chat() {
    return (
        <Container>
            <Row>
                <Col md={4}>
                    <Sidebar></Sidebar>
                </Col>

                <Col md={8}>
                    <MessageForm></MessageForm>
                </Col>

            </Row>
        </Container>
    )
}

export default Chat