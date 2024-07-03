import { ChangeEvent, useState } from "react"
import { formatPhoneNumber } from "./format-phone-number"
import { OutlinedInput, OutlinedInputProps } from "@mui/material"


export default function PhoneInput(props: OutlinedInputProps) {
    const [value, setValue] = useState<string>(props.value ? formatPhoneNumber(props.value) : '')

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        props.onChange?.(event)

        setValue(formatPhoneNumber(event.target.value))
    }

    return (
        <OutlinedInput
            size="small"
            placeholder="XX XXX XX XX"
            {...props}
            type="text"
            onChange={handleChange}
            value={value}
            name="phone"
            startAdornment={
                <span style={{ paddingLeft: '7px', paddingRight: '2px' }}>+998</span>
            }
            autoComplete="off"
        />
    )
}