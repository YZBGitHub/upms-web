import React, { useState, useRef, useEffect } from 'react';
import { platformData } from '../data';
import { X, Settings, ChevronRight, Star, ChevronDown } from 'lucide-react';

const userTypes = [
  { id: 'guest', name: '游客', level: 0 },
  { id: 'registered', name: '注册用户', level: 0 },
  { id: 'auth', name: '认证用户', level: 0 },
  { id: 'enterprise', name: '企业用户', parent: 'auth', level: 1 },
  { id: 'school', name: '学校用户', parent: 'auth', level: 1 },
  { id: 'student', name: '学生', parent: 'school', level: 2 },
  { id: 'teacher', name: '老师', parent: 'school', level: 2 },
  { id: 'admin', name: '管理人员', parent: 'school', level: 2 },
];

const platformRoles = [
  { id: '1', name: '运营决策大屏', roles: ['超级管理员', '系统管理员'] },
  { id: '2', name: '考试题库系统', roles: ['超级管理员', '学校管理员', '老师', '学生', '阅卷老师', '考试竞赛管理员'] },
  { id: '3', name: 'AI学伴', roles: ['管理员', '教师', '学生'] },
  { id: '4', name: '二维码平台', roles: ['条例创建者', '案例开发者'] },
  { id: '5', name: 'AIOT应用', roles: ['管理员', '老师', '学生'] },
];

const mockRoleGroups = [
  { id: 'g1', name: '普通用户组', description: '包含各个应用的基础权限' },
  { id: 'g2', name: '教师协作组', description: '包含备课、授课、批改作业等权限' },
  { id: 'g3', name: '超级管理员组', description: '包含平台和所有应用的最高权限' },
];

