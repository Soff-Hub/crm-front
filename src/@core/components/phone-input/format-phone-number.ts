export const formatPhoneNumber = (value: any) => {
    if (!value) return value;

    const phoneNumber = value.replace('+998', '').replace(/[^\d]/g, '')
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength <= 2) return `(${phoneNumber}`;
    if (phoneNumberLength <= 5) return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
    if (phoneNumberLength <= 7) return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 5)}-${phoneNumber.slice(5)}`;
    if (phoneNumberLength <= 9) return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 5)}-${phoneNumber.slice(5, 7)}-${phoneNumber.slice(7)}`;

    // Agar uzunlik 9 dan katta bo'lsa
    const formattedPart = `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 5)}-${phoneNumber.slice(5, 7)}-${phoneNumber.slice(7, 9)}`;
    // const remainingPart = phoneNumber.slice(9);

    return `${formattedPart}`;
};

export const reversePhone = (value: string) => {
    const withoutPrefix = value.replace('+998', '');

    console.log(withoutPrefix.replace(/[^\d]/g, ''));
    
    return `+998${withoutPrefix.replace(/[^\d]/g, '').length <= 9 ? withoutPrefix.replace(/[^\d]/g, '') : withoutPrefix.replace(/[^\d]/g, '').split('').slice(0, 9).join('')}`
}