import React from 'react';
import { Menu, ChevronDown, UserCircle } from 'lucide-react';

export default function Header() {
  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm shrink-0">
      <div className="flex items-center h-full">
        {/* Hamburger */}
        <div className="w-14 h-full border-r border-gray-100 flex items-center justify-center cursor-pointer text-[#3498eb] hover:bg-gray-50">
          <Menu className="w-5 h-5" />
        </div>
      </div>

      <div className="flex-1 text-center text-gray-400 text-[15px] font-medium tracking-wide">
        只为教育做一流的服务
      </div>

      <div className="flex items-center h-full px-6 border-l border-gray-100 cursor-pointer hover:bg-gray-50">
        <UserCircle className="w-6 h-6 text-blue-100 bg-blue-500 rounded-full" />
        <span className="ml-2 text-sm text-gray-700">杨振邦</span>
        <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
      </div>
    </div>
  );
}
