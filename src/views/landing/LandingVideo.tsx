import React from 'react'

export default function LandingVideo() {


    return (
        <section className='landing-video'>
            <div className="container">
                <div className="lading-video-inner" style={{ padding: '90px 0' }}>
                    <div className="landing-video-inner" style={{ maxWidth: '700px', textAlign: 'center', margin: '0 auto' }}>
                        <h2>Soff CRM va LMS</h2>
                        <p>
                            Biz 2020-yildan boshlab o`z faoliyatimizni olib boryapmiz. Ushbu davrda O`zbekistondagi Top-o`quv markazlarni avtomatlashtirish orqali ularning rivojlanishiga o`z hissamizni qo`shishga ulgurdik
                        </p>
                    </div>
                    <div className="">
                        <iframe
                            width="100%"
                            height="700px"
                            src="https://www.youtube.com/embed/fLGhHwZN7ks?si=mXyHDKSKWun-j9mV"
                            title="Soff CRM haqida"
                            allowFullScreen></iframe>
                    </div>
                </div>
            </div>
        </section>
    )
}