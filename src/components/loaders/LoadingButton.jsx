import { button } from "../common/Theme";

export default function LoadingButton() {
    return (
        <button className={`${button} h-[40px] max-h-[40px] flex justify-center items-center opacity-60`}>
            <span className="w-5 h-5 border-2 border-white border-b-transparent rounded-full inline-block box-border animate-spin"></span>
        </button>
    )
}