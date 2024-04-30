import { useState, useEffect } from 'react';
import API from '../utils/axios';
import { toast } from "react-toastify";
import NavBar from '../navbar/nav';
import Loader from '../utils/Loader';

const CreateEvent = () => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        categoryId: '',
        title: '',
        date: '',
        location: '',
        ticketAvailability: ''
    });
    const [loading, setLoading] = useState(false); 

    const fetchCategories = async () => {
        try {
            const response = await API.get('/categories');
            if (response.data.status === 200) {
                setCategories(response.data.data);
            }
        } catch (error) {
          toast.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); 
        const token = localStorage.getItem('token'); 
        try {
            await API.post('/services', formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success('Event created successfully!');
            setFormData({
                categoryId: '',
                title: '',
                date: '',
                location: '',
                ticketAvailability: ''
            });    
            setLoading(false); 
        } catch (error) {
            toast.error('Failed to create event');
            setLoading(false); 
        }
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 flex flex-col">
        <NavBar />
        <div className="flex flex-1 items-center justify-center">
            <form onSubmit={handleSubmit} className="p-8 space-y-4 max-w-md w-full bg-white rounded-lg shadow-md">
                <div>
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Category:</label>
                    <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
                    >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.CategoryName}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date:</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location:</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="ticketAvailability" className="block text-sm font-medium text-gray-700">Ticket Availability:</label>
                    <input
                        type="number"
                        name="ticketAvailability"
                        value={formData.ticketAvailability}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
                    />
                </div>
                <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out" disabled={loading}>
                    {loading ? <Loader /> : 'Create Event'}
                </button>
            </form>
        </div>
    </div>
    
    );
};

export default CreateEvent;
