
import Image from 'next/image'

export default function Hero() {
  return (
    <div id='hero'>
      <div className='w-screen h-screen relative'>
        <Image
          src='/images/hero-main.jpg'
          alt='hero background'
          fill
          className='object-contain md:object-cover object-center'
          priority
        />
      </div>

      <div className='will-fade'>

      </div>
    </div>
  )
}
