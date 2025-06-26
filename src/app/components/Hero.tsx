"use client"
import React, { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const frontRef = useRef(null)
  const containerRef = useRef(null)


  useGSAP(() => {
    gsap.fromTo(frontRef.current,
      { opacity: 0, scale: 1.5 },
      {
        opacity: 1,
        scale: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=300%',
          scrub: 1.5,
          pin: true, // 🔥 pin the section until animation completes
        },
      }
    )

  }, [])

  return (
    <div
      id="hero"
      ref={containerRef}
      className="relative w-full h-[150vh] overflow-x-hidden"
    >
      {/* Sticky container for both images */}
      <div className="sticky top-0 w-full h-screen">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 max-w-full overflow-hidden">
          <Image
            src="/images/hero-main.jpg"
            alt="hero background"
            fill
            className="object-contain md:object-cover object-center"
            priority
          />
        </div>

        {/* Foreground Image */}
        <div
          ref={frontRef}
          className="absolute inset-0 z-10 opacity-0 will-change-transform max-w-full overflow-hidden"
        >
          <Image
            src="/images/hero-front.jpg"
            alt="hero front"
            fill
            className="object-contain md:object-cover object-center"
          />
        </div>

        {/* this text will fade in smoothly from the bottom to its position removing the need for a second image when scrolling */}
        <div className='text-4xl text-white'>
          <h1>The Goated Game</h1>
        </div>
      </div>
    </div>
  )
}
