import React from 'react';
import Proptypes from 'prop-types';

const Error = ({message,closeBtn,closeFn}) => (
    <div className="error-container">
        <div className="error">
            <h2>{message}</h2>
            {closeBtn && <img className="closeBtn" src="../assets/icon-x.svg" onClick={closeFn}/>}
        </div>
    </div>
);

Error.propTypes = {
    message: Proptypes.string,
    closeBtn: Proptypes.bool,
    closeFn: Proptypes.func
};

Error.defaultProps = {
    message: "Something went wrong! Try refreshing the page.",
    closeBtn: true,
    closeFn: () => {}
};

export default Error;