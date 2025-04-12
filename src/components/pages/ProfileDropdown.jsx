import { Menu } from "@headlessui/react";
import { Fragment } from "react";
import { ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function ProfileDropdown() {
  const { user, logout } = useAuth();

  return (
    <div className="relative inline-block text-left">
      <Menu as="div" className="relative">
        <div>
          <Menu.Button className="inline-flex items-center gap-2 px-4 py-2 text-white bg-gray-800 rounded-md hover:bg-gray-700">
            <img
              src={user?.avatar || "/default-avatar.png"}
              alt="User Avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span>{user?.username}</span>
            <ChevronDown size={18} />
          </Menu.Button>
        </div>

        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="p-2">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-gray-200 dark:bg-gray-700" : ""
                  } group flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-800 dark:text-gray-100`}
                >
                  👤 My Profile
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-gray-200 dark:bg-gray-700" : ""
                  } group flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-800 dark:text-gray-100`}
                >
                  📦 Your Orders
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-gray-200 dark:bg-gray-700" : ""
                  } group flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-800 dark:text-gray-100`}
                >
                  📜 Order History
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={logout}
                  className={`${
                    active ? "bg-gray-200 dark:bg-gray-700" : ""
                  } group flex w-full items-center rounded-md px-3 py-2 text-sm text-red-600 dark:text-red-400`}
                >
                  🚪 Logout
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Menu>
    </div>
  );
}

export default ProfileDropdown;
