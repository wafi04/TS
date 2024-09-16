import React from "react";
import { Championship } from "../types";
import {
  CalendarDays,
  MapPin,
  User,
  Clock,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

const UiChampionship = ({ championship }: { championship: Championship }) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const { push } = useRouter();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        {championship.image ? (
          <img
            src={championship.image}
            alt={championship.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
            <span className="text-white text-mdl font-bold">
              No Image Available
            </span>
          </div>
        )}
        <div className="absolute top-0 left-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 m-3 rounded-full text-sm font-semibold">
          {new Date(championship._creationTime).getFullYear()}
        </div>
      </div>
      <div className="p-6">
        <h2 className="text-lg font-bold mb-3 text-gray-800 dark:text-white">
          {championship.name}
        </h2>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <MapPin className="w-5 h-5 mr-2 text-blue-500" />
            <span>{championship.location}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <CalendarDays className="w-5 h-5 mr-2 text-green-500" />
            <span>
              {formatDate(championship.startDate)} -
              {formatDate(championship.endDate)}
            </span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <User className="w-5 h-5 mr-2 text-purple-500" />
            <span>{championship.creator.name}</span>
          </div>
        </div>
        <button
          onClick={() => push(`/championship/${championship.name}`)}
          className="group relative inline-flex items-center px-4 py-2  overflow-hidden text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
            View Details
          </span>
          <ArrowRight className="w-4 h-4 ml-1 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
          <div className="absolute inset-0 bg-blue-700 transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0"></div>
        </button>
      </div>
    </div>
  );
};

export default UiChampionship;
