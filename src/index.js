import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import {store} from "./redux/store"
import { Provider } from 'react-redux';
import { createGlobalStyle } from "styled-components";
const GlobalStyle = createGlobalStyle`
html, body{
  /* font-size: 62.5%; */
};
`;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <GlobalStyle />
    <App />{" "}
  </Provider>
);