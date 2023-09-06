import { Routes, Route, Navigate } from 'react-router-dom';
import RouteGuard from 'guards/RouteGuard';
import PaymentOptions from 'components/PaymentOptions';
import img from 'assets/not-found.png';

function App() {
  // TODO: refresh auth on reload

  return (
    <>
      <Routes>
        <Route
          path={'/'}
          element={
            <RouteGuard>
              <PaymentOptions />
            </RouteGuard>
          }
        />

        <Route
          path='notfound'
          element={
            <div className='flex h-full w-full justify-center items-center'>
              <img src={img} alt='' className='w-[15rem] sm:w-[20rem] lg:w-[25rem]' />
            </div>
          }
        />
        <Route path='*' element={<Navigate to='/notfound' replace />} />
      </Routes>
    </>
  );
}

export default App;
