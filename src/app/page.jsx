import Image from "next/image";
import Carousel from "../components/Carousel";
import TeamMemberCard from "../components/TeamMemberCard";
import localFont from "next/font/local";

const conthrax = localFont({
  src: "../../public/fonts/Conthrax-SemiBold.otf",
  variable: "--font-conthrax",
  display: "swap",
});

const teamMembers = [
  {
    name: "NASER AHMAD",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    githubUrl: "https://github.com",
  },
  {
    name: "SOUMYADEEP KUNDU",
    image:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=600&fit=crop",
    githubUrl: "https://github.com",
  },
  {
    name: "SARAH JOHNSON",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop",
    githubUrl: "https://github.com",
  },
  {
    name: "ALEX CHEN",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop",
    githubUrl: "https://github.com",
  },
  {
    name: "MARIA GARCIA",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop",
    githubUrl: "https://github.com",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen py-6 overflow-y-hidden w-full">
      {/* Header Buttons */}
      {/* <header className="flex justify-end items-center gap-3 sm:gap-4 mb-6">
        <button className="px-5 sm:px-8 py-2 sm:py-2.5 border-2 border-gray-300 text-gray-300 rounded-full font-medium hover:bg-gray-300 hover:text-slate-900 transition-all duration-300 text-sm sm:text-base">
          Sign Up
        </button>
        <button className="px-5 sm:px-8 py-2 sm:py-2.5 border-2 border-gray-300 text-gray-300 rounded-full font-medium hover:bg-gray-300 hover:text-slate-900 transition-all duration-300 text-sm sm:text-base">
          Sign In
        </button>
      </header> */}

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row justify-center items-center text-center md:text-left py-4 px-2 sm:px-6 md:px-10 m-4 sm:m-6 gap-10 md:gap-14">
        <div className="flex justify-center">
          <Image
            src="/images/logo.png"
            alt="Description"
            width={500}
            height={300}
            className="w-64 sm:w-96 md:w-[30rem] lg:w-[34rem] h-auto"
          />
        </div>

        <div
          className={`flex flex-col justify-center items-center md:items-start space-y-4 ${conthrax.className }`}
        >
          <h1 className="font-semibold text-6xl sm:text-7xl md:text-8xl text-white leading-tight">
            K-1000
          </h1>
          <h2 className="font-medium text-3xl sm:text-4xl md:text-4xl text-white">
            Manager Project
          </h2>
        </div>
      </section>

      {/* Description */}
      <section className="flex justify-center px-4 sm:px-8 md:px-12">
        <p className="text-center text-gray-400 text-base sm:text-lg leading-relaxed italic max-w-3xl">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
          facilisi. Aenean in lorem vel sapien tincidunt sagittis ut et lectus.
          Proin sit amet eros vitae justo tincidunt fermentum vitae sed nisi.
        </p>
      </section>

      {/* Team Section */}
      <div className="min-h-screen py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-[#ffffff] mb-16 text-left">
            Team Members:
          </h1>

          <Carousel autoPlay={true} interval={4000}>
            {teamMembers.map((member, index) => (
              <TeamMemberCard
                key={index}
                name={member.name}
                image={member.image}
                githubUrl={member.githubUrl}
              />
            ))}
          </Carousel>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-[#091F2A] w-full via-[#0E2F3F] to-[#274F62] text-white py-8">
        <div className="max-w-6xl mx-auto px-6">
          {/* Main row — evenly distribute links and social icons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
            {/* Navigation Links */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-6 text-sm sm:text-base">
              <a href="#" className="hover:text-gray-300">
                Home
              </a>
              <a href="#" className="hover:text-gray-300">
                About us
              </a>
              <a href="#" className="hover:text-gray-300">
                Contact us
              </a>
              <a href="#" className="hover:text-gray-300">
                Sign up
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center sm:justify-end gap-6 text-2xl">
              <a href="#" className="hover:text-gray-300">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" className="hover:text-gray-300">
                <i className="fa-brands fa-linkedin"></i>
              </a>
              <a href="#" className="hover:text-gray-300">
                <i className="fa-brands fa-whatsapp"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
