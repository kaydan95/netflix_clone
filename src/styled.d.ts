import 'styled-components';
import { DefaultTheme } from 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
        red: string;
        black: {
            veryDark: string;
            darker: string;
            lighter: string;
            moreLighter : string;
        };
        white: {
            darker: string;
            lighter: string;
        };
    }
}