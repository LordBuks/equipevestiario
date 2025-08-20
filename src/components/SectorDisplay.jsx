import React from 'react';

const SectorDisplay = ({ assignments }) => {
  if (!assignments || assignments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum setor atribuído.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Setores Atribuídos</h3>
      <ul className="list-disc list-inside space-y-2">
        {assignments.map((assignment, index) => (
          <li key={index} className="text-gray-700">{assignment}</li>
        ))}
      </ul>
    </div>
  );
};

export default SectorDisplay;


