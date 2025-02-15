import React, { useState } from 'react';
import { User } from '../types';
import { FileUpload } from './FileUpload';
import { AnalysisResults } from './AnalysisResults';
import { signOut } from '../lib/auth';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  FileSpreadsheet,
  LogOut,
  GraduationCap,
  TrendingUp,
  Award,
  Clock,
  Search,
  Trash2,
  Edit,
  UserPlus,
  Settings,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

interface DashboardProps {
  user: User;
}

// Sample data
const sampleStudents = [
  { id: 1, name: 'John Smith', prn: 'PRN2024001', course: 'B.Tech CSE', semester: 4, cgpa: 8.9 },
  { id: 2, name: 'Emma Wilson', prn: 'PRN2024002', course: 'B.Tech CSE', semester: 4, cgpa: 9.2 },
  { id: 3, name: 'Michael Brown', prn: 'PRN2024003', course: 'B.Tech CSE', semester: 4, cgpa: 8.7 },
  { id: 4, name: 'Sarah Davis', prn: 'PRN2024004', course: 'B.Tech CSE', semester: 4, cgpa: 9.0 },
  { id: 5, name: 'James Johnson', prn: 'PRN2024005', course: 'B.Tech CSE', semester: 4, cgpa: 8.5 },
];

const sampleTeachers = [
  { id: 1, name: 'Dr. Robert Chen', email: 'robert.chen@example.com', department: 'Computer Science', subjects: ['Advanced Programming', 'Software Engineering'] },
  { id: 2, name: 'Dr. Sarah Miller', email: 'sarah.miller@example.com', department: 'Computer Science', subjects: ['Database Systems'] },
  { id: 3, name: 'Prof. David Wilson', email: 'david.wilson@example.com', department: 'Computer Science', subjects: ['Computer Networks'] },
];

