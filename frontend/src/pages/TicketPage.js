import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchMovieByIdFromAdmin } from '../services/adminService';
import { createBooking } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Default showtimes - in a real app, these would be fetched from an API
const defaultShowTimes = [
  { id: 1, date: "Today, April 6", time: "10:00 AM", available: true },
  { id: 2, date: "Today, April 6", time: "1:30 PM", available: true },
  { id: 3, date: "Today, April 6", time: "4:15 PM", available: false },
  { id: 4, date: "Today, April 6", time: "7:00 PM", available: true },
  { id: 5, date: "Today, April 6", time: "9:45 PM", available: true },
  { id: 6, date: "Tomorrow, April 7", time: "10:00 AM", available: true },
  { id: 7, date: "Tomorrow, April 7", time: "1:30 PM", available: true },
  { id: 8, date: "Tomorrow, April 7", time: "4:15 PM", available: true },
  { id: 9, date: "Tomorrow, April 7", time: "7:00 PM", available: true },
  { id: 10, date: "Tomorrow, April 7", time: "9:45 PM", available: true }
];

const TicketPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("Today, April 6");
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  
  // Fetch movie details based on the id
  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        // Get movie data from the admin side using adminService
        const movieData = await fetchMovieByIdFromAdmin(parseInt(id));
        
        if (movieData) {
          // Add showtimes to the movie data
          setMovie({
            ...movieData,
            showTimes: defaultShowTimes
          });
        } else {
          console.error('Movie not found in admin data');
          // If movie not found in admin data, try to fetch from localStorage as fallback
          const moviesData = localStorage.getItem('movies');
          if (moviesData) {
            const allMovies = JSON.parse(moviesData);
            const fallbackMovie = allMovies.find(m => m.id === parseInt(id));
            if (fallbackMovie) {
              setMovie({
                ...fallbackMovie,
                showTimes: defaultShowTimes
              });
            }
          }
        }
      } catch (error) {
        console.error('Error fetching movie data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovieData();
  }, [id]);
  
  // Show loading state while fetching movie data
  if (loading || !movie) {
    return (
      <div className="bg-dark py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white text-xl">Loading ticket information...</p>
        </div>
      </div>
    );
  }

  // Filter showtimes by selected date
  const filteredShowTimes = movie.showTimes.filter(
    showTime => showTime.date === selectedDate && showTime.available
  );

  // Generate a 8x8 seat grid
  const generateSeats = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seats = [];
    
    for (let i = 0; i < rows.length; i++) {
      const row = [];
      for (let j = 1; j <= 8; j++) {
        // Randomly mark some seats as taken
        const isTaken = Math.random() < 0.3;
        row.push({
          id: `${rows[i]}${j}`,
          row: rows[i],
          number: j,
          status: isTaken ? 'taken' : 'available'
        });
      }
      seats.push(row);
    }
    
    return seats;
  };

  const seats = generateSeats();

  const handleSeatClick = (seatId) => {
    const seat = seats.flat().find(s => s.id === seatId);
    
    if (seat.status === 'taken') return;
    
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      if (selectedSeats.length < quantity) {
        setSelectedSeats([...selectedSeats, seatId]);
      }
    }
  };

  const handleNextStep = () => {
    if (step === 1 && selectedTime) {
      setStep(2);
    } else if (step === 2 && selectedSeats.length === quantity) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const calculateTotal = () => {
    // Fixed price for all tickets
    const basePrice = 12;
    
    return basePrice * quantity;
  };

  // Submit the booking to the backend
  const handleConfirmBooking = async () => {
    setBookingLoading(true);
    setBookingError(null);

    try {
      const total = calculateTotal() + 2 + calculateTotal() * 0.08;
      await createBooking({
        movieId: Number(id),
        movieTitle: movie.title,
        customerName,
        email: currentUser?.email || '',
        phone,
        date: selectedDate,
        time: (movie.showTimes.find((s) => s.id === selectedTime) || {}).time || '',
        seats: selectedSeats,
        ticketCount: quantity,
        totalAmount: Number(total.toFixed(2)),
      });
      navigate('/');
    } catch (err) {
      setBookingError(err.message || 'Booking failed. Please try again.');
      setBookingLoading(false);
    }
  };

  return (
    <div className="bg-dark py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Booking Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className={`flex-1 text-center ${step >= 1 ? 'text-primary' : 'text-gray-500'}`}>
                <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-700 text-gray-400'}`}>
                  1
                </div>
                <p className="mt-2">Select Time</p>
              </div>
              <div className={`flex-1 border-t-2 ${step >= 2 ? 'border-primary' : 'border-gray-700'}`}></div>
              <div className={`flex-1 text-center ${step >= 2 ? 'text-primary' : 'text-gray-500'}`}>
                <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-700 text-gray-400'}`}>
                  2
                </div>
                <p className="mt-2">Choose Seats</p>
              </div>
              <div className={`flex-1 border-t-2 ${step >= 3 ? 'border-primary' : 'border-gray-700'}`}></div>
              <div className={`flex-1 text-center ${step >= 3 ? 'text-primary' : 'text-gray-500'}`}>
                <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-700 text-gray-400'}`}>
                  3
                </div>
                <p className="mt-2">Payment</p>
              </div>
            </div>
          </div>

          {/* Movie Info */}
          <div className="bg-secondary rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/4 mb-4 md:mb-0">
                <img 
                  src={movie.poster} 
                  alt={movie.title} 
                  className="w-full rounded"
                />
              </div>
              <div className="md:w-3/4 md:pl-6">
                <h1 className="text-2xl font-bold text-white mb-2">{movie.title}</h1>
                <div className="flex items-center text-gray-300 space-x-4 mb-4">
                  <span>{movie.genre}</span>
                  <span>•</span>
                  <span>{movie.duration}</span>
                  <span>•</span>
                  <span className="flex items-center">
                    <svg className="w-5 h-5 text-primary mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {movie.rating}/10
                  </span>
                </div>
                {step === 1 && (
                  <>
                    <div className="mb-4">
                      <label className="block text-gray-300 mb-2">Select Date</label>
                      <select 
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        value={selectedDate}
                        onChange={(e) => {
                          setSelectedDate(e.target.value);
                          setSelectedTime(null);
                        }}
                      >
                        <option>Today, April 6</option>
                        <option>Tomorrow, April 7</option>
                        <option>Wednesday, April 8</option>
                        <option>Thursday, April 9</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-300 mb-2">Select Time</label>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {filteredShowTimes.map((showTime) => (
                          <button 
                            key={showTime.id}
                            className={`py-2 px-3 rounded text-center ${
                              selectedTime === showTime.time 
                                ? 'bg-primary text-white' 
                                : 'bg-gray-700 text-white hover:bg-gray-600 transition duration-300'
                            }`}
                            onClick={() => setSelectedTime(showTime.time)}
                          >
                            {showTime.time}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 mb-6">
                      <div>
                        <label className="block text-gray-300 mb-2">Quantity</label>
                        <select 
                          className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-primary"
                          value={quantity}
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value);
                            setQuantity(newQuantity);
                            // If new quantity is less than selected seats, adjust selected seats
                            if (newQuantity < selectedSeats.length) {
                              setSelectedSeats(selectedSeats.slice(0, newQuantity));
                            }
                          }}
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                )}
                {step === 2 && (
                  <div className="mb-4">
                    <p className="text-gray-300 mb-2">
                      <span className="font-bold">Date:</span> {selectedDate}
                    </p>
                    <p className="text-gray-300 mb-2">
                      <span className="font-bold">Time:</span> {selectedTime}
                    </p>

                    <p className="text-gray-300 mb-2">
                      <span className="font-bold">Quantity:</span> {quantity}
                    </p>
                    <p className="text-gray-300 mb-4">
                      <span className="font-bold">Selected Seats:</span> {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
                    </p>
                  </div>
                )}
                {step === 3 && (
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-4">Booking Summary</h3>
                    <div className="bg-gray-800 p-4 rounded mb-4">
                      <p className="text-gray-300 mb-2">
                        <span className="font-bold">Movie:</span> {movie.title}
                      </p>
                      <p className="text-gray-300 mb-2">
                        <span className="font-bold">Date:</span> {selectedDate}
                      </p>
                      <p className="text-gray-300 mb-2">
                        <span className="font-bold">Time:</span> {selectedTime}
                      </p>

                      <p className="text-gray-300 mb-2">
                        <span className="font-bold">Seats:</span> {selectedSeats.join(', ')}
                      </p>
                      <div className="border-t border-gray-700 my-2 pt-2">
                        <p className="text-gray-300 flex justify-between">
                          <span className="font-bold">Subtotal:</span> 
                          <span>${calculateTotal().toFixed(2)}</span>
                        </p>
                        <p className="text-gray-300 flex justify-between">
                          <span className="font-bold">Booking Fee:</span> 
                          <span>$2.00</span>
                        </p>
                        <p className="text-gray-300 flex justify-between">
                          <span className="font-bold">Tax:</span> 
                          <span>${(calculateTotal() * 0.08).toFixed(2)}</span>
                        </p>
                        <p className="text-white font-bold flex justify-between mt-2 text-lg">
                          <span>Total:</span> 
                          <span>${(calculateTotal() + 2 + calculateTotal() * 0.08).toFixed(2)}</span>
                        </p>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-4">Payment Method</h3>
                    <div className="grid grid-cols-1 gap-4 mb-6">
                      <div className="p-4 border rounded-lg border-orange-500 bg-gray-700">
                        <div className="flex items-center mb-2">
                          <span className="text-white font-medium">Cash on Delivery</span>
                        </div>
                        <p className="text-gray-400 text-sm">Pay cash when you collect your tickets at the theater</p>
                      </div>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg mb-4">
                        <div className="flex items-start mb-4">
                          <div className="flex-shrink-0 mt-1">
                            <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-gray-300 text-sm">You will need to pay the total amount of <span className="font-bold text-white">${(calculateTotal() + 2 + calculateTotal() * 0.08).toFixed(2)}</span> when you collect your tickets at the theater. Please bring the exact amount.</p>
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-300 mb-2">Your Name</label>
                          <input
                            type="text"
                            placeholder="Enter your full name"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-2">Phone Number</label>
                          <input
                            type="text"
                            placeholder="Enter your phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Seat Selection (Step 2) */}
          {step === 2 && (
            <div className="bg-secondary rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Select Your Seats</h2>
              <div className="mb-6">
                <div className="flex justify-center mb-8">
                  <div className="w-full max-w-2xl">
                    <div className="bg-gray-800 p-4 rounded-lg text-center mb-6">
                      <p className="text-gray-300 uppercase tracking-wider">Screen</p>
                    </div>
                    <div className="grid gap-2">
                      {seats.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex justify-center gap-2">
                          <div className="w-6 flex items-center justify-center text-gray-300">
                            {row[0].row}
                          </div>
                          {row.map((seat) => (
                            <button
                              key={seat.id}
                              className={`w-8 h-8 rounded-md flex items-center justify-center ${
                                seat.status === 'taken' 
                                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                                  : selectedSeats.includes(seat.id)
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-600 text-white hover:bg-gray-500'
                              }`}
                              onClick={() => handleSeatClick(seat.id)}
                              disabled={seat.status === 'taken'}
                            >
                              {seat.number}
                            </button>
                          ))}
                          <div className="w-6 flex items-center justify-center text-gray-300">
                            {row[0].row}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-center space-x-8">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-gray-600 rounded-md mr-2"></div>
                    <span className="text-gray-300">Available</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-primary rounded-md mr-2"></div>
                    <span className="text-gray-300">Selected</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-gray-700 rounded-md mr-2"></div>
                    <span className="text-gray-300">Taken</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                Please select {quantity} seat{quantity > 1 ? 's' : ''}. 
                You have selected {selectedSeats.length} of {quantity}.
              </p>
            </div>
          )}

          {bookingError && (
            <div className="bg-red-600 text-white p-3 rounded mb-4 text-center">
              {bookingError}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            {step > 1 ? (
              <button
                className="bg-gray-700 text-white px-6 py-3 rounded hover:bg-gray-600 transition duration-300"
                onClick={handlePrevStep}
              >
                Back
              </button>
            ) : (
              <Link
                to={`/movie/${id}`}
                className="bg-gray-700 text-white px-6 py-3 rounded hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </Link>
            )}
            
            {step < 3 ? (
              <button
                className={`btn-primary px-6 py-3 ${
                  (step === 1 && !selectedTime) || (step === 2 && selectedSeats.length !== quantity)
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
                onClick={handleNextStep}
                disabled={(step === 1 && !selectedTime) || (step === 2 && selectedSeats.length !== quantity)}
              >
                Continue
              </button>
            ) : (
              <button
                className={`btn-primary px-6 py-3 ${bookingLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                onClick={handleConfirmBooking}
                disabled={bookingLoading}
              >
                {bookingLoading ? 'Booking...' : 'Confirm Booking'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketPage;
