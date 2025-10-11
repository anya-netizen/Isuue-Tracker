import React from 'react';

const TestMap = ({ pgs, patients, onPGSelect }) => {
  return (
    <div className="w-full h-full bg-blue-100 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Test Map Component</h2>
        <p>PGs received: {pgs ? pgs.length : 0}</p>
        <p>Patients received: {patients ? patients.length : 0}</p>
        <p>Component is working correctly!</p>
      </div>
    </div>
  );
};

export default TestMap;