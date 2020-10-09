const domain = 'localhost:8000/';
export const apiUrl = `http://${domain}`;
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