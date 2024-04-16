import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-screen">
      <section className="bg-gradient-to-r from-custom-dark to-custom-green text-white p-40">
        <div className="container mx-auto flex flex-wrap items-center">
          <div className="w-full md:w-1/2">
            <h1 className="text-4xl font-bold">
              Welcome to Evergreen Trust Bank
            </h1>
            <p className="text-lg mt-4">
              Experience financial excellence with our trusted guidance and
              seamless banking solutions.
            </p>
            <Link href="/create">
              <button className="bg-white text-custom-dark font-bold py-2 px-4 rounded-lg m-4">
                Register Now
              </button>
            </Link>
          </div>
          <div className="w-full md:w-1/2"></div>
        </div>
      </section>
    </main>
  );
}
