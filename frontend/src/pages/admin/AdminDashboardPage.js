import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  fetchAdminStats,
  fetchAdminUsers,
  fetchAdminBookings,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  createMovie,
  updateMovie,
  deleteMovie,
} from '../../services/api';
import { addImagesToMovies, fetchAllMoviesFromAdmin } from '../../services/adminService';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { isAdminAuthenticated, currentAdmin, adminLogout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [adminData, setAdminData] = useState(null);
  
  // Stats state
  const [stats, setStats] = useState({
    totalMovies: 0,
    activeMovies: 0,
    totalUsers: 0,
    totalBookings: 0,
    revenue: 0
  });

  // Data states
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  
  // User management states
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    isAdmin: false
  });

  // Movie management states
  const [isAddingMovie, setIsAddingMovie] = useState(false);
  const [isEditingMovie, setIsEditingMovie] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [newMovie, setNewMovie] = useState({
    title: '',
    status: 'upcoming',
    screenings: 0,
    bookings: 0,
    image: null,
    imagePreview: '',
    trailer: null,
    trailerUrl: ''
  });
  
  // Function to handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for the UI
      const previewUrl = URL.createObjectURL(file);
      
      // Compress the image before storing
      compressImage(file, 800, 600, 0.7, (compressedBase64) => {
        setNewMovie({
          ...newMovie,
          image: file,
          imagePreview: previewUrl, // For UI preview
          imageData: compressedBase64 // Compressed data for storage
        });
      });
    }
  };
  
  // Function to compress images
  const compressImage = (file, maxWidth, maxHeight, quality, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        // Create a canvas to resize the image
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Get compressed image as base64 string
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        callback(compressedBase64);
      };
    };
  };
  
  // Function to handle trailer upload
  const handleTrailerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for the UI
      const previewUrl = URL.createObjectURL(file);
      
      // For trailers, we'll use a smaller file size approach
      // Read the file as a data URL but with limited size
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMovie({
          ...newMovie,
          trailer: file,
          trailerUrl: previewUrl, // For UI preview
          trailerData: reader.result // Store the data for persistence
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Function to handle user form submission
  const handleUserSubmit = async () => {
    if (!newUser.name || !newUser.email) {
      alert('Please enter name and email');
      return;
    }

    try {
      if (isEditingUser && selectedUser) {
        await updateAdminUser(selectedUser.id, {
          name: newUser.name,
          email: newUser.email,
          isAdmin: newUser.isAdmin,
          ...(newUser.password ? { password: newUser.password } : {}),
        });
        setIsEditingUser(false);
      } else {
        await createAdminUser({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password || 'password123',
          isAdmin: newUser.isAdmin,
        });
        setIsAddingUser(false);
      }

      setNewUser({ name: '', email: '', password: '', isAdmin: false });
      setSelectedUser(null);
      await loadDashboardData();
    } catch (error) {
      alert(error.message || 'Failed to save user');
    }
  };

  // Function to handle editing a user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      password: '',
      isAdmin: user.isAdmin || false
    });
    setIsEditingUser(true);
    setIsAddingUser(true);
  };
  
  // Function to handle deleting a user
  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteAdminUser(id);
        await loadDashboardData();
      } catch (error) {
        alert(error.message || 'Failed to delete user');
      }
    }
  };

  // Function to handle movie form submission (add or edit)
  const handleMovieSubmit = async () => {
    if (!newMovie.title) {
      alert('Please enter a movie title');
      return;
    }

    const adminName = adminData?.name || currentAdmin?.name || 'Admin';
    const currentDate = new Date().toISOString().split('T')[0];

    // Process image and trailer files (base64 data URLs)
    let imageUrl = '';
    let trailerUrl = '';

    if (newMovie.imageData) {
      imageUrl = newMovie.imageData;
    } else if (newMovie.imagePreview && !newMovie.imagePreview.startsWith('blob:')) {
      imageUrl = newMovie.imagePreview;
    }

    if (newMovie.trailerData) {
      trailerUrl = newMovie.trailerData;
    } else if (newMovie.trailerUrl && !newMovie.trailerUrl.startsWith('blob:')) {
      trailerUrl = newMovie.trailerUrl;
    }

    try {
      if (isEditingMovie && selectedMovie) {
        let updatedTrailers = selectedMovie.trailers || [];

        if (trailerUrl && trailerUrl !== selectedMovie.trailerUrl) {
          const exists = updatedTrailers.some((t) => t.url === trailerUrl);
          if (!exists) {
            updatedTrailers = [
              {
                title: `${newMovie.title} - Official Trailer`,
                url: trailerUrl,
                description: `Official trailer for ${newMovie.title}`,
                duration: '2:30',
              },
              ...updatedTrailers,
            ];
          }
        }

        await updateMovie(selectedMovie.id, {
          title: newMovie.title,
          status: newMovie.status,
          screenings: parseInt(newMovie.screenings) || 0,
          bookings: parseInt(newMovie.bookings) || 0,
          imageUrl: imageUrl || selectedMovie.imageUrl || '',
          trailerUrl: trailerUrl || selectedMovie.trailerUrl || '',
          trailers: updatedTrailers,
        });

        setIsEditingMovie(false);
      } else {
        const movieToAdd = {
          title: newMovie.title,
          status: newMovie.status,
          screenings: parseInt(newMovie.screenings) || 0,
          bookings: parseInt(newMovie.bookings) || 0,
          imageUrl: imageUrl,
          trailerUrl: trailerUrl,
          addedBy: adminName,
          dateAdded: currentDate,
          genre: 'Action',
          rating: 4.0,
          duration: '2h 0m',
          releaseDate: currentDate,
          description: `${newMovie.title} is a new movie added to the system.`,
          director: 'Unknown',
          cast: ['Actor 1', 'Actor 2'],
          language: 'English',
          trailers: trailerUrl
            ? [
                {
                  title: `${newMovie.title} - Official Trailer`,
                  url: trailerUrl,
                  description: `Official trailer for ${newMovie.title}`,
                  duration: '2:30',
                },
              ]
            : [],
        };

        await createMovie(movieToAdd);
      }

      // Reset form
      setNewMovie({
        title: '',
        status: 'upcoming',
        screenings: 0,
        bookings: 0,
        image: null,
        imagePreview: '',
        trailer: null,
        trailerUrl: '',
      });
      setSelectedMovie(null);
      setIsAddingMovie(false);

      await loadDashboardData();
    } catch (error) {
      alert(error.message || 'Failed to save movie');
    }
  };

  // Function to handle editing a movie
  const handleEditMovie = (movie) => {
    setSelectedMovie(movie);
    
    // Get the trailer URL from the movie data
    let trailerUrl = movie.trailerUrl || '';
    
    setNewMovie({
      title: movie.title,
      status: movie.status,
      screenings: movie.screenings,
      bookings: movie.bookings,
      image: null,
      imagePreview: movie.imageUrl || '', // Handle null/undefined case
      imageData: movie.imageUrl || '', // Keep the existing image data
      trailer: null,
      trailerUrl: trailerUrl || '', // Handle null/undefined case
      trailerData: trailerUrl || '', // Store the trailer data for persistence
      trailers: movie.trailers || [] // Include existing trailers if available
    });
    
    setIsEditingMovie(true);
    setIsAddingMovie(true);
  };


  // Function to delete a movie
  const handleDeleteMovie = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await deleteMovie(id);
        await loadDashboardData();
      } catch (error) {
        alert(error.message || 'Failed to delete movie');
      }
    }
  };


  // Show the current admin's name
  useEffect(() => {
    setAdminData(currentAdmin || null);
  }, [currentAdmin]);

  // Load all dashboard data from the backend API
  const loadDashboardData = async () => {
    try {
      const [statsData, usersData, moviesData, bookingsData] = await Promise.all([
        fetchAdminStats(),
        fetchAdminUsers(),
        fetchAllMoviesFromAdmin(),
        fetchAdminBookings(),
      ]);

      setStats({
        totalMovies: statsData?.totalMovies || 0,
        activeMovies: statsData?.activeMovies || 0,
        totalUsers: statsData?.totalUsers || 0,
        totalBookings: statsData?.totalBookings || 0,
        revenue: statsData?.revenue || 0,
      });

      // Users (admins are hidden from the user-management table)
      const normalUsers = (usersData || [])
        .filter((u) => !u.isAdmin)
        .map((u) => ({
          ...u,
          id: u._id,
          joined: u.createdAt ? String(u.createdAt).split('T')[0] : new Date().toISOString().split('T')[0],
          bookings: 0,
        }));
      setUsers(normalUsers);

      // Movies (with fallback images)
      setMovies(addImagesToMovies(Array.isArray(moviesData) ? moviesData : []));

      // Bookings, normalised to the shape the table expects
      const enhancedBookings = (bookingsData || []).map((b) => ({
        ...b,
        id: b._id || b.id,
        movie: b.movieTitle || (b.movieId ? `Movie #${b.movieId}` : 'Unknown Movie'),
        user: b.customerName || 'Guest',
        seats: Array.isArray(b.seats) ? b.seats.join(', ') : b.seats || '',
        quantity: b.ticketCount || 0,
        total: b.totalAmount || 0,
        status: b.status ? b.status.charAt(0).toUpperCase() + b.status.slice(1) : 'Confirmed',
      }));
      setBookings(enhancedBookings);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  // Load once the admin is authenticated
  useEffect(() => {
    if (isAdminAuthenticated) {
      loadDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdminAuthenticated]);

  // Check if admin is authenticated
  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/admin/login');
    }
    // We're using a separate admin authentication system, so we know this is an admin
  }, [isAdminAuthenticated, navigate]);
  
  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };
  
  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Admin Header */}
      <header className="bg-gray-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Movie Theater Admin</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Welcome, {adminData?.name || currentAdmin?.name || 'Admin'}</span>
            <button 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white text-sm py-1 px-3 rounded transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      {/* Admin Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-gray-800 rounded-lg shadow-md p-4">
            <nav>
              <ul className="space-y-2">
                <li>
                  <button
                    className={`w-full text-left px-4 py-2 rounded ${activeTab === 'dashboard' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                    onClick={() => setActiveTab('dashboard')}
                  >
                    Dashboard
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left px-4 py-2 rounded ${activeTab === 'movies' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                    onClick={() => setActiveTab('movies')}
                  >
                    Movies
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left px-4 py-2 rounded ${activeTab === 'users' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                    onClick={() => setActiveTab('users')}
                  >
                    Users
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left px-4 py-2 rounded ${activeTab === 'bookings' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                    onClick={() => setActiveTab('bookings')}
                  >
                    Bookings
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left px-4 py-2 rounded ${activeTab === 'settings' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                    onClick={() => setActiveTab('settings')}
                  >
                    Settings
                  </button>
                </li>
                <li className="pt-4 mt-4 border-t border-gray-700">
                  <Link
                    to="/"
                    className="block px-4 py-2 text-gray-300 hover:text-white"
                  >
                    View Website
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 bg-gray-800 rounded-lg shadow-md p-6">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h2>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-700 rounded-lg p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-400 text-sm">Total Movies</p>
                        <h3 className="text-3xl font-bold text-white">{stats.totalMovies}</h3>
                      </div>
                      <div className="bg-blue-500 p-3 rounded-full">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path>
                        </svg>
                      </div>
                    </div>
                    <p className="text-green-400 text-sm mt-2">{stats.activeMovies} active now</p>
                  </div>
                  
                  <div className="bg-gray-700 rounded-lg p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-400 text-sm">Total Users</p>
                        <h3 className="text-3xl font-bold text-white">{stats.totalUsers}</h3>
                      </div>
                      <div className="bg-purple-500 p-3 rounded-full">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                        </svg>
                      </div>
                    </div>
                    <p className="text-green-400 text-sm mt-2">{users.length > 0 ? users.filter(user => {
                      const joinDate = new Date(user.joined);
                      const oneWeekAgo = new Date();
                      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                      return joinDate >= oneWeekAgo;
                    }).length : 0} this week</p>
                  </div>
                  

                </div>
                
                {/* Recent Bookings */}
                <div className="bg-gray-700 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-bold text-white mb-4">Recent Bookings</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                      <thead className="text-xs uppercase text-gray-400 border-b border-gray-600">
                        <tr>
                          <th className="px-4 py-3">ID</th>
                          <th className="px-4 py-3">Movie</th>
                          <th className="px-4 py-3">User</th>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Seats</th>
                          <th className="px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.length > 0 ? (
                          bookings.slice(0, 5).map(booking => (
                            <tr key={booking.id} className="border-b border-gray-600">
                              <td className="px-4 py-3">{booking.id}</td>
                              <td className="px-4 py-3">{booking.movie}</td>
                              <td className="px-4 py-3">{booking.user}</td>
                              <td className="px-4 py-3">{booking.date}</td>
                              <td className="px-4 py-3">{booking.seats}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded text-xs ${booking.status === 'Cancelled' ? 'bg-red-800 text-red-200' : booking.status === 'Completed' ? 'bg-blue-800 text-blue-200' : 'bg-green-800 text-green-200'}`}>
                                  {booking.status || 'Confirmed'}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className="border-b border-gray-600">
                            <td colSpan="6" className="px-4 py-3 text-center">No bookings found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Quick Actions section removed */}
              </div>
            )}
            
            {/* Movies Tab */}
            {activeTab === 'movies' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Movies Management</h2>
                  <button 
                    className="bg-primary hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-300"
                    onClick={() => setIsAddingMovie(true)}
                  >
                    Add New Movie
                  </button>
                </div>
                
                {/* Add/Edit Movie Form */}
                {isAddingMovie && (
                  <div className="bg-gray-700 rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-bold text-white mb-4">
                      {isEditingMovie ? 'Edit Movie' : 'Add New Movie'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">Movie Title</label>
                        <input 
                          type="text" 
                          className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2"
                          value={newMovie.title}
                          onChange={(e) => setNewMovie({...newMovie, title: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">Status</label>
                        <select 
                          className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2"
                          value={newMovie.status}
                          onChange={(e) => setNewMovie({...newMovie, status: e.target.value})}
                        >
                          <option value="active">Active</option>
                          <option value="upcoming">Upcoming</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">Screenings</label>
                        <input 
                          type="number" 
                          className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2"
                          value={newMovie.screenings}
                          onChange={(e) => setNewMovie({...newMovie, screenings: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">Bookings</label>
                        <input 
                          type="number" 
                          className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2"
                          value={newMovie.bookings}
                          onChange={(e) => setNewMovie({...newMovie, bookings: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">Movie Image</label>
                        <input 
                          type="file" 
                          accept="image/*"
                          className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2"
                          onChange={handleImageUpload}
                        />
                        {newMovie.imagePreview && (
                          <div className="mt-2">
                            <img 
                              src={newMovie.imagePreview} 
                              alt="Movie preview" 
                              className="w-32 h-32 object-cover rounded"
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">Movie Trailer</label>
                        <input 
                          type="file" 
                          accept="video/*"
                          className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2"
                          onChange={handleTrailerUpload}
                        />
                        {newMovie.trailerUrl && (
                          <div className="mt-2">
                            <video 
                              src={newMovie.trailerUrl} 
                              controls 
                              className="w-full h-32 object-cover rounded"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button 
                        className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded transition duration-300"
                        onClick={() => setIsAddingMovie(false)}
                      >
                        Cancel
                      </button>
                      <button 
                        className="bg-primary hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-300"
                        onClick={handleMovieSubmit}
                      >
                        {isEditingMovie ? 'Update Movie' : 'Add Movie'}
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="bg-gray-700 rounded-lg p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                      <thead className="text-xs uppercase text-gray-400 border-b border-gray-600">
                        <tr>
                          <th className="px-4 py-3">ID</th>
                          <th className="px-4 py-3">Title</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Screenings</th>
                          <th className="px-4 py-3">Bookings</th>
                          <th className="px-4 py-3">Added By</th>
                          <th className="px-4 py-3">Date Added</th>
                          <th className="px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {movies.length > 0 ? (
                          movies.map(movie => (
                            <tr key={movie.id} className="border-b border-gray-600">
                              <td className="px-4 py-3">{movie.id}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center">
                                  {movie.imageUrl && (
                                    <img 
                                      src={movie.imageUrl} 
                                      alt={movie.title} 
                                      className="w-10 h-10 mr-2 object-cover rounded"
                                    />
                                  )}
                                  {movie.title}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded text-xs ${movie.status === 'active' ? 'bg-green-800 text-green-200' : 'bg-yellow-800 text-yellow-200'}`}>
                                  {movie.status}
                                </span>
                              </td>
                              <td className="px-4 py-3">{movie.screenings || 0}</td>
                              <td className="px-4 py-3">{movie.bookings || 0}</td>
                              <td className="px-4 py-3">{movie.addedBy || 'Admin'}</td>
                              <td className="px-4 py-3">{movie.dateAdded || 'N/A'}</td>
                              <td className="px-4 py-3">
                                <button 
                                  className="text-blue-400 hover:text-blue-300 mr-2"
                                  onClick={() => handleEditMovie(movie)}
                                >
                                  Edit
                                </button>
                                <button 
                                  className="text-red-400 hover:text-red-300"
                                  onClick={() => handleDeleteMovie(movie.id)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className="border-b border-gray-600">
                            <td colSpan="8" className="px-4 py-3 text-center">No movies found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Users Management</h2>
                </div>
                
                {/* Add/Edit User Form */}
                {isAddingUser && (
                  <div className="bg-gray-700 rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-bold text-white mb-4">
                      {isEditingUser ? 'Edit User' : 'Add New User'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">Name</label>
                        <input 
                          type="text" 
                          className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2"
                          value={newUser.name}
                          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">Email</label>
                        <input 
                          type="email" 
                          className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2"
                          value={newUser.email}
                          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        />
                      </div>
                      {!isEditingUser && (
                        <div>
                          <label className="block text-gray-400 text-sm mb-1">Password</label>
                          <input 
                            type="password" 
                            className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2"
                            value={newUser.password}
                            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                          />
                        </div>
                      )}
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="isAdmin"
                          className="mr-2"
                          checked={newUser.isAdmin}
                          onChange={(e) => setNewUser({...newUser, isAdmin: e.target.checked})}
                        />
                        <label htmlFor="isAdmin" className="text-gray-400 text-sm">Admin User</label>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button 
                        className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded transition duration-300"
                        onClick={() => {
                          setIsAddingUser(false);
                          setIsEditingUser(false);
                          setSelectedUser(null);
                        }}
                      >
                        Cancel
                      </button>
                      <button 
                        className="bg-primary hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-300"
                        onClick={handleUserSubmit}
                      >
                        {isEditingUser ? 'Update User' : 'Add User'}
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="bg-gray-700 rounded-lg p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                      <thead className="text-xs uppercase text-gray-400 border-b border-gray-600">
                        <tr>
                          <th className="px-4 py-3">ID</th>
                          <th className="px-4 py-3">Name</th>
                          <th className="px-4 py-3">Email</th>
                          <th className="px-4 py-3">Admin</th>
                          <th className="px-4 py-3">Bookings</th>
                          <th className="px-4 py-3">Joined</th>
                          <th className="px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length > 0 ? (
                          users.map(user => (
                            <tr key={user.id} className="border-b border-gray-600">
                              <td className="px-4 py-3">{user.id}</td>
                              <td className="px-4 py-3">{user.name}</td>
                              <td className="px-4 py-3">{user.email}</td>
                              <td className="px-4 py-3">
                                {user.isAdmin ? (
                                  <span className="px-2 py-1 bg-purple-800 text-purple-200 rounded text-xs">Admin</span>
                                ) : (
                                  <span className="px-2 py-1 bg-gray-600 text-gray-300 rounded text-xs">User</span>
                                )}
                              </td>
                              <td className="px-4 py-3">{user.bookings}</td>
                              <td className="px-4 py-3">{user.joined}</td>
                              <td className="px-4 py-3">
                                <button 
                                  className="text-blue-400 hover:text-blue-300 mr-2"
                                  onClick={() => handleEditUser(user)}
                                >
                                  Edit
                                </button>
                                <button 
                                  className="text-red-400 hover:text-red-300"
                                  onClick={() => handleDeleteUser(user.id)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className="border-b border-gray-600">
                            <td colSpan="6" className="px-4 py-3 text-center">No users found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Bookings Management</h2>
                </div>
                
                {/* Booking Filters */}
                <div className="bg-gray-700 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-bold text-white mb-4">Booking Statistics</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-gray-800 p-4 rounded">
                      <p className="text-gray-400 text-sm">Total Bookings</p>
                      <p className="text-2xl font-bold text-white">{bookings.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                      <thead className="text-xs uppercase text-gray-400 border-b border-gray-600">
                        <tr>
                          <th className="px-4 py-3">ID</th>
                          <th className="px-4 py-3">Movie</th>
                          <th className="px-4 py-3">User</th>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Seats</th>
                          <th className="px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.length > 0 ? (
                          bookings.map(booking => (
                            <tr key={booking.id} className="border-b border-gray-600">
                              <td className="px-4 py-3">{booking.id}</td>
                              <td className="px-4 py-3">
                                {booking.movieDetails ? (
                                  <div className="flex items-center">
                                    {booking.movieDetails.imageUrl || booking.movieDetails.poster ? (
                                      <img 
                                        src={booking.movieDetails.imageUrl || booking.movieDetails.poster} 
                                        alt={booking.movie} 
                                        className="w-10 h-14 object-cover rounded mr-2"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = 'https://via.placeholder.com/40x56?text=No+Image';
                                        }}
                                      />
                                    ) : null}
                                    <span>{booking.movie}</span>
                                  </div>
                                ) : (
                                  booking.movie
                                )}
                              </td>
                              <td className="px-4 py-3">
                                {booking.userDetails ? (
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-2">
                                      <span className="text-sm text-white">{booking.user.charAt(0)}</span>
                                    </div>
                                    <span>{booking.user}</span>
                                  </div>
                                ) : (
                                  booking.user
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <div>
                                  <div>{booking.date}</div>
                                  <div className="text-xs text-gray-400">{booking.time}</div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div>
                                  <div>{booking.seats}</div>
                                  <div className="text-xs text-gray-400">{booking.ticketType || 'Regular'} ({booking.quantity || 1})</div>
                                </div>
                              </td>

                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded text-xs ${booking.status === 'Cancelled' ? 'bg-red-800 text-red-200' : booking.status === 'Completed' ? 'bg-blue-800 text-blue-200' : 'bg-green-800 text-green-200'}`}>
                                  {booking.status || 'Confirmed'}
                                </span>
                                <div className="text-xs text-gray-400 mt-1">{booking.paymentMethod || 'Cash on Delivery'}</div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className="border-b border-gray-600">
                            <td colSpan="7" className="px-4 py-3 text-center">No bookings found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">System Settings</h2>
                
                <div className="bg-gray-700 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-bold text-white mb-4">Admin Profile</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center mb-6">
                      <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mr-4">
                        <span className="text-3xl text-white">{adminData?.name?.charAt(0) || currentAdmin?.name?.charAt(0) || 'A'}</span>
                      </div>
                      <div>
                        <h4 className="text-white text-lg font-semibold">{adminData?.name || currentAdmin?.name || 'Admin User'}</h4>
                        <p className="text-gray-400">{adminData?.email || currentAdmin?.email || 'admin@example.com'}</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">First Name</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 bg-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        defaultValue={adminData?.name?.split(' ')[0] || currentAdmin?.name?.split(' ')[0] || ''}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">Last Name</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 bg-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        defaultValue={adminData?.name?.split(' ')[1] || currentAdmin?.name?.split(' ')[1] || ''}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        className="w-full px-4 py-2 bg-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        defaultValue={adminData?.email || currentAdmin?.email || ''}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">New Password</label>
                      <input 
                        type="password" 
                        className="w-full px-4 py-2 bg-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Leave blank to keep current password"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">Confirm New Password</label>
                      <input 
                        type="password" 
                        className="w-full px-4 py-2 bg-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Leave blank to keep current password"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Booking Settings section removed */}
                
                <div className="flex justify-end">
                  <button className="bg-primary hover:bg-blue-600 text-white py-2 px-6 rounded transition duration-300">
                    Save Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
