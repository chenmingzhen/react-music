import React from 'react';
import ReactDOM from 'react-dom';
import '../src/assets/sass/index.scss';
import App from './App.js';
import * as serviceWorker from './serviceWorker';
import 'antd/dist/antd.css';
import {
    BrowserRouter
} from "react-router-dom";
import {Provider} from 'react-redux';
import store from "./store";

//resize fontsize
// default fontsize 16
(function () {
    function a() {
        let b = document.documentElement.clientWidth;
        b = b > 1920 ? 1920 : b;
        const c = b / 1920 * 16;
        document.getElementsByTagName('html')[0].style.fontSize = c + 'px';
    }

    a();
    window.onresize = a;
})();

ReactDOM.render(
    <React.Fragment>
        <BrowserRouter>
            <Provider store={store}>
                <App/>
            </Provider>
        </BrowserRouter>
    </React.Fragment>,
    document.getElementById('root')
);

serviceWorker.unregister();
