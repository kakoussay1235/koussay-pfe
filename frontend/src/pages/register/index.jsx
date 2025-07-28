import React from 'react';
import { Helmet } from 'react-helmet';
import AuthHeader from './components/AuthHeader';
import RegistrationForm from './components/RegistrationForm';
import AuthFooter from './components/AuthFooter';

const Register = () => {
  return (
    <>
      <Helmet>
        <title>Inscription - FamilyExpense</title>
        <meta name="description" content="Créez votre compte FamilyExpense pour commencer à gérer vos finances familiales efficacement." />
        <meta name="keywords" content="inscription, compte, finances familiales, budget, gestion" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Main Container */}
        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* Left Side - Form Section */}
          <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
            <div className="w-full max-w-md space-y-8">
              <AuthHeader />
              <RegistrationForm />
            </div>
          </div>

          {/* Right Side - Information Section */}
          <div className="lg:flex-1 bg-muted/30 p-4 lg:p-8 flex items-center justify-center">
            <div className="w-full max-w-lg">
              <AuthFooter />
            </div>
          </div>
        </div>

        {/* Mobile Bottom Spacing */}
        <div className="h-16 lg:hidden" />
      </div>
    </>
  );
};

export default Register;