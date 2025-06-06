import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://x-republik-backend-1.onrender.com/tickets');
        setTickets(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch tickets. Please try again later.');
        setLoading(false);
        console.error('Error fetching tickets:', err);
      }
    };

    fetchTickets();
  }, []);

  // Handle marking a ticket as used/unused
  const toggleTicketUsed = async (ticketId, currentStatus) => {
    try {
      // Optimistic UI update
      const updatedTickets = tickets.map(ticket => 
        ticket.ticketId === ticketId ? {...ticket, isUsed: !currentStatus} : ticket
      );
      setTickets(updatedTickets);
      
      // Send update to backend
      await axios.patch(`https://x-republik-backend-1.onrender.com/tickets/${ticketId}`, {
        isUsed: !currentStatus
      });
    } catch (err) {
      // Revert on error
      setError('Failed to update ticket status. Please try again.');
      console.error('Error updating ticket:', err);
      
      // Revert the optimistic update
      const revertedTickets = tickets.map(ticket => 
        ticket.ticketId === ticketId ? {...ticket, isUsed: currentStatus} : ticket
      );
      setTickets(revertedTickets);
    }
  };

  // Filter tickets based on search term and status filter
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'used') return matchesSearch && ticket.isUsed === true;
    if (statusFilter === 'unused') return matchesSearch && ticket.isUsed !== true;
    if (statusFilter === 'paid') return matchesSearch && ticket.isPaid === true;
    if (statusFilter === 'pending') return matchesSearch && ticket.isPaid !== true;
    
    return matchesSearch;
  });

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Safely format currency values
  const formatCurrency = (amount) => {
    if (amount !== undefined && amount !== null && !isNaN(amount)) {
      return `₦${Number(amount).toFixed(2)}`;
    }
    return '₦0.00';
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Festival header */}
      <div className="bg-black py-10 border-b-4 border-yellow-300">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-red-600 mb-2">X REPUBLIK</h1>
          <p className="text-yellow-300 text-xl mb-6">
            A festival that brings together creativity, music, and culture.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 border-l-4 border-red-600 pl-4">
          Event Ticket Management
        </h2>
        
        {/* Search and filter controls */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search bar */}
          <div className="col-span-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tickets by ID, email or category..."
                className="w-full px-4 py-3 bg-black border-2 border-yellow-300 rounded-none focus:outline-none focus:border-red-600 placeholder-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Status filter */}
          <div>
            <select
              className="w-full px-4 py-3 bg-black border-2 border-yellow-300 rounded-none focus:outline-none focus:border-red-600 text-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Tickets</option>
              <option value="used">Used Tickets</option>
              <option value="unused">Unused Tickets</option>
              <option value="paid">Paid Only</option>
              <option value="pending">Pending Payment</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-yellow-300">Loading tickets...</div>
          </div>
        ) : error ? (
          <div className="bg-red-900 border-l-4 border-red-600 text-white p-4 mb-8" role="alert">
            <p>{error}</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No tickets found. {searchTerm && "Try adjusting your search."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-black border border-yellow-300">
              <thead>
                <tr className="border-b-2 border-red-600">
                  <th className="py-4 px-4 text-left text-yellow-300 font-bold">Ticket ID</th>
                  <th className="py-4 px-4 text-left text-yellow-300 font-bold">Email</th>
                  <th className="py-4 px-4 text-left text-yellow-300 font-bold">Category</th>
                  <th className="py-4 px-4 text-center text-yellow-300 font-bold">Qty</th>
                  <th className="py-4 px-4 text-right text-yellow-300 font-bold">Amount</th>
                  <th className="py-4 px-4 text-center text-yellow-300 font-bold">Payment</th>
                  <th className="py-4 px-4 text-center text-yellow-300 font-bold">Status</th>
                  <th className="py-4 px-4 text-left text-yellow-300 font-bold">Date</th>
                  <th className="py-4 px-4 text-center text-yellow-300 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.ticketId} className="hover:bg-gray-900">
                    <td className="py-3 px-4 font-mono text-yellow-300">{ticket.ticketId}</td>
                    <td className="py-3 px-4">{ticket.email}</td>
                    <td className="py-3 px-4 font-medium">{ticket.category}</td>
                    <td className="py-3 px-4 text-center">{ticket.quantity || 1}</td>
                    <td className="py-3 px-4 text-right text-white">{formatCurrency(ticket.amount)}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold ${
                          ticket.isPaid 
                            ? 'bg-red-600 text-white' 
                            : 'bg-yellow-300 text-black'
                        }`}>
                          {ticket.isPaid ? 'PAID' : 'PENDING'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold ${
                          ticket.isUsed 
                            ? 'bg-gray-600 text-white' 
                            : 'bg-green-500 text-black'
                        }`}>
                          {ticket.isUsed ? 'USED' : 'VALID'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-400">{formatDate(ticket.purchaseDate)}</td>
                    <td className="py-3 px-4 text-center">
                      <button 
                        onClick={() => toggleTicketUsed(ticket.ticketId, ticket.isUsed)}
                        className={`px-3 py-1 text-xs font-semibold border ${
                          ticket.isUsed
                            ? 'border-green-500 text-green-500 hover:bg-green-900'
                            : 'border-gray-500 text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        {ticket.isUsed ? 'MARK UNUSED' : 'MARK USED'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="mt-6 flex justify-between items-center border-t border-gray-800 pt-4">
          <div className="text-gray-400">
            X REPUBLIK FESTIVAL 2025
          </div>
          <div className="text-yellow-300">
            Total tickets: {filteredTickets.length}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tickets;