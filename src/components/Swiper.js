import React from 'react'

import CardRoom from './CardRoom'

import ReactIdSwiper from 'react-id-swiper'

const Swiper = (props) => {
    const breakpoints = []
    if (props.sm) {
        breakpoints[565] = {
            slidesPerView: props.sm
        }
    }
    if (props.md) {
        breakpoints[768] = {
            slidesPerView: props.md
        }
    }
    if (props.lg) {
        breakpoints[991] = {
            slidesPerView: props.lg
        }
    }
    if (props.xl) {
        breakpoints[1200] = {
            slidesPerView: props.xl
        }
    }
    if (props.xxl) {
        breakpoints[1400] = {
            slidesPerView: props.xxl
        }
    }
    if (props.xxxl) {
        breakpoints[1600] = {
            slidesPerView: props.xxxl
        }
    }
    const params = {
        containerClass: `swiper-container ${props.className}`,

        slidesPerView: props.perView,
        effect: props.effect,
        allowTouchMove: props.allowTouchMove === false ? false : true,
        spaceBetween: props.spaceBetween,
        centeredSlides: props.centeredSlides,
        roundLengths: props.roundLengths,
        loop: props.loop,
        speed: props.speed ? props.speed : 400,
        parallax: props.parallax,
        breakpoints: breakpoints,
        autoplay: props.autoplay ? {
            delay: props.delay
        } : false,
        pagination: props.pagination !== false ? {
            el: `.swiper-pagination.${props.paginationClass}`,
            clickable: true,
            dynamicBullets: true
        } : false,
        navigation: {
            nextEl: props.navigation ? '.swiper-button-next' : '',
            prevEl: props.navigation ? '.swiper-button-prev' : ''
        },
        wrapperClass: `swiper-wrapper ${props.wrapperClass ? props.wrapperClass : ''}`
    }
    return (
        props.data ? <ReactIdSwiper {...params}>
            {props.data.map((slide, index) =>
                props.simple ?
                    <div
                        key={slide}
                        style={{ backgroundImage: `url(/content/img/photo/${slide})` }}
                    />
                    :
                    <div key={index} className="h-auto px-2">
                        {props.cards &&
                            <div className="w-100 h-100 hover-animate">
                                <CardRoom data={slide.properties} />
                            </div>
                        }
                    </div>
            )}

        </ReactIdSwiper>
            : 'loading'
    )
}

export default Swiper