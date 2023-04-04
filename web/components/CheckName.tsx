import { Card, Input, Button } from '@ensdomains/thorin';
import { FC } from 'react';
import { useForm } from 'react-hook-form';

type FormValues = {
    name: string;
};

export const CheckName: FC = () => {
    const { register, formState } = useForm<FormValues>({
        mode: 'onChange',
        defaultValues: {
            name: 'vitalik.eth',
        }
    });

    return (
        <Card>
            <h2 className="font-bold">CheckName</h2>
            <div className="flex flex-col gap-4 mt-2">
                <Input label="" placeholder="vitalik.eth" {...register('name')} />
                <Button>
                    Check
                </Button>
            </div>
        </Card>
    );
};
