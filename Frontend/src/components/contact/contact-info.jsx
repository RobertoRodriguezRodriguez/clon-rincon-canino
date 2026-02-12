export default function ContactInfo() {
  return (
    <section className="pt-14 sm:pt-12">
      <div className="py-8 px-4 mx-auto max-w-screen-lg sm:py-16 lg:px-6">
        <div className=" mb-8 lg:mb-16 mx-auto text-center">
          <h2 className="mb-4 text-5xl tracking-tight font-extrabold text-gray-900">
            Bienvenidos a Mi Rincón Canino
          </h2>
          <h3 className="mb-4 text-2xl tracking-tight font-extrabold text-gray-900">
            Soy Nazaret, tu Adiestradora de Perros Comprometida
          </h3>
          <p className="text-gray-500 sm:text-xl">
            Sumérgete en la experiencia de la Educación Canina conmigo. Aquí
            tienes mis detalles de contacto para que juntos iniciemos el camino
            hacia una relación más sólida y feliz con tu leal compañero de
            cuatro patas.
          </p>
        </div>
        <div className="shadow-2xl mb-6 space-y-6 pb-8 pt-6 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0 text-center">
          <div>
            <div className="flex mx-auto justify-center items-center w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold">Teléfono</h3>
            <p className="text-gray-500">(+34) 123 456 789</p>
          </div>
          <div>
            <div className="flex mx-auto justify-center items-center w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold">Correo electrónico</h3>
            <p className="text-gray-500">info@nombreadiestradora.com</p>
          </div>
          <div>
            <div className="flex mx-auto justify-center items-center w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold">Dirección</h3>
            <p className="text-gray-500">Calle Principal, Ciudad, País</p>
          </div>
        </div>
      </div>
    </section>
  );
}
