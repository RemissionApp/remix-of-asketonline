import React from 'react';

const WelcomePage: React.FC = () => {
  console.log('WelcomePage rendering - minimal version');
  
  return (
    <div className="min-h-screen bg-cosmic-dark text-white p-4">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">Welcome</h1>
        <p className="text-center text-cosmic-secondary">
          This is a minimal version of WelcomePage for debugging.
        </p>
        <div className="text-center mt-8">
          <a href="/main" className="text-cosmic-accent hover:text-cosmic-gold">
            Go to Main Page
          </a>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;