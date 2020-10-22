import React from 'react';

export function LoadingComponent(props) {
    return (
        <div style={styles}>
            <img src={props.img} style={{ height: props.height }} />
            Chargement...
        </div>
    )
}

const styles = {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    fontSize: '2rem',
    color: 'green',
    textAlign: 'center',
    marginTop: '250px'
}