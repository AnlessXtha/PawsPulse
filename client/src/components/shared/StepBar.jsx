import { Check } from "lucide-react";
import React from "react";

const StepBar = ({ steps, current }) => {
  return (
    <div className="flex flex-col w-full  items-center text-[14px] font-semibold gap-y-[8px]">
      <div className="flex w-[85%] justify-between relative items-center laptop:w-[97%]">
        <div className="absolute w-[99%] bg-[#D3DAE6] h-[3px] z-0"></div>
        {steps.map((value, index) => (
          <div
            key={value}
            className={`w-[32px] h-[32px] border-2  z-[1] ${
              value === current
                ? " bg-[#A63E4B] text-white"
                : steps.indexOf(current) > index
                ? "bg-[#A63E4B]  text-white"
                : "border-[#C8C8C8] bg-[#C8C8C8] text-white"
            }  flex justify-center items-center rounded-full`}
          >
            {steps.indexOf(current) > index ? (
              <Check strokeWidth={3} className="w-[14px] h-[14px] text-white" />
            ) : (
              index + 1
            )}
          </div>
        ))}
      </div>
      <div className="flex w-full justify-between text-[#ABB4C4]">
        {steps.map((value) => (
          <div key={value} className={`${value === current && "text-black"}`}>
            {value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepBar;
