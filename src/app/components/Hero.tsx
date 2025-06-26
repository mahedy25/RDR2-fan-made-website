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
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.current,
      start: 'top top',
      end: '+=300%',
      scrub: true,
      pin: true,
    }
  })

  // First 20% of scroll: do nothing (dummy tween)
  tl.to({}, { duration: 0.2 })

  // Animate opacity and scale from 20% scroll onwards (remaining 80%)
  tl.fromTo(frontRef.current,
    { opacity: 0, scale: 2.5 },
    { opacity: 1, scale: 1, ease: 'power2.out', duration: 0.8 },
    "<"
  )
}, [])

  return (
    <div
      id="hero"
      ref={containerRef}
      className="relative w-full h-[400vh] overflow-x-hidden"
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
      </div>
    </div>
  )
}
