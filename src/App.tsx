import HomePage from './pages/HomePage';
import { UserModel } from './lib/types';
import LoggedView from './pages/LoggedView';
import { Toaster } from '@/components/ui/toaster';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import * as UserService from './services/userService';
import PageNotFound from './pages/PageNotFound';
function App() {
  const [loggedInUser, setLoggedInUser] = useState<UserModel | null>(null);

  useEffect(() => {
    async function fetchLoggedInUser() {
      try {
        const user = await UserService.getLoggedInUser();
        setLoggedInUser(user);
      } catch (error) {
        console.error(error);
      }
    }
    fetchLoggedInUser();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/home"
            element={
              !loggedInUser ? (
                <HomePage onLoginSucessful={setLoggedInUser}></HomePage>
              ) : (
                <LoggedView
                  loggedUser={loggedInUser}
                  setLoggedInUser={setLoggedInUser}
                />
              )
            }
          />
          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
      {/* {!loggedInUser ? ( */}
      {/*   <HomePage onLoginSucessful={setLoggedInUser}></HomePage> */}
      {/* ) : ( */}
      {/*   <LoggedView */}
      {/*     loggedUser={loggedInUser} */}
      {/*     setLoggedInUser={setLoggedInUser} */}
      {/*   /> */}
      {/* )} */}
      <Toaster />
    </>
  );
}

export default App;
