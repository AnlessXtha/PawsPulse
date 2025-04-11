import { toast } from "sonner";
import { X } from "lucide-react";

export const showToast = (
  title,
  description,
  variant = "info",
  customOptions = {}
) => {
  const baseFontSize = "text-[16px]";
  const descFontSize = "text-[12px]";

  const variants = {
    success: {
      classNames: {
        title: `text-green-700 font-semibold ${baseFontSize}`,
        description: `text-black ${descFontSize}`,
      },
      style: { borderTop: "3px solid #22c55e", fontSize: "16px" },
      cancel: {
        label: (
          <X
            className="top-0 right-0 absolute mt-2 mr-2"
            width={15}
            height={15}
          />
        ),
      },
    },
    error: {
      classNames: {
        title: `text-red-700 font-semibold ${baseFontSize}`,
        description: `text-black ${descFontSize}`,
      },
      style: { borderTop: "3px solid #ef4444", fontSize: "16px" },
      cancel: {
        label: (
          <X
            className="top-0 right-0 absolute mt-2 mr-2"
            width={15}
            height={15}
          />
        ),
      },
    },
    info: {
      classNames: {
        title: `text-blue-700 font-semibold ${baseFontSize}`,
        description: `text-black ${descFontSize}`,
      },
      style: { borderTop: "3px solid #3b82f6", fontSize: "16px" },
      cancel: {
        label: (
          <X
            className="top-0 right-0 absolute mt-2 mr-2"
            width={15}
            height={15}
          />
        ),
      },
    },
    warning: {
      classNames: {
        title: `text-yellow-700 font-semibold ${baseFontSize}`,
        description: `text-black ${descFontSize}`,
      },
      style: { borderTop: "3px solid #eab308", fontSize: "16px" },
      cancel: {
        label: (
          <X
            className="top-0 right-0 absolute mt-2 mr-2"
            width={15}
            height={15}
          />
        ),
      },
    },
  };

  const config = variants[variant] || variants.info;

  toast(title, {
    description: (
      <div className={config.classNames.description}>{description}</div>
    ),
    ...config,
    ...customOptions,
  });
};
