import HomePage from './pages/HomePage';
import { UserModel } from './lib/types';
import LoggedView from './pages/LoggedView';
import { Toaster } from '@/components/ui/toaster';
import { useEffect, useState } from 'react';
import * as UserService from './services/userService';
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
      {!loggedInUser ? (
        <HomePage onLoginSucessful={setLoggedInUser}></HomePage>
      ) : (
        <LoggedView
          loggedUser={loggedInUser}
          setLoggedInUser={setLoggedInUser}
        />
      )}
      <Toaster />
    </>
  );
}

export default App;
