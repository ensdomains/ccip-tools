import { BannerCard } from '../components/organisms/BannerCard';
import { DeployResolverCard } from '../components/organisms/deploy/DeploySOResolver';
import { DeployedResolvers } from '../components/organisms/deployed_resolvers/DeployedResolvers';
import { Thing } from './thing';

export const App = () => {
    return (
        <Thing>
            <div>
                <div className="w-full flex justify-between items-center">
                    <div>
                        <h1 className="block text-xl font-extrabold bg-gradient-to-tr from-ens-blue to bg-ens-teal bg-clip-text text-transparent">
                            CCIP Tools
                        </h1>
                        <p className="text-sm leading-none text-ens-grey2">
                            Because Offchain Resolution
                            <br /> should be easy
                        </p>
                    </div>
                </div>
                <div className="flex flex-col gap-4 mt-4">
                    <BannerCard />
                    <DeployResolverCard />
                    {/* <Configuration /> */}
                    {/* <CheckName /> */}
                    <DeployedResolvers />
                </div>
            </div>
        </Thing>
    );
};
