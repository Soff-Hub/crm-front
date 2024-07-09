import React from 'react'

interface StatusTypes {
    color?: 'warning' | 'success' | 'error' | 'secondary' | undefined,
}

export default function Status({ color }: StatusTypes) {
    return (
        <span
            style={{
                display: 'flex',
                overflow: 'hidden',
                justifyContent: 'center',
                alignItems: 'center',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: color === "success" ? '#72E128' : color === 'error' ? '#FF4D49' : color === 'warning' ? '#ffc107' : 'gray'
            }}></span>
    )
}
