import { ConnectKitButton } from 'connectkit';

import { CheckName } from '../components/CheckName';
import { Configuration } from '../components/Configuration';
import { Thing } from './thing';

export const App = () => {
    return (
        <Thing>

        <div>
            <div className="w-full flex justify-between items-center">
                <h1 className="block text-xl font-extrabold bg-gradient-to-tr from-blue-500 to bg-purple-500 bg-clip-text text-transparent">
                    CCIP.Tools
                </h1>
                <ConnectKitButton />
            </div>
            <div className="flex flex-col gap-4 mt-4">
                <Configuration />
                <CheckName />
            </div>
        </div>
        </Thing>
    );
};
