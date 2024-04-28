import React, { useState } from 'react';
import { CButton, CCard, CCardBody, CCardHeader } from '@coreui/react';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

const ExcelOrganizer = () => {
  const [originalData, setOriginalData] = useState([]);
  const [organizedData, setOrganizedData] = useState([]);
  const [showOriginalData, setShowOriginalData] = useState(false);
  const [showOrganizedData, setShowOrganizedData] = useState(false);

  const readDataFromExcel = (data) => {
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const headers = jsonData.shift();
    const formattedData = jsonData.map((row) => {
      return {
        'RECORD #(BIBLIO)': row[0],
        'TITLE': row[1],
        'RECORD #(ORDER)': row[2],
        'HOLDS': row[3],
        'FUND': row[4],
        'BIB CATALOG DATE': row[5],
        'ORDER RECEIVED DATE': row[6],
        'STANDARD #': row[7],
      };
    });

    return formattedData;
  };

  const transformData = (data) => {
    const transformedData = [];
    for (const row of data) {
      const bib = row['RECORD #(BIBLIO)'];
      const titleWithFormat = row['TITLE'];
      const holds = row['HOLDS'];

      let title, format;
      if (titleWithFormat.includes('[')) {
        const [titlePart, formatPart] = titleWithFormat.split(/\[(.+)\]/);
        title = titlePart.trim();
        format = formatPart.trim();
      } else {
        title = titleWithFormat.trim();
        format = null;
      }

      transformedData.push({ bib, title, format, holds });
    }

    return transformedData;
  };

  const organizeData = (data) => {
    const groupedData = {};
    for (const { bib, title, format, holds } of data) {
      if (groupedData[title]) {
        groupedData[title].push({ bib, title, format, holds });
      } else {
        groupedData[title] = [{ bib, title, format, holds }];
      }
    }

    const organizedData = [];
    for (const [title, formats] of Object.entries(groupedData)) {
      const sortedFormats = formats.sort((a, b) => b.holds - a.holds);
      organizedData.push(...sortedFormats);
    }

    return organizedData;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;
      const originalData = readDataFromExcel(data);
      const transformedData = transformData(originalData);
      const organizedData = organizeData(transformedData);

      setOriginalData(originalData);
      setOrganizedData(organizedData);
    };

    reader.readAsArrayBuffer(file);
  };

  const exportToExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelData = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    FileSaver.saveAs(excelData, 'organized_data.xlsx');
  };

  const toggleOriginalDataVisibility = () => {
    setShowOriginalData(!showOriginalData);
  };

  const toggleOrganizedDataVisibility = () => {
    setShowOrganizedData(!showOrganizedData);
  };

  return (
    <div className="file-input-container">
      <CButton color="primary" onClick={() => document.getElementById('file-input').click()}>
        Choose File
      </CButton>
      <input
        id="file-input"
        type="file"
        accept=".xlsx,.xls"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      
      <CCard className="mb-3">
        <CCardHeader onClick={toggleOriginalDataVisibility}>
          <h5 className="m-0">Original Data</h5>
        </CCardHeader>
        <CCardBody className={showOriginalData ? '' : 'd-none'}>
          <pre>{JSON.stringify(originalData, null, 2)}</pre>
        </CCardBody>
      </CCard>

      <CCard>
        <CCardHeader onClick={toggleOrganizedDataVisibility}>
          <h5 className="m-0">Organized Data</h5>
        </CCardHeader>
        <CCardBody className={showOrganizedData ? '' : 'd-none'}>
          <pre>{JSON.stringify(organizedData, null, 2)}</pre>
        </CCardBody>
      </CCard>

      
      <div>
        <button onClick={() => exportToExcel(organizedData)}>Download Organized Data</button>
      </div>

    </div>
  );
};

export default ExcelOrganizer;