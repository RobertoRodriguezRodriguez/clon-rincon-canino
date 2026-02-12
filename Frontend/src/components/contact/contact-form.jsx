export default function ContactForm() {
  return (
    <section>
      <div className="pb-10 sm:pt-10 px-4 mx-auto max-w-screen-lg">
        <h2 className="mb-4 text-4xl sm:pt-0 pt-8 tracking-tight font-extrabold text-center text-gray-900">
          Contáctame
        </h2>
        <p className="mb-8 lg:mb-10 font-light text-center text-gray-500 sm:text-xl">
          ¡No dudes en llamarme, escribirme o visitarme! Estoy aquí para
          responder a todas tus preguntas y ayudarte en el viaje hacia una
          convivencia armoniosa con tu querido amigo canino.
        </p>
        <form action="#" className="space-y-8">
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Tu correo electrónico
            </label>
            <input
              type="email"
              id="email"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
              placeholder="ejemplo@gmail.com"
              required
            />
          </div>
          <div>
            <label
              htmlFor="subject"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Asunto
            </label>
            <input
              type="text"
              id="subject"
              className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
              placeholder="Déjame saber en qué puedo ayudarte"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="message"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Tu mensaje
            </label>
            <textarea
              id="message"
              rows="6"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Deja un mensaje..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-blue-700 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300"
          >
            Enviar mensaje
          </button>
        </form>
      </div>
    </section>
  );
}
