import { CSSProperties } from "react";
import toast from "react-hot-toast";

const CopyButton = ({ children, className, sx, value }: { children: any, className?: string, sx?: CSSProperties, value: string }) => {
    const handleClick = () => {
        navigator.clipboard.writeText(value)
        toast.success("Nusxalandi!")
    };

    return <span className={`${className}`} style={{...sx}} onClick={handleClick}>{children}</span>;
};

export default CopyButton;