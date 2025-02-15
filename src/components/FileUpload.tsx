import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';
import { analyzePerformanceData } from '../lib/analysis';

interface FileUploadProps {
  onFileProcess: (data: any) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileProcess }) => {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        // Validate required sheets
        const requiredSheets = ['Students', 'MSE Marks', 'ESE Marks', 'CA Marks', 'IA Marks', 'Subjects'];
        const missingSheets = requiredSheets.filter(sheet => !workbook.SheetNames.includes(sheet));
        
        if (missingSheets.length > 0) {
          toast.error(`Missing required sheets: ${missingSheets.join(', ')}`);
          return;
        }

        // Convert each sheet to JSON
        const sheets = workbook.SheetNames.reduce((acc: any, sheetName) => {
          acc[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
          return acc;
        }, {});

        // Validate data structure
        if (!validateSheetData(sheets)) {
          toast.error('Invalid data structure in Excel file');
          return;
        }

        // Process and analyze the data
        const analysisResults = analyzePerformanceData(sheets);
        onFileProcess(analysisResults);
        toast.success('File processed successfully');
      } catch (error) {
        console.error('Error processing file:', error);
        toast.error('Error processing file. Please check the file format.');
      }
    };

    reader.readAsBinaryString(file);
  }, [onFileProcess]);

  const validateSheetData = (sheets: any) => {
    try {
      // Validate Students sheet
      const hasValidStudents = sheets['Students']?.every((student: any) => 
        student.PRN && student.Name && student.Course && student.Semester
      );

      // Validate MSE Marks sheet
      const hasValidMSE = sheets['MSE Marks']?.every((mark: any) => 
        mark.PRN && mark['Subject Code'] && 
        typeof mark['Marks Obtained'] === 'number' && 
        typeof mark['Maximum Marks'] === 'number'
      );

      // Validate ESE Marks sheet
      const hasValidESE = sheets['ESE Marks']?.every((mark: any) => 
        mark.PRN && mark['Subject Code'] && 
        typeof mark['Marks Obtained'] === 'number' && 
        typeof mark['Maximum Marks'] === 'number'
      );

      // Validate CA Marks sheet
      const hasValidCA = sheets['CA Marks']?.every((mark: any) => 
        mark.PRN && mark['Subject Code'] && 
        typeof mark['Total CA'] === 'number' && 
        typeof mark['Maximum Marks'] === 'number'
      );

      // Validate IA Marks sheet
      const hasValidIA = sheets['IA Marks']?.every((mark: any) => 
        mark.PRN && mark['Subject Code'] && 
        typeof mark['Total IA'] === 'number' && 
        typeof mark['Maximum Marks'] === 'number'
      );

      return hasValidStudents && hasValidMSE && hasValidESE && hasValidCA && hasValidIA;
    } catch (error) {
      return false;
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1
  });

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-500 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className={`mx-auto h-12 w-12 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
        <p className="mt-4 text-sm text-gray-600">
          {isDragActive ? (
            <span className="font-medium text-blue-600">Drop the Excel file here</span>
          ) : (
            <>
              <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
            </>
          )}
        </p>
        <p className="mt-2 text-xs text-gray-500">Excel files only (*.xlsx, *.xls)</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-yellow-800 mb-2">Required Excel Structure:</h3>
        <ul className="text-xs text-yellow-700 space-y-1">
          <li>• Sheet 1: Students (PRN, Name, Course, Semester)</li>
          <li>• Sheet 2: MSE Marks (PRN, Subject Code, Marks Obtained, Maximum Marks, Date)</li>
          <li>• Sheet 3: ESE Marks (PRN, Subject Code, Marks Obtained, Maximum Marks, Date)</li>
          <li>• Sheet 4: CA Marks (PRN, Subject Code, Assignment 1, Assignment 2, Quiz 1, Quiz 2, Total CA, Maximum Marks)</li>
          <li>• Sheet 5: IA Marks (PRN, Subject Code, Lab Performance, Lab Records, Lab Viva, Total IA, Maximum Marks)</li>
          <li>• Sheet 6: Subjects (Subject Code, Subject Name, Maximum Marks for each component)</li>
        </ul>
      </div>
    </div>
  );
};