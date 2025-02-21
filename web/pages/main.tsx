import './globals.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import Modal from 'react-modal';

import { App } from './app.jsx';

ReactDOM.createRoot(document.querySelector('#root') as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

Modal.setAppElement('#root');
