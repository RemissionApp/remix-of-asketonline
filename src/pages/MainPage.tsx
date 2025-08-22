import React from 'react';

const MainPage: React.FC = () => {
  console.log('MainPage rendering - minimal version');
  
  return (
    <div className="min-h-screen bg-cosmic-dark text-white p-4">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">Main Page</h1>
        <p className="text-center text-cosmic-secondary">
          This is a minimal version of MainPage for debugging.
        </p>
      </div>
    </div>
  );
};

export default MainPage;