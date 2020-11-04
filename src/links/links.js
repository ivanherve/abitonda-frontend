import backgroundImg from '../img/Shrug-Emoji.jpg';
import React from 'react';

//const domain = 'localhost:8082/';
//const domain = '146.59.196.124:8082/';
//const domain = '146.59.196.124:4433/';
const domain = 'homework.abitonda.rw:4433/';
//const domain = 'localhost:8000/';

export let apiUrlLocal = `http://${domain}`;

export let apiUrl = `https://${domain}`;

/*
export const checkUrl = (url) => {
    var request = new XMLHttpRequest();
    request.open('GET', apiUrl, true);
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status !== 200) domain = 'localhost:8000/'
            console.log(request.status, apiUrl)
        }
    };
    request.send();
}
*/

export const postRequest = {
    method: 'post',
};

export const postAuthRequest = (token, data) => {
    return (
        {
            method: 'post',
            headers: {
                'Authorization': token
            },
            body: data
        }
    )
}

export const getRequest = token => {
    return (
        {
            method: 'get',
            headers: {
                'Authorization': token,
            }
        }
    )
}

export const Idx = (Tab, element) => {
    return Tab.indexOf(element);
}

export const KigaliTimeZone = '+02:00';

export const variantElement = (e, u) => {
    if (u.Profil_Id > 2) {
        if (e.disabled) return 'danger';
        else return 'success';
    } else {
        return 'light'
    }

}

export const loadingTime = 2000;

//export const isAdmin = JSON.parse(sessionStorage.getItem('userData')).user.Profil_Id === 3;

export const styles = {
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

export const EmptyList = props => {
    return (
        <div style={styles.image}>
            <div style={styles.emptyList}>
                {props.msg}
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