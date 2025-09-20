import authorImage from '../assets/authorPhoto.jpg'

function HeroSection() {
  return (
    <hero className='flex gap-4 p-10  w-full mx-auto max-[1200px] justify-center'>
      <div className='text-right justify-center flex flex-col max-w-[400px] pr-10'>
        <h1 className="h1 pb-6">Stay<br></br> Informed, <br></br>Stay Inspired</h1>
        <p className='text-brown-400'>Discover a World of Knowledge at Your <br></br>Fingertips. Your Daily Dose of Inspiration <br></br>and Information.</p>
      </div>
      <div>
        <img src={authorImage} alt='authorImage' className='object-cover w-full h-150 max-w-[400px]'></img>
      </div>
      <div className='text-left justify-center flex flex-col max-w-[400px] pl-10'>
        <h1 className='b3 pb-4 text-brown-400'>-Author</h1>
        <h1 className='h3 pb-6'>Thompson P.</h1>
        <p className='b1 pb-6 text-brown-400'>I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.</p>
        <p className='b1 text-brown-400'>When i’m not writing, I spends time volunteering at my local animal shelter, helping cats find loving homes.</p>
      </div>
    </hero>
  )
}

export default HeroSection