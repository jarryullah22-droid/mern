import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TicketBookingWidget = ({ movieId, movieTitle }) => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(formatDate(today));
  const [selectedTime, setSelectedTime] = useState(null);

  // Format date as "Today, Month Day" or "Tomorrow, Month Day" or "Day, Month Day"
  function formatDate(date) {
    const options = { month: 'long', day: 'numeric' };
    const dateString = date.toLocaleDateString('en-US', options);
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${dateString}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${dateString}`;
    } else {
      const dayOptions = { weekday: 'long' };
      const dayString = date.toLocaleDateString('en-US', dayOptions);
      return `${dayString}, ${dateString}`;
    }
  }

  // Generate next 7 days for date selection
  const generateDateOptions = () => {
    const options = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      options.push({
        value: formatDate(date),
        date: date
      });
    }
    return options;
  };

  // Showtimes for the selected date
  const showtimes = [
    { id: 1, time: "10:00 AM" },
    { id: 2, time: "1:30 PM" },
    { id: 3, time: "4:15 PM" },
    { id: 4, time: "7:00 PM" },
    { id: 5, time: "9:45 PM" }
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4">Showtimes</h3>
      
      {/* Date Selection */}
      <div className="mb-4">
        <label htmlFor="date-select" className="block text-sm text-gray-400 mb-2">
          Select Date
        </label>
        <select
          id="date-select"
          className="w-full bg-gray-700 text-white py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        >
          {generateDateOptions().map((option, index) => (
            <option key={index} value={option.value}>
              {option.value}
            </option>
          ))}
        </select>
      </div>
      
      {/* Available Times */}
      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-2">Available Times</p>
        <div className="grid grid-cols-2 gap-2">
          {showtimes.map((showtime) => (
            <button
              key={showtime.id}
              className={`py-2 px-4 rounded-md text-center transition-colors duration-300 ${
                selectedTime === showtime.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
              onClick={() => setSelectedTime(showtime.id)}
            >
              {showtime.time}
            </button>
          ))}
        </div>
      </div>
      
      {/* Book Tickets Button */}
      <Link 
        to={selectedTime ? `/ticket/${movieId}?time=${selectedTime}&date=${encodeURIComponent(selectedDate)}` : '#'}
        className={`w-full block text-center py-3 px-4 rounded-md font-medium transition-colors duration-300 ${
          selectedTime 
            ? 'bg-orange-500 text-white hover:bg-orange-600' 
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
        }`}
        onClick={(e) => !selectedTime && e.preventDefault()}
      >
        Book Tickets
      </Link>
    </div>
  );
};

export default TicketBookingWidget;