const sampleSubjects = [
  { id: 1, code: 'CS401', name: 'Advanced Programming', faculty: 'Dr. Robert Chen', students: 150, avgScore: 82 },
  { id: 2, code: 'CS402', name: 'Database Systems', faculty: 'Dr. Sarah Miller', students: 145, avgScore: 78 },
  { id: 3, code: 'CS403', name: 'Computer Networks', faculty: 'Prof. David Wilson', students: 155, avgScore: 75 },
  { id: 4, code: 'CS404', name: 'Operating Systems', faculty: 'Dr. Emily Brown', students: 148, avgScore: 80 },
  { id: 5, code: 'CS405', name: 'Software Engineering', faculty: 'Prof. Michael Lee', students: 152, avgScore: 85 },
];

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteTeacher = (teacherId: number) => {
    toast.success('Teacher account deleted successfully');
  };

  const navigation = [
    { name: 'Overview', icon: LayoutDashboard, tab: 'overview' },
    { name: 'Students', icon: Users, tab: 'students' },
    { name: 'Subjects', icon: BookOpen, tab: 'subjects' },
    { name: 'Analysis', icon: FileSpreadsheet, tab: 'analysis' },
    ...(user.role === 'admin' ? [
      { name: 'Teachers', icon: Shield, tab: 'teachers' },
    ] : []),
  ];

  const filteredStudents = sampleStudents.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.prn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSubjects = sampleSubjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTeachers = sampleTeachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          <div className="flex-1 flex flex-col pt-5 pb-4">
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h1 className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
                Performance Analysis
              </h1>
            </div>
            <nav className="mt-8 flex-1 px-2 space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.tab)}
                  className={`${
                    activeTab === item.tab
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-blue-50'
                  } group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg w-full transition-all duration-200`}
                >
                  <item.icon
                    className={`${
                      activeTab === item.tab ? 'text-white' : 'text-gray-400 group-hover:text-blue-600'
                    } mr-3 h-5 w-5 transition-colors`}
                  />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center w-full bg-gray-50 p-2 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">{user.name}</p>
                <p className="text-xs text-blue-600 font-medium capitalize">{user.role}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="ml-auto flex items-center justify-center h-8 w-8 rounded-full hover:bg-red-50 group transition-colors"
              >
                <LogOut className="h-5 w-5 text-gray-400 group-hover:text-red-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-blue-100">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <Users className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                            <dd className="text-lg font-bold text-gray-900">750</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-blue-100">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="p-2 bg-green-50 rounded-lg">
                            <TrendingUp className="h-6 w-6 text-green-600" />
                          </div>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Average CGPA</dt>
                            <dd className="text-lg font-bold text-gray-900">8.5</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-blue-100">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="p-2 bg-yellow-50 rounded-lg">
                            <Award className="h-6 w-6 text-yellow-600" />
                          </div>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Pass Rate</dt>
                            <dd className="text-lg font-bold text-gray-900">92%</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-blue-100">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="p-2 bg-purple-50 rounded-lg">
                            <Clock className="h-6 w-6 text-purple-600" />
                          </div>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Current Semester</dt>
                            <dd className="text-lg font-bold text-gray-900">4th</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white shadow-lg rounded-xl border border-blue-100">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                    <div className="mt-4 divide-y divide-gray-200">
                      {[
                        { action: 'Marks Updated', subject: 'Advanced Programming', time: '2 hours ago', icon: Edit, color: 'text-blue-600' },
                        { action: 'New Student Added', subject: 'Emma Wilson', time: '4 hours ago', icon: UserPlus, color: 'text-green-600' },
                        { action: 'Analysis Generated', subject: 'Database Systems', time: '1 day ago', icon: FileSpreadsheet, color: 'text-purple-600' },
                        { action: 'Report Downloaded', subject: 'Semester Progress', time: '2 days ago', icon: Settings, color: 'text-yellow-600' },
                      ].map((activity, idx) => (
                        <div key={idx} className="py-3">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-lg ${activity.color.replace('text', 'bg').replace('600', '50')}`}>
                              <activity.icon className={`h-5 w-5 ${activity.color}`} />
                            </div>
                            <div className="ml-4 flex-1">
                              <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                              <p className="text-sm text-gray-500">{activity.subject}</p>
                            </div>
                            <p className="text-sm text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Students Tab */}
            {activeTab === 'students' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Students</h2>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
                      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                    {user.role === 'admin' && (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                        <UserPlus className="h-5 w-5" />
                        <span>Add Student</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-white shadow-lg rounded-xl border border-blue-100 overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          PRN
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Course
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Semester
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          CGPA
                        </th>
                        {user.role === 'admin' && (
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{student.prn}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{student.course}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{student.semester}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{student.cgpa}</div>
                          </td>
                          {user.role === 'admin' && (
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-900 mr-3">
                                <Edit className="h-5 w-5" />
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Subjects Tab */}
            {activeTab === 'subjects' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Subjects</h2>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search subjects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
                      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                    {user.role === 'admin' && (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                        <BookOpen className="h-5 w-5" />
                        <span>Add Subject</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-white shadow-lg rounded-xl border border-blue-100 overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subject Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Faculty
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Students
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Avg. Score
                        </th>
                        {user.role === 'admin' && (
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredSubjects.map((subject) => (
                        <tr key={subject.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{subject.code}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{subject.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{subject.faculty}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{subject.students}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{subject.avgScore}%</div>
                          </td>
                          {user.role === 'admin' && (
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-900 mr-3">
                                <Edit className="h-5 w-5" />
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Teachers Tab (Admin Only) */}
            {activeTab === 'teachers' && user.role === 'admin' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Teachers</h2>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search teachers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
                      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                      <UserPlus className="h-5 w-5" />
                      <span>Add Teacher</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white shadow-lg rounded-xl border border-blue-100 overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subjects
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTeachers.map((teacher) => (
                        <tr key={teacher.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{teacher.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{teacher.department}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500">
                              {teacher.subjects.join(', ')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">
                              <Edit className="h-5 w-5" />
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleDeleteTeacher(teacher.id)}
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Analysis Tab */}
            {activeTab === 'analysis' && (
              <div className="space-y-6">
                <FileUpload onFileProcess={setAnalysisResults} />
                {analysisResults && <AnalysisResults results={analysisResults} />}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};