import { ConnectKitButton } from 'connectkit';

import { CheckName } from '../components/organisms/CheckName';
import { Configuration } from '../components/organisms/Configuration';
import { Thing } from './thing';
import { BannerCard } from '../components/organisms/BannerCard';
import { DeployResolverCard } from '../components/organisms/deploy/DeployResolver';

export const App = () => {
    return (
        <Thing>
            <div>
                <div className="w-full flex justify-between items-center">
                    <div>
                        <h1 className="block text-xl font-extrabold bg-gradient-to-tr from-ens-blue to bg-ens-teal bg-clip-text text-transparent">
                            CCIP.Tools
                        </h1>
                        <p className="text-sm leading-none text-ens-grey2">Because Offchain Resolution<br /> should be easy</p>
                    </div>
                    <ConnectKitButton />
                </div>
                <div className="flex flex-col gap-4 mt-4">
                    <BannerCard />
                    <DeployResolverCard />
                    {/* <Configuration /> */}
                    {/* <CheckName /> */}
                </div>
            </div>
        </Thing>
    );
};
