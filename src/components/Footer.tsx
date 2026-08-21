export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 py-6 px-6 text-center text-xs text-gray-500 mt-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto gap-2">
        <div>© 2026 Smart Campus AI. All rights reserved.</div>
        <div className="font-semibold text-indigo-400 tracking-wider">
          Powered by <span className="text-white font-bold">ThomasG Technologies</span>
        </div>
      </div>
    </footer>
  );
}
