import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const FeClotherButton = () => {
    let history = useHistory();

    const callFunctioForCategory = (e) => {
        e.preventDefault();
        history.push(process.env.PUBLIC_URL+'/getCate/'+'77')
    }

    return(
        <button className="button-sandal" onClick={callFunctioForCategory}>
            Quần Áo Nữ
        </button>
    )
}

export default FeClotherButton;