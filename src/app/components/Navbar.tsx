'use client'

import { useState, useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import Image from 'next/image'
import { people, places } from '../../..'

gsap.registerPlugin(useGSAP)

export default function Navbar() {
  const imageRef = useRef<HTMLImageElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'people' | 'places' | null>(
    'people'
  )
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

    if (hovered) {
      gsap.killTweensOf(imageRef.current)

      gsap.fromTo(
        imageRef.current,
        { x: 0 },
        {
          x: -30,
          duration: 45,
          ease: 'power2.inout',
        }
      )
    } else {
      gsap.to(imageRef.current, {
        x: 0,
        duration: 1,
        ease: 'power2.inOut',
      })
    }
  },
  { dependencies: [hovered] } // This replaces the useEffect dependency array
)

  const data =
    activeTab === 'people' ? people : activeTab === 'places' ? places : []

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
        <div
          ref={leftRef}
          className='flex-1 bg-black flex items-center justify-center relative'
        >
          <Image
           ref={imageRef}
            src={hovered?.image || '/images/navbar-side-img.jpg'}
            alt={hovered?.name || 'Background'}
            fill
            sizes='(max-width: 768px) 100vw, 50vw'
            style={{ objectFit: 'contain', }}
            priority
          />
        </div>

        <div
          ref={rightRef}
          className='flex-1 bg-[#0f172a] text-white flex flex-col p-10 justify-start '
        >
          {/* Top Nav */}
          <div className='flex flex-row gap-10 lg:gap-20 xl:gap-16 text-lg md:text-xl  font-bold mt-20 '>
            <button
              className={`px-5 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeTab === 'people'
                  ? 'bg-white text-black'
                  : 'bg-transparent text-white '
              }`}
              onClick={() => setActiveTab('people')}
            >
              PEOPLE
            </button>
            <button
              className={`px-5 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeTab === 'places'
                  ? 'bg-white text-black'
                  : 'bg-transparent text-white  '
              }`}
              onClick={() => setActiveTab('places')}
            >
              PLACES
            </button>
          </div>

          {/* List of Names */}
          {activeTab && (
            <div className='mt-16 space-y-6 md:space-y-10'>
              {data.map((item) => (
                <button
                  key={item.id}
                  onMouseEnter={() => setHovered(item)}
                  onMouseLeave={() => setHovered(null)}
                  className='block text-left text-xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold hover:underline text-white cursor-pointer uppercase'
                >
                  {item.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
