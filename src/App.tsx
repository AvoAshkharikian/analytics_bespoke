import Layout from './Layout';

function App() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4 text-center">Call Center Performance Analysis</h1>
      <p className="text-md text-center mb-8 text-gray-600">
        Your Tailwind layout is working, and the content is now centered with padding!
      </p>

      <section className="bg-white p-6 rounded shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-2">Live Preview</h2>
        <p className="text-gray-700 text-sm">
          Replace this with your report charts, metrics, or tables.
        </p>
      </section>
    </Layout>
  );
}

export default App;
