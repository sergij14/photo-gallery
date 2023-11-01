import { ReloadIcon } from "@radix-ui/react-icons";

export const Loader = ({ message }: { message?: string }) => {
  return (
    <div
      role="status"
      className="flex flex-col text-center items-center gap-2 justify-center p-10"
    >
      <div className="animate-spin w-6">
        <ReloadIcon className="w-6 h-6" />
      </div>
      <span className="text-sm">{message || 'Loading...'}</span>
    </div>
  );
};
