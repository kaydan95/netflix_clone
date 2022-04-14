import React from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import App from './App';
import { QueryClient, QueryClientProvider } from 'react-query';
import { theme } from './theme';

// 기존 CSS 리셋(전역)
const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Federo&family=Markazi+Text&family=Raleway:wght@300;400;500;600;700;800&family=Vidaloka&display=swap');
  /* font-family: 'Markazi Text', serif;
  font-family: 'Raleway', sans-serif;
  font-family: 'Vidaloka', serif;
  font-family: 'Federo', sans-serif; */
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, menu, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  main, menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure,
  footer, header, hgroup, main, menu, nav, section {
    display: block;
  }
  /* HTML5 hidden-attribute fix for newer browsers */
  *[hidden] {
      display: none;
  }
  body {
    line-height: 1;
  }
  menu, ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  *{
    box-sizing: border-box;
  }
  body {
    /* font-weight: 300; */
    font-family: 'Raleway', sans-serif;
    background-color: ${props => props.theme.black.darker};
    color: ${props => props.theme.white.lighter};
    display : flex;
    flex-direction: column;
    letter-spacing: 0.3;
    /* line-height: 1.2; */
    &::-webkit-scrollbar {
        display : none;
    }
  }
  a {
    text-decoration: none;
    color : inherit;
  }
`

const client = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <QueryClientProvider client={client}>
        <ThemeProvider theme={theme}>
          <GlobalStyle/>
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root')
);
