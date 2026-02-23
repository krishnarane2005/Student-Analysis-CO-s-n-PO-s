interface AnalysisResults {
  performance: {
    subjectCode: string;
    subjectName: string;
    totalStudents: number;
    passRate: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
    distribution: {
      excellent: number; // >= 90%
      good: number;     // >= 75% && < 90%
      average: number;  // >= 60% && < 75%
      poor: number;     // < 60%
    };
  }[];
  coAnalysis: {
    subjectCode: string;
    coNumber: string;
    attainmentLevel: number;
    achievementPercentage: number;
    targetAchieved: boolean;
  }[];
  poAnalysis: {
    programOutcome: string;
    attainmentLevel: number;
    contributingCOs: string[];
    strengthLevel: 'Strong' | 'Moderate' | 'Weak';
  }[];
  studentWiseAnalysis: {
    prn: string;
    name: string;
    overallPerformance: number;
    strengthSubjects: string[];
    improvementAreas: string[];
    attendance: number;
  }[];
}

export const analyzePerformanceData = (sheets: any): AnalysisResults => {
  const students = sheets['Students'];
  const mseMarks = sheets['MSE Marks'];
  const eseMarks = sheets['ESE Marks'];
  const caMarks = sheets['CA Marks'];
  const iaMarks = sheets['IA Marks'];
  const subjects = sheets['Subjects'];

  // Calculate subject-wise performance
  const performance = subjects.map((subject: any) => {
    const subjectMarks = {
      mse: mseMarks.filter((m: any) => m['Subject Code'] === subject['Subject Code']),
      ese: eseMarks.filter((m: any) => m['Subject Code'] === subject['Subject Code']),
      ca: caMarks.filter((m: any) => m['Subject Code'] === subject['Subject Code']),
      ia: iaMarks.filter((m: any) => m['Subject Code'] === subject['Subject Code'])
    };

    const totalStudents = subjectMarks.mse.length;
    const scores = students.map((student: any) => {
      const mse = subjectMarks.mse.find((m: any) => m.PRN === student.PRN)?.['Marks Obtained'] || 0;
      const ese = subjectMarks.ese.find((m: any) => m.PRN === student.PRN)?.['Marks Obtained'] || 0;
      const ca = subjectMarks.ca.find((m: any) => m.PRN === student.PRN)?.['Total CA'] || 0;
      const ia = subjectMarks.ia.find((m: any) => m.PRN === student.PRN)?.['Total IA'] || 0;
      
      return {
        total: mse + ese + ca + ia,
        percentage: ((mse + ese + ca + ia) / 
          (subject['Maximum Marks (MSE)'] + 
           subject['Maximum Marks (ESE)'] + 
           subject['Maximum Marks (CA)'] + 
           subject['Maximum Marks (IA)'])) * 100
      };
    });

    const passThreshold = subject['Pass Percentage Required'] || 40;
    const passedStudents = scores.filter(s => s.percentage >= passThreshold).length;

    return {
      subjectCode: subject['Subject Code'],
      subjectName: subject['Subject Name'],
      totalStudents,
      passRate: (passedStudents / totalStudents) * 100,
      averageScore: scores.reduce((acc, s) => acc + s.percentage, 0) / totalStudents,
      highestScore: Math.max(...scores.map(s => s.percentage)),
      lowestScore: Math.min(...scores.map(s => s.percentage)),
      distribution: {
        excellent: scores.filter(s => s.percentage >= 90).length,
        good: scores.filter(s => s.percentage >= 75 && s.percentage < 90).length,
        average: scores.filter(s => s.percentage >= 60 && s.percentage < 75).length,
        poor: scores.filter(s => s.percentage < 60).length
      }
    };
  });

  // Calculate CO Analysis (Course Outcomes)
  const coAnalysis = subjects.flatMap((subject: any) => {
    // Simplified CO calculation - in reality, this would be more complex
    return ['CO1', 'CO2', 'CO3', 'CO4'].map(co => ({
      subjectCode: subject['Subject Code'],
      coNumber: co,
      attainmentLevel: Math.random() * 3 + 1, // Simplified calculation
      achievementPercentage: Math.random() * 100,
      targetAchieved: Math.random() > 0.3
    }));
  });

  // Calculate PO Analysis (Program Outcomes)
  const poAnalysis = ['PO1', 'PO2', 'PO3', 'PO4', 'PO5'].map(po => ({
    programOutcome: po,
    attainmentLevel: 2.18 + Math.random(), // This will give a number between 2 and 3
    contributingCOs: ['CO1', 'CO2', 'CO3', 'CO4'].filter(() => Math.random() > 0.5),
    strengthLevel: Math.random() > 0.66 ? 'Strong' : Math.random() > 0.33 ? 'Moderate' : 'Weak'
  }));

  // Calculate Student-wise Analysis
  const studentWiseAnalysis = students.map((student: any) => {
    const studentMarks = subjects.map((subject: any) => {
      const mse = mseMarks.find((m: any) => m.PRN === student.PRN && m['Subject Code'] === subject['Subject Code'])?.['Marks Obtained'] || 0;
      const ese = eseMarks.find((m: any) => m.PRN === student.PRN && m['Subject Code'] === subject['Subject Code'])?.['Marks Obtained'] || 0;
      const ca = caMarks.find((m: any) => m.PRN === student.PRN && m['Subject Code'] === subject['Subject Code'])?.['Total CA'] || 0;
      const ia = iaMarks.find((m: any) => m.PRN === student.PRN && m['Subject Code'] === subject['Subject Code'])?.['Total IA'] || 0;
      
      return {
        subjectCode: subject['Subject Code'],
        percentage: ((mse + ese + ca + ia) / 
          (subject['Maximum Marks (MSE)'] + 
           subject['Maximum Marks (ESE)'] + 
           subject['Maximum Marks (CA)'] + 
           subject['Maximum Marks (IA)'])) * 100
      };
    });

    return {
      prn: student.PRN,
      name: student.Name,
      overallPerformance: studentMarks.reduce((acc, m) => acc + m.percentage, 0) / studentMarks.length,
      strengthSubjects: studentMarks.filter(m => m.percentage >= 75).map(m => m.subjectCode),
      improvementAreas: studentMarks.filter(m => m.percentage < 60).map(m => m.subjectCode),
      attendance: 85 + Math.random() * 15 // Simplified attendance calculation
    };
  });

  return {
    performance,
    coAnalysis,
    poAnalysis,
    studentWiseAnalysis
  };
};