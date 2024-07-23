import { cn, fallBack } from '@/lib/utils';
import {
  useEffect,
  useState,
  forwardRef,
  ElementRef,
  ComponentPropsWithoutRef,
} from 'react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { CreditCard, KeySquare, LogOut, User, StickyNote } from 'lucide-react';
import { UserModel } from '@/lib/types';
import * as UserService from '../services/userService';

interface NavigationBarProps {
  loggedUser: UserModel;
  onLogoutSuccessful: () => void;
  onCardsClicked: () => void;
  onItemsClicked: () => void;
  onProfileClicked: () => void;
}

export default function NavigationBar({
  loggedUser,
  onLogoutSuccessful,
  onCardsClicked,
  onItemsClicked,
  onProfileClicked,
}: NavigationBarProps) {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await UserService.getProfileImage();
        setImageUrl(response);
      } catch (error) {
        alert(error);
        console.error('Failed to fetch profile image:', error);
      }
    };

    fetchImage();
  }, []);

  async function handleLogout() {
    try {
      await UserService.logout();
      onLogoutSuccessful();
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
    <NavigationMenu className="mr-16 ">
      <NavigationMenuList className="flex flex-col items-start justify-start">
        {/* Menu Item that display the regular Passwords Page */}

        <NavigationMenuItem className="ml-1">
          <NavigationMenuLink
            onClick={onItemsClicked}
            className={navigationMenuTriggerStyle()}
          >
            <KeySquare className="mr-2" strokeWidth={1.2} />
            Passwords
          </NavigationMenuLink>
        </NavigationMenuItem>
        {/* Menu Item that display the credit cards Page */}
        <NavigationMenuItem>
          <NavigationMenuLink
            onClick={onCardsClicked}
            className={navigationMenuTriggerStyle()}
          >
            <CreditCard className="mr-2" strokeWidth={1.2} />
            Credit cards
          </NavigationMenuLink>
        </NavigationMenuItem>
        {/* Display The Secure Notes Page */}
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            <StickyNote className="mr-2" strokeWidth={1.2} />
            Secure Notes
          </NavigationMenuLink>
        </NavigationMenuItem>
        <Separator className="my-4" />
        <NavigationMenuItem className="w-full">
          <NavigationMenuLink
            onClick={onProfileClicked}
            className={navigationMenuTriggerStyle()}
          >
            <User className="mr-2" strokeWidth={1.2} />
            Profile
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            onClick={() => handleLogout()}
          >
            <LogOut className="mr-2" strokeWidth={1.2} />
            Log out
          </NavigationMenuLink>
        </NavigationMenuItem>
        {/* This one no matter what pages filter the password by user's favorites */}
        <hr className="h-2 bg-gray-500 border-0" />

        <NavigationMenuItem className="flex flex-row mt-44">
          <Avatar>
            <AvatarImage src={imageUrl} alt="@shadcn" />
            <AvatarFallback>{fallBack(loggedUser.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col align-middle ml-2 space-y-0">
            <span className="text-sm text-gray-700 ">{loggedUser.name}</span>
            <p className="text-xs text-gray-500 pb-1">{loggedUser.email}</p>
          </div>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = forwardRef<ElementRef<'a'>, ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  },
);
ListItem.displayName = 'ListItem';
