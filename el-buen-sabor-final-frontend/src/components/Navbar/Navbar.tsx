"use client";

import Link from "next/link";
import { signIn, useSession, signOut } from "next-auth/react";
import {listPages} from "@/data/index"

function Navbar() {
  const { data: session } = useSession();

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
      
        {/*listPages.map(itemPage => (
        ))*/}
  
        <Link href="/">
          <h1>Buen Sabor</h1>
        </Link>

        {session?.user ? (
          <div className="flex gap-x-2 items-center">
            <Link href="/prueba">Prueba</Link>
            <p>
              {session.user.name} {session.user.email}
            </p>
            {session?.user?.image && (
              <img
                src={session.user.image}
                alt=""
                className="w-10 h-10 rounded-full cursor-pointer"
              />
            )}

            <button
              onClick={async () => {
                await signOut({
                  callbackUrl: "/",
                })
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link href="/login" type="button" className="btn btn-primary">
            Sign In
          </Link>
        )}
      </nav>
    </>
  );
}
export default Navbar;
