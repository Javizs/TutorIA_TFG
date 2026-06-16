import Link from "next/link";
import { getServerSession } from "next-auth";

async function Navbar() {
  const session = await getServerSession();

  return (
    <nav className="bg-primary text-background border-b border-border p-4">
      <div className="container mx-auto flex justify-between items-center">
        
          <h1 className="font-bold text-xl">English Tutor AI</h1>
        

        <ul className="flex gap-x-2">
          {session ? (
            <>
              <li className="px-3 py-1 text-background/90">
                <Link href="/dashboard">  Inicio</Link>
              </li>
            </>
          ) : (
            <>
              
              <li>
                <Link
                  className="bg-primary-light text-background px-3 py-1 rounded-sm border border-background/20 hover:bg-accent hover:text-primary transition-colors"
                  href="/login"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  className="bg-background text-primary px-3 py-1 rounded-sm border border-background/40 hover:bg-surface hover:text-primary-dark transition-colors"
                  href="/register"
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
