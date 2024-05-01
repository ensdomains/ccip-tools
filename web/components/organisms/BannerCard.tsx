import { Card } from '@ensdomains/thorin';
import { FC } from 'react';

export const BannerCard: FC = () => {
    return (
        <Card className="leading-6">
            <div>
                <h2 className="font-bold">Welcome to CCIP Tools</h2>
                <p className="text-neutral-700 mt-2">
                    This page contains tooling to let you easily deploy and
                    manage Offchain Resolvers for your ENS names.
                </p>
            </div>
        </Card>
    );
};
