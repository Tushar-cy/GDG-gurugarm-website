import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { FaCalendar, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { format } from 'date-fns';
import { Event } from '../types/event';


interface EventCardProps {
  event: Event;
  delay?: number;
}

export const EventCard = ({ event, delay = 0 }: EventCardProps) => {
  const statusColors = {
    upcoming: 'primary',
    ongoing: 'success',
    past: 'default',
  };

  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, 'MMM d, yyyy');
  const formattedTime = format(eventDate, 'h:mm a');

  const defaultImage = 'https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2,f_auto,g_center,q_auto:good/v1/gcs/platform-data-goog/events/GDG%20Cloud.png';

  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-blue-200 h-full flex flex-col">
      <div className="relative overflow-hidden">
        <img
          src={event.image || defaultImage}
          alt={event.title}
          className="w-full h-52 object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.setAttribute('style', 'display: flex');
          }}
        />
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold capitalize backdrop-blur-sm ${
            event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
            event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {event.status}
          </span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex-1 space-y-3">
          <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2">
            {event.title}
          </h3>

          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
            {event.description}
          </p>

          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <FaCalendar className="mr-2 text-blue-600" />
              {formattedDate}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FaClock className="mr-2 text-blue-600" />
              {formattedTime}
            </div>
            {event.location && (
              <div className="flex items-center text-sm text-gray-600">
                <FaMapMarkerAlt className="mr-2 text-blue-600" />
                {event.location}
              </div>
            )}
          </div>

          {event.link && (
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-all hover:translate-x-1"
            >
              Learn More
              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}; 