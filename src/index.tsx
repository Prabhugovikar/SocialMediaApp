import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {Provider} from 'react-redux'
import reportWebVitals from './reportWebVitals';
import store from './redux/store';

//Fonts
import './Fonts/Karla/static/Karla-Bold.ttf';
import './Fonts/Karla/static/Karla-SemiBold.ttf';
import './Fonts/Karla/static/Karla-Medium.ttf';
import './Fonts/Karla/static/Karla-Regular.ttf';

//Kumbhans fonts
import './Fonts/Kumbh_Sans/static/KumbhSans-Bold.ttf';
import './Fonts/Kumbh_Sans/static/KumbhSans-SemiBold.ttf';
import './Fonts/Kumbh_Sans/static/KumbhSans-Medium.ttf';
import './Fonts/Kumbh_Sans/static/KumbhSans-Regular.ttf';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <Provider store={store} children={undefined}>
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
