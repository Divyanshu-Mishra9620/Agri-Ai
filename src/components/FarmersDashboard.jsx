import { Cloud, TrendingUp, Wheat, Droplets, Sun, Wind } from "lucide-react";
import { useState } from "react";
import { ChatBot } from "./ChatBot";
import { Map } from "./Map";

export default function FarmersDashboard() {
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [searchRequest, setSearchRequest] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                <Wheat className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Kisan Seva Portal
                </h1>
                <p className="text-xs text-gray-500">
                  Smart India Hackathon 2024
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-6 text-sm">
                <a
                  href="#"
                  className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Market Prices</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition"
                >
                  <Cloud className="w-4 h-4" />
                  <span>Weather</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition"
                >
                  <Wheat className="w-4 h-4" />
                  <span>Crop Calendar</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <Map
              onDistrictSelect={setSelectedDistrict}
              searchRequest={searchRequest}
            />
          </div>

          <div className="xl:col-span-1">
            <ChatBot
              selectedDistrict={selectedDistrict}
              onDistrictRequest={setSearchRequest}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>Developed for Smart India Hackathon 2024 | Team AgriFarm</p>
            <p className="mt-1">Empowering farmers with technology 🌾</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
