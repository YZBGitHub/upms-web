import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MainContent from './components/MainContent';
import SettingsContent from './components/SettingsContent';
import DefaultSettingsContent from './components/DefaultSettingsContent';
import TenantManagement from './components/TenantManagement';
import RegisteredUsersContent from './components/RegisteredUsersContent';
import RoleGroupManagementContent from './components/RoleGroupManagementContent';
import RoleManagementContent from './components/RoleManagementContent';
import BasicDataContent from './components/BasicDataContent';

export default function App() {
  const [activeMenu, setActiveMenu] = useState('默认配置');

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden font-sans">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Header />
        {activeMenu === '基础设置' && <SettingsContent className="flex-1" />}
        {activeMenu === '默认配置' && <DefaultSettingsContent className="flex-1" />}
        {activeMenu === '基础数据' && <BasicDataContent className="flex-1" />}
        {activeMenu === '注册用户管理' && <RegisteredUsersContent className="flex-1" />}
        {activeMenu === '角色组管理' && <RoleGroupManagementContent className="flex-1" />}
        {activeMenu === '角色管理' && <RoleManagementContent className="flex-1" />}
        {activeMenu === '学校管理' && <MainContent className="flex-1" />}
        {activeMenu === '租户管理' && <TenantManagement className="flex-1" />}
        {/* Fallback for empty menus */}
        {!['基础设置', '默认配置', '基础数据', '注册用户管理', '角色组管理', '角色管理', '学校管理', '租户管理'].includes(activeMenu) && (
          <div className="flex-1 bg-gray-100 p-4 flex items-center justify-center text-gray-500">
            {activeMenu} 页面开发中...
          </div>
        )}
      </div>
    </div>
  );
}
