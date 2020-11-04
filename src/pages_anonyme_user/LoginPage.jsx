import React, { useState } from 'react';
import { Button, Card, Container, Form } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import swal from 'sweetalert';
import { apiUrl } from '../links/links';

export default function LoginPage() {
    const [loggedin, setloggedin] = useState(false);
    const [email, setemail] = useState('a');
    const [password, setpassword] = useState('a')

    const signIn = (email, password) => {
        let data = new FormData();
        data.append('email', email);
        data.append('password', password);
        //console.log(email, password)
        fetch(`${apiUrl}signin`, {
            method: 'post',
            body: data
        }).then(r => r.json())
            .then(r => {
                if (r.status) {
                    sessionStorage.setItem('userData', JSON.stringify(r.response));
                    setloggedin(true);
                } else {
                    swal(r.response[0]);
                    //console.log(r.response)
                }
            }).catch(e => {
                //alert(e);
                //console.log(e);
                //console.log(apiUrl)
            });

        //sessionStorage.setItem('userData', 'JSON.stringify(r.response)');
        //setloggedin(true);
        //console.log(email, password)
    }

    if (loggedin) {
        return (
            <Redirect to='/' />
        )
    }

    if (sessionStorage.getItem('userData')) {
        return (<Redirect to="/" />)
    }
    return (
        <Container>
            <div className="d-flex justify-content-center" style={{ marginTop: '100px' }}>
                <img src={require('../img/logo-removebg.png')} alt="Logo" width="199.5" height="225" />
            </div>
            <div className="d-flex justify-content-center h-50">
                <Card>
                    <Card.Header>
                        <Card.Title>Connexion</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Form>
                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label>Adresse E-mail</Form.Label>
                                <Form.Control type="email" placeholder="adresse@email.com" onChange={e => setemail(e.target.value)} onKeyUp={e => {
                                    if(e.keyCode === 13) signIn(email, password)
                                }} />
                            </Form.Group>
                            <Form.Group controlId="exampleForm.ControlInput2">
                                <Form.Label>Mot de passe</Form.Label>
                                <Form.Control type="password" onChange={e => setpassword(e.target.value)} onKeyUp={e => {
                                    if(e.keyCode === 13) signIn(email, password)
                                }} />
                            </Form.Group>
                        </Form>
                    </Card.Body>
                    <Card.Footer>
                        <Button variant="outline-warning" onClick={() => signIn(email, password)}>
                            Connexion
                        </Button>
                    </Card.Footer>
                </Card>
            </div>
        </Container>
    )
}