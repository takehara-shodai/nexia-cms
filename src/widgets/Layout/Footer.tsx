export const Footer = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 py-4 px-6 bg-white dark:bg-gray-800">
      <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <div>&copy; {new Date().getFullYear()} VAREAL, Inc. All rights reserved.</div>
        <div className="mt-2 md:mt-0 flex space-x-4">
          <a href="#" className="hover:text-gray-900 dark:hover:text-gray-300 transition-colors">
            Help
          </a>
          <a href="#" className="hover:text-gray-900 dark:hover:text-gray-300 transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-gray-900 dark:hover:text-gray-300 transition-colors">
            Terms
          </a>
          <span>Version 1.0.0</span>
        </div>
      </div>
    </footer>
  );
};
