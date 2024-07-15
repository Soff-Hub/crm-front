import { TextField, TextFieldProps } from '@mui/material';
import { ChangeEvent, useState } from 'react';

// Helper function to format numbers
export const formatAmount = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

// Helper function to unformat numbers
export const revereAmount = (value: string) => {
    return value.replace(/\s+/g, '');
};

export default function AmountInput(props: TextFieldProps) {
    const [value, setValue] = useState<string>(`${Number(props?.value) >= 0 ? props?.value : ""}`);

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const rawValue = event.target.value;

        // Remove any non-numeric characters
        const numericValue = rawValue.replace(/[^0-9]/g, '');

        setValue(numericValue);

        props.onChange?.(event);
    }

    return (
        <TextField
            {...props}
            onChange={handleChange}
            value={formatAmount(value)}
            autoComplete='off'
        />
    );
}
