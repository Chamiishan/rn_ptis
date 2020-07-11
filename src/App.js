import React from 'react';
// import LoginPage from './Component/LoginPage';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import combineReducers from './Reducers';
import ReduxThunk from 'redux-thunk';
import AppRouter from './AppRouter';

class App extends React.Component {

    
    render() {
        const store = createStore(combineReducers, {}, applyMiddleware(ReduxThunk));

        return (            
                <Provider store={store}>
                    <AppRouter />
                </Provider>
        );
    }
}

export default App;