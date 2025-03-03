import ClientCard from '@/Components/NonPrimitive/ClientCard';
import UnauthenticatedLayout from '@/Layouts/UnauthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import customers from '@/dummyJson/customersJson';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import '../i18n.js';
import FeatureCard from '@/Components/NonPrimitive/FeatureCard.jsx';
import features from '@/dummyJson/features.jsx';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    // multilanguage code
    const languages = [
        { value: "", text: "Options" },
        { value: "en", text: "English" },
        { value: "ar", text: "Arabic" },
        { value: "es", text: "Español" },
        { value: "de", text: "Deutsch" },
    ];
    const { t } = useTranslation();

    const [lang, setLang] = useState(localStorage.getItem("selectedLang") || "en");

    useEffect(() => {
        // Apply language from localStorage on first load
        let params = new URLSearchParams(window.location.search);
        const urlLang = params.get("lng");

        if (urlLang) {
            setLang(urlLang);
            localStorage.setItem("selectedLang", urlLang);
        }
    }, []);

    const handleChange = (e) => {
        setLang(e.target.value);
        let loc = "http://leafeye.test/";
        window.location.replace(
            loc + "?lng=" + e.target.value
        );
    };

    // Responsive carousel code
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [visibleCards, setVisibleCards] = useState(3);
    const intervalRef = useRef(null);
    const carouselRef = useRef(null);

    // Responsive card count based on screen size
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setVisibleCards(1);
            } else if (window.innerWidth < 1024) {
                setVisibleCards(2);
            } else {
                setVisibleCards(3);
            }
        };

        // Set initial value
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Clean up
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const maxIndex = Math.max(0, customers.length - visibleCards);
    const autoRotateInterval = 5000;

    const nextSlide = () => {
        setCurrentIndex(prevIndex => 
            prevIndex < maxIndex ? prevIndex + 1 : 0
        );
    };
      
    const prevSlide = () => {
        setCurrentIndex(prevIndex => 
            prevIndex > 0 ? prevIndex - 1 : maxIndex
        );
    };
      
    // Set up auto-rotation
    useEffect(() => {
        // Start the interval
        if (!isPaused) {
            intervalRef.current = setInterval(() => {
                nextSlide();
            }, autoRotateInterval);
        }
        
        // Clean up on unmount or when dependencies change
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [currentIndex, isPaused, maxIndex]);
      
    // Pause auto-rotation when hovering
    const handleMouseEnter = () => {
        setIsPaused(true);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };
      
    const handleMouseLeave = () => {
        setIsPaused(false);
    };

    return (
        <>
            <Head title="Welcome" />
            <UnauthenticatedLayout>
                <select value={lang} onChange={handleChange} className='m-4'>
                    {languages.map((item) => {
                        return (
                            <option
                                key={item.value}
                                value={item.value}
                            >
                                {item.text}
                            </option>
                        );
                    })}
                </select>
                
                {/*This section is for the welcome text and the image */}
                <div className='grid md:grid-cols-2 mt-3'>
                    <div className='p-4'>
                        <h1 className='text-2xl sm:text-3xl md:text-4xl'>{t("welcome_title")}</h1>
                        <h2 className='text-lg sm:text-xl md:text-2xl font-bold'>{t("slogan")}</h2>
                        <div className='w-4/5'>
                            <p className='mt-4 text-sm sm:text-base md:text-xl'>
                                {t("welcome_text")}
                            </p>
                        </div>
                    </div>
                    <div className='flex md:justify-center ml-4'>
                        <img src="images/Welcome/7.png" alt="" className=' max-w-full h-auto'/>
                    </div>
                </div>

                {/*This section is for the features */}
                <div className="featuresSection p-4 sm:p-6 md:p-8 mt-5 relative overflow-hidden">
                    {/* Title Row - Full Width */}
                    <div className="mb-4 sm:mb-6 md:mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">{t("features_title")}</h2>
                    </div>
            
                    {/* Content Row - Two Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center">
                        {/* Left Column - Phone Images */}
                        <div className="flex justify-center relative z-10">
                            <div>
                                <img src="images/Welcome/iPhone_screen.png" alt="" srcSet="" 
                                className='max-w-full h-auto md:max-h-[50vh]'/>
                            </div>
                        </div>

                        {/* Right Column - Feature List */}
                        <div className="flex flex-col gap-4 sm:gap-6 z-10">
                            <div className="space-y-3 sm:space-y-6">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="bg-green-50 p-2 rounded-full flex-shrink-0">
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-base sm:text-xl md:text-2xl text-gray-800 line-clamp-2">{t("f1")}</p>
                                </div>
                                
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="bg-green-50 p-2 rounded-full flex-shrink-0">
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-base sm:text-xl md:text-2xl text-gray-800 line-clamp-2">{t("f2")}</p>
                                </div>
                                
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="bg-green-50 p-2 rounded-full flex-shrink-0">
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-base sm:text-xl md:text-2xl text-gray-800 line-clamp-2">{t("f3")}</p>
                                </div>
                                
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="bg-green-50 p-2 rounded-full flex-shrink-0">
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-base sm:text-xl md:text-2xl text-gray-800 line-clamp-2">{t("f4")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/**This Section is for the Clients Comments */}
                <div className='mt-5 px-4'>
                    <div className='mb-4 sm:mb-6 md:mb-8'>
                        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">{t("customer_Title")}</h2>
                    </div>
                    
                    <div 
                        className="relative" 
                        ref={carouselRef}
                    >
                        
                        
                        {/* Carousel container */}
                        <div className="overflow-hidden">
                            <div 
                                className="flex transition-transform duration-700 ease-in-out"
                                style={{ transform: `translateX(-${currentIndex * (100 / visibleCards)}%)` }}
                            >
                                {customers.map(customer => (
                                    <div 
                                        key={customer.id} 
                                        className={`flex-none px-2 ${
                                            visibleCards === 1 ? 'w-full' : 
                                            visibleCards === 2 ? 'w-1/2' : 'w-1/3'
                                        }`}
                                    >
                                        <ClientCard name={customer.name} comment={customer.comment} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Pagination indicators */}
                        <div className="flex justify-center gap-2 my-4">
                            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                                <button
                                    key={index}
                                    className={`h-2 rounded-full transition-all ${
                                        currentIndex === index ? 'w-6 bg-green-600' : 'w-2 bg-gray-300'
                                    }`}
                                    onClick={() => setCurrentIndex(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>


                {/**This is the feature list section */}
                <div className='featuresSection2 p-5'>
                    <div>
                        <h1 className='flex justify-center md:text-3xl sm:text-2xl text-xl font-bold mb-6'>{t("f_listing_title")}</h1>
                        <h2 className='text-center md:text-2xl w-1/2 mx-auto mb-20'>
                            {t("feature_message")}
                        </h2>
                        <div className='grid md:grid-cols-4  sm:grid-cols-2 grid-cols-1 w-3/4 mx-auto gap-3'>
                            {features.map((feature)=>(
                                <FeatureCard 
                                    key={feature.id}
                                    isAiFeatures={feature.title=="f_listing2"}
                                    title={feature.title}
                                    img={feature.icon}    
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="bg-gray-100 p-6 w-full">


                {/**This is the call to action sectiono */}
                <div className="max-w-6xl mx-auto">
                    {/* Desktop/Tablet Layout (md and above) */}
                    <div className="hidden md:grid md:grid-cols-3 md:gap-6 md:items-center">
                    {/* Phone Column */}
                    <div className="flex justify-center">
                        <img 
                        src="images/Welcome/iPhone_2.png" 
                        alt="LeafEye Mobile App" 
                        className="h-96 object-contain"
                        />
                    </div>
                    
                    {/* Center Text Column */}
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4">{t("call_action_main")}</h1>
                        <p className="text-lg">
                        {t("call_action_body")}
                        </p>
                    </div>
                    
                    {/* Laptop Column */}
                    <div className="flex justify-center">
                        <img 
                        src="images/Welcome/mac_screen.png" 
                        alt="LeafEye Desktop View" 
                        className="h-64 object-contain"
                        />
                    </div>
                    {/* App Store Buttons - Desktop */}
                    <div className="mt-8 flex justify-center space-x-4 col-span-3">
                        <a href="#" className="block">
                            <img 
                            src="images/Welcome/apple.png" 
                            alt="Download on App Store" 
                            className="h-12"
                            />
                        </a>
                        <a href="#" className="block">
                            <img 
                            src="images/Welcome/playG.png" 
                            alt="Get it on Google Play" 
                            className="h-20"
                            />
                        </a>
                    </div>
                    </div>
                    
                    {/* Mobile Layout (sm and below) */}
                    <div className="block md:hidden">
                    {/* Device Images Side by Side */}
                    <div className="flex justify-center space-x-4 mb-6">
                        <img 
                        src="images/Welcome/iPhone_2.png" 
                        alt="LeafEye Mobile App" 
                        className="h-64 object-contain"
                        />
                        <img 
                        src="images/Welcome/mac_screen.png" 
                        alt="LeafEye Desktop View" 
                        className="h-48 object-contain self-center"
                        />
                    </div>
                    
                    {/* Text Content Below */}
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-4">{t("call_action_main")}</h1>
                        <p className="text-base">
                        {t("call_action_body")}
                        </p>
                        
                        {/* App Store Buttons - Mobile */}
                        <div className="mt-6 flex flex-col items-center space-y-4">
                        <a href="#" className="block w-48">
                            <img 
                            src="images/Welcome/apple.png" 
                            alt="Download on App Store" 
                            className="w-full"
                            />
                        </a>
                        <a href="#" className="block w-48">
                            <img 
                            src="images/Welcome/playG.png" 
                            alt="Get it on Google Play" 
                            className="w-full"
                            />
                        </a>
                        </div>
                    </div>
                    </div>
                </div>
                </div>

                <footer className="bg-leaf-nav-back p-6 md:p-10">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
                        {/* Logo & Slogan */}
                        <div>
                        <img src="images/logo.png" alt="Leaf-EYE Logo" className="w-16 sm:w-20 md:w-24 lg:w-28 xl:w-32 mx-auto md:mx-0" />
                        <h2 className="font-bold text-lg mt-2">{t("slogan")}</h2>
                        </div>
                        
                        {/* Discover */}
                        <div>
                        <h3 className="font-bold text-lg">{t("discover")}</h3>
                        <ul className="mt-2 space-y-1">
                            <li><a href="#" className="hover:underline">{t("home_link")}</a></li>
                            <li><a href="#" className="hover:underline">{t("f_listing2")}</a></li>
                        </ul>
                        </div>

                        {/* About */}
                        <div>
                        <h3 className="font-bold text-lg">{t("About")}</h3>
                        <ul className="mt-2 space-y-1">
                            <li><a href="#" className="hover:underline">{t("aboutUs")}</a></li>
                            <li><a href="#" className="hover:underline">{t("t_service")}</a></li>
                        </ul>
                        </div>

                        {/* Help */}
                        <div>
                        <h3 className="font-bold text-lg">{t("Help")}</h3>
                        <ul className="mt-2 space-y-1">
                            <li><a href="#" className="hover:underline">{t("contact")}</a></li>
                            <li><a href="#" className="hover:underline">FAQ</a></li>
                        </ul>
                        </div>
                    </div>
                    {/* Horizontal Line */}
                    <hr className="mt-6 border-gray-400" />
                    <p className="text-gray-700 mt-1">2025 LeafEye GradProject Team</p>
                </footer>
            </UnauthenticatedLayout>
        </>
    );
}