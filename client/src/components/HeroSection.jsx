import authorImage from '../assets/authorPhoto.jpg'

function HeroSection() {
  return (
    <section className="flex flex-col sm:flex-row items-center justify-between gap-10 px-6 sm:px-10 py-5 w-full mx-auto max-w-[1200px]">

      {/* Left Text Section */}
      <div className="flex flex-col justify-center sm:text-right text-center sm:max-w-[380px] w-full">
        <h1 className="hidden sm:block h2 pb-6 leading-tight">
          Brew Ideas,<br />Share Stories,<br />Enjoy the Moment
        </h1>
        <h1 className="sm:hidden h2 pb-6 leading-tight">
          Brew Ideas,<br />Share Stories,<br />Enjoy the Moment
        </h1>
        <p className="text-brown-400 b1 leading-relaxed">
          ที่นี่ไม่ใช่แค่จิบกาแฟ แต่คือการกลั่นความคิด<br />
          แบ่งปันเรื่องราว และเก็บช่วงเวลาเรียบง่าย<br />
          ที่อาจกลายเป็นแรงบันดาลใจดี ๆ ในแต่ละวัน
        </p>
      </div>

      {/* Middle Image */}
      <div className="flex justify-center w-full sm:w-auto">
        <img
          src={authorImage}
          alt="author"
          className="
            object-cover
            w-full
            max-w-[350px]
            sm:max-w-[420px]
            h-[320px]
            sm:max-h-[430px]
            md:max-h-[480px]
            rounded-xl
            shadow-lg
            transition-transform
            duration-300
            hover:scale-[1.02]
          "
        />
      </div>

      {/* Right Author Info */}
      <div className="flex flex-col justify-center text-center sm:text-left sm:max-w-[380px] w-full">
        <h1 className="b3 pb-3 text-brown-400">– Author</h1>
        <h1 className="h3 pb-5 text-brown-600">Kritsiri N.</h1>
        <p className="b1 text-brown-500 leading-relaxed">
          คอกาแฟและนักเล่าเรื่องที่ชอบสังเกตความงามของชีวิตในรายละเอียดเล็ก ๆ  
          ไม่ว่าจะเป็นรสกาแฟที่เปลี่ยนไปตามอารมณ์ หรือบทสนทนาที่ชวนคิดในแต่ละวัน  
          ที่นี่คือพื้นที่เล็ก ๆ สำหรับแบ่งปันความรู้ ความเห็น และแรงบันดาลใจ  
          ในสไตล์เรียบง่ายแต่จริงใจ
        </p>
      </div>
    </section>
  )
}

export default HeroSection
