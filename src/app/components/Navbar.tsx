'use client'

import { useState, useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import Image from 'next/image'
import { people, places } from '../../..'

gsap.registerPlugin(useGSAP)

export default function Navbar() {
  const [showFallbackText, setShowFallbackText] = useState(true)

  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'people' | 'places'>('people')
  const [hovered, setHovered] = useState<{
    name: string
    image: string
  } | null>(null)

  const menuRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (isOpen) {
      gsap.set(menuRef.current, { display: 'flex' })
      gsap.to(menuRef.current, { opacity: 1, duration: 0.2 })

      gsap.fromTo(
        rightRef.current,
        { x: '100%' },
        { x: 0, duration: 0.6, ease: 'power3.out' }
      )

      gsap.fromTo(
        leftRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power1.inout' }
      )
    } else {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(menuRef.current, { display: 'none' })
          gsap.set(rightRef.current, { clearProps: 'all' })
          gsap.set(leftRef.current, { clearProps: 'all' })
        },
      })

      tl.to(rightRef.current, {
        x: '100%',
        duration: 0.5,
        ease: 'power3.in',
      }).to(
        leftRef.current,
        {
          opacity: 0,
          duration: 0.3,
          ease: 'power1.out',
        },
        '-=0.3'
      )
    }
  }, [isOpen])

  useGSAP(
    () => {
      if (!imageRef.current) return

      const imageEl = imageRef.current

      if (hovered) {
        // Change image before animating in
        setImageSrc(hovered.image)

        gsap.killTweensOf(imageEl)

        gsap.fromTo(
          imageEl,
          { opacity: 0, scale: 1.05, x: 0 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'power3.out',
          }
        )

        gsap.to(imageEl, {
          x: -40,
          duration: 15,
          ease: 'sine.inOut',
        })
      } else {
        setShowFallbackText(false) // Hide text right away

        gsap.killTweensOf(imageEl)

        // Animate out image
        gsap.to(imageEl, {
          opacity: 0,
          scale: 1.05,
          duration: 0.6,
          ease: 'power2.out',
          onComplete: () => {
            // Only show fallback text if still no hovered image after fade
            requestAnimationFrame(() => {
              if (!hovered) {
                setShowFallbackText(true)
              }
            })
          },
        })

        gsap.to(imageEl, {
          x: 0,
          duration: 1,
          ease: 'power2.out',
        })
      }
    },
    { dependencies: [hovered] }
  )

  const data = activeTab === 'people' ? people : places

  return (
    <>
      {/* Navbar */}
      <nav className='fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4'>
        <div className='text-5xl lg:text-7xl font-extrabold tracking-tight text-white'>
          RDR2
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='relative w-16 h-16 z-50'
        >
          <Image
            src='/images/hb-img.png'
            alt='Menu'
            width={64}
            height={64}
            className='absolute top-0 left-0 transition-opacity duration-300'
            style={{ opacity: isOpen ? 0 : 1 }}
          />
          <Image
            src='/images/cross-img.png'
            alt='Close'
            width={64}
            height={64}
            className='absolute top-0 left-0 transition-opacity duration-300'
            style={{ opacity: isOpen ? 1 : 0 }}
          />
        </button>
      </nav>

      {/* Menu Overlay */}
      <div
        ref={menuRef}
        style={{ display: 'none' }}
        className='fixed inset-0 z-40 opacity-0 flex flex-row'
      >
        {/* Left Side */}
        <div
          ref={leftRef}
          className='flex-1 bg-black flex items-center justify-center relative overflow-hidden'
        >
          {/* Hovered Image */}
          <Image
            ref={imageRef}
            src={imageSrc || '/placeholder.png'} // Or some blank transparent image
            alt={hovered?.name || 'placeholder'}
            fill
            sizes='(max-width: 768px) 100vw, 50vw'
            className='absolute inset-0 lg:object-contain object-cover pointer-events-none z-10'
            style={{ opacity: 0 }}
            priority
          />

          {/* RDR2 text with red color and blurry background */}
          {showFallbackText && (
            <div className='text-red-600 text-6xl md:text-7xl lg:text-8xl font-extrabold px-8 py-6 rounded-xl backdrop-blur-md z-0 transition-opacity duration-500 opacity-100'>
              RDR2
            </div>
          )}
        </div>

        {/* Right Side */}
        <div
          ref={rightRef}
          className='flex-1 bg-[#0f172a] text-white flex flex-col p-10 justify-start'
        >
          {/* Tabs */}
          <div className='flex flex-row gap-10 lg:gap-20 xl:gap-16 text-lg md:text-xl font-bold mt-15'>
            <button
              className={`px-5 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeTab === 'people'
                  ? 'bg-white text-black'
                  : 'bg-transparent text-white'
              }`}
              onClick={() => setActiveTab('people')}
            >
              PEOPLE
            </button>
            <button
              className={`px-5 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeTab === 'places'
                  ? 'bg-white text-black'
                  : 'bg-transparent text-white'
              }`}
              onClick={() => setActiveTab('places')}
            >
              PLACES
            </button>
          </div>

          {/* List */}
          <div className='mt-16 space-y-6 md:space-y-10'>
            {data.map((item) => (
              <button
                key={item.id}
                onMouseEnter={() => setHovered(item)}
                onMouseLeave={() => setHovered(null)}
                className='block text-left text-xl md:text-4xl lg:text-5xl xl:text-6xl font-bold hover:text-red-500 text-white cursor-pointer uppercase'
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
