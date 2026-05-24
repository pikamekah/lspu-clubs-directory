import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-4 shadow-md">

      <h1 className="text-xl font-bold text-green-700">
        LSPU Clubs
      </h1>

      <div className="flex gap-6">
        <Link href="/">Home</Link>
        <Link href="/organizations">Organizations</Link>
        <Link href="/events">Events</Link>
        <Link href="/admin">Admin</Link>
      </div>

    </nav>
  );
}