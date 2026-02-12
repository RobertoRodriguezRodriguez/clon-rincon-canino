import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <>
      <section className="flex flex-col px-7 w-full h-screen bg-gray-900">
        <div className="my-auto mx-auto max-w-screen-xl">
          <div className="mx-auto max-w-screen-sm ">
            <h1 className="mb-4 text-7xl text-center tracking-tight font-extrabold lg:text-9xl text-sky-400">
              404
            </h1>
            <h2 className="mb-4 text-3xl text-center tracking-tight font-bold text-sky-400 md:text-4xl">
              Algo ha ido mal...
            </h2>
            <p className="mb-4 sm:text-center text-lg font-light text-gray-300">
              Lo siento, no podemos encontrar esa página. Encontrarás mucho que
              explorar en la página de inicio.
            </p>
            <div className="text-center">
              <Link
                to="/"
                className="inline-flex text-white bg-sky-600 hover:bg-sky-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4"
              >
                Volver a la página principal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
