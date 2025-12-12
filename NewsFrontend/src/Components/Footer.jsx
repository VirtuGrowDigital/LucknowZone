import Logo from "../assets/Images/Logo.png";

export default function Footer() {
  return (
    <footer
      className="bg-[#F7F8FA] pt-6 pb-2"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div
        className="max-w-7xl mx-2 px-6 grid grid-cols-1 
                      md:grid-cols-[1.5fr_1fr_auto] gap-10"
      >
        {/* Logo + Description */}
        <div>
          <img
            src={Logo}
            alt="Logo"
            className="h-12 md:h-18 w-auto object-contain"
          />
          <br />

          <p className="text-gray-600 text-lg font-light leading-relaxed max-w-xl">
            Your daily source for the latest news and stories
            <br />
            from Lucknow.
          </p>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-gray-900 font-semibold text-lg mb-4">SUPPORT</h3>
          <ul className="space-y-3 text-gray-600 text-lg">
            <li className="hover:text-gray-900 font-light cursor-pointer">
              About Us
            </li>
            <li className="hover:text-gray-900 font-light cursor-pointer">
              Contact
            </li>
            <li className="hover:text-gray-900 font-light cursor-pointer">
              Careers
            </li>
          </ul>
        </div>

        {/* Social */}
        <div className="ml-auto">
          <h3 className="text-gray-900 font-semibold text-lg mb-4">
            FOLLOW US
          </h3>

          <ul className="space-y-3 text-gray-600 text-lg">
            <li>
              <a
                href="https://www.facebook.com/people/Lucknowzonenewsin/100069759835552/#"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900 font-light cursor-pointer"
              >
                Facebook
              </a>
            </li>

            <li>
              <a
                href="https://www.instagram.com/lucknowzonenews.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900 font-light cursor-pointer"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto mt-8 mb-4 px-6">
        <div className="border-t border-gray-200"></div>
      </div>

      {/* Bottom text */}
      <p className="text-center text-gray-500 text-sm">
        © 2024 Lucknow Zone News. All Rights Reserved.
      </p>
    </footer>
  );
}
