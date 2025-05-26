import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Plane, 
  Building2, 
  Car, 
  Stamp, 
  DollarSign, 
  Map, 
  Train, 
  PiggyBank 
} from 'lucide-react';
import Navbar from '../components/Layout/Navbar';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  to: string;
  color: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, to, color }) => {
  return (
    <Link 
      to={to}
      className="block w-full bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className={`p-5 ${color} text-white flex items-center justify-center`}>
        {icon}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
      </div>
    </Link>
  );
};

const Dashboard: React.FC = () => {
  const services = [
    {
      icon: <Plane size={30} />,
      title: "Flight Booking",
      description: "Manage flight bookings with complete financial tracking",
      to: "/flight-booking",
      color: "bg-blue-500"
    },
    {
      icon: <Building2 size={30} />,
      title: "Hotel Reservation",
      description: "Track hotel bookings and associated costs",
      to: "/hotel-reservation",
      color: "bg-indigo-500"
    },
    {
      icon: <Car size={30} />,
      title: "Car Rental",
      description: "Manage car rentals with size and pricing details",
      to: "/car-rental",
      color: "bg-green-500"
    },
    {
      icon: <Stamp size={30} />,
      title: "Visa",
      description: "Track visa applications and processing fees",
      to: "/visa",
      color: "bg-yellow-500"
    },
    {
      icon: <DollarSign size={30} />,
      title: "Foreign Exchange",
      description: "Manage currency exchange rates and transactions",
      to: "/foreign-exchange",
      color: "bg-purple-500"
    },
    {
      icon: <Map size={30} />,
      title: "Tour Packages",
      description: "Comprehensive tracking of complete tour packages",
      to: "/tour-packages",
      color: "bg-red-500"
    },
    {
      icon: <Train size={30} />,
      title: "Train Booking",
      description: "Manage train tickets and associated costs",
      to: "/train-booking",
      color: "bg-teal-500"
    },
    {
      icon: <PiggyBank size={30} />,
      title: "Vajabhat",
      description: "Track miscellaneous payments and expenses",
      to: "/vajabhat",
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome to QT Holidays Management</h1>
          <p className="mt-2 text-gray-600">Track and manage all your travel services in one place</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              to={service.to}
              color={service.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;