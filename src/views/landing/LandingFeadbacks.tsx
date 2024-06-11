import React, { useState } from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import useResponsive from 'src/@core/hooks/useResponsive';


const LandingFeadbacks = () => {
    const { t, i18n } = useTranslation()
    const { isMobile } = useResponsive()

    const [data, setData] = useState([1, 2, 3, 4, 5])

    var settings = {
        infinite: true,
        speed: 300,
        centerMode: true,
        variableWidth: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,

    };

    return (
        <div className='section_reviews_page' style={{ marginBottom: isMobile ? '-20px' : '0', marginTop: isMobile ? '-20px' : '0' }}>
            <div className="container">
                <div className="card_reviews_card flex justify-between items-center gap-2">
                    <h3>{t("Mijozlar fikrlari")} </h3>
                    <div className="border_div"></div>
                </div>
            </div>
            <div className='card_slider'>
                <Slider {...settings} className='slider-container_section'>
                    {
                        data?.map(item => (
                            <div key={1} >
                                <div className="card_carseol p-8 ml-3 cursor-pointer " style={{ padding: '40px' }}>
                                    <div className='flex items-center gap-6 card_text' style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                                        <div className='images_carddd'>
                                            <Image style={{ objectFit: 'cover', objectPosition: 'top' }} src={'https://admin.soffhub.uz/media/team/Doniyor_3HEt1CW.JPG'} className='images' alt="images_res" width={100} height={100} />
                                        </div>
                                        <div className='pb-3 text_bodyh4' style={{ paddingBottom: '20px' }}>
                                            <h4 className='elh4l'>{'Doniyor Eshmamatov'}</h4>
                                            <p style={{ margin: '0' }}>{'Frontend developer'}</p>
                                        </div>
                                    </div>
                                    <div className='card_text_lorem'>
                                        <p className='textp'>
                                            Yuksalish Liderlar akademiyasining boshlang`ich 2 oy davomida juda ko`plab qiyinchiliklarga duch keldik, moliyaviy hisob-kitob, kengayish va filiallarni tizimli boshqarishda juda qiynaldik. Va nihoyat jonimizga aro kirgan platforma keldi, buning nomi Modme deb ataladi. Ushbu platformani ishlatish orqali ishimiz oson ko`chdi.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </Slider>
            </div>
        </div>
    )
}

export default LandingFeadbacks