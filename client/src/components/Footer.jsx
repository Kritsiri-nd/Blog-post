
import gitLogo from "../assets/Github.png";
import linkedInLogo from "../assets/LinkedIN.png";
import googleLogo from "../assets/Google.png";
import { Link } from "react-router-dom";
function Footer() {
  return (
    <footer className="p-4 px-20 flex justify-between items-center sm:flex-row flex-col gap-4 ">
      <div className="flex items-center gap-4">
        <h1 className="b1">Get in touch</h1>
        <div className="flex gap-4">
          <Link to="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
            <img src={linkedInLogo} alt="LinkedIn" className="w-[30px] h-[30px]" />
          </Link>
          <Link to="https://github.com/" target="_blank" rel="noopener noreferrer">
            <img src={gitLogo} alt="GitHub" className="w-[30px] h-[30px]" />
          </Link>
          <Link to="mailto:your.mail@gmail.com" target="_blank" rel="noopener noreferrer">
            <img src={googleLogo} alt="Google" className="w-[30px] h-[30px]" />
          </Link>
        </div>
      </div>
      <Link to="/" className="cursor-pointer">
      <h1 className="b1 underline">Home page</h1>
      </Link>
    </footer>
  )
}

export default Footer