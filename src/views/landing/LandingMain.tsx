import React, { CSSProperties } from 'react'
import LandingHeader from './LandingHeader'
import LandingHero from './LandingHero'
import LandingVideo from './LandingVideo'
import LandingTopics from './LandingTopics'

type Props = {}

export default function LandingMain({ }: Props) {
    return (
        <div>
            <LandingHeader />
            <LandingHero />
            <LandingVideo />
            <LandingTopics/>
        </div>
    )
}