export default function DefaultSettingsContent({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState<'roles' | 'packages' | 'data' | 'rewards' | 'tenant' | 'password'>('roles');
  
  type PasswordLevel = 'weak' | 'medium' | 'strong';
  
  const [currentLevel, setCurrentLevel] = useState<PasswordLevel>('medium');
  const [passwordConfigs, setPasswordConfigs] = useState<Record<PasswordLevel, {min: number, max: number, upper: boolean, lower: boolean, num: boolean, special: boolean, noSpace: boolean}>>({
    weak: { min: 6, max: 16, upper: false, lower: false, num: true, special: false, noSpace: true },
    medium: { min: 8, max: 16, upper: true, lower: true, num: true, special: false, noSpace: true },
    strong: { min: 10, max: 20, upper: true, lower: true, num: true, special: true, noSpace: true }
  });

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<any>(null);
  const [selectedUserType, setSelectedUserType] = useState('guest');
  const [rolesMap, setRolesMap] = useState<Record<string, string[]>>({});
  const [packageMap, setPackageMap] = useState<Record<string, string>>({});
  const [retentionMap, setRetentionMap] = useState<Record<string, string>>({
    guest: '1',
    registered: '30',
    enterprise: '365',
    student: '180',
    teacher: '365',
    admin: '365'
  });
  
  const detailedPackages = [
    { id: 'trial', name: '试用套餐', model: '', validity: '12月', price: '免费', accounts: '0', tokens: '5000000', aippt: '5', bgClass: 'from-[#e6f0ff] to-[#f5f9ff]', textClass: 'text-blue-500' },
    { id: 'small', name: '小容量套餐', model: '', validity: '2月', price: '免费', accounts: '5', tokens: '1000', aippt: '1', bgClass: 'from-[#f3e8ff] to-[#fdfaull]', textClass: 'text-purple-500' },
    { id: '10acc', name: '10账号套餐', model: '', validity: '12月', price: '免费', accounts: '10', tokens: '0', aippt: null, bgClass: 'from-[#fff0e6] to-[#fffaf5]', textClass: 'text-orange-500' },
    { id: 'iot', name: '智联网综合实...', model: '型号:LingY-611-TJ', validity: '12月', price: '2000', pricePrefix: '¥', accounts: '1', tokens: '10000000', aippt: null, bgClass: 'from-[#fff8db] to-[#fffdf0]', textClass: 'text-blue-500' },
    { id: 'demo', name: 'demo', model: '', validity: '2月', price: '免费', accounts: '1', tokens: '10000', aippt: null, bgClass: 'from-[#e6f0ff] to-[#f5f9ff]', textClass: 'text-blue-500' },
  ];

  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [selectedUserTypeForPackage, setSelectedUserTypeForPackage] = useState<string | null>(null);

  const openPackageConfig = (userId: string) => {
    setSelectedUserTypeForPackage(userId);
    setIsPackageModalOpen(true);
  };

  const selectPackage = (pkgId: string) => {
    if (selectedUserTypeForPackage) {
      setPackageMap(prev => ({...prev, [selectedUserTypeForPackage]: pkgId}));
      setIsPackageModalOpen(false);
    }
  };
  
  // Example available roles across the system
  const availableRoles = [
    '学校管理员', '教务管理员', '教师', '辅导员', '学生处职员', '学生', '实训管理员', '指导教师', '数据分析师', '校领导', '普通用户'
  ];

  const openRoleConfig = (platform: any) => {
    setSelectedPlatform(platform);
    setRolesMap(platform.rolesMap || {});
    setSelectedUserType('guest');
    setIsRoleModalOpen(true);
  };

  const toggleRole = (role: string) => {
    setRolesMap(prev => {
      const currentRoles = prev[selectedUserType] || [];
      const newRoles = currentRoles.includes(role) 
        ? currentRoles.filter(r => r !== role)
        : [...currentRoles, role];
      return { ...prev, [selectedUserType]: newRoles };
    });
  };

  const [selectedRoles, setSelectedRoles] = useState<{appId: string, appName: string, role: string}[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<{groupId: string, groupName: string}[]>([]);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [activeRoleAppId, setActiveRoleAppId] = useState<string>('group');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleGroup = (groupId: string, groupName: string) => {
    if (selectedGroups.some(g => g.groupId === groupId)) {
      setSelectedGroups(selectedGroups.filter(g => g.groupId !== groupId));
    } else {
      setSelectedGroups([...selectedGroups, { groupId, groupName }]);
    }
  };

  const toggleAssignRole = (appId: string, appName: string, role: string) => {
    const exists = selectedRoles.some(r => r.appId === appId && r.role === role);
    if (exists) {
      setSelectedRoles(selectedRoles.filter(r => !(r.appId === appId && r.role === role)));
    } else {
      setSelectedRoles([...selectedRoles, { appId, appName, role }]);
    }
  };

  return (
    <div className={`bg-gray-100 p-4 ${className} overflow-auto`}>
      <div className="bg-white rounded-sm shadow-sm p-6 min-h-full relative">
        {/* Title */}
        <div className="flex items-center mb-6">
          <div className="w-1 h-4 bg-[#3498eb] mr-3 rounded-sm"></div>
          <h2 className="text-[15px] font-bold text-gray-800">默认配置</h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6 gap-6">
          <button
            onClick={() => setActiveTab('roles')}
            className={`py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'roles'
                ? 'border-[#3498eb] text-[#3498eb]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            角色配置
          </button>
          <button
            onClick={() => setActiveTab('packages')}
            className={`py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'packages'
                ? 'border-[#3498eb] text-[#3498eb]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            套餐配置
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'data'
                ? 'border-[#3498eb] text-[#3498eb]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            数据权限
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'rewards'
                ? 'border-[#3498eb] text-[#3498eb]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            签到赠送配置
          </button>
          <button
            onClick={() => setActiveTab('tenant')}
            className={`py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'tenant'
                ? 'border-[#3498eb] text-[#3498eb]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            租户配置
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'password'
                ? 'border-[#3498eb] text-[#3498eb]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            密码复杂度配置
          </button>
        </div>

        {/* Tab Content */}
        <div className="max-w-6xl">
          {activeTab === 'password' && (
            <div className="w-full max-w-4xl border border-gray-100 rounded-sm bg-white p-6 animate-in fade-in duration-300">
              <h3 className="font-medium text-gray-800 text-[14px] mb-6 border-b border-gray-100 pb-3">密码复杂度配置</h3>
              
              <div className="flex flex-col gap-6">
                <div>
                  <label className="text-gray-700 text-[13px] font-medium block mb-3">默认密码等级</label>
                  <div className="flex items-center gap-6">
                    {(['weak', 'medium', 'strong'] as PasswordLevel[]).map(level => {
                      const labels = { weak: '弱', medium: '中等', strong: '强' };
                      return (
                        <label key={level} className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name="passwordLevel"
                            checked={currentLevel === level}
                            onChange={() => setCurrentLevel(level)}
                            className="w-4 h-4 text-[#3498eb] border-gray-300 focus:ring-[#3498eb]"
                          />
                          <span className="text-[14px] text-gray-700">{labels[level]}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-gray-50/50 p-5 rounded border border-gray-100 space-y-5">
                  <h4 className="text-[13px] font-medium text-gray-700 mb-2">
                    {currentLevel === 'weak' ? '弱' : currentLevel === 'medium' ? '中等' : '强'}等级规则配置
                  </h4>
                  
                  <div className="flex items-center gap-4">
                    <label className="text-[13px] text-gray-600 w-24">密码位数</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        value={passwordConfigs[currentLevel].min} 
                        onChange={(e) => setPasswordConfigs(prev => ({...prev, [currentLevel]: {...prev[currentLevel], min: parseInt(e.target.value) || 0}}))}
                        className="border border-gray-300 rounded px-3 py-1.5 text-[13px] w-20 focus:border-[#3498eb] focus:outline-none"
                      />
                      <span className="text-gray-500 text-[13px]">-</span>
                      <input 
                        type="number" 
                        value={passwordConfigs[currentLevel].max} 
                        onChange={(e) => setPasswordConfigs(prev => ({...prev, [currentLevel]: {...prev[currentLevel], max: parseInt(e.target.value) || 0}}))}
                        className="border border-gray-300 rounded px-3 py-1.5 text-[13px] w-20 focus:border-[#3498eb] focus:outline-none"
                      />
                      <span className="text-gray-500 text-[13px] ml-1">位</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <label className="text-[13px] text-gray-600 w-24 pt-1">包含字符</label>
                    <div className="flex items-center flex-wrap gap-4 flex-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={passwordConfigs[currentLevel].upper}
                          onChange={(e) => setPasswordConfigs(prev => ({...prev, [currentLevel]: {...prev[currentLevel], upper: e.target.checked}}))}
                          className="rounded text-[#3498eb] focus:ring-[#3498eb] border-gray-300"
                        />
                        <span className="text-[13px] text-gray-700">大写字母 (A-Z)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={passwordConfigs[currentLevel].lower}
                          onChange={(e) => setPasswordConfigs(prev => ({...prev, [currentLevel]: {...prev[currentLevel], lower: e.target.checked}}))}
                          className="rounded text-[#3498eb] focus:ring-[#3498eb] border-gray-300"
                        />
                        <span className="text-[13px] text-gray-700">小写字母 (a-z)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={passwordConfigs[currentLevel].num}
                          onChange={(e) => setPasswordConfigs(prev => ({...prev, [currentLevel]: {...prev[currentLevel], num: e.target.checked}}))}
                          className="rounded text-[#3498eb] focus:ring-[#3498eb] border-gray-300"
                        />
                        <span className="text-[13px] text-gray-700">数字 (0-9)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={passwordConfigs[currentLevel].special}
                          onChange={(e) => setPasswordConfigs(prev => ({...prev, [currentLevel]: {...prev[currentLevel], special: e.target.checked}}))}
                          className="rounded text-[#3498eb] focus:ring-[#3498eb] border-gray-300"
                        />
                        <span className="text-[13px] text-gray-700">特殊字符 (!@#$%)</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <label className="text-[13px] text-gray-600 w-24 pt-1">限制规则</label>
                    <div className="flex items-center flex-wrap gap-4 flex-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={passwordConfigs[currentLevel].noSpace}
                          onChange={(e) => setPasswordConfigs(prev => ({...prev, [currentLevel]: {...prev[currentLevel], noSpace: e.target.checked}}))}
                          className="rounded text-[#3498eb] focus:ring-[#3498eb] border-gray-300"
                        />
                        <span className="text-[13px] text-gray-700">不允许包含空格</span>
                      </label>
                    </div>
                  </div>

                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-start">
                  <button className="bg-[#3498eb] hover:bg-blue-600 px-8 py-2 rounded text-white text-sm transition-colors font-medium">
                    保存配置
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tenant' && (
            <div className="w-full max-w-4xl border border-gray-100 rounded-sm bg-white p-6">
              <h3 className="font-medium text-gray-800 text-[14px] mb-6 border-b border-gray-100 pb-3">租户管理员默认可分配角色配置</h3>
              
              <div className="flex flex-col gap-4">
                <label className="text-gray-700 text-sm">可分配角色配置 <span className="text-gray-500 ml-1">(限定租户管理员可分配的角色有哪些)</span></label>
                
                <div className="relative" ref={dropdownRef}>
                  <div 
                    className="min-h-[44px] px-3 py-2 border border-gray-300 rounded focus-within:border-[#3498eb] focus-within:ring-1 focus-within:ring-[#3498eb] cursor-pointer flex flex-wrap gap-2 items-center transition-colors"
                    onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  >
                    {selectedGroups.length === 0 && selectedRoles.length === 0 && (
                      <span className="text-gray-400 text-sm">请选择可分配的角色组或单个角色</span>
                    )}

                    {selectedGroups.map(group => (
                      <span key={group.groupId} className="bg-indigo-50 text-indigo-700 px-2.5 py-1.5 flex items-center gap-1.5 rounded-md text-[13px] border border-indigo-100 font-medium">
                        【角色组】 {group.groupName}
                        <X 
                          className="w-3.5 h-3.5 cursor-pointer hover:text-indigo-900" 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleGroup(group.groupId, group.groupName);
                          }}
                        />
                      </span>
                    ))}
                    
                    {selectedRoles.map((role, idx) => (
                      <span key={`${role.appId}-${role.role}-${idx}`} className="bg-gray-50 text-gray-700 px-2.5 py-1.5 flex items-center gap-1.5 rounded-md text-[13px] border border-gray-200">
                        {role.appName} / {role.role}
                        <X 
                          className="w-3.5 h-3.5 cursor-pointer hover:text-gray-900" 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAssignRole(role.appId, role.appName, role.role);
                          }}
                        />
                      </span>
                    ))}

                    <div className="ml-auto text-gray-400 pl-2">
                      {isRoleDropdownOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </div>
                  </div>

                  {isRoleDropdownOpen && (
                    <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-20 flex h-[320px] overflow-hidden">
                      {/* Left Sidebar */}
                      <div className="w-[200px] bg-gray-50 border-r border-gray-100 flex flex-col overflow-y-auto">
                        <div 
                          onClick={() => setActiveRoleAppId('group')}
                          className={`px-4 py-3.5 text-[13px] cursor-pointer flex items-center transition-colors ${activeRoleAppId === 'group' ? 'bg-indigo-50 text-indigo-600 font-medium border-l-[3px] border-indigo-600' : 'text-gray-600 hover:bg-gray-100 border-l-[3px] border-transparent'}`}
                        >
                          角色组
                          {activeRoleAppId === 'group' && <ChevronRight className="w-4 h-4 ml-auto" />}
                        </div>
                        {platformRoles.map(app => (
                          <div 
                            key={app.id}
                            onClick={() => setActiveRoleAppId(app.id)}
                            className={`px-4 py-3.5 text-[13px] cursor-pointer flex items-center transition-colors ${activeRoleAppId === app.id ? 'bg-blue-50 text-[#3498eb] font-medium border-l-[3px] border-[#3498eb]' : 'text-gray-600 hover:bg-gray-100 border-l-[3px] border-transparent'}`}
                          >
                            {app.name}
                            {activeRoleAppId === app.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                          </div>
                        ))}
                      </div>
                      
                      {/* Right Panel */}
                      <div className="flex-1 overflow-y-auto p-5 bg-white">
                        {activeRoleAppId === 'group' ? (
                          <div className="flex flex-col gap-3">
                            {mockRoleGroups.map(group => {
                              const isSelected = selectedGroups.some(g => g.groupId === group.id);
                              return (
                                <label key={group.id} className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                  <input 
                                    type="checkbox" 
                                    className="mt-1 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                    checked={isSelected}
                                    onChange={() => toggleGroup(group.id, group.name)}
                                  />
                                  <div className="flex flex-col">
                                    <span className="text-[14px] text-gray-800 font-medium">{group.name}</span>
                                    <span className="text-[13px] text-gray-500 mt-0.5">{group.description}</span>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-4">
                            {platformRoles.find(a => a.id === activeRoleAppId)?.roles.map(role => {
                              const appName = platformRoles.find(a => a.id === activeRoleAppId)?.name || '';
                              const isSelected = selectedRoles.some(r => r.appId === activeRoleAppId && r.role === role);
                              return (
                                <label key={role} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                  <input 
                                    type="checkbox" 
                                    className="border-gray-300 rounded text-[#3498eb] focus:ring-[#3498eb] cursor-pointer"
                                    checked={isSelected}
                                    onChange={() => toggleAssignRole(activeRoleAppId, appName, role)}
                                  />
                                  <span className="text-[14px] text-gray-700">{role}</span>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-8 flex justify-start border-t border-gray-100 pt-5">
                <button className="bg-[#3498eb] hover:bg-blue-600 px-8 py-2 rounded text-white text-sm transition-colors font-medium">
                  保存配置
                </button>
              </div>
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="w-full max-w-3xl border border-gray-100 rounded-sm bg-white">
              <div className="px-6 py-4 border-b border-gray-100 bg-blue-50/50 flex items-center justify-between">
                <h3 className="font-medium text-gray-800 text-[14px]">签到奖励配置</h3>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">注：此配置只针对注册用户生效</span>
              </div>
              
              <div className="p-6 space-y-8">
                {/* 日常签到 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3498eb]"></div>
                    <h4 className="font-medium text-gray-700 text-sm">日常签到赠送</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-6 pl-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-gray-500">赠送时长 (天)</label>
                      <input type="number" defaultValue="1" className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3498eb]" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-gray-500">赠送 Token 数</label>
                      <input type="number" defaultValue="1000" className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3498eb]" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-gray-500">赠送 PPT 次数</label>
                      <input type="number" defaultValue="1" className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3498eb]" />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-100 w-full"></div>

                {/* 连续签到7天 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                    <h4 className="font-medium text-gray-700 text-sm">连续签到 7 天额外赠送</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-6 pl-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-gray-500">额外时长 (天)</label>
                      <input type="number" defaultValue="3" className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3498eb]" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-gray-500">额外 Token 数</label>
                      <input type="number" defaultValue="5000" className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3498eb]" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-gray-500">额外 PPT 次数</label>
                      <input type="number" defaultValue="3" className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3498eb]" />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-100 w-full"></div>

                {/* 连续签到30天 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                    <h4 className="font-medium text-gray-700 text-sm">连续签到 30 天额外赠送</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-6 pl-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-gray-500">额外时长 (天)</label>
                      <input type="number" defaultValue="15" className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3498eb]" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-gray-500">额外 Token 数</label>
                      <input type="number" defaultValue="30000" className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3498eb]" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-gray-500">额外 PPT 次数</label>
                      <input type="number" defaultValue="10" className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3498eb]" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 flex justify-end bg-gray-50 border-t border-gray-100">
                <button className="bg-[#3498eb] hover:bg-blue-600 px-6 py-2 rounded text-white text-sm transition-colors font-medium">
                  保存配置
                </button>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="w-full max-w-2xl overflow-x-auto border border-gray-100 rounded-sm">
              <table className="w-full text-left border-collapse text-[13px] text-gray-600">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium">
                    <th className="py-3 px-6 font-medium w-1/2">用户类型</th>
                    <th className="py-3 px-6 font-medium w-1/2">数据保留时长 (天)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {userTypes.map((ut) => (
                    <tr key={ut.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-6">
                        <div style={{ paddingLeft: `${ut.level * 20}px` }} className="flex items-center gap-2">
                          {ut.level > 0 && <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>}
                          <span className={ut.level === 0 ? "font-medium text-gray-700" : "text-gray-600"}>{ut.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        {['auth', 'school'].includes(ut.id) ? null : (
                          <div className="flex items-center gap-2">
                            <input 
                              type="number"
                              min="1"
                              className="border border-gray-300 rounded px-3 py-1.5 w-32 text-sm focus:outline-none focus:border-[#3498eb] focus:ring-1 focus:ring-[#3498eb]"
                              value={retentionMap[ut.id] || ''}
                              onChange={(e) => setRetentionMap(prev => ({...prev, [ut.id]: e.target.value}))}
                              placeholder="请输入天数"
                            />
                            <span className="text-gray-500">天</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 flex justify-end bg-gray-50 border-t border-gray-100">
                <button className="bg-[#3498eb] hover:bg-blue-600 px-6 py-2 rounded text-white text-sm transition-colors font-medium">
                  保存配置
                </button>
              </div>
            </div>
          )}

          {activeTab === 'packages' && (
            <div className="w-full max-w-4xl overflow-x-auto border border-gray-100 rounded-sm">
              <table className="w-full text-left border-collapse text-[13px] text-gray-600">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium">
                    <th className="py-3 px-6 font-medium w-1/3">用户类型</th>
                    <th className="py-3 px-6 font-medium w-1/3">默认套餐</th>
                    <th className="py-3 px-6 font-medium text-center w-36 whitespace-nowrap">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {userTypes.filter(u => u.id !== 'guest').map((ut) => (
                    <tr key={ut.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-6">
                        <div style={{ paddingLeft: `${ut.level * 20}px` }} className="flex items-center gap-2">
                          {ut.level > 0 && <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>}
                          <span className={ut.level === 0 ? "font-medium text-gray-700" : "text-gray-600"}>{ut.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        {['auth', 'school'].includes(ut.id) ? null : (
                          <div className="text-gray-700">
                            {detailedPackages.find(p => p.id === packageMap[ut.id])?.name || <span className="text-gray-400">暂未配置</span>}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-6 text-center text-[#3498eb]">
                        {!['auth', 'school'].includes(ut.id) && (
                          <div className="flex items-center justify-center">
                            <button 
                              onClick={() => openPackageConfig(ut.id)}
                              className="flex items-center gap-1 hover:text-blue-700 transition-colors whitespace-nowrap"
                            >
                              <Settings className="w-3.5 h-3.5" /> 套餐配置
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 flex justify-end bg-gray-50 border-t border-gray-100">
                <button className="bg-[#3498eb] hover:bg-blue-600 px-6 py-2 rounded text-white text-sm transition-colors font-medium">
                  保存配置
                </button>
              </div>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="w-full overflow-x-auto border border-gray-100 rounded-sm">
              <table className="w-full text-left border-collapse text-[13px] text-gray-600">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium">
                    <th className="py-3 px-6 font-medium w-24">ID</th>
                    <th className="py-3 px-6 font-medium whitespace-nowrap">应用名称</th>
                    <th className="py-3 px-6 font-medium">当前默认角色 (按用户类型)</th>
                    <th className="py-3 px-6 font-medium text-center w-36 whitespace-nowrap">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {platformData.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-6 text-gray-500">{row.id}</td>
                      <td className="py-3 px-6 text-gray-700">{row.name}</td>
                      <td className="py-3 px-6 text-gray-600">
                        <div className="flex flex-col gap-1.5 py-1">
                          {Object.entries(row.rolesMap || {}).map(([key, roles]) => (
                            (roles as string[]).length > 0 && (
                              <div key={key} className="flex gap-2 items-start text-xs">
                                <span className="text-gray-500 w-20 shrink-0 mt-0.5 text-right">{userTypes.find(u => u.id === key)?.name || key}:</span>
                                <div className="flex flex-wrap gap-1">
                                  {(roles as string[]).map(r => (
                                    <span key={r} className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100 text-xs">
                                      {r}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )
                          ))}
                          {(!row.rolesMap || Object.values(row.rolesMap).flat().length === 0) && <span className="text-gray-400">暂无角色</span>}
                        </div>
                      </td>
                      <td className="py-3 px-6 text-center text-[#3498eb]">
                        <div className="flex items-center justify-center">
                          <button 
                            onClick={() => openRoleConfig(row)}
                            className="flex items-center gap-1 hover:text-blue-700 transition-colors whitespace-nowrap"
                          >
                            <Settings className="w-3.5 h-3.5" /> 角色配置
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Role Config Modal */}
      {isRoleModalOpen && selectedPlatform && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl w-[700px] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">默认角色配置 - {selectedPlatform.name}</h3>
              <button 
                onClick={() => setIsRoleModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex h-[50vh]">
              {/* Left: User Types Tree */}
              <div className="w-[180px] shrink-0 border-r border-gray-100 p-4 overflow-y-auto bg-gray-50/50">
                <div className="text-xs font-semibold text-gray-500 mb-3">选择用户类型</div>
                <div className="flex flex-col gap-0.5">
                  {userTypes.map(ut => (
                    <div 
                      key={ut.id}
                      onClick={() => setSelectedUserType(ut.id)}
                      className={`flex items-center cursor-pointer px-2 py-2 rounded text-[13px] transition-colors select-none ${selectedUserType === ut.id ? 'bg-[#3498eb] text-white shadow-sm font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                      style={{ marginLeft: `${ut.level * 16}px` }}
                    >
                      {ut.name}
                      {selectedUserType === ut.id && <ChevronRight className="w-4 h-4 ml-auto opacity-70" />}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Right: Roles */}
              <div className="flex-1 p-6 overflow-y-auto bg-white">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[14px] font-medium text-gray-800">
                    分配角色 <span className="text-gray-400 text-[13px] ml-2 font-normal">({userTypes.find(u => u.id === selectedUserType)?.name})</span>
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 pr-2">
                  {availableRoles.map(role => {
                    const isChecked = (rolesMap[selectedUserType] || []).includes(role);
                    return (
                      <label key={role} className={`flex items-center gap-2 cursor-pointer p-3 rounded border transition-colors ${isChecked ? 'bg-blue-50/50 border-blue-200' : 'bg-white border-gray-200 hover:border-blue-300'}`}>
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-[#3498eb] border-gray-300 rounded focus:ring-[#3498eb] cursor-pointer"
                          checked={isChecked}
                          onChange={() => toggleRole(role)}
                        />
                        <span className="text-[13px] text-gray-700 select-none">{role}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button 
                onClick={() => setIsRoleModalOpen(false)}
                className="px-4 py-2 border border-gray-300 bg-white rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  selectedPlatform.rolesMap = rolesMap;
                  setIsRoleModalOpen(false);
                }}
                className="px-4 py-2 bg-[#3498eb] hover:bg-blue-600 rounded text-sm text-white transition-colors"
              >
                保存配置
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Package Selection Modal */}
      {isPackageModalOpen && selectedUserTypeForPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-in fade-in duration-200 p-8">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <h3 className="font-bold text-gray-800">
                配置默认套餐 - <span className="text-[#3498eb]">{userTypes.find(u => u.id === selectedUserTypeForPackage)?.name}</span>
              </h3>
              <button 
                onClick={() => setIsPackageModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto bg-gray-50 flex-1">
              <div className="flex gap-4 flex-wrap justify-center">
                {detailedPackages.map(pkg => {
                  const isSelected = packageMap[selectedUserTypeForPackage] === pkg.id;
                  return (
                    <div 
                      key={pkg.id}
                      onClick={() => selectPackage(pkg.id)}
                      className={`relative w-[210px] rounded-xl flex flex-col bg-gradient-to-b ${pkg.bgClass} cursor-pointer transition-all hover:shadow-md border-2 ${isSelected ? 'border-[#3498eb] shadow-lg scale-[1.02]' : 'border-transparent'}`}
                    >
                      {/* Check mark for selected */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-[#3498eb] text-white rounded-full p-0.5 shadow-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                      )}
                      
                      <div className="p-4 pb-2 border-b border-white/40">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white/50 shadow-sm ${pkg.textClass}`}>
                            <Star className="w-4 h-4" />
                          </div>
                          <h4 className="font-bold text-[15px] text-gray-800">{pkg.name}</h4>
                        </div>
                        <div className="text-[11px] text-gray-500 h-8">
                          {pkg.model ? <div>{pkg.model}</div> : <div className="text-transparent hidden">null</div>}
                          <div>有效期: {pkg.validity}</div>
                        </div>
                      </div>
                      
                      <div className="p-4 pt-3 flex flex-col gap-3 flex-1">
                        <div className="flex items-center mb-1">
                          <span className="text-[11px] text-gray-500 w-16">收费标准:</span>
                          <div className={`text-2xl font-semibold flex items-baseline ${pkg.textClass}`}>
                            {pkg.pricePrefix && <span className="text-sm mr-0.5">{pkg.pricePrefix}</span>}
                            <span>{pkg.price}</span>
                          </div>
                        </div>
                        
                        <div className="text-[12px] text-gray-600 flex flex-col gap-2.5">
                          <div className="flex items-center">
                            <div className="w-3.5 h-3.5 rounded-full bg-indigo-500 text-white flex items-center justify-center mr-2">
                              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <span className="w-16">账号数:</span>
                            <span className={`font-medium ml-auto ${pkg.textClass}`}>{pkg.accounts}</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3.5 h-3.5 rounded-full bg-indigo-500 text-white flex items-center justify-center mr-2">
                              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <span className="w-16">Token数:</span>
                            <span className={`font-medium ml-auto ${pkg.textClass}`}>{pkg.tokens}</span>
                          </div>
                          {pkg.aippt && (
                            <div className="flex items-center">
                              <div className="w-3.5 h-3.5 rounded-full bg-indigo-500 text-white flex items-center justify-center mr-2">
                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                              </div>
                              <span className="w-16">AI-PPT:</span>
                              <span className={`font-medium ml-auto ${pkg.textClass}`}>{pkg.aippt}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
