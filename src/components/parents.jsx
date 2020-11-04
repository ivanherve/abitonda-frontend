import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faArrowUp, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, Col, Form, ListGroup, Modal, Nav, OverlayTrigger, Row, Tab, Tooltip } from 'react-bootstrap';
import StickyBox from "react-sticky-box";
import swal from 'sweetalert';
import { apiUrl, EmptyList, getRequest, Idx, loadingTime, postAuthRequest } from '../links/links';
import { LoadingComponent } from './LoadingComponent';

library.add(
    faPlus,
    faTimes,
    faEdit,
    faArrowUp,
);

export const banStudent = s => {
    let data = new FormData();
    data.append('student_id', s.Student_Id);
    let token = JSON.parse(sessionStorage.getItem('userData')).token.api_token;
    let header = postAuthRequest(token, data);
    swal('Etes-vous sûr de vouloir bannir cet élève ?').then((confirmed) => {
        if (confirmed)
            fetch(`${apiUrl}banstudent`, header)
                .then(r => r.json())
                .then(r => {
                    if (r.status) swal('Parfait!', r.response, 'success').then(() => window.location.reload())
                    else swal('Erreur!', r.response, 'warning');
                })
    })

}

export const resetStudent = s => {
    let data = new FormData();
    data.append('student_id', s.Student_Id);
    let token = JSON.parse(sessionStorage.getItem('userData')).token.api_token;
    let header = postAuthRequest(token, data);
    swal('Etes-vous sûr de vouloir réintégrer cet élève ?').then(confirmed => {
        if (confirmed)
            fetch(`${apiUrl}resetstudent`, header)
                .then(r => r.json())
                .then(r => {
                    if (r.status) swal('Parfait!', r.response, 'success').then(() => window.location.reload())
                    else swal('Erreur!', r.response, 'warning');
                })
    })
}

