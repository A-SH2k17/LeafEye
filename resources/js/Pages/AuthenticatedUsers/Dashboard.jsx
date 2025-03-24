import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/multilanguage';
import { useEffect, useState } from 'react';
import PrimaryButton from '@/Components/Primitive/PrimaryButton';
import PlantCard from '@/Components/NonPrimitive/PlantCard';
import Footer from '@/Components/NonPrimitive/Footer';

export default function Dashboard(props) {


    //code to save csrf and beareer token to avoid the 419 and 401 error in post
    useEffect(() => {
        // Extract CSRF token from URL parameters
        const params = new URLSearchParams(window.location.search);
        const token = params.get("csrfToken");
        const bearer = params.get("bearer_token");

        if (token) {
            localStorage.setItem("csrf_token", token); // Save to localStorage
            //setCsrfToken(token); // Update state
            console.log("CSRF Token saved:", token);

            // Remove csrfToken from URL
            params.delete("csrfToken");
            const newUrl = window.location.pathname + (params.toString() ? "?" + params.toString() : "");
            window.history.replaceState({}, "", newUrl);
        }

        if(bearer){
            localStorage.setItem("bearer_token", bearer); // Save to localStorage
            //setCsrfToken(token); // Update state
            console.log("Bearer Token saved:", bearer);

            // Remove csrfToken from URL
            params.delete("bearer_token");
            const newUrl = window.location.pathname + (params.toString() ? "?" + params.toString() : "");
            window.history.replaceState({}, "", newUrl);
        }
    }, []);


    //multilangiage code
    const {lang,handleChange,languages} = useLanguage();
    const {t} = useTranslation();


     //code for plant carrousel
     const [currentIndex, setCurrentIndex] = useState(0);
     const [visibleCards, setVisibleCards] = useState(3);

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


     // Sample plant data
    //  const plants = [
    //      { id: 1, type: "Boston Fern", datePlanted: "Jan 15, 2025" },
    //      { id: 2, type: "Snake Plant", datePlanted: "Dec 3, 2024" },
    //      { id: 3, type: "Monstera", datePlanted: "Feb 2, 2025" },
    //      { id: 4, type: "Spider Plant", datePlanted: "Jan 28, 2025" },
    //      { id: 5, type: "Peace Lily", datePlanted: "Nov 12, 2024" }
    //  ];

    const plants = props.user_plants;
    const visiblePlants = 3;
    const maxIndex = Math.max(0, plants.length - visiblePlants);
 
     const nextSlide = () => {
         setCurrentIndex(prevIndex => 
           prevIndex < maxIndex ? prevIndex + 1 : prevIndex
         );
       };
       
       const prevSlide = () => {
         setCurrentIndex(prevIndex => 
           prevIndex > 0 ? prevIndex - 1 : prevIndex
         );
       };

    return (
        <AuthenticatedLayout
            lang={lang}>
            <Head title={t("home_link")} />
            <select value={lang} onChange={handleChange} className='m-4 mt-20'>
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

            <div className="flex p-2">
                <h1 className="text-2xl sm:text-2xl md:text-3xl mr-4">{t("colllection_title")}</h1>
                <PrimaryButton><Link
                    href={`/plantMonitor/${props.auth.user.username}/addPlant`}
                >{t("add_plant_button")}</Link></PrimaryButton>
            </div>
            { plants.length==0&&
                <div className="flex justify-center">
                    <h1 className='p-5'> You currently monitor no plants in your collection....</h1>
                </div>
            }
            {
                plants.length>0 &&
                <>
                    {/**This section is for the carrousel */}
                    <div className="relative">
                        {/* Navigation buttons */}
                        <button 
                        onClick={prevSlide}
                        disabled={currentIndex === 0}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 disabled:opacity-50"
                        >
                        ← 
                        </button>
                        
                        {/* Carousel container */}
                        <div className="overflow-hidden">
                            <div 
                                className="flex transition-transform duration-700 ease-in-out"
                                style={{ transform: `translateX(-${currentIndex * (100 / visibleCards)}%)` }}
                            >
                                {plants.map(plant => (
                                    <div 
                                        key={plant.id} 
                                        className={`flex-none px-2 ${
                                            visibleCards === 1 ? 'w-full' : 
                                            visibleCards === 2 ? 'w-1/2' : 'w-1/3'
                                        }`}
                                    >
                                        <PlantCard plant={plant}/>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <button 
                        onClick={nextSlide}
                        disabled={currentIndex >= maxIndex}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 disabled:opacity-50"
                        >
                        →
                        </button>
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
                </>
            }

            {/**This is the Detect Disease Section */}
            
            {/* Disease Detection Section */}
            <div className="mb-16 p-6 md:p-10 diseaseDetection">
                <h2 className="text-3xl font-bold text-[#21351F] mb-6">{t("disease_title")}</h2>
                
                <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                    <p className="mb-4">
                    {t("disease_text_user")}
                    </p>
                </div>
                
                <div className="md:w-1/2 flex justify-center items-start">
                    <Link>
                        <PrimaryButton
                            className='h-16'
                        >
                            {t("diagnose_button")}
                        </PrimaryButton>
                    </Link>
                </div>
                </div>
            </div>
      
            {/* Fertilizer Section */}
            <div className="p-6 md:p-10 bg-[]">
                <div className="flex flex-col-reverse md:flex-row gap-8">
                    <div className="md:w-1/2 flex justify-center md:justify-start items-center">
                            <PrimaryButton
                                className='h-16'
                            >
                                {t("recommend_button")}
                            </PrimaryButton>
                    </div>
                    
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">{t("fert_title")}</h2>
                        <p className="text-gray-700 mb-4">
                        {t("fert_text_user")}
                        </p>
                    </div>
                </div>
            </div>
        <Footer lang={lang}/>
        </AuthenticatedLayout>
    );
}
