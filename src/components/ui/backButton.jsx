import { ChevronLeft } from "lucide-react";
import { Button } from "./button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function BackButton({ className }) {
  const navigate = useNavigate();
  return (
    <div className={cn("max-w-5xl mx-auto", className)}>
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ChevronLeft />
        Back
      </Button>
    </div>
  );
}
