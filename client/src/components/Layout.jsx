import React from 'react';

const Layout = ({ navbar, sidebar, content }) => {
  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-background">
      <div className="flex-none">
        {navbar}
      </div>
      <div className="flex-1 flex overflow-hidden">
        <div className="hidden md:block flex-none">
          {sidebar}
        </div>
        <main className="flex-1 overflow-y-auto scrollbar-thin relative scroll-smooth">
          {content}
        </main>
      </div>
    </div>
  );
};

export default Layout;
