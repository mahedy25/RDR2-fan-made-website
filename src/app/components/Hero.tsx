'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

// Custom font import
import { Cinzel } from 'next/font/google'

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
})

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const containerRef = useRef(null)
  const frontRef = useRef(null)
  const textRef = useRef(null)
  const bgRef = useRef(null)

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=400%',
        scrub: 3,
        pin: true,
      },
    })

    // Foreground image fades in
    tl.fromTo(
      frontRef.current,
      { opacity: 0, scale: 2.5 },
      { opacity: 1, scale: 1, duration: 30, ease: 'power2.out' }
    )

    // Foreground fades out
    tl.to(
      frontRef.current,
      { opacity: 0, duration: 3, ease: 'power2.out' },
      '>'
    )

    // Text fades in + background fades out
    tl.fromTo(
      textRef.current,
      { opacity: 0, scale: 0.95, transformOrigin: 'center center' },
      {
        opacity: 1,
        scale: 1,
        duration: 30, // shorter to reduce visible distortion
        ease: 'power2.out',
      },
      '<'
    )

    tl.to(
      bgRef.current,
      { opacity: 0, duration: 0.15, ease: 'power2.out' },
      '<'
    )
  }, [])

  return (
    <div
      ref={containerRef}
      className='relative w-full h-[300vh] overflow-hidden'
    >
      <div className='sticky top-0 w-full h-screen'>
        {/* Background Image */}
        <div ref={bgRef} className='absolute inset-0 z-0'>
          <Image
            src='/images/hero-main.jpg'
            alt='hero background'
            fill
            className='object-cover'
            priority
          />
        </div>

        {/* Foreground Image */}
        <div ref={frontRef} className='absolute inset-0 z-10'>
          <Image
            src='/images/hero-front.jpg'
            alt='hero front'
            fill
            className='object-cover'
          />
        </div>

        {/* Text Content */}
        <div
          ref={textRef}
          className='absolute inset-0 z-20 flex items-center justify-center h-full pointer-events-none will-change-transform transform-gpu'
        >
          <div className='w-[85%] max-w-4xl text-center text-white px-4 border-8 border-white p-8' >
            <h1
              className={`${cinzel.className} text-4xl md:text-7xl font-extrabold tracking-wide leading-tight drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]`}
            >
              <span className='bg-gradient-to-r from-[#ff416c] via-[#ff4b2b] to-[#ffc371] bg-clip-text text-transparent'>
                The Goated Game
              </span>
            </h1>

            <p className='mt-6 text-base md:text-xl leading-relaxed font-light text-gray-200'>
              <span className='text-red-500 font-bold text-2xl md:text-3xl block mb-2'>
                Red Dead Redemption 2-
              </span>
              is a critically acclaimed open-world action-adventure game
              developed by Rockstar Games. Set in 1899, at the end of the
              American Wild West era, the game follows{' '}
              <span className='text-white font-semibold'>Arthur Morgan</span>, a
              rugged outlaw and loyal member of the Van der Linde gang, as he
              navigates a rapidly changing world where lawmen,
              industrialization, and internal conflicts threaten his way of
              life.
              <br />
              <br />
              From snowy peaks to swampy bayous, RDR2 offers a deeply immersive
              experience, filled with heart-pounding heists, rich storytelling,
              and unforgettable moments. It’s not just a game — it’s a living,
              breathing world.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
