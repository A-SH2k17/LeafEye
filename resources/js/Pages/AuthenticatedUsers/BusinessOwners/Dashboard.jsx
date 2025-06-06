import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect ,useState} from 'react';
import { useLanguage } from '@/multilanguage';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronUp, ChevronDown, RefreshCw, DollarSign, Package, TrendingUp, Plus, Minus } from 'lucide-react';
import PrimaryButton from '@/Components/Primitive/PrimaryButton';
import SecondaryButton from '@/Components/Primitive/SecondaryButton';
import axios from 'axios';

export default function BusinessDashboard({success,errors,auth,shop,products}) {

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


      

         //inventory data
         const [inventoryData, setInventoryData] = useState(products);
         const [updateMap, setUpdateMap] = useState({});
         useEffect(() => {
          // Calculate the new map based on the current 'products'
          const newMap = products.reduce((acc, product) => {
            acc[product.name] = null;
            return acc;
          }, {});
      
          // Update the state *once* with the new map
          setUpdateMap(newMap);
      
        }, [products]);
         //console.log(updateMap)
        //sample sales data 
        const salesData = [
            { month: 'Jan', sales: 5400 },
            { month: 'Feb', sales: 6200 },
            { month: 'Mar', sales: 8100 },
            { month: 'Apr', sales: 7300 },
            { month: 'May', sales: 9000 },
            { month: 'Jun', sales: 10500 },
        ];

        // Calculated metrics
        const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0);
        const totalInventoryValue = inventoryData.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        const totalItems = inventoryData.reduce((sum, item) => sum + item.quantity, 0);
        
        // State for filtering and sorting
        const [sortField, setSortField] = useState('name');
        const [sortDirection, setSortDirection] = useState('asc');
        const [activeCategory, setActiveCategory] = useState('All');
        const [selectedTimeRange, setSelectedTimeRange] = useState('6M');

        // Sort inventory data
        const sortedInventory = React.useMemo(() => {
            return [...inventoryData].sort((a, b) => {
              const aValue = a[sortField].toLowerCase()
              const bValue = b[sortField].toLowerCase()

              if (sortDirection === 'asc') {
                return aValue > bValue ? 1 : -1;
              } else {
                return aValue < bValue ? 1 : -1;
              }
            });
          }, [inventoryData, sortField, sortDirection]);

        

        // Handle sorting
        const handleSort = (field) => {
            if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
            } else {
            setSortField(field);
            setSortDirection('asc');
            }
        };

        // Get filtered sales data based on time range
        const getFilteredSalesData = () => {
            switch (selectedTimeRange) {
            case '3M':
                return salesData.slice(3);
            case '6M':
                return salesData;
            default:
                return salesData;
            }
        };

        


          //update quantity code

          const updatequantity = (id, increment) => {
            setInventoryData(prevData =>
              prevData.map(item => {
                if (item.id === id) {
                  return { ...item, quantity: increment ? item.quantity + 1 : Math.max(0, item.quantity - 1) };
                }
                return item;
              })
            );
          };

          const {data,setData,processing,post} = useForm({
            id:null,
            quantity:null,
          });

          const handleUpdate = async (id,quantity,name)=>{
            try{
              setData('id',id)
              setData('quantity',quantity)
              const formData = new FormData()
              formData.append('id',id)
              formData.append('quantity',quantity)
              const response = await axios.post(`/business/updateQuantity/${id}/${quantity}`,formData,{
                headers:{
                  "Content-Type": "application/json",
                  "X-CSRF-TOKEN": localStorage.getItem("csrf_token")
                }
              })
              console.log(response.data)
              setUpdateMap((prevMapp)=>{
                return{
                  ...prevMapp,
                  [name]:response.data
                }
              })
              //console.log(updateMap)
            }catch(error){
              alert(error)
            }
          }


          //delete items
          const handleDelete= async (id)=>{
            try{
              const response = await axios.delete(`/business/updateQuantity/${id}`)
              setInventoryData(response.data.products)
              console.log(response.data)
            }catch(error){
              console.log(error.response.data)
            }
          }

    return (
        <AuthenticatedLayout
            lang = {lang}
        >
            <Head title="Business Dashboard" />
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
            <div className='p-4'>
                {shop ? (
                    <>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{shop.name} - Inventory Management</h1>
                        <h2 className='text-xl sm:2xl md:3xl font-semibold'>{shop.type}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('business.add_product')}
                            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Product
                        </Link>
                        <Link
                            href={route('business.orders.index')}
                            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                        >
                            <Package className="w-4 h-4 mr-2" />
                            View Orders
                        </Link>
                    </div>
                </div>
                    </>
                ) : (
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Welcome to Business Dashboard</h1>
                )}
            </div>
        
            <div className="max-w-7xl mx-auto text-center">
                <div className="bg-white shadow-md overflow-hidden  sm:rounded-lg">
                    <div className="p-6 text-gray-900">
                        <h1 className="text-2xl font-bold mb-4">Welcome {auth.user.first_name}</h1>
                        <p>This is your business dashboard. Here you can manage your shop and products.</p>
                    </div>
                    {
                      (success || Object.keys(errors).length > 0) ? (
                        <p className={success?'text-green-600':'text-red-500'}>{success?success:errors["message"]}</p>
                      ):null
                      
                    }
                </div>
            </div>

            {/**Kpi Sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 m-10">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-3 rounded-full">
                    <DollarSign size={24} className="text-green-600" />
                    </div>
                    <div>
                    <h3 className="text-gray-500 text-sm">Total Sales</h3>
                    <p className="text-2xl font-bold">EGP {totalSales.toLocaleString()}</p>
                    <p className="text-green-600 text-sm flex items-center">
                        <TrendingUp size={14} className="mr-1" />
                        +12.5% from last period
                    </p>
                    </div>
                </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-3 rounded-full">
                    <Package size={24} className="text-blue-600" />
                    </div>
                    <div>
                    <h3 className="text-gray-500 text-sm">Inventory Value</h3>
                    <p className="text-2xl font-bold">EGP {totalInventoryValue.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Across {inventoryData.length} products</p>
                    </div>
                </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-3 rounded-full">
                    <Package size={24} className="text-purple-600" />
                    </div>
                    <div>
                    <h3 className="text-gray-500 text-sm">Items in quantity</h3>
                    <p className="text-2xl font-bold">{totalItems.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{Math.round(totalItems / inventoryData.length)} avg per product</p>
                    </div>
                </div>
                </div>
            </div>
        
        {/* Sales Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 m-6">
            <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Sales Trend</h2>
            <div className="flex bg-gray-100 rounded-md">
                <button 
                className={`px-3 py-1 text-sm rounded-md ${selectedTimeRange === '3M' ? 'bg-leaf-button-200 text-white' : 'text-gray-600'}`}
                onClick={() => setSelectedTimeRange('3M')}
                >
                3M
                </button>
                <button 
                className={`px-3 py-1 text-sm rounded-md ${selectedTimeRange === '6M' ? 'bg-leaf-button-200 text-white' : 'text-gray-600'}`}
                onClick={() => setSelectedTimeRange('6M')}
                >
                6M
                </button>
            </div>
            </div>
            <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getFilteredSalesData()} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                    formatter={(value) => [`EGP ${value.toLocaleString()}`, 'Sales']}
                />
                <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#00796A" 
                    strokeWidth={2} 
                    dot={{ fill: '#00796A', r: 4 }}
                    activeDot={{ r: 6 }}
                />
                </LineChart>
            </ResponsiveContainer>
            </div>
        </div>


         {/* Inventory Table */}
