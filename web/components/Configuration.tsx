import { Card, Input } from '@ensdomains/thorin';
import { FC } from 'react';

export const Configuration: FC = () => {
    return (
        <Card>
            <h2 className="font-bold pb-4">Configuration</h2>
            <Input label="gateway url" placeholder="http://localhost:3000" />
        </Card>
    );
};
