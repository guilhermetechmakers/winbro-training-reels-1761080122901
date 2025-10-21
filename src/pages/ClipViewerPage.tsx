import React from 'react';
import { useParams } from 'react-router-dom';

const ClipViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">Clip Viewer</h1>
        <div className="bg-card p-6 rounded-lg shadow-md">
          <p className="text-muted-foreground">Viewing clip: {id}</p>
        </div>
      </div>
    </div>
  );
};

export default ClipViewerPage;