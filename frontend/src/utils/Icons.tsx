import type { FC, SVGProps } from "react";
import { GoPlus } from "react-icons/go";

const Edit: FC<SVGProps<SVGSVGElement>> = () => (
    <svg
        width="15"
        height="20"
        viewBox="0 0 18 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M10.1549 2.06916L2.62907 10.035C2.3449 10.3375 2.0699 10.9333 2.0149 11.3458L1.67574 14.3158C1.55657 15.3883 2.32657 16.1216 3.3899 15.9383L6.34157 15.4341C6.75407 15.3608 7.3316 15.0583 7.61576 14.7466L15.1416 6.78083C16.4433 5.40583 17.0299 3.83833 15.0041 1.92249C12.9874 0.0249936 11.4566 0.69416 10.1549 2.06916Z"
            stroke="#3B3B3B"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M8.89941 3.39941C9.29358 5.92941 11.3469 7.86358 13.8952 8.12027"
            stroke="#3B3B3B"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M0.75 18.9365H17.25"
            stroke="#3B3B3B"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const Delete: FC<SVGProps<SVGSVGElement>> = () => (
    <svg
        width="14"
        height="20"
        viewBox="0 0 18 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M17.25 4.39876C14.1975 4.09626 11.1267 3.94043 8.065 3.94043C6.25 3.94043 4.435 4.0321 2.62 4.21543L0.75 4.39876"
            stroke="#3B3B3B"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M5.7915 3.4725L5.99317 2.27167C6.13984 1.40083 6.24984 0.75 7.799 0.75H10.2007C11.7498 0.75 11.869 1.4375 12.0065 2.28083L12.2082 3.4725"
            stroke="#3B3B3B"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M15.279 7.2959L14.6832 16.5267C14.5824 17.9659 14.4999 19.0842 11.9424 19.0842H6.05737C3.49987 19.0842 3.41737 17.9659 3.31654 16.5267L2.7207 7.2959"
            stroke="#3B3B3B"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M7.46924 14.042H10.5217"
            stroke="#3B3B3B"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M6.7085 10.375H11.2918"
            stroke="#3B3B3B"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const Icons = {
    Edit,
    Delete,
    Plus: GoPlus,
};

export default Icons;