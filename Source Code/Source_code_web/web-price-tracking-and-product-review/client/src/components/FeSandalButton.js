import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const FeSandalButton = () => {
    let history = useHistory();

    const callFunctioForCategory = (e) => {
        e.preventDefault();
        history.push(process.env.PUBLIC_URL+'/getCate/'+'2429')
    }

    return(
        <button className="button-sandal" onClick={callFunctioForCategory}>
            Giày Dép Nữ
        </button>
    )
}

export default FeSandalButton;