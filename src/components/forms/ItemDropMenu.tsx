import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Slider } from '../ui/slider';

interface ItemDropMenuProps {
  setPassword: React.Dispatch<React.SetStateAction<string>>;
}

const ItemDropMenu = ({ setPassword }: ItemDropMenuProps) => {
  const [uppercase, setUppercase] = useState<boolean>(true);
  const [lowercase, setLowercase] = useState<boolean>(false);
  const [numerical, setNumerical] = useState<boolean>(false);
  const [specialChars, setSpecialChars] = useState<boolean>(false);
  const [passLenght, setPassLength] = useState<number>(4);
  const [textWarning, setTextWarning] = useState<string | null>(null);

  function generateString(
    length: number,
    includeUppercase: boolean,
    includeLowercase: boolean,
    includeNumbers: boolean,
    includeSpecial: boolean,
  ): string {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const specialChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    let characterPool = '';
    let mandatoryChars = '';

    if (includeUppercase) {
      characterPool += uppercaseChars;
      mandatoryChars +=
        uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
    }
    if (includeLowercase) {
      characterPool += lowercaseChars;
      mandatoryChars +=
        lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
    }
    if (includeNumbers) {
      characterPool += numberChars;
      mandatoryChars +=
        numberChars[Math.floor(Math.random() * numberChars.length)];
    }
    if (includeSpecial) {
      characterPool += specialChars;
      mandatoryChars +=
        specialChars[Math.floor(Math.random() * specialChars.length)];
    }

    let randomString = mandatoryChars;
    for (let i = mandatoryChars.length; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characterPool.length);
      randomString += characterPool[randomIndex];
    }

    return randomString
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }

  const handleCheckboxChange = (
    checked: boolean,
    setOption: React.Dispatch<React.SetStateAction<boolean>>,
    currentOption: boolean,
  ) => {
    if (
      !checked &&
      Number(uppercase) +
        Number(lowercase) +
        Number(numerical) +
        Number(specialChars) -
        Number(currentOption) ===
        0
    ) {
      setTextWarning('At least one option must be selected.');
      return;
    }
    setTextWarning(null);
    setOption(checked);
  };

  return (
    <div className="flex flex-col justify-center space-y-4 py-4 border-[1px] rounded-md border-gray-400">
      {textWarning && (
        <Alert variant={'destructive'}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Check the actived options for your password</AlertTitle>
          <AlertDescription className="text-red-600">
            {textWarning}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-row w-full items-center space-x-2 px-4">
        <span
          className="text-sm font-medium leading-none
             peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Lenght
        </span>
        <div className="border-[1px] border-black px-2 rounded">
          {passLenght}
        </div>
        <Slider
          defaultValue={[4]}
          max={16}
          min={4}
          step={1}
          onValueChange={(value) => setPassLength(value[0])}
        />
      </div>
      <div className="flex justify-between w-full space-x-2 px-4">
        <label
          htmlFor="uppercase"
          className="text-sm font-medium leading-none
             peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          A-Z
        </label>
        <Checkbox
          id="uppercase"
          checked={uppercase}
          onCheckedChange={(checked) =>
            handleCheckboxChange(checked as boolean, setUppercase, uppercase)
          }
        />
      </div>
      <div className="flex justify-between w-full space-x-2 px-4">
        <label
          htmlFor="lowercase"
          className="text-sm font-medium leading-none
             peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          a-z
        </label>

        <Checkbox
          id="lowercase"
          checked={lowercase}
          onCheckedChange={(checked) =>
            handleCheckboxChange(checked as boolean, setLowercase, lowercase)
          }
        />
      </div>
      <div className="flex justify-between w-full space-x-2 px-4">
        <label
          htmlFor="numerical"
          className="text-sm font-medium leading-none
             peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          0-9
        </label>
        <Checkbox
          id="numerical"
          checked={numerical}
          onCheckedChange={(checked) =>
            handleCheckboxChange(checked as boolean, setNumerical, numerical)
          }
        />
      </div>
      <div className="flex justify-between w-full space-x-2 px-4">
        <label
          htmlFor="specialcharacters"
          className="text-sm font-medium leading-none
             peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          !@#$%^&*
        </label>

        <Checkbox
          id="specialcharacters"
          checked={specialChars}
          onCheckedChange={(checked) =>
            handleCheckboxChange(
              checked as boolean,
              setSpecialChars,
              specialChars,
            )
          }
        />
      </div>
      <div className="flex justify-end w-full space-x-2 px-4">
        <Button
          type="button"
          variant={'secondary'}
          onClick={() =>
            setPassword(
              generateString(
                passLenght,
                uppercase,
                lowercase,
                numerical,
                specialChars,
              ),
            )
          }
        >
          Generate
        </Button>
      </div>
    </div>
  );
};

export default ItemDropMenu;
