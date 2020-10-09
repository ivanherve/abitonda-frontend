import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, ListGroup, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { apiUrl, getRequest, Idx, loadingTime, postAuthRequest } from '../links/links';
import StickyBox from "react-sticky-box";
import { LoadingComponent } from './LoadingComponent';
import { ListItem, ModalFile, delItem } from './classes';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import swal from 'sweetalert';

library.add(
    faTimes,
    faEdit
)

export function Students() {
    const [students, setstudents] = useState([]);
    const [oneStudent, setoneStudent] = useState({});
    const [items, setitems] = useState([]);
    const [loading, setloading] = useState(1);
    const [parents, setparents] = useState([]);
    const [classes, setclasses] = useState([]);

    const [img, setimg] = useState('');
    const [ItemId, setItemId] = useState('');
    const [oneItem, setoneItem] = useState('');
    const [showModal, setshowModal] = useState(false);
    const [toEdit, settoEdit] = useState(false);

    const [showEditStudent, setshowEditStudent] = useState(false);
    const [editStudentFirstname, seteditStudentFirstname] = useState('');
    const [editStudentSurname, seteditStudentSurname] = useState('');
    const [editStudentBirthDate, seteditStudentBirthDate] = useState('');
    const [editStudentParent, seteditStudentParent] = useState('');
    const [editStudentClass, setEditStudentClass] = useState('');

    const getStudents = () => {
        fetch(`${apiUrl}getstudents`, getRequest(JSON.parse(sessionStorage.getItem('userData')).token.api_token))
            .then(r => r.json())
            .then(r => {
                if (r.status) {
                    setstudents(r.response);
                    setoneStudent(r.response[0]);
                    console.log(r.response);
                    getItems(r.response[0].class)
                }
                else
                    swal('Erreur!', r.response, 'warning')
            })
    }

    const getClasses = () => {
        fetch(`${apiUrl}getclasses`, getRequest(JSON.parse(sessionStorage.getItem('userData')).token.api_token))
            .then(r => r.json())
            .then(r => {
                if (r.status) setclasses(r.response)
                else swal('Erreur!', r.response, 'warning');
            })
    }

    const getItems = (classe) => {
        fetch(`${apiUrl}getitem/${classe}`, getRequest(JSON.parse(sessionStorage.getItem('userData')).token.api_token))
            .then(r => r.json())
            .then(r => {
                if (r.status) setitems(Object.values(r.response));
                console.log(Object.values(r.response))
            })
    }

    const editStudent = () => {
        let data = new FormData();
        data.append('student_Id', oneStudent.Student_Id);
        data.append('firstname', editStudentFirstname);
        data.append('surname', editStudentSurname);
        data.append('birthdate', editStudentBirthDate);
        data.append('class_Id', editStudentClass);
        data.append('parent_Id', editStudentParent);
        let token = JSON.parse(sessionStorage.getItem('userData')).token.api_token;
        let header = postAuthRequest(token, data);
        fetch(`${apiUrl}editstudent`, header)
            .then(r => r.json())
            .then(r => {
                if (r.status) swal('Parfait!', r.response, 'success').then(() => window.location.reload())
                else swal('Erreur!', r.response, 'warning')
            })
    }

    const findParent = e => {
        if (parents.length < 1) console.log(0);
        else {
            parents.map(p => {
                let name = p.Firstname + ' ' + p.Surname;
                if (name === e.target.value) seteditStudentParent(p.Parent_Id)
            })
        }
    }

    const findClass = e => {
        if (classes.length < 1) console.log(0);
        else {
            classes.map(c => {
                if (c.Class === e.target.value) setEditStudentClass(c.Class_Id)
            })
        }
    }

    useEffect(() => {
        if (students.length < 1) getStudents();
        if (parents.length < 1) getParents();
        if (classes.length < 1) getClasses();
    }, [students, parents, classes])

    const user = JSON.parse(sessionStorage.getItem('userData')).user;

    const getParents = () => {
        fetch(`${apiUrl}getparents`, getRequest(JSON.parse(sessionStorage.getItem('userData')).token.api_token))
            .then(r => r.json())
            .then(r => {
                if (r.status) setparents(r.response);
                else console.log(r.response)
            })
    }

    setTimeout(() => {
        setloading(0);
    }, loadingTime);

    if (loading) return <LoadingComponent />
    return (
        <div>
            {
                user.Profil_Id > 2
                &&
                <Button
                    variant="outline-success"
                    style={{ width: '100%', marginBottom: '10px' }}
                    onClick={() => swal('Allez sur l\'onglet "Parents" \n Créez un parent \n Et ajoutez-y un élève')}
                >
                    Ajouter un élève
                </Button>
            }
            <Row>
                <Col xs='2'>
                    <ListGroup style={{ marginBottom: '10px' }}>
                        {
                            students.map(s =>
                                <ListGroup.Item
                                    key={Idx(students, s)}
                                    action
                                    onClick={() => { setoneStudent(s); getItems(s.class); console.log(s) }}
                                    variant={JSON.parse(sessionStorage.getItem('userData')).user.Profil_Id > 2 && (s.disabled ? 'danger' : 'success')}
                                >
                                    {s.Student}
                                </ListGroup.Item>
                            )
                        }
                    </ListGroup>
                </Col>
                <Col xs='10'>
                    <StickyBox offsetTop={80} offsetBottom={10}>
                        <Card style={{ width: '100%', height: '75vh' }}>
                            <Card.Header>
                                <Row>
                                    <Col xs='11'>
                                        <Card.Title>{oneStudent.Student}</Card.Title>
                                        <Card.Text>
                                            {oneStudent.class}
                                        </Card.Text>
                                        <Card.Text>
                                            {moment(oneStudent.BirthDate).format('LL')}
                                        </Card.Text>
                                    </Col>
                                    <Col xs='1'>
                                        <Row>
                                            {
                                                JSON.parse(sessionStorage.getItem('userData')).user.Profil_Id > 2
                                                &&
                                                <OverlayTrigger
                                                    placement="auto"
                                                    delay={{ show: 250, hide: 400 }}
                                                    overlay={<Tooltip>Modifier</Tooltip>}
                                                >
                                                    <Button style={{ width: '90%' }} variant="outline-info" onClick={() => setshowEditStudent(true)}>
                                                        <FontAwesomeIcon icon={["fas", "edit"]} />
                                                    </Button>
                                                </OverlayTrigger>
                                            }
                                        </Row>
                                        <Row>
                                            {
                                                JSON.parse(sessionStorage.getItem('userData')).user.Profil_Id > 2
                                                &&
                                                <OverlayTrigger
                                                    placement="auto"
                                                    delay={{ show: 250, hide: 400 }}
                                                    overlay={<Tooltip>Bannir</Tooltip>}
                                                >
                                                    <Button style={{ width: '90%', marginTop: '10px' }} variant="outline-danger">
                                                        <FontAwesomeIcon icon={["fas", "times"]} />
                                                    </Button>
                                                </OverlayTrigger>
                                            }
                                        </Row>
                                    </Col>
                                </Row>
                            </Card.Header>
                            <ListGroup className="list-group-flush" style={{ overflowY: 'auto' }}>
                                {
                                    items.length < 1
                                        ?
                                        <ListGroup.Item disabled>
                                            Il n'y a pas de support existant pour le moment dans sa classe
                                        </ListGroup.Item>
                                        :
                                        items.map(i =>
                                            <ListItem
                                                key={Idx(items, i)}
                                                title={i.Title}
                                                details={i.details}
                                                click={() => {
                                                    setshowModal(true);
                                                    setimg(i.File);
                                                    setItemId(i.Item_Id);
                                                    setoneItem(i);
                                                }}
                                                date={i.updated_at}
                                            />
                                        )
                                }

                            </ListGroup>
                        </Card>
                    </StickyBox>
                </Col>
                <ModalFile
                    show={showModal}
                    hide={() => setshowModal(false)}
                    imgSrc={img}
                    del={() => delItem(oneItem.Item_Id)}
                    item={oneItem}
                    toEdit={toEdit}
                    setEdit={() => settoEdit(!toEdit)}
                    isParent={JSON.parse(sessionStorage.getItem('userData')).user.Parent_Id}
                    isAdmin={JSON.parse(sessionStorage.getItem('userData')).user.Profil_Id > 2}
                />
                <EditStudent
                    show={showEditStudent}
                    hide={() => setshowEditStudent(false)}
                    student={oneStudent}
                    parents={parents}
                    classes={classes}
                    editStudent={() => editStudent()}
                    setFirstname={e => seteditStudentFirstname(e.target.value)}
                    setSurname={e => seteditStudentSurname(e.target.value)}
                    setBirthDate={e => seteditStudentBirthDate(e.target.value)}
                    setParent={e => findParent(e)}
                    setClass={e => findClass(e)}
                />
            </Row>
        </div>
    )
}

