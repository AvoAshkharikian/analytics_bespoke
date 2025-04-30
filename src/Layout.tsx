type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-10">
        <div className="relative bg-white rounded-lg shadow-lg p-6 md:p-10">

          {/* PDF Button */}
          <div className="absolute top-4 right-4 print:hidden">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-full shadow hover:bg-blue-700 transition text-xs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M5 4a2 2 0 012-2h10a2 2 0 012 2v4H5V4zm14 6H5v8h4v2h6v-2h4v-8z" />
              </svg>
              PDF
            </button>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
