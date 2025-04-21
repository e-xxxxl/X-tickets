import React from 'react';
import TicketTable from './Components/Tickettable';

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-black border-b-4 border-yellow-300 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-4xl font-bold text-red-600">X REPUBLIK</h1>
              <p className="text-yellow-300 text-lg mt-1">
                A festival that brings together creativity, music, and culture.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 transition duration-300">
                ADMIN PANEL
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4">
        <TicketTable />
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