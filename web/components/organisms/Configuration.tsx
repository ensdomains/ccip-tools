import { Card, Input } from '@ensdomains/thorin';
import { ContractOrRegister } from '../molecules/ContractOrGateway';
import { FC, useState } from 'react';

export const Configuration: FC = () => {
    const [selected, setSelected] = useState(0);

    return (
        <Card className="flex flex-col gap-4">
            <h2 className="font-bold">Configuration</h2>
            <p>I would like to test out my</p>

            <ContractOrRegister value={selected} setValue={setSelected} />

            {
                selected === 0 && (
                    <>
                        <Input label="Resolver Address" placeholder="0x..." />
                    </>
                )
            }
            {
                selected === 1 && (
                    <>
                        <Input label="Gateway Url" placeholder="http://localhost:3000" />
                    </>
                )
            }
        </Card>
    );
};
