import React from 'react';
import AuthForm from './components/AuthForm';
import AuthBrandPanel from './components/AuthBrandPanel';

export default function SignUpLoginPage() {
  return (
    <div className="min-h-screen bg-background bg-grid flex">
      <AuthBrandPanel />
      <AuthForm />
    </div>
  );
}