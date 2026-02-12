import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="bg-zinc-900">
      <footer className="text-gray-600 body-font mx-4">
        <div className="container py-3 mx-auto flex items-center sm:flex-row flex-col">
          <Link
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
              RincónCanino
            </span>
          </Link>
          <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
            © 2024 E-ASY
          </p>
          <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
            <div className="ml-3 text-white">
              <a href="https://es.linkedin.com/company/insideeasy">
                <svg
                  fill="currentColor"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="0"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="none"
                    d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
                  ></path>
                  <circle cx="4" cy="4" r="2" stroke="none"></circle>
                </svg>
              </a>
            </div>
          </span>
        </div>
      </footer>
    </div>
  );
}
