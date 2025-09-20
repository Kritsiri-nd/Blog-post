import Button from "./Button"

function Navbar() {
  return (
    <nav className="w-full  mx-auto flex items-center justify-between py-4 px-20 border border-[#DAD6D1]">
      <h1 className="h2 text-black">hh<span className="text-green">.</span></h1>
      <div className="flex gap-4">
        <Button variant="secondary">Log in</Button>
        <Button variant="primary">Sign up</Button>
      </div>
    </nav>
  )
}

export default Navbar