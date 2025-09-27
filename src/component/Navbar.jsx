import Button from "./Button"
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
function Navbar() {
  return (
    <nav className="w-full  mx-auto flex items-center justify-between py-4 px-20 border border-[#DAD6D1]">
      <h1 className="h2 text-black">hh<span className="text-green">.</span></h1>
      <div className="sm:flex gap-4 hidden ">
        <Button variant="secondary" >Log in</Button>
        <Button variant="primary">Sign up</Button>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="sm:hidden focus:outline-none">
          <Menu />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="sm:hidden w-screen rounded-none mt-4 flex flex-col gap-6 py-10 px-6 border-none bg-white">
          <a
            href="/login"
            className="px-8 py-4 bg-white rounded-full text-center text-foreground border border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors"
          >
            Log in
          </a>
          <a
            href="/signup"
            className="px-8 py-4 bg-foreground bg-brown-600 text-center text-white rounded-full hover:bg-muted-foreground transition-colors"
          >
            Sign up
          </a>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}

export default Navbar