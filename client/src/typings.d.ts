import { DetailedHTMLProps } from "react";

declare module 'reapop-theme-wybo';
declare module 'react-datepicker';
declare module 'react' {
    interface HTMLAttributes<T> extends DetailedHTMLProps<T> {
        class?: string;
    }
}