import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import 'styles/style.scss';
import 'react-lazy-load-image-component/src/effects/blur.css';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserProvider } from 'context.tsx';

import { Toaster, resolveValue } from 'react-hot-toast';

// react query client

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <UserProvider>
      <Router>
        <App />

        <Toaster
          position='top-right'
          toastOptions={{
            className: '',
            duration: 5000,
          }}
        >
          {(t) => (
            <div
              className={`flex ${t.type === 'error' ? `items-center` : `items-start`} ${
                t.visible ? `visible` : `hidden`
              }  bg-white  border border-b-2 md:border-b-4 border-b-primary-1 shadow-md dark:bg-grey-4 dark:shadow-none rounded-[4px] gap-4 min-w-[14rem] max-w-[22rem]`}
              style={{
                animation: t.visible ? 'custom-enter 1s ease' : 'custom-exit 1s ease',
              }}
            >
              <p
                className={`text-[15px]  capitalize    font-normal  py-5 px-5   leading-normal text-black-3 dark:text-white ${
                  t.type === 'error' ? `inline` : ``
                }`}
              >
                {resolveValue(t.message, t)}
              </p>
            </div>
          )}
        </Toaster>
      </Router>
    </UserProvider>
  </React.StrictMode>,
);
