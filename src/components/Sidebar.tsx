import React, { useState } from 'react';
import {
  Cloud,
  User,
  Home,
  MonitorPlay,
  CheckSquare,
  FolderOpen,
  FileText,
  Activity,
  Calendar,
  Key,
  Grid,
  Plug,
  ChevronDown,
  LayoutDashboard,
  Settings,
  Users
} from 'lucide-react';

interface SidebarProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

export default function Sidebar({ activeMenu, setActiveMenu }: SidebarProps) {
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({
    '系统设置': true,
    '认证管理': true,
  });

  const toggleSubMenu = (menu: string) => {
    setOpenSubMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <div className="w-[200px] h-full bg-[#5653ff] flex flex-col text-white/80 shrink-0">
      {/* Logo Area */}
      <div className="h-14 flex items-center px-4 font-medium text-lg text-white bg-[#4d4bec]">
        <Cloud className="w-5 h-5 mr-2" />
        新大陆教育云平台
      </div>

      {/* Menu Area */}
      <div className="flex-1 overflow-y-auto py-2 scrollbar-hide">
        
        {/* 系统设置 - System Settings */}
        <div className="group cursor-pointer">
          <div onClick={() => toggleSubMenu('系统设置')} className="flex justify-between items-center px-6 py-3 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <Settings className="w-[18px] h-[18px]" />
              <span className="text-[13px] font-medium">系统设置</span>
            </div>
            <ChevronDown className={`w-4 h-4 opacity-50 transition-transform ${openSubMenus['系统设置'] ? 'rotate-180' : ''}`} />
          </div>
          {openSubMenus['系统设置'] && (
            <div className="bg-white">
              <div 
                onClick={() => setActiveMenu('基础设置')} 
                className={`flex items-center gap-3 px-6 py-3 cursor-pointer relative ${activeMenu === '基础设置' ? 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#3498eb]' : ''}`}
              >
                <div className="w-[18px] h-[18px] ml-[26px]" /> {/* Spacer for alignment */}
                <span className={`text-[13px] font-medium ${activeMenu === '基础设置' ? 'text-[#5653ff]' : 'text-gray-600 hover:text-[#5653ff]'}`}>基础设置</span>
              </div>
              <div 
                onClick={() => setActiveMenu('默认配置')} 
                className={`flex items-center gap-3 px-6 py-3 cursor-pointer relative ${activeMenu === '默认配置' ? 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#3498eb]' : ''}`}
              >
                <div className="w-[18px] h-[18px] ml-[26px]" /> {/* Spacer for alignment */}
                <span className={`text-[13px] font-medium ${activeMenu === '默认配置' ? 'text-[#5653ff]' : 'text-gray-600 hover:text-[#5653ff]'}`}>默认配置</span>
              </div>
              <div 
                onClick={() => setActiveMenu('基础数据')} 
                className={`flex items-center gap-3 px-6 py-3 cursor-pointer relative ${activeMenu === '基础数据' ? 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#3498eb]' : ''}`}
              >
                <div className="w-[18px] h-[18px] ml-[26px]" /> {/* Spacer for alignment */}
                <span className={`text-[13px] font-medium ${activeMenu === '基础数据' ? 'text-[#5653ff]' : 'text-gray-600 hover:text-[#5653ff]'}`}>基础数据</span>
              </div>
            </div>
          )}
        </div>

        {/* 认证管理 - Authentication Management */}
        <div className="group cursor-pointer">
          <div onClick={() => toggleSubMenu('认证管理')} className="flex justify-between items-center px-6 py-3 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <User className="w-[18px] h-[18px]" />
              <span className="text-[13px] font-medium">认证管理</span>
            </div>
            <ChevronDown className={`w-4 h-4 opacity-50 transition-transform ${openSubMenus['认证管理'] ? 'rotate-180' : ''}`} />
          </div>
          {openSubMenus['认证管理'] && (
            <div className="bg-white">
              <div 
                onClick={() => setActiveMenu('学校管理')} 
                className={`flex items-center gap-3 px-6 py-3 cursor-pointer relative ${activeMenu === '学校管理' ? 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#3498eb]' : ''}`}
              >
                <LayoutDashboard className={`w-[18px] h-[18px] ml-[26px] ${activeMenu === '学校管理' ? 'text-[#5653ff]' : 'text-gray-500'}`} />
                <span className={`text-[13px] font-medium ${activeMenu === '学校管理' ? 'text-[#5653ff]' : 'text-gray-600 hover:text-[#5653ff]'}`}>学校管理</span>
              </div>
              <div 
                onClick={() => setActiveMenu('注册用户管理')} 
                className={`flex items-center gap-3 px-6 py-3 cursor-pointer relative ${activeMenu === '注册用户管理' ? 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#3498eb]' : ''}`}
              >
                <User className={`w-[18px] h-[18px] ml-[26px] ${activeMenu === '注册用户管理' ? 'text-[#5653ff]' : 'text-gray-500'}`} />
                <span className={`text-[13px] font-medium ${activeMenu === '注册用户管理' ? 'text-[#5653ff]' : 'text-gray-600 hover:text-[#5653ff]'}`}>注册用户管理</span>
              </div>
              <div 
                onClick={() => setActiveMenu('角色组管理')} 
                className={`flex items-center gap-3 px-6 py-3 cursor-pointer relative ${activeMenu === '角色组管理' ? 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#3498eb]' : ''}`}
              >
                <Users className={`w-[18px] h-[18px] ml-[26px] ${activeMenu === '角色组管理' ? 'text-[#5653ff]' : 'text-gray-500'}`} />
                <span className={`text-[13px] font-medium ${activeMenu === '角色组管理' ? 'text-[#5653ff]' : 'text-gray-600 hover:text-[#5653ff]'}`}>角色组管理</span>
              </div>
              <div 
                onClick={() => setActiveMenu('角色管理')} 
                className={`flex items-center gap-3 px-6 py-3 cursor-pointer relative ${activeMenu === '角色管理' ? 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#3498eb]' : ''}`}
              >
                <Key className={`w-[18px] h-[18px] ml-[26px] ${activeMenu === '角色管理' ? 'text-[#5653ff]' : 'text-gray-500'}`} />
                <span className={`text-[13px] font-medium ${activeMenu === '角色管理' ? 'text-[#5653ff]' : 'text-gray-600 hover:text-[#5653ff]'}`}>角色管理</span>
              </div>
            </div>
          )}
        </div>

        {/* Other menu items */}
        <MenuItem 
          icon={<Home />} 
          label="租户管理" 
          isActive={activeMenu === '租户管理'}
          onClick={() => setActiveMenu('租户管理')}
        />
        <MenuItem icon={<Activity />} label="系统监控" hasSub />
        <MenuItem icon={<CheckSquare />} label="任务管理" />
        <MenuItem icon={<FolderOpen />} label="文件资源中心" hasSub />
        <MenuItem icon={<FileText />} label="内容管理" hasSub />
        <MenuItem icon={<MonitorPlay />} label="实验管理" hasSub />
        <MenuItem icon={<Calendar />} label="日志管理" hasSub />
        <MenuItem icon={<Key />} label="授权管理" hasSub />
        <MenuItem icon={<Grid />} label="平台管理" hasSub />
        <MenuItem icon={<Plug />} label="接口开放平台" hasSub />
      </div>
    </div>
  );
}

function MenuItem({ icon, label, hasSub, isActive, onClick }: { icon: React.ReactNode; label: string; hasSub?: boolean; isActive?: boolean; onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`flex justify-between items-center px-6 py-3 cursor-pointer transition-colors relative
        ${isActive ? 'bg-white text-[#5653ff] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#3498eb]' : 'hover:bg-white/10 text-white/90'}
      `}
    >
      <div className="flex items-center gap-3">
        {React.cloneElement(icon as React.ReactElement, { className: `w-[18px] h-[18px] ${isActive ? 'text-[#5653ff]' : ''}` })}
        <span className="text-[13px] font-medium">{label}</span>
      </div>
      {hasSub && <ChevronDown className={`w-4 h-4 transition-transform -rotate-90 ${isActive ? 'opacity-100' : 'opacity-50'}`} />}
    </div>
  );
}