export function Parents() {
    const [parents, setparents] = useState([]);
    const [name, setname] = useState('');
    const [email, setemail] = useState('');
    const [profil, setprofil] = useState('');
    const [students, setstudents] = useState([]);
    const [showAddStudent, setshowAddStudent] = useState(false);
    const [showEditParent, setshowEditParent] = useState(false);
    const [loading, setloading] = useState(1);
    const [oneParent, setoneParent] = useState('');
    const [status, setStatus] = useState(false);

    const [showAddParent, setshowAddParent] = useState(false);
    const [addParentFirstname, setaddParentFirstname] = useState('');
    const [addParentSurname, setaddParentSurname] = useState('');
    const [addParentEmail, setaddParentEmail] = useState('');
    const [addParentPassword, setaddParentPassword] = useState('');
    const [addParentConfPassword, setaddParentConfPassword] = useState('');

    const [addStudentFirstname, setaddStudentFirstname] = useState('');
    const [addStudentSurname, setaddStudentSurname] = useState('');
    const [addStudentBday, setaddStudentBday] = useState('');
    const [addStudentClass, setaddStudentClass] = useState('');

    const [editParentFirstname, seteditParentFirstname] = useState('');
    const [editParentSurname, seteditParentSurname] = useState('');
    const [editParentEmail, seteditParentEmail] = useState('');

    const [editParentPwdCorrect, seteditParentPwdNotCorrect] = useState(true);
    const [editParentOldPwd, seteditParentOldPwd] = useState('');
    const [editParentNewPwd, seteditParentNewPwd] = useState('');
    const [editParentConfPwd, seteditParentConfPwd] = useState('');

    const [classes, setclasses] = useState([]);


    const user = JSON.parse(sessionStorage.getItem('userData')).user;

    const getStudents = (parentId) => {
        fetch(`${apiUrl}getstudents/${parentId}`, getRequest(JSON.parse(sessionStorage.getItem('userData')).token.api_token))
            .then(r => r.json())
            .then(r => {
                if (r.status)
                    setstudents(Object.values(r.response));
                else
                    setstudents([{ Student_Id: 0, Student: r.response }]);
            });
    }

    const addParent = () => {
        let data = new FormData();
        data.append('firstname', addParentFirstname);
        data.append('surname', addParentSurname);
        data.append('email', addParentEmail);
        data.append('password', addParentPassword);
        data.append('confpassword', addParentConfPassword);
        fetch(`${apiUrl}addparent`, postAuthRequest(JSON.parse(sessionStorage.getItem('userData')).token.api_token, data))
            .then(r => r.json())
            .then(r => {
                if (r.status) swal('Parfait!', r.response, 'success').then(() => window.location.reload());
                else swal('Erreur!', r.response, 'warning');
                //console.log([addParentPassword, addParentConfPassword, addParentConfPassword === addParentPassword])
            })
    }

    const addStudent = () => {
        let data = new FormData();
        data.append('firstname', addStudentFirstname);
        data.append('surname', addStudentSurname.length < 1 ? oneParent.Surname : addStudentSurname);
        data.append('birthdate', addStudentBday);
        data.append('parent_id', oneParent.Parent_Id);
        data.append('class', addStudentClass);
        fetch(`${apiUrl}addstudent`, postAuthRequest(JSON.parse(sessionStorage.getItem('userData')).token.api_token, data))
            .then(r => r.json())
            .then(r => {
                if (r.status) swal('Parfait!', r.response, 'success').then(() => window.location.reload());
                else swal('Erreur!', r.response, 'warning');
            })
    }

    const banParent = () => {
        let data = new FormData();
        data.append('parent_id', oneParent.Parent_Id);
        swal('Etes-vous sûr de vouloir bannir ce parent ?').then(confirmed => {
            if (confirmed)
                fetch(`${apiUrl}banparent`, postAuthRequest(JSON.parse(sessionStorage.getItem('userData')).token.api_token, data))
                    .then(r => r.json())
                    .then(r => {
                        if (r.status) swal('Parfait!', r.response, 'success').then(() => window.location.reload());
                        else swal('Erreur!', r.response, 'warning');
                    })
        })
    }

    const resetParent = () => {
        let data = new FormData();
        data.append('parent_id', oneParent.Parent_Id);
        swal('Etes-vous sûr de vouloir réintégrer ce parent ?').then(confirmed => {
            if (confirmed)
                fetch(`${apiUrl}resetparent`, postAuthRequest(JSON.parse(sessionStorage.getItem('userData')).token.api_token, data))
                    .then(r => r.json())
                    .then(r => {
                        if (r.status) swal('Parfait!', r.response, 'success').then(() => window.location.reload());
                        else swal('Erreur!', r.response, 'warning');
                    })
        })
    }

    const checkPwd = () => {
        let data = new FormData();
        data.append('userId', oneParent.User_Id);
        data.append('oldpassword', editParentOldPwd)
        fetch(`${apiUrl}checkpwd`, postAuthRequest(JSON.parse(sessionStorage.getItem('userData')).token.api_token, data))
            .then(r => r.json())
            .then(r => {
                if (r.status) seteditParentPwdNotCorrect(false);
                //else console.log(r)
            })
    }

    const editPwd = () => {
        let data = new FormData();
        data.append('userId', oneParent.User_Id);
        data.append('oldpassword', editParentOldPwd);
        data.append('newpassword', editParentNewPwd);
        data.append('confpassword', editParentConfPwd);
        let token = JSON.parse(sessionStorage.getItem('userData')).token.api_token;
        let header = postAuthRequest(token, data)
        fetch(`${apiUrl}editpwd`, header)
            .then(r => r.json())
            .then(r => {
                if (r.status) swal('Parfait!', r.response, 'success').then(() => window.location.reload())
                else swal('Erreur!', r.response, 'warning')
            })
    }

    const editInfo = () => {
        let data = new FormData();
        data.append('user_Id', oneParent.User_Id);
        data.append('firstname', editParentFirstname);
        data.append('surname', editParentSurname);
        data.append('email', editParentEmail);
        let token = JSON.parse(sessionStorage.getItem('userData')).token.api_token;
        let header = postAuthRequest(token, data);
        fetch(`${apiUrl}editparent`, header)
            .then(r => r.json())
            .then(r => {
                if (r.status) swal('Parfait!', r.response, 'success').then(() => window.location.reload())
                else swal('Erreur!', r.response, 'warning');
            })
    }

    useEffect(() => {
        const getParents = () => {
            fetch(`${apiUrl}getparents`, getRequest(JSON.parse(sessionStorage.getItem('userData')).token.api_token))
                .then(r => r.json())
                .then(r => {
                    if (r.status) {
                        let firstElement = r.response[0];
                        setparents(r.response);
                        setname(firstElement.Firstname + ' ' + firstElement.Surname);
                        setemail(firstElement.EmailAddress);
                        setprofil(firstElement.Profil);
                        getStudents(firstElement.Parent_Id);
                        setoneParent(firstElement);
                        setStatus(true)
                    }
                    //else console.log(r.response)
                });
        }

        const getClasses = () => {
            fetch(`${apiUrl}getclasses`, getRequest(JSON.parse(sessionStorage.getItem('userData')).token.api_token))
                .then(r => r.json())
                .then(r => {
                    if (r.status) {
                        setclasses(r.response);
                        setaddStudentClass(r.response[0].Class)
                    }
                    //else console.log(r.response);
                })
        }
        
        if (parents.length < 1) getParents();
        if (classes.length < 1) getClasses();
        if (JSON.parse(sessionStorage.getItem('userData')).user.Profil_Id > 2) seteditParentPwdNotCorrect(false);
    }, [parents, classes, editParentPwdCorrect]);

    setTimeout(() => {
        setloading(0);
    }, loadingTime);

    if (loading) return <LoadingComponent img={require('../img/Spinner-1s-98px.svg')} />

    if (!status) {
        return (
            <div>
                {
                    user.Profil_Id > 2
                    &&
                    <Button
                        variant="outline-success"
                        style={{ width: '100%', marginBottom: '10px' }}
                        onClick={() => setshowAddParent(true)}
                    >
                        Ajouter un parent
                    </Button>
                }
                <EmptyList msg="Vous n'avez aucun parent d'inscrit" />
                <AddParent
                    show={showAddParent}
                    hide={() => setshowAddParent(false)}
                    setFirstname={e => setaddParentFirstname(e.target.value)}
                    setSurname={e => setaddParentSurname(e.target.value)}
                    setEmail={e => setaddParentEmail(e.target.value)}
                    setPassword={e => setaddParentPassword(e.target.value)}
                    setConfPassword={e => setaddParentConfPassword(e.target.value)}
                    addParent={() => addParent()}
                />
            </div>
        )
    }

    return (
        <div>
            {
                user.Profil_Id > 2
                &&
                <Button
                    variant="outline-success"
                    style={{ width: '100%', marginBottom: '10px' }}
                    onClick={() => setshowAddParent(true)}
                >
                    Ajouter un parent
                </Button>
            }
            <Row>
                <Col xs='2'>
                    <ListGroup style={{ marginBottom: '100px' }}>
                        {
                            parents.map(p =>
                                <ListGroup.Item
                                    key={Idx(parents, p)}
                                    variant={JSON.parse(sessionStorage.getItem('userData')).user.Profil_Id > 2 && (p.Profil_Id > 1 ? 'success' : 'danger')}
                                    action
                                    onClick={() => {
                                        setname(p.Firstname + ' ' + p.Surname);
                                        setemail(p.EmailAddress);
                                        setprofil(p.Profil);
                                        getStudents(p.Parent_Id);
                                        setoneParent(p);
                                    }}
                                >
                                    {p.Firstname} {p.Surname}
                                </ListGroup.Item>
                            )
                        }
                    </ListGroup>
                </Col>
                <Col xs='10'>
                    <StickyBox offsetTop={80} offsetBottom={10}>
                        <Card
                            style={{ width: '100%', height: '75vh', overflowY: 'auto' }}
                        >
                            <Card.Header>
                                <Row>
                                    <Col xs="11">
                                        <Card.Title>{name}</Card.Title>
                                        <Card.Text>
                                            <i>{email}</i>
                                            <br />
                                            <i>{profil}</i>
                                        </Card.Text>
                                    </Col>
                                    <Col>
                                        {
                                            JSON.parse(sessionStorage.getItem('userData')).user.Profil_Id > 2
                                            &&
                                            (
                                                oneParent.Profil_Id > 1
                                                    ?
                                                    <OverlayTrigger
                                                        placement="auto"
                                                        delay={{ show: 250, hide: 400 }}
                                                        overlay={<Tooltip>Bannir</Tooltip>}
                                                    >
                                                        <Button
                                                            style={{ width: '100%', marginBottom: '10px' }}
                                                            variant="outline-danger"
                                                            onClick={() => banParent()}
                                                        >
                                                            <FontAwesomeIcon icon={["fas", "times"]} />
                                                        </Button>
                                                    </OverlayTrigger>
                                                    :
                                                    <OverlayTrigger
                                                        placement="auto"
                                                        delay={{ show: 250, hide: 400 }}
                                                        overlay={<Tooltip>Réintégrer</Tooltip>}
                                                    >
                                                        <Button
                                                            style={{ width: '100%', marginBottom: '10px' }}
                                                            variant="outline-success"
                                                            onClick={() => resetParent()}
                                                        >
                                                            <FontAwesomeIcon icon={["fas", "arrow-up"]} />
                                                        </Button>
                                                    </OverlayTrigger>
                                            )
                                        }
                                        <OverlayTrigger
                                            placement="auto"
                                            delay={{ show: 250, hide: 400 }}
                                            overlay={<Tooltip>Modifier</Tooltip>}
                                        >
                                            <Button style={{ width: '100%' }} variant="outline-info" onClick={() => setshowEditParent(true)}>
                                                <FontAwesomeIcon icon={["far", "edit"]} />
                                            </Button>
                                        </OverlayTrigger>
                                    </Col>
                                </Row>
                            </Card.Header>
                            <ListGroup className="list-group-flush" style={{ overflowY: 'auto' }}>
                                {
                                    JSON.parse(sessionStorage.getItem('userData')).user.Profil_Id > 2
                                    &&
                                    <Button
                                        style={{ width: '100%' }}
                                        variant="light"
                                        onClick={() => setshowAddStudent(true)}
                                        disabled={oneParent.Profil_Id < 2}
                                    >
                                        <FontAwesomeIcon icon={["fas", "plus"]} /> Ajouter un enfant
                                </Button>
                                }
                                {
                                    students.map(s =>
                                        <ListGroup.Item
                                            key={Idx(students, s)}
                                            disabled={(s.Student_Id === 0) || oneParent.Profil_Id < 2}
                                        >
                                            <Row>
                                                <Col xs="11">
                                                    <div>{s.Student}</div>
                                                    <p style={{ fontStyle: 'italic', fontSize: '0.75em' }}>
                                                        {s.class}
                                                    </p>
                                                    {
                                                        JSON.parse(sessionStorage.getItem('userData')).user.Profil_Id > 2
                                                        &&
                                                        (
                                                            s.Student_Id !== 0
                                                            &&
                                                            (
                                                                s.disabled
                                                                    ?
                                                                    <Badge variant='danger'>
                                                                        Bannis
                                                                </Badge>
                                                                    :
                                                                    <Badge variant='success'>
                                                                        Inscrit
                                                                </Badge>
                                                            )
                                                        )
                                                    }
                                                </Col>
                                                <Col xs="1">
                                                    {
                                                        JSON.parse(sessionStorage.getItem('userData')).user.Profil_Id > 2
                                                        &&
                                                        (
                                                            s.Student_Id !== 0
                                                            &&
                                                            (
                                                                s.disabled
                                                                    ?
                                                                    <OverlayTrigger
                                                                        placement="auto"
                                                                        delay={{ show: 250, hide: 400 }}
                                                                        overlay={<Tooltip>Réintégrer</Tooltip>}
                                                                    >
                                                                        <Button style={{ width: '100%' }} variant='outline-primary' onClick={() => resetStudent(s)}>
                                                                            <FontAwesomeIcon icon={["fas", "arrow-up"]} />
                                                                        </Button>
                                                                    </OverlayTrigger>
                                                                    :
                                                                    <OverlayTrigger
                                                                        placement="auto"
                                                                        delay={{ show: 250, hide: 400 }}
                                                                        overlay={<Tooltip>Bannir</Tooltip>}
                                                                    >
                                                                        <Button style={{ width: '100%' }} variant='outline-danger' onClick={() => banStudent(s)}>
                                                                            <FontAwesomeIcon icon={["fas", "times"]} />
                                                                        </Button>
                                                                    </OverlayTrigger>
                                                            )
                                                        )
                                                    }
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    )
                                }
                            </ListGroup>
                            <AddStudent
                                show={showAddStudent}
                                hide={() => setshowAddStudent(false)}
                                setFirstname={e => setaddStudentFirstname(e.target.value)}
                                setSurname={e => setaddStudentSurname(e.target.value)}
                                setaddStudentBday={e => setaddStudentBday(e.target.value)}
                                setClass={e => setaddStudentClass(e.target.value)}
                                addStudent={() => addStudent()}
                                parent={oneParent}
                                classes={classes}
                            />
                            <EditParent
                                show={showEditParent}
                                hide={() => setshowEditParent(false)}
                                pwdNotCorrect={editParentPwdCorrect}
                                isAdmin={JSON.parse(sessionStorage.getItem('userData')).user.Profil_Id > 2}
                                editPwd={() => editPwd()}
                                checkPwd={() => checkPwd()}
                                editInfo={() => editInfo()}
                                setFirstname={e => seteditParentFirstname(e.target.value)}
                                setSurname={e => seteditParentSurname(e.target.value)}
                                setEmail={e => seteditParentEmail(e.target.value)}
                                parent={oneParent}
                                setOldPwd={e => seteditParentOldPwd(e.target.value)}
                                setNewPwd={e => seteditParentNewPwd(e.target.value)}
                                setConfPwd={e => seteditParentConfPwd(e.target.value === editParentNewPwd)}
                            />
                            <AddParent
                                show={showAddParent}
                                hide={() => setshowAddParent(false)}
                                setFirstname={e => setaddParentFirstname(e.target.value)}
                                setSurname={e => setaddParentSurname(e.target.value)}
                                setEmail={e => setaddParentEmail(e.target.value)}
                                setPassword={e => setaddParentPassword(e.target.value)}
                                setConfPassword={e => setaddParentConfPassword(e.target.value)}
                                addParent={() => addParent()}
                            />
                        </Card>
                    </StickyBox>
                </Col>
            </Row>
        </div>
    )
}

