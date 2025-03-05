import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Lock, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { adminNavLinks, guestNavLinks } from "../../constants/nav-items";
import { useAuth } from "../../context/authContext";
import { useLogout } from "../../hooks";
import ProfilePicture from "../profile-image";

interface SideBarProps {
  className?: string;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isMobileMenuOpen: boolean) => void;
}

export const SideBar: React.FC<SideBarProps> = ({ className = "", isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { isAuthenticated } = useAuth();
  const logout = useLogout();
    const [user, setUser] = useState<{
      first_name: string;
      last_name: string;
      email: string;
      profile_url: string;
    } | null>(null);
  
    useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }, []);

  const userNavLinks = isAuthenticated ? adminNavLinks : guestNavLinks;

  const handleImageUpload = (file: any) => {
    // updateUserDetails(userDetails?.id, { image_1920: file });
  };

  return (
    <>
      {/* Sidebar always visible on large screens */}
      <div className={`hidden lg:flex flex-col justify-between bg-white px-4 py-4 md:px-7 md:py-6 fixed sm:top-[90px] top-[69px] z-50 sm:h-[calc(100vh-88px)] h-[calc(100vh-85px)] lg:px-7 ${className}`}>
        <ul className="flex-1 space-y-0 overflow-y-auto">
          {userNavLinks.map((n) => (
            <li key={n.name}>
              <NavLink
                to={n.href}
                className={({ isActive }) =>
                  `inline-flex w-full items-center justify-between rounded-lg pl-4 pr-14 py-4.5 transition-colors ${isActive
                    ? "bg-blue-50 [&_svg]:text-blue-600 [&_span]:text-blue-600"
                    : "text-[#2E2E2E] hover:bg-blue-50 hover:[&_svg]:text-blue-600 hover:[&_span]:text-blue-600"
                  }`
                }
                end={n.href === "/"}
                preventScrollReset={n.name === "Explore"}
              >
                <span className="inline-flex items-center gap-3">
                  <n.icon className="h-5 w-5 transition-colors" />
                  <span className="whitespace-nowrap transition-colors">{n.name}</span>
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
        {isAuthenticated && <div className="flex gap-3 cursor-pointer py-4" onClick={logout}>
          <LogOut size={20} color="#D74B42" /> <span className="font-light text-[#D74B42]">Logout</span>
        </div>}
      </div>

      {/* Sidebar with animation for mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`fixed right-0 left-auto z-50 lg:hidden flex flex-col justify-between bg-white px-4 py-4 md:px-7 md:py-6 sm:top-[90px] top-[66px] sm:h-[calc(100vh-90px)] h-[calc(100vh-66px)] lg:px-7 shadow-[-5px_0_5px_-5px_rgba(0,0,0,0.1)] ${className}`}
          >
            <div>
              {isAuthenticated ?
                <motion.div className="mb-2 my-4 flex items-center gap-3 px-4">
                  <ProfilePicture onImageUpload={handleImageUpload} showCam={true} />
                  <div>
                    <p className="line-clamp-1 max-w-[150px] font-medium text-[#1E272F] capitalize">
                      {user?.first_name}
                    </p>
                    <p className="line-clamp-1 max-w-[150px] text-xs font-light text-[#898989]">
                      {user?.email}
                    </p>
                  </div>
                </motion.div> :
                <div className="flex flex-col items-start gap-3 mb-4">
                  <Link to="/login" className="flex justify-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"><Lock className="w-4 h-4 mr-2" /> Login as Admin</Link>
                </div>
              }
              <ul className="flex-1">
                <ul className="flex-1 overflow-y-auto">
                  {userNavLinks.map((n) => (
                    <li key={n.name} onClick={() => setIsMobileMenuOpen(false)}>
                      <NavLink
                        to={n.href}
                        className={({ isActive }) =>
                          `inline-flex w-full items-center justify-between rounded-lg pl-4 pr-14 py-4.5 transition-colors ${isActive
                            ? "bg-blue-50 [&_svg]:text-blue-600 [&_span]:text-blue-600"
                            : "text-[#2E2E2E] hover:bg-blue-50 hover:[&_svg]:text-blue-600 hover:[&_span]:text-blue-600"
                          }`
                        }
                        end={n.href === "/"}
                        preventScrollReset={n.name === "Explore"}
                      >
                        <span className="inline-flex items-center gap-3">
                          <n.icon className="h-5 w-5 transition-colors" />
                          <span className="whitespace-nowrap transition-colors">{n.name}</span>
                        </span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </ul>
            </div>

            {isAuthenticated && <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex gap-3 cursor-pointer pl-4 py-4"
              onClick={logout}
            >
              <LogOut size={20} color="#D74B42" />
              <span className="font-light text-[#D74B42]">Logout</span>
            </motion.div>}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
