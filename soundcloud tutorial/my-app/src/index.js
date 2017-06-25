import SC from 'soundcloud';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import App from './App';
import Callback from './components/Callback';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import configureStore from './stores/configureStore';
import * as actions from './actions';
import Stream from './components/Stream';
import { CLIENT_ID, REDIRECT_URI } from './constants/auth';

SC.initialize({ client_id: CLIENT_ID, redirect_uri: REDIRECT_URI });

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

/*
const tracks = [
    {
        title: 'Some track'
    },
    {
        title: 'Some other tracks'
    }
];
*/

var tracks = getTracks();

function getTracks() {
    var tracks = fetch('https://emazz.mainvan.us/v4/actiontypes');
    console.log(tracks);
    return tracks;
}

const store = configureStore();
store.dispatch(actions.setTracks(tracks));

const history = syncHistoryWithStore(createHistory(), store);

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App}>
                <Route path="/" component={Stream} />
                <Route path="/callback" component={Callback} />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('app')
);

module.hot.accept();
