"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// Removed ModelViewer and HeroSaturn imports to avoid conflicts

import Blackhole from "./components/Blackhole"; // Ensure this is imported

import Navbar from "./components/Navbar"
import dynamic from "next/dynamic";
const BlackholeDynamic = dynamic(() => import("./components/Blackhole"), {
  ssr: false,
  loading: () => <div style={{height: 420}} />
});

// Custom hook for typing effect
const useTypingEffect = (text, speed = 50, startDelay = 0) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);



  const startTyping = () => {
    if (hasStarted) return;
    setHasStarted(true);
    setIsTyping(true);

    setTimeout(() => {
      let index = 0;
      const timer = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(timer);
        }
      }, speed);
    }, startDelay);
  };

  return { displayedText, isTyping, startTyping, hasStarted };
};

export default function Home() {
  const [lightboxData, setLightboxData] = useState(null);

  // Typing effect states for project descriptions
  const classCastDescription = "A real-time video note-taking web app where you paste a video URL, create timeline notes and detailed notes, and share them with friends. Includes built-in chat and live collaboration for study groups and classrooms.";
  const snapShoprDescription = "A hyper-local marketplace web app where users can buy and sell products within their community. It enables secure listings, direct messaging between buyers and sellers, and a smooth shopping experience.";

  const classCastTyping = useTypingEffect(classCastDescription, 30, 200);
  const snapShoprTyping = useTypingEffect(snapShoprDescription, 30, 200);

  // Animation states for project images
  const [classCastImageVisible, setClassCastImageVisible] = useState(false);
  const [snapShoprImageVisible, setSnapShoprImageVisible] = useState(false);

  // Animation states for skills section
  const [languagesVisible, setLanguagesVisible] = useState(false);
  const [frameworksVisible, setFrameworksVisible] = useState(false);
  const [toolsVisible, setToolsVisible] = useState(false);
  const [designVisible, setDesignVisible] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showLink, setShowLink] = useState(false);


  // Define image arrays for each project
  const classCastImages = [
    { src: "/cc1.png", alt: "ClassCast Screenshot 1" },
    { src: "/cc2.png", alt: "ClassCast Screenshot 2" },
    { src: "/cc3.png", alt: "ClassCast Screenshot 3" },
    { src: "/cc4.png", alt: "ClassCast Screenshot 4" },
    { src: "/cc5.png", alt: "ClassCast Screenshot 5" },
    { src: "/cc6.png", alt: "ClassCast Screenshot 6" }
  ];

  const snapShoprImages = [
    { src: "/ss1.png", alt: "SnapShopr Screenshot 1" },
    { src: "/ss2.png", alt: "SnapShopr Screenshot 2" },
    { src: "/ss3.png", alt: "SnapShopr Screenshot 3" },
    { src: "/ss4.png", alt: "SnapShopr Screenshot 4" }
  ];
  const [mountBlackhole, setMountBlackhole] = useState(false);

  useEffect(() => {
    const start = () => setMountBlackhole(true);
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      requestIdleCallback(start, { timeout: 2000 });
    } else {
      const t = setTimeout(start, 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const openLightbox = (imageSrc, imageAlt, projectImages) => {
    const currentIndex = projectImages.findIndex(img => img.src === imageSrc);
    setLightboxData({
      images: projectImages,
      currentIndex: currentIndex,
      currentImage: projectImages[currentIndex]  // ✅ fixed
    });
  };
  const handleGmailClick = (e) => {
    // Prevent the default link behavior
    e.preventDefault();
    setShowEmail(!showEmail);
  };
  const handleLinkClick = (e) => {
    // Prevent the default link behavior
    e.preventDefault();
    setShowLink(!showLink);
  };

  const closeLightbox = () => {
    setLightboxData(null);
  };

  const navigateImage = (direction) => {
    if (!lightboxData) return;

    const { images, currentIndex } = lightboxData;
    let newIndex;

    if (direction === 'next') {
      newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    }

    setLightboxData({
      ...lightboxData,
      currentIndex: newIndex,
      currentImage: images[newIndex]
    });
  };

  const [currentSection, setCurrentSection] = useState("hero");

  const heroRef = useRef();
  const projectsRef = useRef();
  const classcastRef = useRef();
  const snapshoprRef = useRef();
  const skillsRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSection(entry.target.id);

            // Trigger typing effects and image animations when projects come into view
            if (entry.target.id === 'classcast') {
              classCastTyping.startTyping();
              // Delay image animation to start after typing begins
              setTimeout(() => {
                setClassCastImageVisible(true);
              }, 400);
            } else if (entry.target.id === 'snapshopr') {
              snapShoprTyping.startTyping();
              // Delay image animation to start after typing begins
              setTimeout(() => {
                setSnapShoprImageVisible(true);
              }, 400);
            } else if (entry.target.id === 'skills') {
              // Trigger skills animations with staggered delays
              setTimeout(() => setLanguagesVisible(true), 200);
              setTimeout(() => setToolsVisible(true), 400);
              setTimeout(() => setFrameworksVisible(true), 600);
              setTimeout(() => setDesignVisible(true), 800);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    [heroRef, projectsRef, classcastRef, snapshoprRef, skillsRef].forEach(
      (ref) => {
        if (ref.current) observer.observe(ref.current);
      }
    );

    return () => observer.disconnect();
  }, [classCastTyping, snapShoprTyping]);


  return (
    <div className="bg-black text-white font-[family-name:var(--font-raleway)]">
      {/* Blackhole component moved to the top level */}


      {/* Lightbox Modal */}
      {lightboxData && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-7xl max-h-full flex items-center">
            {/* Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('prev');
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full w-14 h-14 flex items-center justify-center"
            >
              ‹
            </button>

            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
            >
              ×
            </button>

            {/* Image */}
            <img
              src={lightboxData.currentImage.src}
              alt={lightboxData.currentImage.alt}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('next');
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full w-14 h-14 flex items-center justify-center"
            >
              ›
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full">
              {lightboxData.currentIndex + 1} / {lightboxData.images.length}
            </div>
          </div>
        </div>
      )}
      {/* Navbar */}
      {/* <Navbar /> */}
      {/* Hero Section */}
      <section id="hero" ref={heroRef} className="flex flex-col md:flex-col items-center justify-between px-4 sm:px-8 py-7 relative h-screen font-[family-name:var(--font-montserrat)]">
      <Navbar />
        {/* <Blackhole /> */}
        {mountBlackhole && <BlackholeDynamic />}
        <div className="md:w-1/2 space-y-4 z-20 mx-auto mt- md:ml-10 mb-16 md:mt-35 md:mb-32">
          <h1 className="text-xl sm:text-2xl mt-16 md:mt-0">I’m</h1>
          <h2 className="text-4xl sm:text-6xl font-bold">Ayaan</h2>
          <p className="text-gray-300 text-sm max-w-lg md:mt-20 md:mb-10">
            A MERN stack developer focused on solving real-world
            problems by building interactive 3D web 
            experiences and real-time platforms.sses,
          </p>
          <p className="text-lg">MERN Stack Developer</p>
        </div>

        <div className="md:w-1/2 relative flex justify-center items-center">
          {/* Yellow curved border */}
          {/* <div className="absolute w-[300px] h-[300px] border-t-2 border-r-2 border-yellow-400 rounded-bl-[100%] top-0 right-0"></div> */}
          {/* Removed HeroSaturn related elements from here */}
          <section className="h-screen relative overflow-hidden" ref={heroRef}>
          </section>
        </div>

      </section>

      {/* Projects Section */}
      <section id="projects" ref={projectsRef} className="px-4 sm:px-8 py-16 h-fit">
        <div className="flex flex-col items-center align-middle mb-10 sm:mb-20">
          <h2 className="text-4xl sm:text-5xl mb-4">Projects</h2>
          <p className="text-gray-300 mb-8 max-w-2xl text-center">
            Here are some of my recent works — crafted with attention to detail,
            clean code, and a focus on user experience. Each project challenged me
            to think creatively, solve problems, and improve my technical skills.
          </p>
        </div>

        <div className="flex flex-col gap-16">
          {/* Project 1 - ClassCast */}
          <div id="classcast" ref={classcastRef} className="flex flex-col lg:flex-row items-center gap-8 mb-20">
            <div className={`bg-[#38394a] p-4 sm:p-6 rounded-xl w-full lg:w-1/2 transition-all duration-1000 ease-out ${classCastImageVisible
              ? 'transform translate-y-0 opacity-100'
              : 'transform translate-y-20 opacity-0'
              }`}>
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={10}
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={{ delay: 2000 }}
                className="rounded-xl"
              >
                <SwiperSlide>
                  <img
                    src="/cc1.png"
                    alt="ClassCast Screenshot 1"
                    className="rounded-xl w-full h-fit object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onError={(e) => { e.target.src = "/placeholder-project1.png" }}
                    onClick={() => openLightbox("/cc1.png", "ClassCast Screenshot 1", classCastImages)}
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="/cc2.png"
                    alt="ClassCast Screenshot 2"
                    className="rounded-xl w-full h-fit object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onError={(e) => { e.target.src = "/placeholder-project1.png" }}
                    onClick={() => openLightbox("/cc2.png", "ClassCast Screenshot 2", classCastImages)}
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="/cc3.png"
                    alt="ClassCast Screenshot 3"
                    className="rounded-xl w-full h-fit object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onError={(e) => { e.target.src = "/placeholder-project1.png" }}
                    onClick={() => openLightbox("/cc3.png", "ClassCast Screenshot 3", classCastImages)}
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="/cc4.png"
                    alt="ClassCast Screenshot 4"
                    className="rounded-xl w-full h-fit object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onError={(e) => { e.target.src = "/placeholder-project1.png" }}
                    onClick={() => openLightbox("/cc4.png", "ClassCast Screenshot 4", classCastImages)}
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="/cc5.png"
                    alt="ClassCast Screenshot 5"
                    className="rounded-xl w-full h-fit object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onError={(e) => { e.target.src = "/placeholder-project1.png" }}
                    onClick={() => openLightbox("/cc5.png", "ClassCast Screenshot 5", classCastImages)}
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="/cc6.png"
                    alt="ClassCast Screenshot 6"
                    className="rounded-xl w-full h-fit object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onError={(e) => { e.target.src = "/placeholder-project1.png" }}
                    onClick={() => openLightbox("/cc6.png", "ClassCast Screenshot 6", classCastImages)}
                  />
                </SwiperSlide>
              </Swiper>
            </div>
            <div className="w-full lg:w-1/2 lg:ml-8 mt-8 lg:mt-0">
              <div className="flex justify-center">
                <h3 className="text-3xl sm:text-4xl mb-2">ClassCast</h3>
              </div>
              <div className="">
                <span>
                  <div className="flex flex-col sm:flex-row text-gray-300 ">
                    <p className="text-xl font-bold">Problem:</p> <p className="mb-2 ml-0 sm:ml-2 text-center sm:text-left">Students struggle to take notes and collaborate effectively during online lectures.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row text-gray-300">
                    <p className="text-xl font-bold">Solution:</p> <p className="mb-2 ml-0 sm:ml-2 text-center sm:text-left">I built ClassCast, a real-time note-taking platform where students can add timeline-based notes
                      to videos, share them with classmates, and revisit lectures more effectively.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row text-gray-300">
                    <p className="text-xl font-bold">Impact:</p> <p className="mb-2 ml-0 sm:ml-2 text-center sm:text-left">Improved study collaboration and reduced missed information during online learning sessions.</p>
                  </div>

                </span>
              </div>
              <h3 className="text-xl mb-2">Tech Stack</h3>
              <div className="text-gray-300 mb-4">
                <p>React • Node.js • Express • MongoDB • Next.js</p>
              </div>
              <h3 className="text-xl mb-2">Features</h3>
              <p className="mb-4">Timeline & detailed notes, share with friends, real-time chat, role-based access, responsive UI</p>
              <h3 className="text-xl mb-2">Demo</h3>
              <p><a href="https://classcast.vercel.app/" className="text-blue-400 hover:text-blue-300">Link</a></p>
            </div>
          </div>

          {/* Project 2 - SnapShopr */}
          <div id="snapshopr" ref={snapshoprRef} className="flex flex-col lg:flex-row-reverse items-center gap-8 mb-10">
            <div className={`bg-[#38394a] p-4 sm:p-6 rounded-xl w-full lg:w-1/2 transition-all duration-1000 ease-out ${snapShoprImageVisible
              ? 'transform translate-y-0 opacity-100'
              : 'transform translate-y-20 opacity-0'
              }`}>
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={10}
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={{ delay: 1500 }}
                className="rounded-xl"
              >
                <SwiperSlide>
                  <img
                    src="/ss1.png"
                    alt="SnapShopr Screenshot 1"
                    className="rounded-xl w-full h-fit object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onError={(e) => { e.target.src = "/placeholder-project1.png" }}
                    onClick={() => openLightbox("/ss1.png", "SnapShopr Screenshot 1", snapShoprImages)}
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="/ss2.png"
                    alt="SnapShopr Screenshot 2"
                    className="rounded-xl w-full h-fit object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onError={(e) => { e.target.src = "/placeholder-project1.png" }}
                    onClick={() => openLightbox("/ss2.png", "SnapShopr Screenshot 2", snapShoprImages)}
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="/ss3.png"
                    alt="SnapShopr Screenshot 3"
                    className="rounded-xl w-full h-fit object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onError={(e) => { e.target.src = "/placeholder-project1.png" }}
                    onClick={() => openLightbox("/ss3.png", "SnapShopr Screenshot 3", snapShoprImages)}
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="/ss4.png"
                    alt="SnapShopr Screenshot 4"
                    className="rounded-xl w-full h-fit object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onError={(e) => { e.target.src = "/placeholder-project1.png" }}
                    onClick={() => openLightbox("/ss4.png", "SnapShopr Screenshot 4", snapShoprImages)}
                  />
                </SwiperSlide>
              </Swiper>
            </div>
            <div className="w-full lg:w-1/2 lg:mr-8 mt-8 lg:mt-0">
              <div className="flex justify-center">
                <h3 className="text-3xl sm:text-4xl mb-2">SnapShopr</h3>
              </div>
              <div className="">
                <span>
                  <div className="flex flex-col sm:flex-row text-gray-300 ">
                    <p className="text-xl font-bold">Problem:</p> <p className="mb-2 ml-0 sm:ml-2 text-center sm:text-left">College people often waste time searching multiple websites to find affordable products.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row text-gray-300">
                    <p className="text-xl font-bold">Solution:</p> <p className="mb-2 ml-0 sm:ml-2 text-center sm:text-left">SnapShopr is a hyper-local marketplace where students can buy/sell items quickly, with
                      real-time chat built in for smooth transactions.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row text-gray-300">
                    <p className="text-xl font-bold">Impact:</p> <p className="mb-2 ml-0 sm:ml-2 text-center sm:text-left">Helped people save money and time by simplifying campus trading into one seamless platform.</p>
                  </div>

                </span>
              </div>
              <h3 className="text-xl mb-2">Tech Stack</h3>
              <div className="text-gray-300 mb-4">
                <p>React • Node.js • Express • MongoDB • Socket.io</p>
              </div>
              <h3 className="text-xl mb-2">Features</h3>
              <p className="mb-4">User authentication, product listings with images,
                category-based browsing, direct chat between buyers &
                sellers, responsive UI</p>
              <h3 className="text-xl mb-2">Demo</h3>
              <p><a href="https://snapshopr.vercel.app/" className="text-blue-400 hover:text-blue-300">Link</a></p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" ref={skillsRef} className="px-4 sm:px-8 py-16 h-fit">
        <div className="flex flex-col items-center">
          <h2 className="text-4xl sm:text-5xl mb-3">Skills</h2>
          <p className="text-gray-300  max-w-2xl mb-10 sm:mb-20 text-center">
            A comprehensive list of my technical and soft skills,
            showcasing my proficiency in key technologies and my
            ability to collaborate effectively in a team.
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
          <div className={`bg-[#2e2e2e] rounded-xl p-6 w-full md:w-1/2 lg:w-[60%] mb-4 md:mb-0 transition-all duration-800 ease-out ${languagesVisible
            ? 'transform translate-x-0 opacity-100'
            : 'transform -translate-x-20 opacity-0'
            }`}>
            <div className="flex justify-center">
              <h2 className="text-2xl sm:text-3xl mb-2">Languages</h2>
            </div>
            <div className="flex flex-wrap gap-4 justify-center items-center">
              <div className="flex items-center gap-2 rounded-full px-4 py-2">
                <img src="/icons/js.png" alt="JavaScript" className="w-20 h-20 md:w-27 md:h-31 pt-5" />
              </div>
              <div className="flex items-center gap-2 rounded-full px-4 py-2">
                <img src="/icons/css.svg" alt="CSS" className="w-20 h-20 md:w-30 md:h-30" />
              </div>
              <div className="flex items-center gap-2 rounded-full px-4 py-2">
                <img src="/icons/html.svg" alt="HTML" className="w-20 h-20 md:w-30 md:h-30" />
              </div>
            </div>
          </div>

          <div className={`bg-[#2e2e2e] rounded-xl p-6 w-full md:w-1/2 lg:w-[35%] transition-all duration-800 ease-out ${toolsVisible
            ? 'transform translate-x-0 opacity-100'
            : 'transform translate-x-20 opacity-0'
            }`}>
            <div className="flex justify-center">
              <h2 className="text-2xl sm:text-3xl mb-8">Tools & Platforms</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-4 items-center">
              <div className="flex items-center gap-2 rounded-full px-4 py-2">
                <img src="/icons/github.svg" alt="GitHub" className="w-20 h-20 md:w-25 md:h-25" />
              </div>
              <div className="flex items-center gap-2 rounded-full px-4 py-2">
                <img src="/icons/vercel.png" alt="Vercel" className="w-40 h-8 md:w-45 md:h-10" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-4 mt-4">
          <div className={`bg-[#2e2e2e] rounded-xl p-6 w-full md:w-1/2 lg:w-[75%] mb-4 md:mb-0 transition-all duration-800 ease-out ${frameworksVisible
            ? 'transform translate-x-0 opacity-100'
            : 'transform -translate-x-20 opacity-0'
            }`}>
            <div className="flex justify-center">
              <h2 className="text-2xl sm:text-3xl mb-2">Frameworks</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-4 items-center">
              <div className="flex items-center gap-2 rounded-full px-4">
                <img src="/icons/react.svg" alt="React" className="w-20 h-20 md:w-30 md:h-30" />
              </div>
              <div className="flex items-center gap-2 rounded-full px-4">
                <img src="/icons/express.png" alt="Express" className="w-20 h-20 md:w-30 md:h-30" />
              </div>
              <div className="flex items-center gap-2 rounded-full px-4">
                <img src="/icons/next.svg" alt="Next.js" className="w-30 h-30 md:w-50 md:h-40" />
              </div>
              <div className="flex items-center gap-2 rounded-full px-4">
                <img src="/icons/mongo.svg" alt="MongoDB" className="w-30 h-30 md:w-50 md:h-40" />
              </div>
            </div>
          </div>

          <div className={`bg-[#2e2e2e] rounded-xl p-6 w-full md:w-1/2 lg:w-[25%] transition-all duration-800 ease-out ${designVisible
            ? 'transform translate-x-0 opacity-100'
            : 'transform translate-x-20 opacity-0'
            }`}>
            <div className="flex justify-center">
              <h2 className="text-2xl sm:text-3xl mb-8">Design</h2>
            </div>
            <div className="flex flex-wrap gap-4 justify-center items-center">
              <div className="flex items-center gap-2 rounded-full px-4 py-2">
                <img src="/icons/figma.svg" alt="Figma" className="w-20 h-20 md:w-25 md:h-25" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="h-screen">
        <div className="relative w-full h-full bg-black overflow-hidden flex flex-col items-center justify-center">

          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('./Moon.jpeg')` }}
          ></div>

          {/* The Connect With Me Text */}
          <div className="relative z-20 text-center">
            <h2 className="text-white text-4xl sm:text-6xl font-semibold tracking-wider mb-37 sm:mb-40 ">
              Connect With Me
            </h2>
          </div>

          {/* The Moon Cutout Image and Social Icons */}
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-end">
            {/* This image is the cutout that should be positioned over the moon */}
            <img
              src="./Mooncut.png"
              alt="Moon Cutout"
              className="absolute w-full h-auto object-cover bottom-[35%]  scale-330 md:scale-100  md:bottom-0 md:translate-x-[-37%] md:translate-y-[12%]"
              style={{
                // Use CSS to manually position the image over the moon in the background
                // You may need to adjust these values based on your exact image
                // bottom: '35%',
                left: '50%',
                transform: 'translateX(-13%)'
              }}
            />

            {/* The social icons container */}
            <div className="absolute bottom-12 sm:bottom-24 z-30 space-y-4">
              <div className="relative flex items-center">
                <button
                  onClick={handleGmailClick}
                  className={`relative z-10 transition-transform duration-500 ease-in-out ${showEmail ? 'transform -translate-x-28 sm:-translate-x-40' : 'transform translate-x-0'}`}
                  pagination={{ clickable: true }}
                >
                  <img
                    src="./gmail.svg"
                    alt="Gmail"
                    className="h-10 w-10 sm:h-13 sm:w-13"
                  />
                </button>
                <div
                  className={`absolute left-full transform -translate-x-1/2 text-white transition-all duration-500 ease-in-out overflow-hidden`}
                  style={{
                    width: showEmail ? '12rem' : '0',
                    opacity: showEmail ? '1' : '0',
                    transform: showEmail ? 'translateX(10px)' : 'translateX(0)'
                  }}
                >
                  <p className="whitespace-nowrap text-sm sm:text-lg">ayaanshoaib519@gmail.com</p>
                </div>
              </div>
              <div> Phone : 03009240732 </div>
              <div className="relative flex items-center">
                <button
                  onClick={handleLinkClick}
                  className={`relative z-10 transition-transform duration-500 ease-in-out ${showLink ? 'transform -translate-x-28 sm:-translate-x-40' : 'transform translate-x-0'}`}
                >
                  <img
                    src="./link.svg"
                    alt="LinkedIn"
                    className="h-10 w-10 sm:h-13 sm:w-13"
                  />
                </button>
                <div
                  className={`absolute left-full transform -translate-x-1/2 text-white transition-all duration-500 ease-in-out overflow-hidden`}
                  style={{
                    width: showLink ? '12rem' : '0',
                    opacity: showLink ? '1' : '0',
                    transform: showLink ? 'translateX(10px)' : 'translateX(0)'
                  }}
                >
                  <p className="whitespace-nowrap text-sm sm:text-lg">Ayaan Shoaib</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <GuideCharacter currentSection={currentSection} /> */}
    </div>
  );
}


