"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Phone,
  MapPin,
  Users,
  Activity,
  BookOpen,
  MessageCircle,
  ChevronRight,
  Sun,
  Menu,
  X,
  Heart,
  Sparkles,
  Cloud,
  Star,
  ToyBrick,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const phoneNumber = "09286815672";

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === "f" || e.key === "F")) {
        e.preventDefault();
        router.push("/dashboard");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  const services = [
    {
      title: "School Readiness",
      description:
        "Play-based programs that prepare your little one for the big steps of formal schooling.",
      icon: <Sparkles className="w-8 h-8 text-slate-900" />,
      color: "bg-amber-300",
      tag: "Playschool",
    },
    {
      title: "Speech Therapy",
      description:
        "Developing communication skills and confidence through engaging, child-led activities.",
      icon: <MessageCircle className="w-8 h-8 text-slate-900" />,
      color: "bg-emerald-300",
      tag: "Expert-Led",
    },
    {
      title: "Occupational Therapy",
      description:
        "Enhancing fine motor skills and sensory integration through purposeful play.",
      icon: <Activity className="w-8 h-8 text-slate-900" />,
      color: "bg-sky-300",
      tag: "Specialized",
    },
    {
      title: "SPED Programs",
      description:
        "Tailored educational support designed specifically for unique learning journeys.",
      icon: <Heart className="w-8 h-8 text-slate-900" />,
      color: "bg-rose-300",
      tag: "Individualized",
    },
    {
      title: "Group Programs",
      description:
        "Social interaction and peer learning in a safe, fun, and supportive environment.",
      icon: <Users className="w-8 h-8 text-slate-900" />,
      color: "bg-indigo-300",
      tag: "Social Growth",
    },
    {
      title: "Play School",
      description:
        "Play-based programs that prepare your little one for the big steps of formal schooling.",
      icon: <ToyBrick className="w-8 h-8 text-slate-900" />,
      color: "bg-amber-300",
      tag: "Playschool",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFBF0] font-sans text-slate-900 selection:bg-rose-300 selection:text-slate-900 overflow-x-hidden">
      {/* Playful Graph Paper Background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      {/* Floating Pill Navigation */}
      <div className="fixed top-6 left-0 right-0 z-50 px-4 pointer-events-none">
        <nav className="max-w-6xl mx-auto pointer-events-auto bg-white border-4 border-slate-900 rounded-full px-4 py-3 flex justify-between items-center shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all">
          <div className="flex items-center pl-2">
            <Logo showBadge />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <a
              href="#services"
              className="text-slate-900 font-bold hover:-translate-y-1 transition-transform"
            >
              Programs
            </a>
            <a
              href="#about"
              className="text-slate-900 font-bold hover:-translate-y-1 transition-transform"
            >
              Our Hub
            </a>
            <a
              href={`tel:${phoneNumber}`}
              className="flex items-center space-x-2 bg-yellow-400 text-slate-900 px-6 py-2.5 rounded-full font-black border-2 border-slate-900 hover:bg-yellow-300 transition-all shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[2px]"
            >
              <Phone size={18} />
              <span>{phoneNumber}</span>
            </a>
          </div>

          <button
            className="md:hidden bg-slate-100 p-2 rounded-full border-2 border-slate-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-4 right-4 pointer-events-auto bg-white border-4 border-slate-900 rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex flex-col space-y-4 animate-in slide-in-from-top-4">
            <a
              href="#services"
              className="text-xl font-black text-center py-2 border-b-2 border-slate-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Programs
            </a>
            <a
              href="#about"
              className="text-xl font-black text-center py-2 border-b-2 border-slate-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Our Hub
            </a>
            <a
              href={`tel:${phoneNumber}`}
              className="bg-yellow-400 text-slate-900 p-4 rounded-xl font-black border-4 border-slate-900 text-center text-xl flex justify-center items-center gap-2"
            >
              <Phone size={24} /> Call Us
            </a>
          </div>
        )}
      </div>

      {/* Hero Section */}
      <header className="relative pt-40 pb-20 px-4 min-h-[90vh] flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10 w-full">
          <div className="inline-flex items-center space-x-2 bg-rose-300 px-6 py-2 rounded-full border-4 border-slate-900 text-slate-900 font-black text-sm uppercase tracking-widest shadow-[4px_4px_0_0_rgba(15,23,42,1)] mb-8 transform -rotate-2 hover:rotate-0 transition-transform cursor-default">
            <Star size={18} className="fill-slate-900" />
            <span>Welcome to the fun!</span>
            <Star size={18} className="fill-slate-900" />
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black text-slate-900 mb-6 leading-[0.9] tracking-tighter drop-shadow-[6px_6px_0px_rgba(253,224,71,1)]">
            HELP YOUR <br />
            <span className="text-white relative inline-block">
              <span className="absolute -inset-2 bg-blue-500 rounded-[3rem] border-4 border-slate-900 shadow-[8px_8px_0_0_rgba(15,23,42,1)] -z-10 transform rotate-1"></span>
              CHILD SHINE
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl md:text-3xl text-slate-700 mb-12 font-bold leading-relaxed mt-10">
            Expert-led play, therapy, and learning tailored for every unique
            little star.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 items-center">
            <a
              href="#services"
              className="bg-emerald-400 text-slate-900 border-4 border-slate-900 px-10 py-5 rounded-full font-black text-xl hover:bg-emerald-300 transition-all shadow-[8px_8px_0_0_rgba(15,23,42,1)] hover:shadow-[4px_4px_0_0_rgba(15,23,42,1)] hover:translate-y-[4px] hover:translate-x-[4px] w-full sm:w-auto"
            >
              EXPLORE PROGRAMS
            </a>
          </div>
        </div>

        {/* Decorative Floating Elements */}
        <Cloud
          className="absolute top-32 left-10 w-32 h-32 text-white fill-white drop-shadow-[4px_4px_0_rgba(15,23,42,1)] animate-float hidden md:block"
          strokeWidth={1}
        />
        <Cloud
          className="absolute top-40 right-20 w-40 h-40 text-white fill-white drop-shadow-[4px_4px_0_rgba(15,23,42,1)] animate-float-delayed hidden lg:block"
          strokeWidth={1}
        />
        <Star
          className="absolute bottom-32 left-1/4 w-16 h-16 text-yellow-400 fill-yellow-400 drop-shadow-[4px_4px_0_rgba(15,23,42,1)] animate-wiggle hidden md:block"
          strokeWidth={2}
          stroke="currentColor"
        />
        <Sun
          className="absolute top-1/2 right-1/4 w-20 h-20 text-orange-400 fill-orange-400 drop-shadow-[4px_4px_0_rgba(15,23,42,1)] animate-spin-slow hidden md:block"
          strokeWidth={2}
          stroke="currentColor"
        />
      </header>

      {/* Programs Section */}
      <section id="services" className="py-24 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight drop-shadow-[4px_4px_0_rgba(244,114,182,1)]">
                OUR PROGRAMS
              </h2>
            </div>
            <div className="bg-white border-4 border-slate-900 px-6 py-3 rounded-full shadow-[4px_4px_0_0_rgba(15,23,42,1)] font-bold">
              Designed for ages 2-10 🎨
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className={`group relative ${service.color} border-4 border-slate-900 p-8 rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] transition-all duration-300 flex flex-col h-full`}
              >
                <div className="bg-white border-4 border-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] group-hover:rotate-12 transition-transform">
                  {service.icon}
                </div>

                <div className="absolute top-6 right-6 bg-white border-2 border-slate-900 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-slate-900 shadow-[2px_2px_0_0_rgba(15,23,42,1)] transform rotate-3">
                  {service.tag}
                </div>

                <h3 className="text-3xl font-black text-slate-900 mb-4 leading-tight uppercase">
                  {service.title}
                </h3>

                <p className="text-slate-800 text-lg font-bold leading-relaxed mb-8 flex-grow">
                  {service.description}
                </p>

                <div className="mt-auto inline-flex items-center justify-between w-full bg-white border-4 border-slate-900 rounded-full px-6 py-3 shadow-[4px_4px_0_0_rgba(15,23,42,1)] group-hover:bg-slate-900 group-hover:text-white transition-colors cursor-pointer">
                  <span className="font-black uppercase text-sm tracking-wider">
                    Learn More
                  </span>
                  <ChevronRight size={20} className="stroke-[3px]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fun Divider */}
      <div className="w-full h-12 bg-[#FFFBF0] overflow-hidden flex whitespace-nowrap border-y-4 border-slate-900 relative z-20">
        <div className="animate-marquee flex items-center bg-yellow-300 w-full py-2">
          {[...Array(10)].map((_, i) => (
            <span
              key={i}
              className="text-xl font-black uppercase mx-8 flex items-center text-slate-900"
            >
              <Star className="inline mr-4 fill-slate-900" size={16} />
              Every Child is a Star
            </span>
          ))}
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="py-24 px-4 bg-sky-300">
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image/Blob Area */}
            <div className="relative h-full min-h-[400px]">
              <div className="absolute inset-0 bg-yellow-400 border-4 border-slate-900 rounded-[4rem] transform -rotate-3 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)]"></div>
              <div className="absolute inset-0 bg-white border-4 border-slate-900 rounded-[4rem] transform rotate-2 p-10 flex flex-col justify-center text-center">
                <Heart
                  className="w-24 h-24 mx-auto text-rose-400 fill-rose-400 drop-shadow-[4px_4px_0_rgba(15,23,42,1)] mb-6 animate-pulse"
                  strokeWidth={2}
                  stroke="currentColor"
                />
                <h3 className="text-4xl font-black uppercase mb-4">
                  A Safe Place To Grow
                </h3>
                <p className="text-xl font-bold text-slate-700">
                  Our hub is designed to feel like a second home. Bright colors,
                  soft corners, and expert care ensure your child loves every
                  minute of learning.
                </p>
              </div>
            </div>

            {/* Text Content */}
            <div className="bg-white border-4 border-slate-900 rounded-[4rem] p-10 md:p-16 shadow-[12px_12px_0_0_rgba(15,23,42,1)]">
              <h2 className="text-5xl md:text-6xl font-black mb-8 leading-none uppercase drop-shadow-[3px_3px_0_rgba(56,189,248,1)]">
                The Sunshine <br /> Difference
              </h2>
              <ul className="space-y-6">
                {[
                  { text: "Safe & Colorful Spaces", color: "bg-rose-300" },
                  { text: "Play-Based Techniques", color: "bg-emerald-300" },
                  { text: "Caring Expert Staff", color: "bg-amber-300" },
                  { text: "Family-Centered", color: "bg-indigo-300" },
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center space-x-6 text-2xl font-black border-2 border-slate-900 p-4 rounded-2xl shadow-[4px_4px_0_0_rgba(15,23,42,1)] bg-slate-50"
                  >
                    <div
                      className={`${item.color} w-12 h-12 rounded-xl border-4 border-slate-900 flex items-center justify-center shrink-0`}
                    >
                      <Sun
                        size={24}
                        className="text-slate-900"
                        strokeWidth={3}
                      />
                    </div>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Big Footer CTA */}
      <footer
        id="contact"
        className="py-24 px-4 bg-rose-400 relative border-t-4 border-slate-900 overflow-hidden"
      >
        {/* Decorative Background Stars */}
        <Star className="absolute top-10 left-10 w-24 h-24 text-rose-500 fill-rose-500 opacity-50" />
        <Star className="absolute bottom-10 right-10 w-32 h-32 text-rose-500 fill-rose-500 opacity-50" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="bg-white border-4 border-slate-900 rounded-[4rem] p-12 md:p-20 shadow-[16px_16px_0_0_rgba(15,23,42,1)] transform -rotate-1 hover:rotate-0 transition-transform">
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 uppercase tracking-tight">
              Ready To <br /> Play & Learn?
            </h2>
            <p className="text-2xl font-bold text-slate-700 mb-12">
              Give us a call to schedule a visit!
            </p>

            <a
              href={`tel:${phoneNumber}`}
              className="inline-block bg-yellow-400 border-4 border-slate-900 px-8 py-6 rounded-[2.5rem] shadow-[8px_8px_0_0_rgba(15,23,42,1)] hover:shadow-[4px_4px_0_0_rgba(15,23,42,1)] hover:translate-y-[4px] hover:translate-x-[4px] transition-all group"
            >
              <span className="flex items-center justify-center gap-4 text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
                <Phone className="w-10 h-10 md:w-14 md:h-14 fill-slate-900 group-hover:animate-wiggle" />
                {phoneNumber}
              </span>
            </a>

            <div className="flex items-center justify-center space-x-3 mt-10 text-slate-900 font-black uppercase tracking-wider text-xl">
              <MapPin size={28} className="fill-rose-300" />
              <span>Visit Our Hub Today!</span>
            </div>
          </div>

          <div className="mt-16 font-bold uppercase text-slate-900 tracking-widest text-sm bg-white/50 py-4 px-8 rounded-full border-4 border-slate-900 inline-block shadow-[4px_4px_0_0_rgba(15,23,42,1)]">
            &copy; {new Date().getFullYear()} SUNSHINE LEARNING HUB
          </div>
        </div>
      </footer>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float 6s ease-in-out 3s infinite; }
        .animate-wiggle { animation: wiggle 3s ease-in-out infinite; }
        .animate-marquee { animation: marquee 20s linear infinite; width: max-content; }
      `,
        }}
      />
    </div>
  );
};

export default App;
