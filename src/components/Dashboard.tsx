import React, { useState, useEffect } from 'react';
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

interface OverviewData {
  totalStudents: number;
  averageCGPA: number;
  passRate: number;
  totalSubjects: number;
}

interface Activity {
  id: string;
  action: string;
  subject: string;
  time: string;
  icon: any;
  color: string;
  timestamp: number;
}

type TimeFilter = 'all' | 'today' | 'week' | 'month';

interface Teacher {
  id: number;
  name: string;
  email: string;
  department: string;
  subjects: string[];
}

interface Student {
  id: number;
  name: string;
  prn: string;
  course: string;
  semester: number;
  cgpa: number;
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
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [overview, setOverview] = useState<OverviewData>({
    totalStudents: 0,
    averageCGPA: 0,
    passRate: 0,
    totalSubjects: 0
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('week');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newTeacher, setNewTeacher] = useState<Partial<Teacher>>({
    name: '',
    email: '',
    department: '',
    subjects: []
  });
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    name: '',
    prn: '',
    course: '',
    semester: 1,
    cgpa: 0
  });

  // Function to add a new activity
  const addActivity = (action: string, subject: string, icon: any, color: string) => {
    const newActivity: Activity = {
      id: Math.random().toString(36).substr(2, 9),
      action,
      subject,
      time: 'Just now',
      icon,
      color,
      timestamp: Date.now()
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  // Filter activities based on time period
  const getFilteredActivities = () => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay;

    return activities.filter(activity => {
      const age = now - activity.timestamp;
      switch (timeFilter) {
        case 'today':
          return age < oneDay;
        case 'week':
          return age < oneWeek;
        case 'month':
          return age < oneMonth;
        default:
          return true;
      }
    });
  };

  // Update activity timestamps
  useEffect(() => {
    const interval = setInterval(() => {
      setActivities(prev => prev.map(activity => ({
        ...activity,
        time: getTimeAgo(activity.timestamp)
      })));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Function to format time ago
  const getTimeAgo = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const handleFileProcess = (data: {
    analysisResults: any;
    students: any[];
    subjects: any[];
    overview: OverviewData;
  }) => {
    setAnalysisResults(data.analysisResults);
    setStudents(data.students);
    setSubjects(data.subjects);
    setOverview(data.overview);
    
    // Add activity for file upload
    addActivity(
      'Analysis Generated',
      `${data.students.length} Students Data`,
      FileSpreadsheet,
      'text-purple-600'
    );
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteTeacher = (teacherId: number) => {
    setTeachers(prev => prev.filter(teacher => teacher.id !== teacherId));
    addActivity('Teacher Deleted', 'Teacher account removed', Trash2, 'text-red-600');
    toast.success('Teacher account deleted successfully');
  };

  const handleAddTeacher = () => {
    if (!newTeacher.name || !newTeacher.email || !newTeacher.department) {
      toast.error('Please fill in all required fields');
      return;
    }

    const teacher: Teacher = {
      id: Date.now(),
      name: newTeacher.name,
      email: newTeacher.email,
      department: newTeacher.department,
      subjects: newTeacher.subjects || []
    };

    setTeachers(prev => [...prev, teacher]);
    setShowAddTeacherModal(false);
    setNewTeacher({ name: '', email: '', department: '', subjects: [] });
    addActivity('Teacher Added', teacher.name, UserPlus, 'text-green-600');
    toast.success('Teacher added successfully');
  };

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.prn || !newStudent.course) {
      toast.error('Please fill in all required fields');
      return;
    }

    const student: Student = {
      id: Date.now(),
      name: newStudent.name,
      prn: newStudent.prn,
      course: newStudent.course,
      semester: newStudent.semester || 1,
      cgpa: newStudent.cgpa || 0
    };

    setStudents(prev => [...prev, student]);
    setShowAddStudentModal(false);
    setNewStudent({ name: '', prn: '', course: '', semester: 1, cgpa: 0 });
    addActivity('Student Added', student.name, UserPlus, 'text-green-600');
    toast.success('Student added successfully');
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

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.prn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTeachers = sampleTeachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add activity tracking for student actions
  const handleStudentAction = (action: string, studentName: string) => {
    addActivity(
      action,
      studentName,
      action.includes('Added') ? UserPlus : action.includes('Deleted') ? Trash2 : Edit,
      action.includes('Deleted') ? 'text-red-600' : 'text-blue-600'
    );
  };

  // Add activity tracking for subject actions
  const handleSubjectAction = (action: string, subjectName: string) => {
    addActivity(
      action,
      subjectName,
      action.includes('Added') ? BookOpen : action.includes('Deleted') ? Trash2 : Edit,
      action.includes('Deleted') ? 'text-red-600' : 'text-blue-600'
    );
  };

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
                            <dd className="text-lg font-bold text-gray-900">{overview.totalStudents}</dd>
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
                            <dd className="text-lg font-bold text-gray-900">{overview.averageCGPA}</dd>
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
                            <dd className="text-lg font-bold text-gray-900">{overview.passRate}%</dd>
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
                            <BookOpen className="h-6 w-6 text-purple-600" />
                          </div>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Subjects</dt>
                            <dd className="text-lg font-bold text-gray-900">{overview.totalSubjects}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white shadow-lg rounded-xl border border-blue-100">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setTimeFilter('today')}
                          className={`px-3 py-1 text-sm rounded-md ${
                            timeFilter === 'today'
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          Today
                        </button>
                        <button
                          onClick={() => setTimeFilter('week')}
                          className={`px-3 py-1 text-sm rounded-md ${
                            timeFilter === 'week'
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          This Week
                        </button>
                        <button
                          onClick={() => setTimeFilter('month')}
                          className={`px-3 py-1 text-sm rounded-md ${
                            timeFilter === 'month'
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          This Month
                        </button>
                        <button
                          onClick={() => setTimeFilter('all')}
                          className={`px-3 py-1 text-sm rounded-md ${
                            timeFilter === 'all'
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          All Time
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 divide-y divide-gray-200">
                      {getFilteredActivities().length > 0 ? (
                        getFilteredActivities().map((activity) => (
                          <div key={activity.id} className="py-3">
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
                        ))
                      ) : (
                        <div className="py-3 text-center text-gray-500">
                          No activities in the selected time period
                        </div>
                      )}
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
                      <button 
                        onClick={() => setShowAddStudentModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <UserPlus className="h-5 w-5" />
                        <span>Add Student</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* CGPA Distribution Summary */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
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
                            <dd className="text-lg font-bold text-gray-900">{overview.averageCGPA}</dd>
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
                            <dd className="text-lg font-bold text-gray-900">{overview.passRate}%</dd>
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
                            <Users className="h-6 w-6 text-purple-600" />
                          </div>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                            <dd className="text-lg font-bold text-gray-900">{overview.totalStudents}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-blue-100">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="p-2 bg-red-50 rounded-lg">
                            <BookOpen className="h-6 w-6 text-red-600" />
                          </div>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Subjects</dt>
                            <dd className="text-lg font-bold text-gray-900">{overview.totalSubjects}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
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
                            <div className="text-sm font-medium text-gray-900">{student.cgpa}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              Number(student.cgpa) >= 6.0 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {Number(student.cgpa) >= 6.0 ? 'Pass' : 'Fail'}
                            </span>
                          </td>
                          {user.role === 'admin' && (
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button 
                                className="text-blue-600 hover:text-blue-900 mr-3"
                                onClick={() => handleStudentAction('Student Updated', student.name)}
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button 
                                className="text-red-600 hover:text-red-900"
                                onClick={() => handleStudentAction('Student Deleted', student.name)}
                              >
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
                              <button 
                                className="text-blue-600 hover:text-blue-900 mr-3"
                                onClick={() => handleSubjectAction('Subject Updated', subject.name)}
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button 
                                className="text-red-600 hover:text-red-900"
                                onClick={() => handleSubjectAction('Subject Deleted', subject.name)}
                              >
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
                    <button 
                      onClick={() => setShowAddTeacherModal(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
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
                <h2 className="text-2xl font-bold text-gray-900">Performance Analysis</h2>
                <FileUpload onFileProcess={handleFileProcess} />
                {analysisResults && <AnalysisResults results={analysisResults} />}
              </div>
            )}

            {/* Add Teacher Modal */}
            {showAddTeacherModal && (
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <h3 className="text-lg font-bold mb-4">Add New Teacher</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        value={newTeacher.name}
                        onChange={(e) => setNewTeacher(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        value={newTeacher.email}
                        onChange={(e) => setNewTeacher(prev => ({ ...prev, email: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Department</label>
                      <input
                        type="text"
                        value={newTeacher.department}
                        onChange={(e) => setNewTeacher(prev => ({ ...prev, department: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setShowAddTeacherModal(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddTeacher}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                      >
                        Add Teacher
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Add Student Modal */}
            {showAddStudentModal && (
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <h3 className="text-lg font-bold mb-4">Add New Student</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        value={newStudent.name}
                        onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">PRN</label>
                      <input
                        type="text"
                        value={newStudent.prn}
                        onChange={(e) => setNewStudent(prev => ({ ...prev, prn: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Course</label>
                      <input
                        type="text"
                        value={newStudent.course}
                        onChange={(e) => setNewStudent(prev => ({ ...prev, course: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Semester</label>
                      <input
                        type="number"
                        min="1"
                        max="8"
                        value={newStudent.semester}
                        onChange={(e) => setNewStudent(prev => ({ ...prev, semester: parseInt(e.target.value) }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setShowAddStudentModal(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddStudent}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                      >
                        Add Student
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};