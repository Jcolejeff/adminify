import { Routes, Route, Navigate } from 'react-router-dom';
import RouteGuard from 'guards/RouteGuard';
import img from 'assets/not-found.png';
import LoginPage from 'pages/auth/login';
import ProfilePage from 'pages/dashboard/profile';

function App() {
  // TODO: refresh auth on reload

  return (
    <>
      <Routes>
        <Route path={'/'} element={<LoginPage />} />
        <Route
          path={'/profile'}
          element={
            <RouteGuard>
              <ProfilePage />
            </RouteGuard>
          }
        />

        <Route
          path='not-found'
          element={
            <div className='flex h-full w-full justify-center items-center'>
              <img src={img} alt='' className='w-[15rem] sm:w-[20rem] lg:w-[25rem]' />
            </div>
          }
        />
        <Route path='*' element={<Navigate to='/not-found' replace />} />
      </Routes>
    </>
  );
}

export default App;
