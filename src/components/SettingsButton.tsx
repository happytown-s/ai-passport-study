interface Props {
  onClick: () => void;
}

export default function SettingsButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="fixed top-4 right-4 z-50 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-md"
      aria-label="設定"
    >
      ⚙️
    </button>
  );
}
