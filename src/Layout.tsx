type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-10">
        <div className="relative bg-white rounded-lg shadow-lg p-6 md:p-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
