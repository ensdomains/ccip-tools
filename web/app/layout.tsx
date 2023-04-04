import { ReactNode } from 'react';

import { Thing } from './thing';

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>
                <Thing children={children} />
            </body>
        </html>
    );
}
