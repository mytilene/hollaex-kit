import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-snapshot';
import { Router, browserHistory } from 'react-router';
import './config/initialize';

import store from './store';
import routes from './routes';
import './index.css';

// import registerServiceWorker from './registerServiceWorker'

render(
	<Provider store={store}>
		<Router routes={routes} history={browserHistory} />
	</Provider>, document.getElementById('root')
);

// registerServiceWorker();
