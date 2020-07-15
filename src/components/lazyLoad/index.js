import React, { Component } from 'react';
import Lazyload from 'r-img-lazyload';

const pic = require('../../assets/img/loading.gif');

export default class extends Component {
    render() {
        const config = {
            options: {
                error: pic,
                loading: pic
            },
            ...this.props
        };
        return <Lazyload {...config} />;
    }
}
