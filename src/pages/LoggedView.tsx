import NavigationBar from '@/components/NavigationBar';
import ItemTable from '@/components/tables/ItemTable';
import CardTable from '@/components/tables/CardTable';
import { UserModel } from '@/lib/types';
import { useState } from 'react';
import { ProfileSettings } from '@/components/ProfileSettings';

interface LoggedViewProps {
  loggedUser: UserModel;
  setLoggedInUser: React.Dispatch<React.SetStateAction<UserModel | null>>;
}

export default function LoggedView({
  loggedUser,
  setLoggedInUser,
}: LoggedViewProps) {
  const [displayItems, setDisplayItems] = useState(true);
  const [displayCards, setDisplayCards] = useState(false);
  const [displayProfile, setDisplayProfile] = useState(false);

  return (
    <div className="flex flex-col justify-center items-center pt-16 gap-3">
      {!displayProfile && (
        <div className="w-full flex justify-center p-14 ">
          <div className=" flex justify-end align-middle ">
            <NavigationBar
              onProfileClicked={() => {
                setDisplayProfile(true);
                setDisplayCards(false);
                setDisplayItems(false);
              }}
              onCardsClicked={() => {
                setDisplayCards(true);
                setDisplayItems(false);
              }}
              onItemsClicked={() => {
                setDisplayItems(true);
                setDisplayCards(false);
              }}
              loggedUser={loggedUser}
              onLogoutSuccessful={() => setLoggedInUser(null)}
            />
          </div>
          <div className="col-span-3 ">
            {displayCards && <CardTable />}
            {displayItems && <ItemTable />}
          </div>
        </div>
      )}
      {displayProfile && (
        <ProfileSettings
          onLoginSucessful={setLoggedInUser}
          loggedUser={loggedUser}
          onPasswordChange={() => setLoggedInUser(null)}
          onCancelClicked={() => {
            setDisplayProfile(false);
            setDisplayItems(true);
          }}
        />
      )}
    </div>
  );
}
