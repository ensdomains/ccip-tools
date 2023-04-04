'use client';

import { Card, Input } from '@ensdomains/thorin';
import { FC } from 'react';

export const Configuration: FC = () => {
    return (
        <Card>
            <h2>Configuration</h2>
            <Input label="gateway url" />
        </Card>
    );
};
