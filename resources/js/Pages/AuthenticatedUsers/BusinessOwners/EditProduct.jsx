import React, {useState} from "react";
import {useForm} from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Navbar from "@/Components/NonPrimitive/Navbar";
import { useLanguage } from "@/multilanguage";
import { useTranslation } from "react-i18next";
import InputLabel from "@/Components/Primitive/InputLabel";
import TextInput from "@/Components/Primitive/TextInput";
import { Textarea } from "@headlessui/react";
import PrimaryButton from "@/Components/Primitive/PrimaryButton";

export default function EditProduct({auth,shop,product}){
    //multilangiage code
    const {lang,handleChange,languages} = useLanguage();
    const {t} = useTranslation();

    //form data
    const {data,setData,reset,errors,processing,post}= useForm({
        image:product.image_path,
        product_name:product.name,
        quantity:product.quantity,
        Description:product.description,
        price:product.price,
        shop_id:shop.id,
    })

    //code for image input
    const [previewImage,setPreviewImage] = useState(`/storage/${product.image_path}`);
    const handleImageChange = (e)=>{
        const file = e.target.files[0];
        
        if(file){
            setData('image',file)
            const reader = new FileReader();
            reader.onload= (e)=>{
                alert(e.target.result)
                setPreviewImage(e.target.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = (e)=>{
        e.preventDefault()
        alert("cll")
        if(Object.values(data).some(value=>value===null) || Object.values(data).some(value=>value==='')){
            alert("Please fill every input in the form")
        }else if(isNaN(Number(data.price))){
            alert("Please enter a number in the price input")
        }else{
            const formData = new FormData()
            formData.append('image', data.image);
            formData.append('product_name', data.product_name);
            formData.append('quantity', data.quantity);
            formData.append('Description', data.description);
            formData.append('price', data.price);
            formData.append('shop_id',data.shop_id)

            post(route('product.add'),formData),{
                formData:true,
            };
        }

    }

    return(
        <AuthenticatedLayout>
            <Head title="Add Product"/>
            
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center my-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">{shop.name} - Add Product</h1>
                        <h2 className="text-xl mt-1 text-gray-600 font-medium">{shop.type}</h2>
                    </div>
                    <select value={lang} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500">
                        {languages.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.text}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                    <div className="p-6 bg-green-50 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Product Information</h3>
                        <p className="mt-1 text-sm text-gray-500">Please fill in the details for your new product.</p>
                    </div>

                    <div className="p-6">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Image Upload Section */}
                            <div className="space-y-2">
                                <InputLabel htmlFor="image" className="block text-sm font-medium text-gray-700">
                                    Product Image
                                </InputLabel>
                                <div className="mt-1">
                                    {previewImage ? (
                                        <div className="mx-auto max-w-md">
                                            <img 
                                                src={previewImage} 
                                                alt="Product Preview" 
                                                className="w-full h-64 object-contain rounded-lg border border-gray-300"
                                            />
                                        </div>
                                    ) : (
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md">
                                            <div className="space-y-1 text-center">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <div className="text-sm text-gray-600">
                                                    <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                                                        <span>Upload a file</span>
                                                        <input 
                                                            id="image-upload" 
                                                            name="image-upload" 
                                                            type="file" 
                                                            className="sr-only" 
                                                            onChange={handleImageChange}
                                                        />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    PNG, JPG, GIF up to 10MB
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {previewImage && (
                                    <div className="flex justify-center mt-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPreviewImage(null);
                                                setData('image', null);
                                            }}
                                            className="text-sm text-red-600 hover:text-red-900"
                                        >
                                            Remove image
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Product Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="product_name" className="block text-sm font-medium text-gray-700">
                                        Product Name
                                    </InputLabel>
                                    <TextInput
                                        id="product_name"
                                        value={data.product_name}
                                        name="product_name"
                                        onChange={(e) => setData('product_name', e.target.value)}
                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>

                                <div>
                                    <InputLabel htmlFor="price" className="block text-sm font-medium text-gray-700">
                                        Product Price
                                    </InputLabel>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">$</span>
                                        </div>
                                        <TextInput
                                            id="price"
                                            value={data.price}
                                            name="price"
                                            onChange={(e) => setData('price', e.target.value)}
                                            className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                                        Available Quantity
                                    </InputLabel>
                                    <TextInput
                                        id="quantity"
                                        value={data.quantity}
                                        name="quantity"
                                        type="number"
                                        onChange={(e) => setData('quantity', e.target.value)}
                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Product Description
                                </InputLabel>
                                <div className="mt-1">
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={4}
                                        className="shadow-sm focus:ring-green-500 focus:border-green-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                                        placeholder="Describe your product..."
                                        value={data.Description}
                                        onChange={(e) => setData('Description', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-5">
                                <PrimaryButton type="submit">
                                    Add
                                </PrimaryButton>
                            </div>
                        </form>
                        <button onClick={()=>alert(previewImage)}>Test</button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}