import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const SandalButton = () => {
    let history = useHistory();

    const callFunctioForCategory = (e) => {
        e.preventDefault();
        history.push(process.env.PUBLIC_URL+'/getCate/'+'161')
    }

    return(
        <button className="button-sandal" onClick={callFunctioForCategory}>
            Giày Dép Nam
        </button>
    )
}

export default SandalButton;