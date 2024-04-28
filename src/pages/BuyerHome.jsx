/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import API from '../utils/axios';
import { formatDate } from '../utils/formatDate';
import NavBar from '../navbar/nav';
import Swal from 'sweetalert2';
import { toast } from "react-toastify";
import Loader from '../utils/Loader';

const BuyerHome = () => {
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Booking, setBooking] = useState({});

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await API.get('/services', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        const formattedEvents = response.data.data.map(event => ({
          ...event,
          date: formatDate(event.date)
        }));
        setEventsData(formattedEvents);
      }
    } catch (error) {
      toast.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [])

  const handleBookEvent = async (serviceId) => {
    const { value: formValues } = await Swal.fire({
      title: 'Number of Ticket',
      showCancelButton: true,
      html:
        '<input id="swal-input1" type="text" class="swal2-input" style="width: 70%; height:40px">',

      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value
        ]
      }
    })

    if (formValues) {
      const userId = localStorage.getItem('userId');
      try {
        setBooking(prevState => ({ ...prevState, [serviceId]: true }));
        await API.post('/services/bookservice', {
          userId,
          serviceId,
          numberOfTicket: formValues[0]
        });
        toast.success('The event has been booked successfully');
        fetchEvents();
      } catch (error) {
        toast.error('There was an error booking the event');
      } finally {
        setBooking(prevState => ({ ...prevState, [serviceId]: false }));
      }
    }
  };

  return (
    <div>
      <NavBar />
      <div className="container mx-auto py-8 px-4">
        <h2 className="text-2xl font-semibold mb-2"> Events</h2>
        {loading ? (
          <Loader />
        ) : eventsData.length > 0 ? (
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Tickets Available</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {eventsData.map((event, index) => (
                <tr key={`event-${index}`}>
                  <td className="px-6 py-4">{event.title}</td>
                  <td className="px-6 py-4">{event.date}</td>
                  <td className="px-6 py-4">{event.location}</td>
                  <td className="px-6 py-4">{event.ticketAvailability}</td>
                  <td className="px-6 py-4">
                    <div className='flex gap-2'>
                      <button className="text-white cursor-pointer border border-green-600 px-2 py-2 rounded-lg bg-green-600 w-20" onClick={() => handleBookEvent(event.id)}>
                        {Booking[event.id] ? (
                          <Loader /> 
                        ) : (
                          'Book' 
                        )}
                      </button>
                    </div>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-500">No Events</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerHome;
