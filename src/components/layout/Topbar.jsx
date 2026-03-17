import { Bell, Search, Sun, Moon, Menu } from "../../lib/icons.js";

export default function Topbar({ dark, onToggleDark, onToggleSidebar }) {
  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center px-5 gap-4 sticky top-0 z-20">
            <button
        onClick={onToggleSidebar}
        className="btn-ghost p-2.5 rounded-lg flex-shrink-0"
        title="Toggle sidebar"
      >
        <Menu size={18} />
      </button>
      
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products, orders, customers…"
            className="input pl-9 py-2 text-sm bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700"
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        {/* Dark mode toggle */}
        <button
          onClick={onToggleDark}
          className="btn-ghost p-2.5 rounded-lg"
          title="Toggle dark mode"
        >
          {dark ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Notifications */}
        <button className="btn-ghost p-2.5 rounded-lg relative">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full"></span>
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-semibold ml-1 cursor-pointer">
          SA
        </div>
      </div>
    </header>
  );
}
