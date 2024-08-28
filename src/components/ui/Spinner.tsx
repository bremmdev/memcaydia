import { LoaderCircle } from "lucide-react";

export default function Spinner() {
  return (
    <div className="flex justify-center mx-auto w-full">
      <LoaderCircle className="stroke-primary-teal animate-spin size-12" />
    </div>
  );
}
