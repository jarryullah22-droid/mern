import React, { useState } from 'react';
import { sendContactMessage } from '../services/api';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [formStatus, setFormStatus] = useState(null); // 'success', 'error', or null
  const [errors, setErrors] = useState({});
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState(null); // 'success', 'error', or null
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Show loading state
    setLoading(true);
    
    try {
      // Send the message to the backend
      await sendContactMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });
      
      // Reset form after submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      setFormStatus('success');
    } catch (err) {
      console.error('Contact form submission failed:', err);
      setFormStatus('error');
    } finally {
      setLoading(false);
      
      // Clear status message after 5 seconds
      setTimeout(() => {
        setFormStatus(null);
      }, 5000);
    }
  };

  const handleContactOption = (option) => {
    switch(option) {
      case 'whatsapp':
        window.open('https://wa.me/923356471303', '_blank');
        break;
      case 'email':
        window.location.href = 'mailto:jarryullah46@gmail.com';
        break;
      case 'call':
        window.location.href = 'tel:+923356471303';
        break;
      default:
        break;
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    
    // Validate email
    if (!newsletterEmail.trim() || !/\S+@\S+\.\S+/.test(newsletterEmail)) {
      setNewsletterStatus('error');
      return;
    }
    
    // Show loading state
    setNewsletterLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Newsletter subscription:', newsletterEmail);
      
      // Reset form and show success message
      setNewsletterEmail('');
      setNewsletterStatus('success');
      setNewsletterLoading(false);
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setNewsletterStatus(null);
      }, 5000);
    }, 1500);
  };
  
  const handleNewsletterChange = (e) => {
    setNewsletterEmail(e.target.value);
    if (newsletterStatus) {
      setNewsletterStatus(null);
    }
  };
  
  const shareOnSocial = (platform) => {
    const url = window.location.href;
    const text = "Check out this awesome movie theater in Faisalabad!";
    
    switch(platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-dark">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Have questions or feedback? We'd love to hear from you. Get in touch with our team.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-secondary p-6 rounded-lg text-center">
              <div className="inline-block p-4 bg-primary rounded-full mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Our Location</h3>
              <p className="text-gray-300">
                Faisalabad
              </p>
            </div>

            <div className="bg-secondary p-6 rounded-lg text-center">
              <div className="inline-block p-4 bg-primary rounded-full mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Call Us</h3>
              <p className="text-gray-300">
                +923356471303
              </p>
            </div>

            <div className="bg-secondary p-6 rounded-lg text-center">
              <div className="inline-block p-4 bg-primary rounded-full mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Email Us</h3>
              <p className="text-gray-300">
                jarryullah46@gmail.com
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>
              
              {/* Quick Contact Options */}
              <div className="flex space-x-4 mb-6">
                <button 
                  onClick={() => handleContactOption('whatsapp')}
                  className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition duration-300"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </button>
                <button 
                  onClick={() => handleContactOption('email')}
                  className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-300"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </button>
                <button 
                  onClick={() => handleContactOption('call')}
                  className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition duration-300"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call
                </button>
              </div>
              
              {formStatus === 'success' && (
                <div className="bg-green-600 text-white p-4 rounded mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Thank you for your message! We will get back to you soon.</span>
                </div>
              )}
              
              {formStatus === 'error' && (
                <div className="bg-red-600 text-white p-4 rounded mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>There was an error sending your message. Please try again.</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="bg-secondary p-6 rounded-lg">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-300 mb-2">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    className={`w-full px-4 py-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-primary ${errors.name ? 'border-2 border-red-500' : ''}`}
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-300 mb-2">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    className={`w-full px-4 py-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-primary ${errors.email ? 'border-2 border-red-500' : ''}`}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-gray-300 mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder="Enter subject"
                    className={`w-full px-4 py-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-primary ${errors.subject ? 'border-2 border-red-500' : ''}`}
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                  {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-300 mb-2">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    placeholder="Enter your message"
                    className={`w-full px-4 py-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-primary ${errors.message ? 'border-2 border-red-500' : ''}`}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className={`btn-primary py-3 px-8 flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : 'Send Message'}
                </button>
              </form>
            </div>
            
            {/* Map */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Find Us</h2>
              <div className="bg-secondary p-2 rounded-lg h-full">
                {/* Google Maps iframe embedding */}
                <div className="rounded h-96 overflow-hidden">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d217897.68028107758!2d72.86107239134724!3d31.42141974654519!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x392242a895a55ca9%3A0xdec58f88932671c6!2sFaisalabad%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1712421394834!5m2!1sen!2s" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Faisalabad Map"
                    className="rounded"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>




    </div>
  );
};

export default ContactPage;
