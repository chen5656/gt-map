import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { getAuthConfig } from "./config";
import { Auth0Provider } from "@auth0/auth0-react";
const onRedirectCallback = (appState) => {

};
const config = getAuthConfig();

const providerConfig = {
  domain: config.domain,
  clientId: config.clientId,
  ...(config.audience ? { audience: config.audience } : null),
  redirectUri: window.location.origin,
  onRedirectCallback,
};

ReactDOM.render(
  <Auth0Provider {...providerConfig}>
    <App />
  </Auth0Provider>,
  document.getElementById('root')
);

