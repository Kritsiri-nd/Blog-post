
import gitLogo from "../assets/Github.png";
import linkedInLogo from "../assets/LinkedIN.png";
import googleLogo from "../assets/Google.png";
function Footer() {
  return (
    <footer className="p-4 px-20 flex justify-between items-center sm:flex-row flex-col gap-4 ">
      <div className="flex items-center gap-4">
        <h1 className="b1">Get in touch</h1>
        <div className="flex gap-4">
          <img src={linkedInLogo} alt="logo" className="w-[30px] h-[30px]" />
          <img src={gitLogo} alt="logo" className="w-[30px] h-[30px]" />
          <img src={googleLogo} alt="logo" className="w-[30px] h-[30px]" />
        </div>
      </div>
      <h1 className="b1 underline">Home page</h1>
    </footer>
  )
}

export default Footer