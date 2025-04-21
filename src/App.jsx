import React, { useState, useEffect } from 'react';
import Tickets from './Components/Tickets';

function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if screen width is less than 768px (typical mobile breakpoint)
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on initial render
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Clean up event listener
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  if (isMobile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-red-600 mb-4">X REPUBLIK</h1>
          <div className="bg-black border-2 border-yellow-300 p-6">
            <p className="text-yellow-300 text-xl mb-4">
              Ticket Management System
            </p>
            <p className="text-white mb-6">
              This dashboard is only available on larger screens (tablets, laptops, or desktops) for better usability.
            </p>
            <p className="text-gray-400 text-sm">
              Please switch to a device with a larger screen to access the ticket management features.
            </p>
          </div>
          <div className="mt-8 text-gray-400 text-sm">
            © 2025 X Republik Festival. All rights reserved.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4">
        <Tickets/>
      </main>
      
      <footer className="bg-black border-t border-gray-800 text-white py-6 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-yellow-300 font-bold mb-4 md:mb-0">
              X REPUBLIK FESTIVAL 2025
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 X Republik Festival. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;