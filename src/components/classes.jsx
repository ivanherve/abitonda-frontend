import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faArrowUp, faExclamationTriangle, faList, faTh, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import StickyBox from "react-sticky-box";
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Alert, Button, ButtonGroup, Card, CardColumns, Col, Form, Image, ListGroup, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import FileBase64 from 'react-file-base64';
import { BrowserRouter, Redirect, Route } from 'react-router-dom';
import swal from 'sweetalert';
import { apiUrl, getRequest, Idx, loadingTime, postAuthRequest, variantElement } from '../links/links';
import { ModalAddClassTeacher } from './AddClassTeacher';
import { EditClass } from './EditClass';
import backgroundImg from '../img/Shrug-Emoji.jpg';
import { LoadingComponent } from './LoadingComponent';

library.add(
    faList,
    faTh,
    faExclamationTriangle,
    faTimes,
    faEdit,
    faArrowUp
)

export const delItem = (itemId) => {
    let data = new FormData();
    data.append('item_id', itemId);
    swal({
        text: "Etes-vous sûr de vouloir supprimer ce support ?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                fetch(`${apiUrl}delitem`, postAuthRequest(JSON.parse(sessionStorage.getItem('userData')).token.api_token, data))
                    .then(r => r.json())
                    .then(r => {
                        if (r.status) {
                            console.log(r)
                            swal('Supprimé', r.response, 'success')
                                .then(() => window.location.reload());
                        }
                        else swal('Erreur', r.response[0], 'danger')
                    })
            }
        });
}

const contains = (sentence, element) => {
    return Idx(sentence, element) !== -1
}

