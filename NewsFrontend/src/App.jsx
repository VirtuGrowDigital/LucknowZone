import Header from "./Components/Header";

export default function App() {
  return (
    <>
      <Header />

      {/* TEST BODY */}
      <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center justify-center p-10">
        <h1 className="text-3xl font-bold text-gray-800">
          Page Loaded Successfully 🎉
        </h1>

        <p className="mt-4 text-gray-600 text-lg">
          If you can see this text, your Header and App setup is working!
        </p>

        <div className="mt-8 w-full max-w-xl bg-white shadow-lg rounded-xl p-6 text-center">
          <h2 className="text-xl font-semibold">Body Content Area</h2>
          <p className="text-sm mt-2 text-gray-500">
            Replace this section with your real homepage later.
          </p>
        </div>
      </div>
    </>
  );
}
