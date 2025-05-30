import Footer from "@/Components/NonPrimitive/Footer";
import AuthenticatedLayout from "@/Layouts/UnauthenticatedLayout";
import { Head,useForm} from "@inertiajs/react";
import React from "react";
import { useEffect,useState,useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/multilanguage";
import axios from "axios";
import { usePage } from "@inertiajs/react";

export default function CropDiseaseDetection(){
    const { auth } = usePage().props;
    const saveMounted = useRef(false);

    //multilanguage code
    const {lang,handleChange,languages} = useLanguage();
    const {t} = useTranslation();


    //imagecode
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [detectionResult, setDetectionResult] = useState(null);
    const [error, setError] = useState(null);
    const [save,setSave] = useState(false);
    const [diseaseId,setDiseaseId] = useState(null);
    
    const { data, setData, reset, errors } = useForm({
        image: null,
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            
            // Show image preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target.result);
            };
            reader.readAsDataURL(file);
            
            // Reset previous results
            setDetectionResult(null);
            setError(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!data.image) {
            setError("Please select an image first");
            return;
        }
        
        setIsLoading(true);
        setError(null);
        
        const formData = new FormData();
        formData.append('image', data.image);
        
        try {
            const saveInput = confirm("Do you want to save the image?")
            if(saveInput){
                setSave(true)
            }else{
                setSave(false)
            }
            const response = await axios.post('/crop-disease/detect', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.success) {
                let prediction = response.data.disease.split("___")
                let detect = {
                    "plantType":prediction[0],
                    "disease":prediction[1],
                    "confidence": response.data.confidence,
                    "recommendations": response.data.recommendations,
                    "description":response.data.description,
                    "plant_id":response.data.plant_id,
                }
                console.log(detect);
                console.log(prediction)
                setDiseaseId(response.data.disease_id)
                setDetectionResult(detect);
            } else {
                setError(response.data.message || "Failed to detect disease");
            }
        } catch (err) {
            console.log(err)
            setError(err.response?.data?.message || "An error occurred during disease detection");
        } finally {
            setIsLoading(false);
        }
    };

    //collection code
    const [collectionNames,setCollectionNames] =useState([])

    const [selectName,setSelectedName] = useState("");
    const [newColl,setNewColl]=useState(false);

    const handleSave = async () => {
        if (!selectName) {
            alert('Please select or enter a collection name');
            return;
        }

        if (!diseaseId) {
            alert('No disease detection found. Please detect a disease first.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('image', data.image);
            formData.append('collection_name', selectName);
            formData.append('disease_id', diseaseId);
            formData.append('plant_id', detectionResult.plant_id);
            formData.append('username', auth.user.username);

            console.log('Sending data:', {
                collection_name: selectName,
                disease_id: diseaseId,
                plant_id: detectionResult.plant_id,
                username: auth.user.username
            });

            const response = await axios.post(route('monitor.save_detection'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                alert('Successfully saved to collection');
                // Reset the form
                setSelectedName('');
                setNewColl(false);
            } else {
                alert(response.data.error || 'Failed to save to collection');
            }
        } catch (error) {
            console.error('Error saving to collection:', error);
            alert(error.response?.data?.error || 'Error saving to collection');
        }
    }

    useEffect(()=>{
        if(saveMounted.current){
            if(save && detectionResult?.plant_id){
                const fetchData = async () => {
                    try{
                        const response = await axios.get(route('monitor.get_collection_names'), {
                            params: {
                                plant_id: detectionResult.plant_id
                            }
                        });
                        console.log('Collections response:', response.data);
                        setCollectionNames(response.data.collections);
                    } catch(error) {
                        console.error("Error fetching collections:", error);
                        alert(error.response?.data?.error || 'Error fetching collections');
                    }
                }
                fetchData();
            }
        } else {
            saveMounted.current = true;
        }
    }, [save, detectionResult?.plant_id]);
    return(
        <>
        <Head title="AI Crop Disease Diagnostic"  />
        <AuthenticatedLayout
        lang={lang}>
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
                <button onClick={()=>(alert(save))}>Test</button>
                <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className=" overflow-hidden shadow-2xl sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <h1 className="text-2xl font-bold mb-4">AI Crop Disease Diagnostic</h1>
                            
                            <div className="flex gap-6">
                                <div className="w-1/2">
                                    <div className="bg-leaf-back p-6 rounded-lg">
                                        {previewImage ? (
                                            <div className="mb-4">
                                                <img 
                                                    src={previewImage} 
                                                    alt="Plant leaf preview" 
                                                    className="w-full h-64 object-contain rounded border" 
                                                />
                                            </div>
                                        ) : (
                                            <div className="mb-4 border-2 border-dashed border-gray-300 rounded p-6 text-center">
                                                <p className="text-gray-500">upload image</p>
                                            </div>
                                        )}
                                        
                                        <div className="mb-4">
                                            <h3 className="font-medium mb-2">Instructions:</h3>
                                            <ul className="text-sm text-gray-600">
                                                <li>Take a picture of the plant leaf from your mobile</li>
                                                <li>Save the image to your desktop</li>
                                                <li>Upload the image to analyze</li>
                                            </ul>
                                        </div>
                                        
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-4">
                                                <input
                                                    type="file"
                                                    onChange={handleImageChange}
                                                    className="w-full p-2 border rounded"
                                                    accept="image/*"
                                                />
                                                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                                            </div>
                                            
                                            <button
                                                type="submit"
                                                disabled={isLoading || !data.image}
                                                className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded transition"
                                            >
                                                {isLoading ? 'Processing...' : 'Detect Disease'}
                                            </button>
                                        </form>
                                        
                                        {error && (
                                            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
                                                {error}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="w-1/2">
                                    {detectionResult ? (
                                        <div className="bg-white p-6 rounded-lg shadow">
                                            <h3 className="text-xl font-bold mb-3">Detection Results</h3>
                                            
                                            <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                                            <p className="text-sm font-medium text-gray-700 mb-3">Existing Collection</p>
                                            <div className="flex items-center space-x-6">
                                                <div className="flex items-center">
                                                    <input 
                                                        type="radio" 
                                                        name="existing" 
                                                        id="existing_yes"
                                                        checked={!newColl}
                                                        onChange={() => setNewColl(false)}
                                                        className="h-4 w-4 text-leaf-button-main focus:ring-leaf-button-main border-gray-300"
                                                    />
                                                    <label htmlFor="existing_yes" className="ml-2 text-sm text-gray-700">Yes</label>
                                                </div>
                                                <div className="flex items-center">
                                                    <input 
                                                        type="radio" 
                                                        name="existing" 
                                                        id="existing_no"
                                                        checked={newColl}
                                                        onChange={() => setNewColl(true)}
                                                        className="h-4 w-4 text-leaf-button-main focus:ring-leaf-button-main border-gray-300"
                                                    />
                                                    <label htmlFor="existing_no" className="ml-2 text-sm text-gray-700">No</label>
                                                </div>
                                            </div>
                                        </div>
                                        { newColl &&
                                            <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                                                <label htmlFor="collection_name" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Collection Name
                                                </label>
                                                <input
                                                    id="collection_name"
                                                    type="text"
                                                    onChange={(e) => setSelectedName(e.target.value)}
                                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-leaf-button-main focus:ring-leaf-button-main"
                                                />
                                                <button 
                                                    type="submit" 
                                                    className="mt-3 inline-flex items-center px-4 py-2 bg-leaf-button-main border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-leaf-button-200 focus:bg-leaf-button-200 active:bg-leaf-button-200 focus:outline-none focus:ring-2 focus:ring-leaf-button-main focus:ring-offset-2 transition ease-in-out duration-150"
                                                    onClick={()=>handleSave()}
                                                >
                                                    Save Collection
                                                </button>
                                            </div>
                                        }
                                        {
                                            !newColl &&
                                            <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                                                <label htmlFor="collections" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Collection
                                                </label>
                                                <select 
                                                    id="collections"
                                                    name="collections" 
                                                    onChange={(e) => setSelectedName(e.target.value)}
                                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-leaf-button-main focus:ring-leaf-button-main"
                                                >
                                                    {collectionNames.map((name) => (
                                                        <option key={name.id} value={name.name}>{name.name}</option>
                                                    ))}
                                                </select>
                                                <button 
                                                    type="submit" 
                                                    className="mt-3 inline-flex items-center px-4 py-2 bg-leaf-button-main border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-leaf-button-200 focus:bg-leaf-button-200 active:bg-leaf-button-200 focus:outline-none focus:ring-2 focus:ring-leaf-button-main focus:ring-offset-2 transition ease-in-out duration-150"
                                                    onClick={()=>handleSave()}
                                                >
                                                    Save to Collection
                                                </button>
                                            </div>
                                        }
                                            <div className="mb-4">
                                                <h4 className="font-medium mb-1">Plant Type:</h4>
                                                <p className="text-lg">{detectionResult.plantType || 'Unknown'}</p>
                                            </div>

                                            <div className="mb-4">
                                                <h4 className="font-medium mb-1">Disease:</h4>
                                                <p className="text-lg">{detectionResult.disease || 'Unknown'}</p>
                                            </div>

                                            {
                                                detectionResult.description &&
                                                <div className="mb-4">
                                                    <h4 className="font-medium mb-1">About Disease:</h4>
                                                    <p className="text-lg">{detectionResult.description || 'Unknown'}</p>
                                                </div>
                                            }
                                            
                                            {detectionResult.confidence && (
                                                <div className="mb-4">
                                                    <h4 className="font-medium mb-1">Confidence:</h4>
                                                    <p>{(detectionResult.confidence * 100).toFixed(2)}%</p>
                                                </div>
                                            )}
                                            
                                            {detectionResult.recommendations && (
                                                <div className="mb-4">
                                                    <h4 className="font-medium mb-1">Recommendations:</h4>
                                                    <ul className="list-disc pl-5">
                                                        {detectionResult.recommendations.map((rec, index) => (
                                                            <li key={index}>{rec}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                                                <p className="text-gray-500">Disease detection results will appear here</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                <Footer lang={lang}/>
        </AuthenticatedLayout>
        </>
    )
}