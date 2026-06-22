import React, { useState, useRef, useEffect } from 'react';
import { Search, RefreshCw, X, User as UserIcon, UploadCloud, Star, ChevronDown, ChevronRight } from 'lucide-react';

const mockData = [
  {
    id: '1',
    phone: '13800138000',
    loginName: 'zj_admin',
    userName: '张建',
    gender: '男',
    authType: '院校用户',
    organization: '福州大学',
    auditStatus: '审核通过',
    lastLoginTime: '2026-06-11 10:20:30',
  },
  {
    id: '2',
    phone: '13900139000',
    loginName: 'li_ming',
    userName: '李明',
    gender: '男',
    authType: '企业用户',
    organization: '新大陆科技集团',
    auditStatus: '待审核',
    lastLoginTime: '2026-06-10 14:15:20',
  },
  {
    id: '3',
    phone: '13700137000',
    loginName: 'guest_user',
    userName: '王小红',
    gender: '女',
    authType: '无',
    organization: '-',
    auditStatus: '无',
    lastLoginTime: '2026-06-09 09:30:00',
  },
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

export default function RegisteredUsersContent({ className }: { className?: string }) {
  const [searchUsername, setSearchUsername] = useState('');
  const [searchLoginName, setSearchLoginName] = useState('');
  const [searchUserType, setSearchUserType] = useState('');
  const [searchAuditStatus, setSearchAuditStatus] = useState('');

  const [viewUser, setViewUser] = useState<any>(null);
  const [auditUser, setAuditUser] = useState<any>(null);
  const [rechargeUser, setRechargeUser] = useState<any>(null);
  const [orderRecordUser, setOrderRecordUser] = useState<any>(null);
  const [usageRecordUser, setUsageRecordUser] = useState<any>(null);
  const [roleAssignUser, setRoleAssignUser] = useState<any>(null);
  
  const [auditResult, setAuditResult] = useState<string>('pass');
  const [rejectReason, setRejectReason] = useState<string>('');
  const [rechargePackage, setRechargePackage] = useState<string>('');

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

  const toggleRole = (appId: string, appName: string, role: string) => {
    const exists = selectedRoles.some(r => r.appId === appId && r.role === role);
    if (exists) {
      setSelectedRoles(selectedRoles.filter(r => !(r.appId === appId && r.role === role)));
    } else {
      setSelectedRoles([...selectedRoles, { appId, appName, role }]);
    }
  };

  return (
    <div className={`bg-gray-100 p-4 ${className} overflow-hidden flex flex-col`}>
      <div className="bg-white rounded-sm shadow-sm flex flex-col h-full overflow-hidden">
        {/* Breadcrumb */}
        <div className="flex items-center px-6 py-4 border-b border-gray-100 shrink-0">
          <span className="text-gray-400 text-[13px]">认证管理</span>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-700 text-[13px] font-medium">注册用户管理</span>
        </div>

        {/* Search Header */}
        <div className="p-6 border-b border-gray-100 shrink-0">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-gray-500 w-16 text-right">用户名:</span>
              <input
                type="text"
                placeholder="请输入"
                className="border border-gray-300 rounded px-3 py-1.5 text-sm w-48 focus:outline-none focus:border-blue-500"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-gray-500 w-16 text-right">登录名:</span>
              <input
                type="text"
                placeholder="请输入"
                className="border border-gray-300 rounded px-3 py-1.5 text-sm w-48 focus:outline-none focus:border-blue-500"
                value={searchLoginName}
                onChange={(e) => setSearchLoginName(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-gray-500 w-16 text-right">用户类型:</span>
              <select
                className="border border-gray-300 rounded px-3 py-1.5 text-sm w-48 focus:outline-none focus:border-blue-500 bg-white"
                value={searchUserType}
                onChange={(e) => setSearchUserType(e.target.value)}
              >
                <option value="">全部</option>
                <option value="企业用户">企业用户</option>
                <option value="院校用户">院校用户</option>
                <option value="未认证用户">未认证用户</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-gray-500 w-16 text-right">审核状态:</span>
              <select
                className="border border-gray-300 rounded px-3 py-1.5 text-sm w-48 focus:outline-none focus:border-blue-500 bg-white"
                value={searchAuditStatus}
                onChange={(e) => setSearchAuditStatus(e.target.value)}
              >
                <option value="">全部</option>
                <option value="无">无</option>
                <option value="待审核">待审核</option>
                <option value="审核通过">审核通过</option>
              </select>
            </div>
            
            <div className="flex gap-2 ml-auto">
              <button className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-500 text-white rounded text-[13px] transition-colors hover:bg-blue-600">
                <Search className="w-3.5 h-3.5" />
                查询
              </button>
              <button className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-gray-300 text-gray-700 rounded text-[13px] transition-colors hover:bg-gray-50">
                <RefreshCw className="w-3.5 h-3.5" />
                重置
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto p-4">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500">
                <th className="py-3 px-4 font-medium border-b border-gray-100">手机号</th>
                <th className="py-3 px-4 font-medium border-b border-gray-100">登录名</th>
                <th className="py-3 px-4 font-medium border-b border-gray-100">用户名</th>
                <th className="py-3 px-4 font-medium border-b border-gray-100">性别</th>
                <th className="py-3 px-4 font-medium border-b border-gray-100">认证用户</th>
                <th className="py-3 px-4 font-medium border-b border-gray-100">加入组织</th>
                <th className="py-3 px-4 font-medium border-b border-gray-100">审核状态</th>
                <th className="py-3 px-4 font-medium border-b border-gray-100">最近登录时间</th>
                <th className="py-3 px-4 font-medium border-b border-gray-100 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4 text-gray-700">{row.phone}</td>
                  <td className="py-3 px-4 text-gray-700">{row.loginName}</td>
                  <td className="py-3 px-4 text-gray-700">{row.userName}</td>
                  <td className="py-3 px-4 text-gray-700">{row.gender}</td>
                  <td className="py-3 px-4 text-gray-700">
                    {row.authType === '未认证用户' || row.authType === '无' ? (
                       <span className="text-gray-400">无</span>
                    ) : (
                       <span>{row.authType}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-700">{row.organization}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      row.auditStatus === '待审核' ? 'bg-orange-50 text-orange-600 border border-orange-200' :
                      row.auditStatus === '审核通过' ? 'bg-green-50 text-green-600 border border-green-200' :
                      'bg-gray-50 text-gray-500 border border-gray-200'
                    }`}>
                      {row.auditStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500">{row.lastLoginTime}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-row items-center justify-center gap-2 text-xs">
                      <button 
                        onClick={() => setViewUser(row)}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        查看
                      </button>
                      <button 
                        onClick={() => {
                          if (row.auditStatus === '待审核') {
                            setAuditUser(row);
                            setAuditResult('pass');
                            setRejectReason('');
                          }
                        }}
                        className={`transition-colors ${row.auditStatus === '待审核' ? 'text-green-500 hover:text-green-700' : 'text-gray-300 cursor-not-allowed'}`}
                      >
                        审核
                      </button>
                      <button onClick={() => setRoleAssignUser(row)} className="text-indigo-500 hover:text-indigo-700 transition-colors">
                        角色
                      </button>
                      <button onClick={() => setRechargeUser(row)} className="text-[#3498eb] hover:text-blue-700 transition-colors">
                        充值
                      </button>
                      <button onClick={() => setOrderRecordUser(row)} className="text-purple-500 hover:text-purple-700 transition-colors">
                        订单记录
                      </button>
                      <button onClick={() => setUsageRecordUser(row)} className="text-orange-500 hover:text-orange-700 transition-colors">
                        使用记录
                      </button>
                      <button className="text-red-500 hover:text-red-700 transition-colors">
                        禁用
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination Mock */}
          <div className="flex items-center justify-end px-4 py-3 mt-2 text-[13px] text-gray-500">
            <span className="mr-4">共 3 条</span>
            <div className="flex items-center gap-1">
               <button className="px-2 py-1 border border-gray-200 rounded text-gray-400 cursor-not-allowed bg-gray-50">上一页</button>
               <button className="px-3 py-1 bg-blue-500 text-white rounded border border-blue-500">1</button>
               <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 transition-colors">下一页</button>
            </div>
          </div>
        </div>
      </div>

      {/* View User Modal */}
      {viewUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-lg shadow-xl w-[700px] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">用户信息</h3>
              <button onClick={() => setViewUser(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 flex gap-12 text-[14px]">
              <div className="flex-1 space-y-6">
                <div className="flex flex-col gap-2">
                  <span className="text-gray-500">账号:</span>
                  <span className="text-gray-800">{viewUser.phone}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-gray-500">用户名:</span>
                  <span className="text-gray-800">{viewUser.userName}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-gray-500">手机号:</span>
                  <span className="text-gray-800">{viewUser.phone}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-gray-500">性别:</span>
                  <span className="text-gray-800">{viewUser.gender}</span>
                </div>
              </div>
              <div className="w-48 flex flex-col gap-2">
                <span className="text-gray-500">头像</span>
                <div className="w-32 h-32 border border-dashed border-gray-300 rounded flex items-center justify-center bg-gray-50/50">
                  <UserIcon className="w-16 h-16 text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audit User Modal */}
      {auditUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-lg shadow-xl w-[600px] flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <span className="text-blue-500 font-normal">+</span> {auditUser.authType === '院校用户' ? '院校认证' : '企业认证'}
              </h3>
              <button onClick={() => setAuditUser(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-5 text-[13px]">
              {auditUser.authType === '院校用户' ? (
                // School Auth Display
                <>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-gray-500">所在院校全称</span>
                    <span className="text-gray-800 bg-gray-50 px-3 py-2 border border-gray-100 rounded">{auditUser.organization || '福州大学'}</span>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <span className="text-gray-500">所在院系</span>
                    <span className="text-gray-800 bg-gray-50 px-3 py-2 border border-gray-100 rounded">计算机与大数据学院</span>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <span className="text-gray-500">身份类型</span>
                    <span className="text-gray-800 bg-gray-50 px-3 py-2 border border-gray-100 rounded">学生</span>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <span className="text-gray-500">学号/工号</span>
                    <span className="text-gray-800 bg-gray-50 px-3 py-2 border border-gray-100 rounded">20230001</span>
                  </div>
                </>
              ) : (
                // Enterprise Auth Display
                <>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-gray-500">所属企业</span>
                    <span className="text-gray-800 bg-gray-50 px-3 py-2 border border-gray-100 rounded">{auditUser.organization || '新大陆科技集团'}</span>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <span className="text-gray-500">所属部门</span>
                    <span className="text-gray-800 bg-gray-50 px-3 py-2 border border-gray-100 rounded">研发中心</span>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <span className="text-gray-500">职位</span>
                    <span className="text-gray-800 bg-gray-50 px-3 py-2 border border-gray-100 rounded">前端工程师</span>
                  </div>
                </>
              )}
              
              <div className="flex flex-col gap-1.5">
                <span className="text-gray-500">资质证明</span>
                <div className="mt-1 border border-gray-200 rounded-lg bg-gray-50 p-4 flex items-center justify-center">
                   <div className="flex items-center gap-2 text-blue-500 hover:text-blue-700 cursor-pointer">
                      <UserIcon className="w-5 h-5" />
                      <span>查看证明材料.jpg</span>
                   </div>
                </div>
              </div>

              <hr className="border-gray-100" />
              
              <div className="flex flex-col gap-3">
                <span className="text-gray-700 font-medium">审核结果</span>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="auditResult" 
                      value="pass" 
                      checked={auditResult === 'pass'} 
                      onChange={() => setAuditResult('pass')} 
                      className="text-blue-500 focus:ring-blue-500"
                    />
                    <span>审核通过</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="auditResult" 
                      value="reject" 
                      checked={auditResult === 'reject'} 
                      onChange={() => setAuditResult('reject')}
                      className="text-blue-500 focus:ring-blue-500"
                    />
                    <span>审核不通过</span>
                  </label>
                </div>
              </div>

              {auditResult === 'reject' && (
                <div className="flex flex-col gap-2">
                  <label className="text-gray-700 font-medium"><span className="text-red-500 mr-1">*</span>不通过理由</label>
                  <textarea 
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    rows={3}
                    placeholder="请输入审核不通过的理由"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  ></textarea>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 shrink-0 bg-gray-50 rounded-b-lg">
              <button onClick={() => setAuditUser(null)} className="px-6 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-100 transition-colors bg-white">
                取消
              </button>
              <button onClick={() => setAuditUser(null)} className="px-6 py-2 bg-[#2563eb] text-white rounded text-sm hover:bg-blue-700 transition-colors font-medium cursor-pointer">
                提交审核
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Recharge Modal */}
      {rechargeUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-in fade-in duration-200 p-8">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <h3 className="font-bold text-gray-800">充值 <span className="font-normal text-sm text-gray-500 ml-2">- {rechargeUser.phone} ({rechargeUser.userName})</span></h3>
              <button onClick={() => setRechargeUser(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto bg-gray-50 flex-1">
              <div className="flex gap-4 flex-wrap justify-center mt-4">
                {[
                  { id: 'trial', name: '试用套餐', model: '', validity: '12月', price: '免费', accounts: '0', tokens: '5000000', aippt: '5', bgClass: 'from-[#e6f0ff] to-[#f5f9ff]', textClass: 'text-blue-500' },
                  { id: 'small', name: '小容量套餐', model: '', validity: '2月', price: '免费', accounts: '5', tokens: '1000', aippt: '1', bgClass: 'from-[#f3e8ff] to-[#fdfaull]', textClass: 'text-purple-500' },
                  { id: '10acc', name: '10账号套餐', model: '', validity: '12月', price: '免费', accounts: '10', tokens: '0', aippt: null, bgClass: 'from-[#fff0e6] to-[#fffaf5]', textClass: 'text-orange-500' },
                  { id: 'iot', name: '智联网综合实...', model: '型号:LingY-611-TJ', validity: '12月', price: '2000', pricePrefix: '¥', accounts: '1', tokens: '10000000', aippt: null, bgClass: 'from-[#fff8db] to-[#fffdf0]', textClass: 'text-blue-500' },
                  { id: 'demo', name: 'demo', model: '', validity: '2月', price: '免费', accounts: '1', tokens: '10000', aippt: null, bgClass: 'from-[#e6f0ff] to-[#f5f9ff]', textClass: 'text-blue-500' },
                ].map(pkg => {
                  const isSelected = rechargePackage === pkg.id;
                  return (
                    <div 
                      key={pkg.id}
                      onClick={() => setRechargePackage(pkg.id)}
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
            
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 shrink-0 bg-white">
              <button onClick={() => setRechargeUser(null)} className="px-6 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors bg-white">
                取消
              </button>
              <button onClick={() => {
                if (!rechargePackage) {
                  alert('请选择充值套餐');
                  return;
                }
                setRechargeUser(null);
                setRechargePackage('');
              }} className="px-6 py-2 bg-[#3498eb] text-white rounded text-sm hover:bg-blue-600 transition-colors">
                确定充值
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Record Modal */}
      {orderRecordUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-lg shadow-xl w-[800px] flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">订单记录 - {orderRecordUser.userName}</h3>
              <button onClick={() => setOrderRecordUser(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-auto">
              <table className="w-full text-left border-collapse text-[13px]">
                <thead>
                  <tr className="bg-gray-50/80 text-gray-500 border-b border-gray-100">
                    <th className="py-2 px-4 font-medium">时间</th>
                    <th className="py-2 px-4 font-medium">类型</th>
                    <th className="py-2 px-4 font-medium">内容详情</th>
                    <th className="py-2 px-4 font-medium">生效日期</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-50 text-gray-700 hover:bg-gray-50/50">
                    <td className="py-3 px-4">2026-06-11 10:20:30</td>
                    <td className="py-3 px-4"><span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-sm border border-blue-100 text-xs">充值套餐</span></td>
                    <td className="py-3 px-4">基础套餐 (1000万Token, 100次PPT)</td>
                    <td className="py-3 px-4">2026-06-11 至 2027-06-11</td>
                  </tr>
                  <tr className="border-b border-gray-50 text-gray-700 hover:bg-gray-50/50">
                    <td className="py-3 px-4">2026-06-10 08:15:00</td>
                    <td className="py-3 px-4"><span className="bg-green-50 text-green-600 px-2.5 py-1 rounded-sm border border-green-100 text-xs">签到赠送</span></td>
                    <td className="py-3 px-4">赠送 1000Token, 1次PPT时长</td>
                    <td className="py-3 px-4">-</td>
                  </tr>
                  <tr className="text-gray-700 hover:bg-gray-50/50">
                    <td className="py-3 px-4">2026-06-09 08:00:00</td>
                    <td className="py-3 px-4"><span className="bg-green-50 text-green-600 px-2.5 py-1 rounded-sm border border-green-100 text-xs">签到赠送</span></td>
                    <td className="py-3 px-4">赠送 1000Token, 1次PPT时长</td>
                    <td className="py-3 px-4">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Usage Record Modal */}
      {usageRecordUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-lg shadow-xl w-[800px] flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <h3 className="font-bold text-gray-800">使用记录 - {usageRecordUser.userName}</h3>
              <button onClick={() => setUsageRecordUser(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="border border-gray-100 rounded-lg p-4 bg-blue-50/30">
                  <div className="text-gray-500 mb-1 text-xs">剩余 Token</div>
                  <div className="text-2xl font-bold text-[#3498eb]">8,500,000</div>
                  <div className="text-xs text-gray-400 mt-2">总计: 10,000,000</div>
                </div>
                <div className="border border-gray-100 rounded-lg p-4 bg-purple-50/30">
                  <div className="text-gray-500 mb-1 text-xs">剩余 实验时长</div>
                  <div className="text-2xl font-bold text-purple-600">120 <span className="text-sm font-normal">小时</span></div>
                  <div className="text-xs text-gray-400 mt-2">总计: 200 小时</div>
                </div>
                <div className="border border-gray-100 rounded-lg p-4 bg-orange-50/30">
                  <div className="text-gray-500 mb-1 text-xs">剩余 PPT 制作次数</div>
                  <div className="text-2xl font-bold text-orange-500">85 <span className="text-sm font-normal">次</span></div>
                  <div className="text-xs text-gray-400 mt-2">总计: 100 次</div>
                </div>
              </div>

              <h4 className="font-medium text-gray-800 mb-3 text-[14px]">近期消耗明细</h4>
              <div className="border border-gray-100 rounded">
                <table className="w-full text-left border-collapse text-[13px]">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 border-b border-gray-100">
                      <th className="py-2 px-4 font-medium">时间</th>
                      <th className="py-2 px-4 font-medium">消耗项</th>
                      <th className="py-2 px-4 font-medium">数量</th>
                      <th className="py-2 px-4 font-medium">来源功能</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-50 text-gray-700 hover:bg-gray-50/50">
                      <td className="py-3 px-4">2026-06-11 15:30:12</td>
                      <td className="py-3 px-4">Token</td>
                      <td className="py-3 px-4 text-red-500 font-medium">-2,500</td>
                      <td className="py-3 px-4">AI 问答对话</td>
                    </tr>
                    <tr className="border-b border-gray-50 text-gray-700 hover:bg-gray-50/50">
                      <td className="py-3 px-4">2026-06-11 14:20:00</td>
                      <td className="py-3 px-4">PPT 制作</td>
                      <td className="py-3 px-4 text-red-500 font-medium">-1</td>
                      <td className="py-3 px-4">一键生成 PPT</td>
                    </tr>
                    <tr className="text-gray-700 hover:bg-gray-50/50">
                      <td className="py-3 px-4">2026-06-11 09:00:00</td>
                      <td className="py-3 px-4">实验时长</td>
                      <td className="py-3 px-4 text-red-500 font-medium">-2 小时</td>
                      <td className="py-3 px-4">虚实融合沙盘</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role Assignment Modal */}
      {roleAssignUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-lg shadow-xl w-[700px] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <h3 className="font-bold text-gray-800">分配角色 - {roleAssignUser.userName}</h3>
              <button 
                onClick={() => {
                  setRoleAssignUser(null);
                  setIsRoleDropdownOpen(false);
                }} 
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4 h-[300px]" ref={dropdownRef}>
                <label className="text-gray-700 font-medium whitespace-nowrap mt-2">
                  <span className="text-red-500 mr-1">*</span> 角色:
                </label>
                <div className="relative flex-1">
                  <div 
                    className="min-h-[40px] px-2 py-1.5 border border-blue-400 rounded-lg flex flex-wrap gap-2 items-center cursor-pointer transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
                    onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  >
                    {selectedGroups.length === 0 && selectedRoles.length === 0 && (
                      <span className="text-gray-400 text-sm pl-2">请选择角色或角色组</span>
                    )}

                    {selectedGroups.map(group => (
                      <span key={group.groupId} className="bg-indigo-50 text-indigo-700 px-2 py-1 flex items-center gap-1 rounded text-sm border border-indigo-100">
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
                      <span key={`${role.appId}-${role.role}-${idx}`} className="bg-gray-100 text-gray-700 px-2 py-1 flex items-center gap-1 rounded text-sm border border-gray-200">
                        {role.appName} / {role.role}
                        <X 
                          className="w-3.5 h-3.5 cursor-pointer hover:text-gray-900" 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRole(role.appId, role.appName, role.role);
                          }}
                        />
                      </span>
                    ))}

                    <div className="ml-auto pr-1 text-gray-400">
                      {isRoleDropdownOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </div>

                  {isRoleDropdownOpen && (
                    <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-10 flex h-[240px] overflow-hidden">
                      {/* Left Sidebar */}
                      <div className="w-[180px] bg-gray-50 border-r border-gray-100 flex flex-col overflow-y-auto">
                        <div 
                          onClick={() => setActiveRoleAppId('group')}
                          className={`px-4 py-3 text-[13px] cursor-pointer flex items-center transition-colors ${activeRoleAppId === 'group' ? 'bg-indigo-50 text-indigo-600 font-medium border-l-2 border-indigo-600' : 'text-gray-600 hover:bg-gray-100 border-l-2 border-transparent'}`}
                        >
                          角色组
                          {activeRoleAppId === 'group' && <ChevronRight className="w-4 h-4 ml-auto" />}
                        </div>
                        {platformRoles.map(app => (
                          <div 
                            key={app.id}
                            onClick={() => setActiveRoleAppId(app.id)}
                            className={`px-4 py-3 text-[13px] cursor-pointer flex items-center transition-colors ${activeRoleAppId === app.id ? 'bg-blue-50 text-[#3498eb] font-medium border-l-2 border-[#3498eb]' : 'text-gray-600 hover:bg-gray-100 border-l-2 border-transparent'}`}
                          >
                            {app.name}
                            {activeRoleAppId === app.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                          </div>
                        ))}
                      </div>
                      
                      {/* Right Panel */}
                      <div className="flex-1 overflow-y-auto p-4 bg-white">
                        {activeRoleAppId === 'group' ? (
                          <div className="flex flex-col gap-3">
                            {mockRoleGroups.map(group => {
                              const isSelected = selectedGroups.some(g => g.groupId === group.id);
                              return (
                                <label key={group.id} className="flex items-start gap-3 cursor-pointer p-2 rounded hover:bg-gray-50 transition-colors">
                                  <input 
                                    type="checkbox" 
                                    className="mt-1 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                    checked={isSelected}
                                    onChange={() => toggleGroup(group.id, group.name)}
                                  />
                                  <div className="flex flex-col">
                                    <span className="text-[14px] text-gray-800 font-medium">{group.name}</span>
                                    <span className="text-[12px] text-gray-500 mt-0.5">{group.description}</span>
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
                                <label key={role} className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-50 transition-colors">
                                  <input 
                                    type="checkbox" 
                                    className="border-gray-300 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    checked={isSelected}
                                    onChange={() => toggleRole(activeRoleAppId, appName, role)}
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
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 shrink-0 bg-gray-50 rounded-b-lg">
              <button 
                onClick={() => {
                  setRoleAssignUser(null);
                  setIsRoleDropdownOpen(false);
                }} 
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-100 transition-colors bg-white"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  setRoleAssignUser(null);
                  setIsRoleDropdownOpen(false);
                }} 
                className="px-6 py-2 bg-[#3498eb] text-white rounded text-sm hover:bg-blue-600 transition-colors"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
