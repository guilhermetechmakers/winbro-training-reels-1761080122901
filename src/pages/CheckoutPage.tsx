import React from 'react';

const CheckoutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">Checkout</h1>
        <div className="bg-card p-6 rounded-lg shadow-md">
          <p className="text-muted-foreground">Checkout process will be implemented here</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;