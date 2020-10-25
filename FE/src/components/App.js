import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from '../store';
import './App.css';
import Leaflet from './LeafletMap';

const App = () => {
    return (
        <Provider store={store}>
            <div className='container'>
                <Leaflet/>
            </div>
        </Provider>
    )}
export default App;
