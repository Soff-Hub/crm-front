import React, { CSSProperties } from 'react'
import LandingHeader from './LandingHeader'
import LandingHero from './LandingHero'
import LandingVideo from './LandingVideo'
import LandingTopics from './LandingTopics'
import LandingFeadbacks from './LandingFeadbacks'
import LandingPartners from './LandingPartners'
import LandingFooter from './LandingFooter'
import LandingDocs from './LandingDocs'

type Props = {}

export default function LandingMain({ }: Props) {
    return (
        <div>
            <LandingHeader />
            <LandingHero />
            <LandingVideo />
            <LandingDocs/>
            <LandingTopics />
            <LandingPartners />
            <LandingFeadbacks />
            <LandingFooter />
        </div>
    )
}