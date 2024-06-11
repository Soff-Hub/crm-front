import Image from 'next/image'
import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useResponsive from 'src/@core/hooks/useResponsive';
import { useTranslation } from 'react-i18next';



export interface LandingTopicsType {
    img: string
    title: string
    description: string
}

export default function LandingTopics() {
    const { isMobile, isTablet, isDesktop } = useResponsive()
    const { t } = useTranslation()

    const data: LandingTopicsType[] = [
        {
            img: 'https://cdn.mrkhub.com/instapage-landings-frontend/60/images/_pages/template/features/feature-landing.svg',
            title: t('MARKETING'),
            description: t('marketing_desc')
        },
        {
            img: 'https://cdn.mrkhub.com/instapage-landings-frontend/60/images/_pages/template/features/feature-visual.svg',
            title: t('MOLIYA'),
            description: t('moliya_desc')
        },
        {
            img: 'https://cdn.mrkhub.com/instapage-landings-frontend/60/images/_pages/template/features/feature-customizable.svg',
            title: 'SOTUV',
            description: 'Platforma yordamida sizga kelib tushayotgan so`rovlarni bir joyga yig`ishingiz, ularga tez va sifatli aloqaga chiqishingiz mumkin'
        },
        {
            img: 'https://cdn.mrkhub.com/instapage-landings-frontend/60/images/_pages/template/features/feature-ai.svg',
            title: t('XIZMAT KO`RSATISH'),
            description: t('xizmat_korsatish_desc')
        }
    ]

    const listStyles: CSSProperties = {
        display: 'flex',
        justifyContent: 'space-around',
        gap: '20px',
        alignItems: 'start'
    }

    const itemStyles: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        minWidth: '340px',
        padding: '40px',
        border: '2px solid #050d1a',
        maxWidth: '360px',
        minHeight: '430px',
    }

    let sliderRef: any = useRef(null);
    const next = () => {
        if (sliderRef.current) {
            sliderRef.current.slickNext();
        }
    };

    const previous = () => {
        if (sliderRef.current) {
            sliderRef.current.slickPrev();
        }
    };

    const [left, setLeft] = useState<any>(0)

    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: false,
        centerMode: true
    };

    useEffect(() => {
        const containerClone = document.querySelector('.container-clone')
        setLeft(containerClone?.clientWidth)
    }, [])

    return (
        <div style={{ padding: isMobile ? '50px 0' : '120px 0', backgroundColor: '#f0e9ab92' }}>
            <div className="container container-clone">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{
                        marginBottom: '34px',
                        color: '#050d1a',
                        maxWidth: '1100px',
                        fontSize: isMobile ? '18px' : '30px',
                        fontWeight: '700',
                    }}>
                        {t("Soff CRM platformasi orqali siz o'z o'quv markazingizda quyidagi yo'nalishlarni tizimlashtirishga erishasiz")}
                    </h2>
                    {!isMobile && <div style={{ display: 'flex', gap: '4px' }}>
                        <div style={{
                            width: '44px',
                            height: '44px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            border: '2px solid #050d1a'
                        }}
                            onClick={previous}
                        >
                            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMyIgaGVpZ2h0PSIzMyIgZmlsbD0ibm9uZSI+PHBhdGggc3Ryb2tlPSIjMkMyQzJDIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiBzdHJva2Utd2lkdGg9IjIiIGQ9Ik03LjMgMTYuNDloMTkuMk0xNC41NjYgOC40NTYgNi41IDE2LjQ4OGw4LjA2NiA4LjAzNCIvPjwvc3ZnPg==" alt="" />
                        </div>
                        <div style={{
                            width: '44px',
                            height: '44px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            border: '2px solid #050d1a'
                        }}
                            onClick={next}
                        >
                            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMyIgaGVpZ2h0PSIzMyIgZmlsbD0ibm9uZSI+PHBhdGggc3Ryb2tlPSIjMkMyQzJDIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiBzdHJva2Utd2lkdGg9IjIiIGQ9Ik0yNS43IDE2LjQ5SDYuNU0xOC40MzQgOC40NTZsOC4wNjYgOC4wMzItOC4wNjYgOC4wMzQiLz48L3N2Zz4=" alt="" />
                        </div>
                    </div>}
                </div>
            </div>
            <div className="slider-container" style={{}}>
                {isMobile ? (
                    <div className="" style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
                        {
                            [...data, ...data].map((el, i) => (
                                <div
                                    data-aos={i % 2 === 0 ? "flip-left" : "flip-right"}
                                    key={i}
                                    style={{ height: '100%' }}
                                >
                                    <div style={{ ...itemStyles, minWidth: '300px', minHeight: '0' }} >
                                        <Image src={el.img} alt={el.title} width={48} height={48} style={{ marginBottom: '24px' }} />
                                        <h4 style={{ fontWeight: 700, color: '#050d1a', textTransform: 'capitalize' }}>{el.title}</h4>
                                        <p>{el.description}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                ) : <Slider ref={sliderRef}
                    {...settings}
                    responsive={[
                        {
                            breakpoint: 1200,
                            settings: {
                                infinite: true,
                                speed: 500,
                                slidesToShow: 3,
                                slidesToScroll: 1,
                                arrows: false,
                                // centerMode: true
                            }
                        },
                        {
                            breakpoint: 1024,
                            settings: {
                                infinite: true,
                                speed: 500,
                                slidesToShow: 2,
                                slidesToScroll: 1,
                                arrows: false,
                                centerMode: true
                            }
                        },
                        {
                            breakpoint: 768,
                            settings: {
                                infinite: true,
                                speed: 500,
                                slidesToShow: 2,
                                slidesToScroll: 1,
                                arrows: false,
                            }
                        },
                        {
                            breakpoint: 600,
                            settings: {
                                infinite: true,
                                speed: 500,
                                slidesToShow: 1,
                                slidesToScroll: 1,
                                arrows: false,
                                centerMode: true

                            }
                        },
                        {
                            breakpoint: 480,
                            settings: {
                                infinite: true,
                                speed: 500,
                                slidesToShow: 1,
                                slidesToScroll: 1,
                                arrows: false,
                                // centerMode: true
                            }
                        }
                    ]}
                >
                    {
                        [...data, ...data].map((el, i) => (
                            <div
                                data-aos={i % 2 === 0 ? "flip-left" : "flip-right"}
                                key={i}
                                style={{ height: '100%' }}
                            >
                                <div style={itemStyles} >
                                    <Image src={el.img} alt={el.title} width={48} height={48} style={{ marginBottom: '24px' }} />
                                    <h4 style={{ fontWeight: 700, color: '#050d1a', textTransform: 'capitalize' }}>{el.title}</h4>
                                    <p>{el.description}</p>
                                </div>
                            </div>
                        ))
                    }

                </Slider>}
            </div>
        </div >
    )
}