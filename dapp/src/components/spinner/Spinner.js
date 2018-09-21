import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {BounceLoader} from 'react-spinners';
import './Spinner.css';

class Spinner extends Component {
    render() {
        return this.props.loading ?
            <div className="loading">
                <BounceLoader color={'rgba(31, 31, 31, 1)'}  />
            </div> : null;
    }
}

Spinner.propTypes = {
    loading: PropTypes.bool
};

Spinner.defaultProps = {
    loading: true
};

export default Spinner;
