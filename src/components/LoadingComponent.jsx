import React from 'react';

export function LoadingComponent() {
    return (
        <div style={styles}>
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