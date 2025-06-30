// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Volume2, MapPin, Phone, Bell, User } from "lucide-react";
// import MapComponent from "../components/MapComponent";
// import { citySubAreas, emergencyContacts } from "../data/alerts";

// const DashboardPage = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const notifications = [
//     {
//       id: 1,
//       message: "High noise detected in Science City",
//       time: "2 min ago",
//     },
//     { id: 2, message: "Noise normalized in Vastrapur", time: "15 min ago" },
//     { id: 3, message: "New sub-area added: Riverfront", time: "1 hr ago" },
//   ];
//   const [showNotifications, setShowNotifications] = useState(false);

//   useEffect(() => {
//     const stored = localStorage.getItem("user");
//     if (stored) setUser(JSON.parse(stored));
//     else navigate("/");
//   }, []);

//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   if (!user) return null;

//   const subAreas = citySubAreas[user.area] || [];
//   const avgNoise = Math.round(
//     subAreas.reduce((acc, loc) => acc + loc.noise, 0) / subAreas.length
//   );
//   const highAlertActive = subAreas.some((loc) => loc.noise > 80);
//   function handleLogout() {
//     localStorage.removeItem("user");
//     navigate("/");
//   }
//   return (
//     <div className="min-h-screen bg-[var(--color-light)] p-6">
//       {/* Header */}
//       <header className="flex items-center justify-between mb-8">
//         {/* Left side - User Name */}
//         <div className="flex items-center gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-[var(--color-dark)]">
//               Welcome back, {user.name}
//             </h1>
//             <p className="text-gray-600">
//               {currentTime.toLocaleDateString("en-US", {
//                 weekday: "long",
//                 year: "numeric",
//                 month: "long",
//                 day: "numeric",
//               })}
//             </p>
//           </div>
//         </div>

//         {/* Right side - Notification and Logout */}
//         <div className="flex items-center gap-6">
//           {/* Notification icon */}
//           <div className="relative">
//             <Bell
//               className="w-6 h-6 text-gray-600 cursor-pointer hover:text-[var(--color-primary)] transition-colors"
//               onClick={() => setShowNotifications(!showNotifications)}
//             />
//             {highAlertActive && (
//               <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
//             )}

//             {/* Notification dropdown */}
//             {showNotifications && (
//               <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg border rounded-lg z-10 p-4">
//                 <h3 className="font-semibold mb-2 text-[var(--color-dark)]">
//                   Notifications
//                 </h3>
//                 <ul className="text-sm max-h-60 overflow-y-auto space-y-2">
//                   {notifications.map((n) => (
//                     <li key={n.id} className="text-gray-700 border-b pb-1">
//                       <p>{n.message}</p>
//                       <p className="text-gray-400 text-xs">{n.time}</p>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>

//           {/* Logout Button */}
//           <button
//             onClick={handleLogout}
//             className="px-4 py-2 bg-red-300 text-red-900 rounded-lg hover:bg-red-500 hover:text-white"
//           >
//             Logout
//           </button>
//         </div>
//       </header>

//       {/* Alert Banner */}
//       <div
//         className={`mb-8 rounded-xl p-4 ${
//           highAlertActive
//             ? "bg-red-50 border border-red-200"
//             : "bg-green-50 border border-green-200"
//         }`}
//       >
//         <div className="flex items-center gap-3">
//           <div
//             className={`p-2 rounded-full ${
//               highAlertActive ? "bg-red-100" : "bg-green-100"
//             }`}
//           >
//             <Volume2
//               className={`w-5 h-5 ${
//                 highAlertActive ? "text-red-600" : "text-green-600"
//               }`}
//             />
//           </div>
//           <div>
//             <h2
//               className={`font-semibold ${
//                 highAlertActive ? "text-red-600" : "text-green-600"
//               }`}
//             >
//               {highAlertActive ? "High Noise Alert" : "Normal Noise Levels"}
//             </h2>
//             <p className="text-gray-600 text-sm">
//               {highAlertActive
//                 ? "Some sub-areas are experiencing high noise levels."
//                 : "All monitored zones are within acceptable noise limits."}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Grid Layout */}
//       <div className="dashboard-grid">
//         {/* Map View */}
//         <div className="glass-card rounded-xl p-6 col-span-1 md:col-span-2">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="p-2 rounded-full bg-[var(--color-primary)]/10">
//               <MapPin className="w-6 h-6 text-[var(--color-primary)]" />
//             </div>
//             <h2 className="text-xl font-semibold">Live Map – {user.area}</h2>
//           </div>
//           <MapComponent selectedCity={user.area} />
//         </div>

