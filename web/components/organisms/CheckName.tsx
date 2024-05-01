import { Button, Card, Input } from '@ensdomains/thorin';
import { FC, useReducer } from 'react';
import { useForm } from 'react-hook-form';
import { useProvider } from 'wagmi';

type FormValues = {
    name: string;
};

export const CheckName: FC = () => {
    const { register, formState, handleSubmit } = useForm<FormValues>({
        mode: 'onChange',
        defaultValues: {
            name: 'vitalik.eth',
        },
    });

    const provider = useProvider();

    const [loading, setLoading] = useReducer(
        (loading: number, action: 'incr' | 'decr') => {
            return action === 'incr' ? loading + 1 : loading - 1;
        },
        0
    );

    const onSubmit = handleSubmit(async ({ name }) => {
        setLoading('incr');
        const resolver = await provider.getResolver(name);

        alert(resolver?.address);

        const data = await resolver?.getAvatar();

        alert(JSON.stringify(data));
        setLoading('decr');
    });

    return (
        <Card>
            <form onSubmit={onSubmit}>
                <h2 className="font-bold">CheckName</h2>
                <div className="flex flex-col gap-4 mt-2">
                    <Input
                        label=""
                        placeholder="vitalik.eth"
                        {...register('name')}
                    />
                    <Button type="submit" loading={loading > 0}>
                        Check
                    </Button>
                </div>
            </form>
        </Card>
    );
};
