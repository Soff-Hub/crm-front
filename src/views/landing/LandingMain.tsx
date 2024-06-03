import React from 'react'
import LandingHeader from './LandingHeader'
import LandingHero from './LandingHero'

type Props = {}

export default function LandingMain({ }: Props) {
    return (
        <div>
            <LandingHeader />
            <LandingHero />
        </div>
    )
}