<div className="bg-white rounded-lg shadow-sm border border-gray-100">
  <div className="p-4 border-b border-gray-100">
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-semibold text-gray-800">Inventory List &nbsp; <Link href={route('business.add_product')}><PrimaryButton>Add Item To Inventory</PrimaryButton></Link></h2>
    </div>
  </div>
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50 text-gray-700 text-sm">
        <tr>
          <th className="p-4 text-left cursor-pointer" onClick={() => handleSort('name')}>
            <div className="flex items-center">
              Product Name
              {sortField === 'name' && (
                sortDirection === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />
              )}
            </div>
          </th>
          <th className="p-4 text-center">Quantity</th>
          <th className="p-4 text-center">Unit Price</th>
          <th className="p-4 text-center">Total Value</th>
          <th className="p-4 text-center">Actions</th>
        </tr>
      </thead>
      <tbody className="text-gray-700">
        {sortedInventory.map((item) => (
          <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
            <td className="p-4 font-medium">{item.name} {updateMap[item.name]?<p className={Object.keys(updateMap[item.name])[0]=="success"?'text-green-500':'text-red-500'}>{Object.keys(updateMap[item.name])[0]=="success"?updateMap[item.name]["success"]:updateMap[item.name]["error"]}</p>:null}</td>
            <td className="p-4">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg font-medium">{item.quantity}</span>
                <div className="flex">
                  <button 
                    onClick={() => updatequantity(item.id, true)}
                    className="bg-green-500 text-white rounded-l p-1 hover:bg-green-600"
                  >
                    <Plus size={16} />
                  </button>
                  <button 
                    onClick={() => updatequantity(item.id, false)}
                    className="bg-red-500 text-white rounded-r p-1 hover:bg-red-600"
                  >
                    <Minus size={16} />
                  </button>
                </div>
              </div>
            </td>
            <td className="p-4 text-center">EGP {item.price}</td>
            <td className="p-4 text-center">EGP {(item.quantity * item.price).toLocaleString()}</td>
            <td className="p-4">
              <div className="flex justify-center space-x-2">
                <PrimaryButton onClick={()=>{handleUpdate(item.id,item.quantity,item.name)}}>
                    Update quantity
                </PrimaryButton>
                <SecondaryButton onClick={()=>{handleDelete(item.id)}}className='bg-red-500 text-white hover:bg-red-300 hover:text-black'>
                    Delete
                </SecondaryButton>
                <Link href={`/business/editItem/${item.name}`}>
                  <SecondaryButton className='bg-gray-100 hover:bg-gray-50'>
                      Edit Item
                  </SecondaryButton>
                </Link>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  <div className="p-4 border-t border-gray-100 text-sm text-gray-500">
    Showing {sortedInventory.length} of {inventoryData.length} products
  </div>
</div>
        </AuthenticatedLayout>
    );
} 