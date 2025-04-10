import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import reportWebVitals from './reportWebVitals.jsx';
import i18n from './translation/i18n.jsx';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router } from 'react-router-dom';
import '../public/stylesheets/style.css';
import '../public/stylesheets/font.css';
import './index.css';

//bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import '../public/fonts/UTM Avo.ttf';
import '../public/fonts/UTM AvoBold.ttf';

//redux
import { Provider } from 'react-redux';

import { store, persistor } from './redux/ReduxStore.jsx';
import { PersistGate } from 'redux-persist/integration/react';
import LoadingModal from './component/LoadingModal.jsx';
import ToastContainerComponent from './component/ToastContainerComponent.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
		    <PersistGate loading={null} persistor={persistor}>
          <Router>
            <App />
            <ToastContainerComponent />
          </Router>
          <LoadingModal />
        </PersistGate>
	    </Provider>
    </I18nextProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
