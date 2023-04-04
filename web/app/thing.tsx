'use client';

import { ConnectKitProvider, getDefaultClient } from 'connectkit';
import { FC, ReactNode } from 'react';
import { createClient, WagmiConfig } from 'wagmi';

const client = createClient(getDefaultClient({ appName: 'CCIP Tools' }));

export const Thing: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <WagmiConfig client={client}>
            <ConnectKitProvider>{children}</ConnectKitProvider>
        </WagmiConfig>
    );
};