export const defaultImg = (type) => {
    if (contains(type, 'pdf')) return require('../img/pdflogo2.svg');
    else if (contains(type, "external-link")) return require('../img/videoLogo2.svg');
    else if (contains(type, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) return require('../img/docxLogo.png');
    //else if (contains(type, "image")) return require('../img/');
    return require('../img/fileLogo.jpg')
}

export function Classe() {

    const [classes, setclasses] = useState([]);
    const [status, setstatus] = useState(false);
    const [oneClass, setoneClass] = useState('');
    const [teachers, setteachers] = useState('');
    const [showModal, setshowModal] = useState(false);
    const [showAddFile, setshowAddFile] = useState(false);
    const [showAddLink, setshowAddLink] = useState(false);
    const [items, setitems] = useState([]);
    const [img, setimg] = useState('');
    const [isList, setisList] = useState(true);
    const [ItemId, setItemId] = useState(0);
    const [oneItem, setoneItem] = useState('');
    const [toEdit, settoEdit] = useState(false);
    const [showAddClassTeacher, setshowAddClassTeacher] = useState(false);
    const [showEditClass, setshowEditClass] = useState(false);
    const [loading, setloading] = useState(1);

    const user = JSON.parse(sessionStorage.getItem('userData')).user;

    useEffect(() => {
        moment().locale('fr')
        console.log(moment().format('LLLL'))
        if (classes.length < 1)
            //fetchClasses(classe);
            fetch(`${apiUrl}getclasses`, getRequest(JSON.parse(sessionStorage.getItem('userData')).token.api_token))
                .then(r => r.json())
                .then(r => {
                    if (r.status) {
                        if (r.response.length < 1) {
                            setoneClass({ Class: '' })
                        } else {
                            setclasses(r.response);
                            setoneClass(r.response[0]);
                            setstatus(true);
                            setteachers(r.response[0].Teacher);
                            getItem(r.response[0].Class);
                        }

                    }
                    else alert(r.response)
                })
    }, [classes]);

    let getItem = (classe) => {
        fetch(`${apiUrl}getitem/${classe}`, getRequest(JSON.parse(sessionStorage.getItem('userData')).token.api_token))
            .then(r => r.json())
            .then(r => {
                if (r.status) {
                    setitems(Object.values(r.response));
                    if (Object.values(r.response).length < 1) {
                        setimg('')
                    }
                    else {
                        setimg(Object.values(r.response)[0].File);
                        setoneItem(Object.values(r.response)[0]);
                    }
                } else {
                    setitems([
                        {
                            PdfItem_Id: 0,
                            Title: null,
                            File: null,
                            Class_Id: 0,
                            Details: null
                        }
                    ]);
                    setimg('')
                }
                console.log(Object.values(r.response));
                //console.log(moment("2020-09-17T13:32:22.000000Z").format('Do MMMM YYYY, HH:mm'));
            })
    }

    const delClass = () => {
        let data = new FormData();
        data.append('class_id', oneClass.Class_Id);
        swal('Etes-vous sûr de supprimer cette classe ?')
            .then(e => {
                if (e)
                    fetch(`${apiUrl}delclass`, postAuthRequest(JSON.parse(sessionStorage.getItem('userData')).token.api_token, data))
                        .then(r => r.json())
                        .then(r => {
                            swal('', r.response, 'success')
                                .then(() => window.location.reload())
                        })
            })
    }

    const rebuildClass = () => {
        let data = new FormData();
        data.append('class_id', oneClass.Class_Id);
        swal('Etes-vous sûr de réactiver cette classe ?')
            .then(e => {
                if (e)
                    fetch(`${apiUrl}rebuildclass`, postAuthRequest(JSON.parse(sessionStorage.getItem('userData')).token.api_token, data))
                        .then(r => r.json())
                        .then(r => {
                            swal('', r.response, 'success')
                                .then(() => window.location.reload())
                        })
            })
    }

    setTimeout(() => {
        setloading(0);
    }, loadingTime);
    if (loading) return <LoadingComponent />
    if (status) {
        return (
            <div style={{ height: '100%' }}>
                {
                    user.Profil_Id > 2
                        ?
                        <Button
                            variant="outline-success"
                            style={{ width: '100%', marginBottom: '10px' }}
                            onClick={() => setshowAddClassTeacher(true)}
                        >
                            Ajouter une classe
                        </Button>
                        :
                        null
                }
                <Row style={{ height: '100%' }}>
                    <Col xs='2'>
                        {
                            classes.length > 0
                                ?
                                <ListGroup>
                                    {
                                        // Classes List
                                        classes.map(c =>
                                            <ListGroup.Item
                                                //style={{ width: '200px' }}
                                                variant={variantElement(c, JSON.parse(sessionStorage.getItem('userData')).user)}
                                                action
                                                key={classes.indexOf(c)}
                                                onClick={() => {
                                                    setoneClass(c);
                                                    setteachers(c.Teacher);
                                                    getItem(c.Class);
                                                    console.log(c)
                                                }}
                                            >
                                                {c.Class}
                                            </ListGroup.Item>
                                        )
                                    }
                                </ListGroup>
                                :
                                <div>No class</div>
                        }
                    </Col>
                    <Col xs='10'>
                        <StickyBox offsetTop={80} offsetBottom={10}>
                            <Card
                                style={{ width: '100%', minHeight: '75vh' }}
                            >
                                <Card.Header>
                                    <Row>
                                        <Col xs={JSON.parse(sessionStorage.getItem('userData')).user.Profil_Id > 2 ? "10" : "11"}>
                                            <Card.Title>{oneClass.Class}</Card.Title>
                                            <Card.Text>
                                                <i>{teachers}</i>
                                            </Card.Text>
                                        </Col>
                                        {
                                            JSON.parse(sessionStorage.getItem('userData')).user.Profil_Id > 2
                                            &&
                                            <Col xs="1">
                                                {
                                                    oneClass.disabled
                                                        ?
                                                        <OverlayTrigger
                                                            placement="top"
                                                            delay={{ show: 250, hide: 400 }}
                                                            overlay={<Tooltip>Rétablir</Tooltip>}
                                                        >
                                                            <Button variant="light" onClick={() => rebuildClass()}>
                                                                <FontAwesomeIcon icon={["fas", "arrow-up"]} />
                                                            </Button>
                                                        </OverlayTrigger>
                                                        :
                                                        <OverlayTrigger
                                                            placement="top"
                                                            delay={{ show: 250, hide: 400 }}
                                                            overlay={<Tooltip>Supprimer</Tooltip>}
                                                        >
                                                            <Button variant="light" onClick={() => delClass()}>
                                                                <FontAwesomeIcon icon={["fas", "times"]} />
                                                            </Button>
                                                        </OverlayTrigger>
                                                }

                                                <br />
                                                <OverlayTrigger
                                                    placement="bottom"
                                                    delay={{ show: 250, hide: 400 }}
                                                    overlay={<Tooltip>Modifier</Tooltip>}
                                                >
                                                    <Button variant="light" onClick={() => setshowEditClass(true)}>
                                                        <FontAwesomeIcon icon={["far", "edit"]} />
                                                    </Button>
                                                </OverlayTrigger>
                                            </Col>
                                        }
                                        <Col xs="1">
                                            <Button variant="light" onClick={() => setisList(true)}>
                                                <FontAwesomeIcon icon={["fas", "list"]} />
                                            </Button>
                                            <br />
                                            <Button variant="light" onClick={() => setisList(false)}>
                                                <FontAwesomeIcon icon={["fas", "th"]} />
                                            </Button>
                                        </Col>
                                    </Row>
                                </Card.Header>
                                <ButtonGroup>
                                    <Button
                                        style={{ width: '50%' }}
                                        variant="outline-primary"
                                        onClick={() => setshowAddFile(true)}
                                        disabled={oneClass.disabled}
                                    >
                                        Ajouter un fichier
                                    </Button>
                                    <Button
                                        style={{ width: '50%' }}
                                        variant="outline-info"
                                        onClick={() => setshowAddLink(true)}
                                        disabled={oneClass.disabled}
                                    >
                                        Ajouter un lien
                                    </Button>
                                </ButtonGroup>
                                <div style={{ overflowY: 'auto' }}>
                                    {
                                        isList
                                            ?
                                            <ListGroup className="list-group-flush">
                                                {
                                                    items.length >= 1
                                                        ?
                                                        items.map(i =>
                                                            <ListItem
                                                                key={items.indexOf(i)}
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
                                                        :
                                                        <ListItem
                                                            title="Il n'y a pas de support ici"
                                                            disabled
                                                            hasElement={false}
                                                        />
                                                }

                                            </ListGroup>
                                            :
                                            <Card.Body style={{ overflowY: 'auto' }}>
                                                {
                                                    items.length >= 1
                                                        ?
                                                        <CardColumns style={{ marginTop: '10px', height: '100%' }}>
                                                            {
                                                                items.map(i =>
                                                                    <CardItem
                                                                        key={i.PdfItem_Id}
                                                                        title={i.Title}
                                                                        details={i.Details}
                                                                        imgSrc={i.File ? i.File : defaultImg(i.Type, Idx(i.Type, "image") !== -1 && i.Link)}
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
                                                        </CardColumns>
                                                        :
                                                        <ListGroup className="list-group-flush">
                                                            <ListItem
                                                                title="Il n'y a pas de support ici"
                                                                disabled
                                                                hasElement={false}
                                                            />
                                                        </ListGroup>
                                                }
                                            </Card.Body>
                                    }
                                </div>
                            </Card>
                        </StickyBox>
                    </Col>
                    <ModalFile
                        show={showModal}
                        hide={() => setshowModal(false)}
                        imgSrc={img}
                        del={() => delItem(ItemId)}
                        item={oneItem}
                        toEdit={toEdit}
                        setEdit={() => settoEdit(!toEdit)}
                        isParent={JSON.parse(sessionStorage.getItem('userData')).user.Parent_Id}
                        isAdmin={JSON.parse(sessionStorage.getItem('userData')).user.Profil_Id > 2}
                    />
                    <ModalAddFile
                        show={showAddFile}
                        hide={() => setshowAddFile(false)}
                        classe={oneClass.Class}
                    />
                    <ModalAddLink
                        show={showAddLink}
                        hide={() => setshowAddLink(false)}
                        classe={oneClass.Class}
                    />
                    <ModalAddClassTeacher
                        show={showAddClassTeacher}
                        hide={() => setshowAddClassTeacher(false)}
                    />
                    <EditClass
                        show={showEditClass}
                        hide={() => setshowEditClass(false)}
                        classe={oneClass}
                    />
                </Row>
            </div>
        )
    }
    else
        return (
            <div style={styles.image}>
                <div style={styles.emptyList}>
                    Vous n'enseignez aucune classe
                </div>
                <div style={{
                    fontStyle: 'italic', fontSize: '0.75rem', display: 'flex', flexDirection: 'column-reverse',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    Veuillez contacter votre administrateur
                </div>
            </div>
        )
}

export function CardItem({ title, details, click, imgSrc, date }) {
    const [hovered, sethovered] = useState(false);
    return (
        <Card
            onClick={click}
            style={hovered ? styles.zoom : { height: '310px' }}
            onMouseOver={() => sethovered(true)}
            onMouseOut={() => sethovered(false)}
        >
            <Card.Img variant="top" src={imgSrc} style={{ height: '160px', display: 'block' }} />
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Text>
                    {details}
                    <br />
                </Card.Text>
            </Card.Body>
            <Card.Footer>
                <small className="text-muted">{moment(date).format('Do MMMM YYYY, HH:mm')}</small>
            </Card.Footer>
        </Card>
    )
}

export function ListItem({ title, details, click, disabled = false, date, hasElement = true }) {
    return (
        <ListGroup.Item
            action
            onClick={click}
            disabled={disabled}
        >
            <Row>
                <Col xs='10'>
                    <div>{title}</div>
                    <p style={{ fontStyle: 'italic', fontSize: '0.75em' }}>
                        {details}
                    </p>
                </Col>
                <Col>
                    {
                        hasElement
                        &&
                        <p style={{ fontStyle: 'italic', fontSize: '0.75em' }}>
                            {moment(date).format('Do MMMM YYYY, HH:mm')}
                        </p>
                    }
                </Col>
            </Row>
        </ListGroup.Item>
    )
}

export function ModalFile(props) {
    const show = props.show;
    const hide = props.hide;
    const imgSrc = props.imgSrc;
    const del = props.del;
    const item = props.item || { Type: "" };
    const toEdit = props.toEdit;
    const setEdit = props.setEdit;
    const [title, settitle] = useState(null);
    const [details, setdetails] = useState(null);
    const [linkItem, setlinkItem] = useState('');
    const [link, setlink] = useState('');
    const [blob, setblob] = useState('');

    console.log(props);

    const downloadItem = (itemId) => {
        let userId = JSON.parse(sessionStorage.getItem('userData')).user.User_Id;
        fetch(`${apiUrl}download/${itemId}/${userId}`, getRequest(JSON.parse(sessionStorage.getItem('userData')).token.api_token))
            .then(r => window.open(r.url))
            .then(r => {
                if (!r.status)
                    swal('Erreur!', r.response, 'warning');
                else
                    window.open(r)
            })
            .catch(e => console.log(e))
    }

    const editItem = (itemId) => {
        let data = new FormData();
        data.append('itemId', itemId);
        data.append('title', title);
        data.append('details', details);
        data.append('linkitem', linkItem);
        data.append('link', link);
        data.append('blob', blob);
        fetch(`${apiUrl}edititem`, postAuthRequest(JSON.parse(sessionStorage.getItem('userData')).token.api_token, data))
            .then(r => r.json())
            .then(r => {
                if (r.status) {
                    console.log(itemId)
                    swal('Parfait!', r.response, 'success')
                        .then(() => window.location.reload())
                }
                else {
                    console.log(r)
                }

            })
        console.log(itemId)
    }

    return (
        <Modal
            show={show}
            onHide={hide}
            centered
            size={toEdit ? "xl" : "lg"}
        >
            <Modal.Body>
                {
                    toEdit
                        ?
                        <Form.Group>
                            <Form.Label>
                                Titre
                                    </Form.Label>
                            <Form.Control placeholder={item.Title.indexOf('.') !== -1 ? item.Title.substring(0, item.Title.indexOf('.')) : item.Title} onChange={e => settitle(e.target.value)} />
                        </Form.Group>
                        :
                        <Modal.Title>
                            {item.Title}
                        </Modal.Title>
                }
                {
                    toEdit
                        ?
                        <Form.Group>
                            <Form.Label>
                                Description
                                    </Form.Label>
                            <Form.Control as="textarea" placeholder={item.details} onChange={e => setdetails(e.target.value)} />
                        </Form.Group>
                        :
                        <p>
                            {item.details}
                        </p>
                }
                {
                    toEdit
                    && (
                        item.Link
                            ?
                            item.Link.indexOf('http') !== -1
                                ?
                                <Form.Group>
                                    <Form.Label>
                                        Lien
                                            </Form.Label>
                                    <Form.Control type="url" placeholder={item.Link} onChange={e => setlink(e.target.value)} />
                                </Form.Group>
                                :
                                <Form.Group>
                                    <Form.Label>
                                        Source
                                    </Form.Label>
                                    <Form.Control type="file" onChange={(e) => setlinkItem(e.target.files[0])} />
                                </Form.Group>
                            :
                            <Form.Group>
                                <Form.Label>
                                    Source
                                    </Form.Label>
                                <Form.Control type="file" onChange={() => console.log('ici')} />
                            </Form.Group>)
                }
                {
                    !toEdit
                        &&
                        item
                        &&
                        item.Link
                        &&
                        item.Link.indexOf("http") === -1
                        ?
                        <Button
                            variant="outline-secondary"
                            onClick={() => downloadItem(item.Item_Id)}
                        >
                            Télécharger le document
                                </Button>
                        :
                        !toEdit
                        &&
                        <a target="blank" href={item.Link}>Accéder au lien</a>
                }
            </Modal.Body>
            {
                props.isAdmin
                &&
                <Modal.Footer>
                    {
                        toEdit
                            ?
                            <Button
                                variant="outline-info"
                                onClick={() => editItem(item.Item_Id, item.linkitem)}
                            >
                                Enregistrer
                        </Button>
                            :
                            <Button
                                variant="outline-info"
                                onClick={setEdit}
                            >
                                Modifier
                        </Button>
                    }
                    {
                        toEdit
                            ?
                            <Button
                                variant="outline-danger"
                                onClick={setEdit}
                            >
                                Annuler
                            </Button>
                            :
                            <Button
                                variant="outline-danger"
                                onClick={del}
                            >
                                Supprimer
                            </Button>
                    }
                </Modal.Footer>
            }
        </Modal>
    )
}

function ModalAddLink(props) {
    const [title, settitle] = useState('');
    const [details, setdetails] = useState('');
    const [link, setlink] = useState('')

    const sendLink = () => {
        let data = new FormData();
        data.append('title', title);
        data.append('classe', props.classe);
        data.append('details', details);
        data.append('linkitem', link);
        /**/
        fetch(`${apiUrl}addlink`, postAuthRequest(JSON.parse(sessionStorage.getItem('userData')).token.api_token, data))
            .then(r => r.json())
            .then(r => {
                if (r.status) {
                    swal("Parfait!", r.response, 'success')
                        .then(() => {
                            window.location.reload();
                        });
                }
                else
                    swal("Erreur", r.response, 'warning')
                //console.log([r.response, item.file])
            })

        //console.log(title, props.classe, details, link)
    }

    return (
        <Modal show={props.show} onHide={props.hide} centered size="xl">
            <Modal.Header>
                <Modal.Title>Ajouter un lien</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group as={Row}>
                        <Form.Label column sm="1">Titre</Form.Label>
                        <Col sm="11">
                            <Form.Control placeholder="leçon TPS" onChange={e => settitle(e.target.value)} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm="1">Lien</Form.Label>
                        <Col sm="11">
                            <Form.Control type="url" placeholder="https://drive.google.com/..." onChange={e => setlink(e.target.value)} />
                        </Col>
                    </Form.Group>
                    {/**/}
                    <Form.Group as={Row}>
                        <Form.Label column sm="1">Classe</Form.Label>
                        <Col sm="11">
                            <Form.Control placeholder={props.classe} readOnly />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Form.Label column sm="1">Description</Form.Label>
                        <Col sm="11">
                            <Form.Control as="textarea" rows='3' onChange={e => setdetails(e.target.value)} />
                        </Col>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='outline-warning' onClick={() => sendLink()}>Ajouter</Button>
            </Modal.Footer>
        </Modal>
    )
}

function ModalAddFile({ show, hide, classe }) {
    const [title, settitle] = useState('');
    const [item, setitem] = useState([]);
    const [details, setdetails] = useState('');
    const [isVideo, setisVideo] = useState(false);

    const sendFile = () => {
        /**/
        let data = new FormData();
        data.append('title', title);
        //data.append('blobitem', item.base64);
        data.append('linkitem', item.file);
        data.append('class', classe);
        data.append('details', details);
        data.append('itemtype', item.type);
        /**/
        fetch(`${apiUrl}additem`, postAuthRequest(JSON.parse(sessionStorage.getItem('userData')).token.api_token, data))
            .then(r => r.json())
            .then(r => {
                if (r.status) {
                    swal("Parfait!", r.response, 'success')
                        .then(() => {
                            window.location.reload();
                        });
                }
                else
                    swal("Erreur", r.response, 'warning')
                console.log([r.response, item.file])
            })
    }

    return (
        <Modal show={show} onHide={hide} centered size="xl">
            <Modal.Header>
                <Modal.Title>Ajouter un fichier</Modal.Title>
            </Modal.Header>
            {
                isVideo
                    ?
                    <Alert variant="danger">
                        <FontAwesomeIcon icon={["fas", "exclamation-triangle"]} /> Les vidéos sont trop lourde!
                        <br />
                        Veuillez ajouter votre vidéo dans un drive et y ajouter le lien en cliquant sur "Ajouter un lien"
                    </Alert>
                    :
                    null
            }
            <Modal.Body>
                <Form>
                    <Form.Group as={Row}>
                        <Form.Label column sm="1">Titre</Form.Label>
                        <Col sm="11">
                            <Form.Control placeholder="exercice TPS" onChange={e => settitle(e.target.value)} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm="1">Fichier</Form.Label>
                        <Col sm="11">
                            <FileBase64
                                className='form-control-file'
                                onDone={(pic) => {
                                    pic.type.indexOf('video') !== -1 || pic.name.indexOf('.mp4') !== -1
                                        ? setisVideo(true)
                                        : setisVideo(false);
                                    setitem(pic);
                                    console.log(pic.base64.length, pic.type)
                                }}
                            />
                            {/*<Form.File onChange={e => console.log(e.target.files)} />*/}
                        </Col>
                    </Form.Group>
                    {/**/}
                    <Form.Group as={Row}>
                        <Form.Label column sm="1">Classe</Form.Label>
                        <Col sm="11">
                            <Form.Control placeholder={classe} readOnly />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Form.Label column sm="1">Description</Form.Label>
                        <Col sm="11">
                            <Form.Control as="textarea" rows='3' onChange={e => setdetails(e.target.value)} />
                        </Col>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='outline-warning' onClick={() => sendFile()}>Ajouter</Button>
            </Modal.Footer>
        </Modal>
    )
}

const styles = {
    image: {
        backgroundImage: 'url(' + backgroundImg + ')',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    },
    emptyList: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#00f',
        backgroundColor: 'rgba(255, 255, 255,0.8)'
    },
    zoom: {
        transform: 'scale(1.1)',
        transition: 'transform .2s', /* Animation */
        cursor: 'pointer',
        height: '310px'
    }
}