//         {/* Noise Overview */}
//         <div className="glass-card rounded-xl p-6">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="p-2 rounded-full bg-[var(--color-primary)]/10">
//               <Volume2 className="w-6 h-6 text-[var(--color-primary)]" />
//             </div>
//             <h2 className="text-xl font-semibold">Noise Overview</h2>
//           </div>
//           <div className="space-y-4">
//             <div className="flex justify-between items-center">
//               <span className="text-gray-600">Average Noise Level</span>
//               <span className="text-2xl font-bold">{avgNoise} dB</span>
//             </div>
//             <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-[var(--color-primary)] transition-all duration-500"
//                 style={{ width: `${(avgNoise / 100) * 100}%` }}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Location Info */}
//         <div className="glass-card rounded-xl p-6">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="p-2 rounded-full bg-blue-50">
//               <MapPin className="w-6 h-6 text-blue-500" />
//             </div>
//             <h2 className="text-xl font-semibold">Sub-Area Details</h2>
//           </div>
//           <div className="space-y-3">
//             {subAreas.map((area, index) => (
//               <div
//                 key={index}
//                 className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
//               >
//                 <span>{area.name}</span>
//                 <span
//                   className={`font-semibold ${
//                     area.noise > 80 ? "text-red-500" : "text-green-500"
//                   }`}
//                 >
//                   {area.noise} dB
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Emergency Contacts */}
//         <div className="glass-card rounded-xl p-6">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="p-2 rounded-full bg-red-50">
//               <Phone className="w-6 h-6 text-red-500" />
//             </div>
//             <h2 className="text-xl font-semibold">Emergency Contacts</h2>
//           </div>
//           <div className="space-y-3">
//             {emergencyContacts.map((contact, index) => (
//               <div
//                 key={index}
//                 className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
//               >
//                 <span className="font-medium">{contact.title}</span>
//                 <span
//                   className="text-blue-600 hover:text-blue-800 cursor-pointer"
//                   onClick={() => {
//                     navigator.clipboard.writeText(contact.number);
//                     alert(`Copied ${contact.number}`);
//                   }}
//                 >
//                   {contact.number}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Volume2, MapPin, Phone, Bell } from "lucide-react";
import MapComponent from "../components/MapComponent";
import { citySubAreas, emergencyContacts } from "../data/alerts";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [subAreas, setSubAreas] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [highAlertActive, setHighAlertActive] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    else navigate("/");
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (user) {
      // Simulate fetching sub-areas data on initial load
      const initialSubAreas = citySubAreas[user.area] || [];
      setSubAreas(initialSubAreas);
      setHighAlertActive(initialSubAreas.some((area) => area.noise > 80));

      // Update noise levels every 30 seconds
      const interval = setInterval(() => {
        const updatedSubAreas = citySubAreas[user.area].map((area) => ({
          ...area,
          noise: Math.floor(Math.random() * 100), // Randomize noise levels
        }));

        setSubAreas(updatedSubAreas);
        setHighAlertActive(updatedSubAreas.some((area) => area.noise > 80)); // Check if there's any high alert
      }, 30000); // 30 seconds interval

      return () => clearInterval(interval); // Clean up interval on unmount
    }
  }, [user]);

  const avgNoise = Math.round(
    subAreas.reduce((acc, loc) => acc + loc.noise, 0) / subAreas.length
  );

  // Simulated notifications for demo purposes
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        {
          id: Date.now(),
          message: "New noise alert triggered!",
          time: new Date().toLocaleTimeString(),
        },
      ]);
    }, 10000); // New notification every 10 seconds

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[var(--color-light)] p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        {/* Left side - User Name */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-dark)]">
              Welcome back, {user?.name}
            </h1>
            <p className="text-gray-600">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Right side - Notification and Logout */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <Bell
              className="w-6 h-6 text-gray-600 cursor-pointer hover:text-[var(--color-primary)] transition-colors"
              onClick={() => setShowNotifications(!showNotifications)}
            />
            {highAlertActive && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
            )}

            {/* Notification dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg border rounded-lg z-10 p-4">
                <h3 className="font-semibold mb-2 text-[var(--color-dark)]">
                  Notifications
                </h3>
                <ul className="text-sm max-h-60 overflow-y-auto space-y-2">
                  {notifications.map((n) => (
                    <li key={n.id} className="text-gray-700 border-b pb-1">
                      <p>{n.message}</p>
                      <p className="text-gray-400 text-xs">{n.time}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-300 text-red-900 rounded-lg hover:bg-red-500 hover:text-white"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Alert Banner */}
      <div
        className={`mb-8 rounded-xl p-4 ${
          highAlertActive
            ? "bg-red-50 border border-red-200"
            : "bg-green-50 border border-green-200"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-full ${
              highAlertActive ? "bg-red-100" : "bg-green-100"
            }`}
          >
            <Volume2
              className={`w-5 h-5 ${
                highAlertActive ? "text-red-600" : "text-green-600"
              }`}
            />
          </div>
          <div>
            <h2
              className={`font-semibold ${
                highAlertActive ? "text-red-600" : "text-green-600"
              }`}
            >
              {highAlertActive ? "High Noise Alert" : "Normal Noise Levels"}
            </h2>
            <p className="text-gray-600 text-sm">
              {highAlertActive
                ? "Some sub-areas are experiencing high noise levels."
                : "All monitored zones are within acceptable noise limits."}
            </p>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="dashboard-grid">
        {/* Map View */}
        <div className="glass-card rounded-xl p-6 col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-[var(--color-primary)]/10">
              <MapPin className="w-6 h-6 text-[var(--color-primary)]" />
            </div>
            <h2 className="text-xl font-semibold">Live Map – {user?.area}</h2>
          </div>
          <MapComponent selectedCity={user?.area} subAreas={subAreas} />
        </div>

        {/* Noise Overview */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-[var(--color-primary)]/10">
              <Volume2 className="w-6 h-6 text-[var(--color-primary)]" />
            </div>
            <h2 className="text-xl font-semibold">Noise Overview</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Noise Level</span>
              <span className="text-2xl font-bold">{avgNoise} dB</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-primary)] transition-all duration-500"
                style={{ width: `${(avgNoise / 100) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Location Info */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-blue-50">
              <MapPin className="w-6 h-6 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold">Sub-Area Details</h2>
          </div>
          <div className="space-y-3">
            {subAreas.map((area, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span>{area.name}</span>
                <span
                  className={`font-semibold ${
                    area.noise > 80 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {area.noise} dB
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-red-50">
              <Phone className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold">Emergency Contacts</h2>
          </div>
          <div className="space-y-3">
            {emergencyContacts.map((contact, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="font-medium">{contact.title}</span>
                <span
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(contact.number);
                    alert(`Copied ${contact.number}`);
                  }}
                >
                  {contact.number}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
