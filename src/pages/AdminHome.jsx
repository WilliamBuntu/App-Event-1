/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import API from '../utils/axios';
import { toast } from "react-toastify";
import Swal from 'sweetalert2'
import { formatDate } from '../utils/formatDate';
import { Link } from 'react-router-dom';
import NavBar from '../navbar/nav';
import Loader from '../utils/Loader';

const AdminHome = () => {
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useMemo(() => async () => {
    try {
      const response = await API.get('/services');
      if (response.status === 200) {
        const formattedEvents = response.data.data.map(event => ({
          ...event,
          date: formatDate(event.date) 
        }));
        setEventsData(formattedEvents);
      }
    } catch (error) {
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleEdit = async (event) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Event',
      showCancelButton: true,
      html:
        '<input id="swal-input1" type="text" class="swal2-input" style="width: 70%; height:40px" value="' + event.title + '">' +
        '<input id="swal-input2" class="swal2-input" type="date" style="width: 70%; height:40px" value="' + event.date + '">' +
        '<input id="swal-input3" class="swal2-input" type="text" style="width: 70%; height:40px" value="' + event.location + '">' +
        '<input id="swal-input4" class="swal2-input" type="text" style="width: 70%; height:40px" value="' + event.ticketAvailability + '">' +
        '<input id="swal-input5" class="swal2-input" type="text" style="width: 70%; height:40px" value="' + event.image + '">',

      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value,
          document.getElementById('swal-input3').value,
          document.getElementById('swal-input4').value,
          document.getElementById('swal-input5').value 
        ]
      }
    })

    if (formValues) {
      const token = localStorage.getItem('token');
      const response = await API.put(`/services/${event.id}`, {
        title: formValues[0],
        date: formValues[1],
        location: formValues[2],
        ticketAvailability: formValues[3],
        image: formValues[4]
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        toast.success("Event updated successfully");
        fetchEvents();
      } else {
        toast.error('Failed to update event:', response.data.message);
      }
    }
  };

  const handleDelete = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await API.delete(`/services/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        toast.success("deleted successfully")
        fetchEvents();
      } else {
        toast.error('Failed to delete event:', response.data.message);
      }
    } catch (error) {
      toast.error('Failed to delete event:', eventId, error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <NavBar />
      <div className="container mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <Loader />
        ) : eventsData.length > 0 ? (
          eventsData.map((event, index) => (
            <div key={`event-${index}`} className="bg-white rounded-lg shadow-md p-4 transition duration-300 ease-in-out hover:bg-green-100 transform hover:scale-105">
              {/* You can replace the image with your actual event image */}
              <img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Event" className="w-full h-40 object-cover mb-4 rounded-md" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h3>
              <p className="text-gray-600 mb-2">{event.date}</p>
              <p className="text-gray-600 mb-2">{event.location}</p>
              <div className="flex justify-end">
                <FontAwesomeIcon icon={faEdit} className="text-blue-600 hover:text-blue-700 cursor-pointer mr-2" onClick={() => handleEdit(event)} />
                <FontAwesomeIcon icon={faTrashAlt} className="text-red-600 hover:text-red-700 cursor-pointer" onClick={() => handleDelete(event.id)} />
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-500">No Events</p>
          </div>
        )}
      </div>
      <div className="fixed bottom-4 right-4">
        <Link to="/admin/create" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md">
          Add Event
        </Link>
      </div>
    </div>
  );
};

export default AdminHome;
