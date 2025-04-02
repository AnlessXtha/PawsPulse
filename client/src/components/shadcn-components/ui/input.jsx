import * as React from "react";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

const Input = ({ className, type, ...props }) => {
  const [visiblePassword, setVisiblePassword] = React.useState(false);
  return type === "password" ? (
    <div className="flex h-10 w-full justify-end items-center relative">
      <input
        type={visiblePassword ? "text" : type}
        className={cn(
          "flex h-10 shadow-sm w-full pr-[35px] rounded-md border border-input bg-background px-3 py-2 text-[12px] ring-offset-background file:border-0 file:bg-transparent file:text-[12px] file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 laptop:text-[14px] laptop:file:text-[14px]",
          className
        )}
        {...props}
      />
      {visiblePassword ? (
        <EyeOff
          onClick={() => {
            setVisiblePassword(false);
          }}
          className="absolute cursor-pointer w-[18px] h-[18px] text-gray-400 mr-[10px]"
        />
      ) : (
        <Eye
          onClick={() => {
            setVisiblePassword(true);
          }}
          className="absolute cursor-pointer  w-[18px] h-[18px]  text-gray-400 mr-[10px]"
        />
      )}
    </div>
  ) : (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full shadow-sm my-0 rounded-md border border-input bg-background px-3 py-2 text-[12px] ring-offset-background file:border-0 file:bg-transparent file:text-[12px] file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 laptop:text-[14px] laptop:file:text-[14px]",
        className
      )}
      {...props}
    />
  );
};

export { Input };