function AddStudent(props) {
    return (
        <Modal show={props.show} onHide={props.hide}>
            <Modal.Header>
                <Modal.Title>Ajouter un élève</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group as={Row} controlId="formPlaintextFirstname">
                        <Form.Label column sm="2">
                            Prénom
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formPlaintextSurname">
                        <Form.Label column sm="2">
                            Nom
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formPlaintextFirstname">
                        <Form.Label column sm="2">
                            Classe
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control />
                        </Col>
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

function EditStudent(props) {
    let student = props.student;
    let name = props.student.Student.split(' ');
    return (
        <Modal show={props.show} onHide={props.hide} centered size='xl'>
            <Modal.Header>
                <Modal.Title>Modifier les informations de {name[0]} {name[1]}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group as={Row} controlId="formFirstname">
                        <Form.Label column sm="2">
                            Prénom
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control placeholder={name[0]} onChange={props.setFirstname} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formSurname">
                        <Form.Label column sm="2">
                            Nom
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control placeholder={name[1]} onChange={props.setSurname} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formBirthDate">
                        <Form.Label column sm="2">
                            Date de naissance
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control type='date' placeholder={student.BirthDate} onChange={props.setBirthDate} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formParent">
                        <Form.Label column sm="2">
                            Parent
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control as="select" defaultValue={student.Parent} onChange={props.setParent}>
                                {
                                    props.parents.map(p =>
                                        <option key={Idx(props.parents, p)}>
                                            {p.Firstname} {p.Surname}
                                        </option>
                                    )
                                }
                            </Form.Control>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formClass">
                        <Form.Label column sm="2">
                            Classe
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control as="select" defaultValue={student.class} onChange={props.setClass}>
                                {
                                    props.classes.map(c =>
                                        <option key={Idx(props.classes, c)}>
                                            {c.Class}
                                        </option>
                                    )
                                }
                            </Form.Control>
                        </Col>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-warning" onClick={props.editStudent}>
                    Modifier
                </Button>
            </Modal.Footer>
        </Modal>
    )
}