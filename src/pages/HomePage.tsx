import { Button } from '@/components/ui/button';
import { UserModel } from '@/lib/types';
import SignUpModal from '@/components/forms/SignUpModal';
import { useState } from 'react';
import { LoginModal } from '@/components/forms/LoginModal';
interface HomePageProps {
  onLoginSucessful: (user: UserModel) => void;
}

const HomePage = ({ onLoginSucessful }: HomePageProps) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  return (
    <>
      <div className="h-screen w-full flex flex-col justify-center  items-center space-y-4">
        <img
          src="https://i.gifer.com/Dtf.gif"
          alt="this slowpoke moves"
          width="200"
        />
        <Button className="w-20" onClick={() => setIsLoginOpen(true)}>
          {' '}
          Login In
        </Button>
        <Button className="w-20" onClick={() => setIsSignUpOpen(true)}>
          Sign In
        </Button>
      </div>
      <SignUpModal isOpen={isSignUpOpen} onOpenChange={setIsSignUpOpen} />
      <LoginModal
        isOpen={isLoginOpen}
        onOpenChange={setIsLoginOpen}
        onLoginSucessful={onLoginSucessful}
      />
    </>
  );
};

export default HomePage;
