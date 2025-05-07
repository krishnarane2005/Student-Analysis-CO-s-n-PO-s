import React, { useState } from 'react';
import { Download, ChevronDown, ChevronRight, BarChart2, Target, User, Book } from 'lucide-react';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

interface AnalysisResultsProps {
  results: any;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results }) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['performance']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const downloadResults = () => {
    try {
      const wb = XLSX.utils.book_new();
      
      // Performance Analysis Sheet
      const performanceSheetData = results.performance.map((subject: any) => ({
        ...subject,
        distribution: subject.distribution
          ? `Excellent: ${subject.distribution.excellent}, Good: ${subject.distribution.good}, Average: ${subject.distribution.average}, Poor: ${subject.distribution.poor}`
          : ''
      }));
      const performanceSheet = XLSX.utils.json_to_sheet(performanceSheetData);
      XLSX.utils.book_append_sheet(wb, performanceSheet, 'Performance Analysis');
      
      // CO Analysis Sheet
      const coSheet = XLSX.utils.json_to_sheet(results.coAnalysis);
      XLSX.utils.book_append_sheet(wb, coSheet, 'CO Analysis');
      
      // PO Analysis Sheet
      const poSheetData = results.poAnalysis.map((po: any) => ({
        ...po,
        contributingCOs: Array.isArray(po.contributingCOs) ? po.contributingCOs.join(', ') : ''
      }));
      const poSheet = XLSX.utils.json_to_sheet(poSheetData);
      XLSX.utils.book_append_sheet(wb, poSheet, 'PO Analysis');
      
      // Student-wise Analysis Sheet
      const studentSheetData = results.studentWiseAnalysis.map((student: any) => ({
        ...student,
        strengthSubjects: Array.isArray(student.strengthSubjects) ? student.strengthSubjects.join(', ') : '',
        improvementAreas: Array.isArray(student.improvementAreas) ? student.improvementAreas.join(', ') : ''
      }));
      const studentSheet = XLSX.utils.json_to_sheet(studentSheetData);
      XLSX.utils.book_append_sheet(wb, studentSheet, 'Student Analysis');
      
      // Save the file
      XLSX.writeFile(wb, 'performance-analysis-report.xlsx');
      toast.success('Analysis report downloaded successfully');
    } catch (error) {
      console.error('Error downloading results:', error);
      toast.error('Error downloading analysis report');
    }
  };

  const SectionHeader = ({ title, icon: Icon, section }: { title: string; icon: any; section: string }) => (
    <button
      onClick={() => toggleSection(section)}
      className="flex items-center justify-between w-full p-4 text-left bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center space-x-3">
        <Icon className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {expandedSections.includes(section) ? (
        <ChevronDown className="h-5 w-5 text-gray-500" />
      ) : (
        <ChevronRight className="h-5 w-5 text-gray-500" />
      )}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
        <button
          onClick={downloadResults}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          Download Report
        </button>
      </div>

      <div className="space-y-4">
        {/* Performance Analysis Section */}
        <div>
          <SectionHeader 
            title="Subject Performance Analysis" 
            icon={BarChart2}
            section="performance"
          />
          {expandedSections.includes('performance') && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.performance.map((subject: any, index: number) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">{subject.subjectName}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Pass Rate:</span>
                      <span className="font-medium">{subject.passRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Average Score:</span>
                      <span className="font-medium">{subject.averageScore.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Highest Score:</span>
                      <span className="font-medium">{subject.highestScore.toFixed(1)}%</span>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <div className="text-xs text-gray-600 mb-1">Score Distribution:</div>
                      <div className="flex h-2 rounded-full overflow-hidden bg-gray-200">
                        <div 
                          className="bg-green-500" 
                          style={{ width: `${(subject.distribution.excellent / subject.totalStudents) * 100}%` }}
                        />
                        <div 
                          className="bg-blue-500" 
                          style={{ width: `${(subject.distribution.good / subject.totalStudents) * 100}%` }}
                        />
                        <div 
                          className="bg-yellow-500" 
                          style={{ width: `${(subject.distribution.average / subject.totalStudents) * 100}%` }}
                        />
                        <div 
                          className="bg-red-500" 
                          style={{ width: `${(subject.distribution.poor / subject.totalStudents) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CO Analysis Section */}
        <div>
          <SectionHeader 
            title="Course Outcome Analysis" 
            icon={Target}
            section="co"
          />
          {expandedSections.includes('co') && (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CO</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attainment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Achievement</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.coAnalysis.map((co: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{co.subjectCode}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{co.coNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{co.attainmentLevel.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{co.achievementPercentage.toFixed(1)}%</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          co.targetAchieved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {co.targetAchieved ? 'Achieved' : 'Not Achieved'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Student Analysis Section */}
        <div>
          <SectionHeader 
            title="Student-wise Analysis" 
            icon={User}
            section="students"
          />
          {expandedSections.includes('students') && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.studentWiseAnalysis.map((student: any, index: number) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{student.name}</h4>
                      <p className="text-sm text-gray-600">{student.prn}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {student.overallPerformance.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">Overall Performance</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Strength Areas:</div>
                      <div className="flex flex-wrap gap-2">
                        {student.strengthSubjects.map((subject: string, idx: number) => (
                          <span key={idx} className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Needs Improvement:</div>
                      <div className="flex flex-wrap gap-2">
                        {student.improvementAreas.map((subject: string, idx: number) => (
                          <span key={idx} className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm text-gray-600">Attendance:</span>
                      <span className={`text-sm font-medium ${
                        student.attendance >= 75 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {student.attendance.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PO Analysis Section */}
        <div>
          <SectionHeader 
            title="Program Outcome Analysis" 
            icon={Book}
            section="po"
          />
          {expandedSections.includes('po') && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.poAnalysis.map((po: any, index: number) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-gray-900">{po.programOutcome}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      po.strengthLevel === 'Strong' ? 'bg-green-100 text-green-800' :
                      po.strengthLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {po.strengthLevel}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Attainment Level:</div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div 
                          className={`h-full rounded-full ${
                            po.attainmentLevel >= 2.5 ? 'bg-green-500' :
                            po.attainmentLevel >= 1.5 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${(po.attainmentLevel / 3) * 100}%` }}
                        />
                      </div>
                      <div className="text-right text-xs text-gray-500 mt-1">
                        {po.attainmentLevel.toFixed(2)}/3
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Contributing COs:</div>
                      <div className="flex flex-wrap gap-2">
                        {po.contributingCOs.map((co: string, idx: number) => (
                          <span key={idx} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            {co}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};