function AddStudent(props) {
    const parent = props.parent;
    const classes = props.classes;

    return (
        <Modal
            show={props.show}
            onHide={props.hide}
            centered
            size='xl'
        >
            <Modal.Header>
                <Modal.Title>Ajouter un enfant</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group as={Row} controlId="formFirstname">
                        <Form.Label column sm="2">
                            Prénom
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control onChange={props.setFirstname} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formSurname">
                        <Form.Label column sm="2">
                            Nom
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control onChange={props.setSurname} defaultValue={parent.Surname} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formBday">
                        <Form.Label column sm="2">
                            Date de naissance
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control type="date" onChange={props.setaddStudentBday} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formClass">
                        <Form.Label column sm="2">
                            Classe
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control as="select" onChange={props.setClass}>
                                {
                                    classes.map(c =>
                                        <option key={Idx(classes, c)}>{c.Class}</option>
                                    )
                                }
                            </Form.Control>
                        </Col>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-warning" onClick={props.addStudent}>
                    Ajouter
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

function EditParent(props) {
    return (
        <Modal
            show={props.show}
            onHide={props.hide}
            centered
            size='xl'
        >
            <Modal.Header>
                <Modal.Title>Modifier</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                    <Row>
                        <Col sm={2}>
                            <Nav variant="pills" className="flex-column">
                                <Nav.Item>
                                    <Nav.Link eventKey="first">Informations Générale</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="second">Mot de passe</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col sm="10">
                            <Tab.Content>
                                <Tab.Pane eventKey="first">
                                    <Form>
                                        <Form.Group controlId="formFirstname">
                                            <Form.Label>
                                                Prénom
                                            </Form.Label>
                                            <Form.Control placeholder={props.parent.Firstname} onChange={props.setFirstname} />
                                        </Form.Group>

                                        <Form.Group controlId="formSurname">
                                            <Form.Label>
                                                Nom
                                            </Form.Label>
                                            <Form.Control placeholder={props.parent.Surname} onChange={props.setSurname} />
                                        </Form.Group>
                                        <Form.Group controlId="formEmail">
                                            <Form.Label>
                                                Email
                                            </Form.Label>
                                            <Form.Control placeholder={props.parent.EmailAddress} onChange={props.setEmail} />
                                        </Form.Group>
                                    </Form>
                                    <Col md={{ span: 3, offset: 10 }}>
                                        <Button style={{ width: '70%' }} variant="outline-warning" onClick={props.editInfo}>
                                            Modifier
                                        </Button>
                                    </Col>
                                </Tab.Pane>
                                <Tab.Pane eventKey="second">
                                    <Form>
                                        {
                                            !props.isAdmin
                                            &&
                                            <Form.Group controlId="formOldPassword">
                                                <Form.Label>
                                                    Ancien Mot de passe
                                                </Form.Label>
                                                <Form.Control type="password" placeholder="Password" onChange={props.setOldPwd} />
                                            </Form.Group>
                                        }
                                        <hr />
                                        <Form.Group controlId="formNewPassword">
                                            <Form.Label>
                                                Nouveau Mot de passe
                                            </Form.Label>
                                            <Form.Control disabled={props.pwdNotCorrect} type="password" placeholder="Password" onChange={props.setNewPwd} />
                                        </Form.Group>
                                        <Form.Group controlId="formConfNewPassword">
                                            <Form.Label>
                                                Vérification du mot de passe
                                            </Form.Label>
                                            <Form.Control disabled={props.pwdNotCorrect} type="password" placeholder="Password" onChange={props.setConfPwd} />
                                        </Form.Group>
                                    </Form>
                                    <Col md={{ span: 3, offset: 9 }}>
                                        {
                                            props.isAdmin
                                                ?
                                                <Button style={{ width: '100%' }} variant="outline-warning" onClick={props.editPwd}>
                                                    Modifier
                                                </Button>
                                                :
                                                (
                                                    props.pwdNotCorrect
                                                        ?
                                                        <Button style={{ width: '100%' }} variant="outline-info" onClick={props.checkPwd}>
                                                            Vérifier mot de passe
                                                        </Button>
                                                        :
                                                        <Button style={{ width: '100%' }} variant="outline-warning" onClick={props.editPwd}>
                                                            Modifier
                                                        </Button>
                                                )
                                        }
                                    </Col>
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
        </Modal>
    )
}

function AddParent(props) {
    return (
        <Modal
            show={props.show}
            onHide={props.hide}
            centered
            size="xl"
        >
            <Modal.Header>
                <Modal.Title>Ajouter un parent</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group as={Row} controlId="formFirstname">
                        <Form.Label column sm="2">
                            Prénom
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control onChange={props.setFirstname} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formSurname">
                        <Form.Label column sm="2">
                            Nom
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control onChange={props.setSurname} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formEmail">
                        <Form.Label column sm="2">
                            Email
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control type="email" onChange={props.setEmail} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formPassword">
                        <Form.Label column sm="2">
                            Mot de passe
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control type="password" onChange={props.setPassword} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formConfPassword">
                        <Form.Label column sm="2">
                            Confirmation de Mot de passe
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control type="password" onChange={props.setConfPassword} />
                        </Col>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-warning" onClick={props.addParent}>Ajouter</Button>
            </Modal.Footer>
        </Modal>
    )
}