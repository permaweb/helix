import styled, { createGlobalStyle } from 'styled-components';

import { fadeIn1, open } from 'helpers/animations';
import { STYLING } from 'helpers/config';

export const GlobalStyle = createGlobalStyle`
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font: inherit;
    vertical-align: baseline;
  }

  article, aside, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section {
    display: block;
  }

  body {
    line-height: 1;
    background: ${(props) => props.theme.colors.view.background};
  }

  ol, ul {
    list-style: none;
  }

  blockquote, q {
    quotes: none;
  }

  blockquote:before, blockquote:after,
  q:before, q:after {
    content: none;
  }

  * {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    color-scheme: ${(props) => props.theme.scheme};
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
    font-family: ${(props) => props.theme.typography.family.primary};
    font-weight: ${(props) => props.theme.typography.weight.medium};
    color: ${(props) => props.theme.colors.font.primary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    box-sizing: border-box;

    scrollbar-color: transparent transparent;
    ::-webkit-scrollbar-track {
      background: ${(props) => props.theme.colors.view.background};
      padding: 0 5px;
    }
    ::-webkit-scrollbar {
      width: 15.5px;
    }
    scrollbar-color: ${(props) => props.theme.colors.scrollbar.thumb} transparent;
    ::-webkit-scrollbar-thumb {
      background-color: ${(props) => props.theme.colors.scrollbar.thumb};
      border-radius: 36px;
      border: 3.5px solid transparent;
      background-clip: padding-box;
    } 
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${(props) => props.theme.typography.family.alt1};
  }

  p, span, button, a, b, li, input, textarea {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
    font-family: ${(props) => props.theme.typography.family.primary};
    color: ${(props) => props.theme.colors.font.primary};
  }

  a, p, li, button {
    transition: all 75ms;
  }
  
  button {
    padding: 0;
    margin: 0;
    border: none;
    background: transparent;
    &:hover {
      cursor: pointer;
    }

    &:disabled {
      cursor: default;
    }
  }

  input, textarea {
    box-shadow: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: transparent;
    margin: 0;
    padding: 10px;
    &:focus {
      outline: 0;
    }
    &:disabled {
      cursor: default;
    }
  }
  
  textarea {
    resize: none;
    line-height: 1.5;
  }

  label {
    cursor: text;
  }

  b, strong {
    font-weight: ${(props) => props.theme.typography.weight.bold};
  }

  p, span {
    line-height: 1.5;
  }

  a {
    color: ${(props) => props.theme.colors.link.color};
    text-decoration: none;

    &:hover {
      color: ${(props) => props.theme.colors.link.active};
      text-decoration: underline;
			text-decoration-thickness: 1.35px;
    }
  }

  * {
    &:focus {
      outline: none;
      opacity: 0.85;
    }
  }

  .border-wrapper-primary {
    background: ${(props) => props.theme.colors.container.primary.background};
    box-shadow: 0 5px 15px 0 ${(props) => props.theme.colors.shadow.primary};
    border: 1px solid ${(props) => props.theme.colors.border.primary};
    border-radius: ${STYLING.dimensions.radius.primary};
  }

  .border-wrapper-alt1 {
    background: ${(props) => props.theme.colors.container.alt3.background};
    border: 1px solid ${(props) => props.theme.colors.border.primary};
    border-radius: ${STYLING.dimensions.radius.primary};
  }

  .border-wrapper-alt2 {
    background: ${(props) => props.theme.colors.container.primary.background};
    box-shadow: 0 5px 15px 2.5px ${(props) => props.theme.colors.shadow.primary};
    border: 1px solid ${(props) => props.theme.colors.border.alt4};
    border-radius: ${STYLING.dimensions.radius.primary};
  }

  .max-view-wrapper {
    width: 100%;
    max-width: ${STYLING.cutoffs.max};
    margin: 0 auto;
  }

  .info-text {
    padding: 0 4.25px;
    background: ${(props) => props.theme.colors.container.primary.background};
    border: 1px solid ${(props) => props.theme.colors.border.primary};
    border-radius: ${STYLING.dimensions.radius.alt2};
    animation: ${open} ${fadeIn1};
    span {
      color: ${(props) => props.theme.colors.font.primary};
      font-size: ${(props) => props.theme.typography.size.xxxSmall};
      font-weight: ${(props) => props.theme.typography.weight.medium};
      white-space: nowrap;
	}
  }

  .overlay {
    min-height: 100vh;
    height: 100%;
    width: 100%;
    position: fixed;
    z-index: 11;
    top: 0;
    left: 0;
    background: ${(props) => props.theme.colors.overlay.primary};
    backdrop-filter: blur(2.5px);
    animation: ${open} ${fadeIn1};
  }

  .scroll-wrapper {
    overflow: auto;

    scrollbar-width: thin;
    scrollbar-color: transparent transparent;
    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-thumb {
      background-color: transparent;
    }

    &:hover {
      scrollbar-color: ${(props) => props.theme.colors.scrollbar.thumb} transparent;

      ::-webkit-scrollbar-thumb {
        background-color: ${(props) => props.theme.colors.scrollbar.thumb};
      }
    }
  }

  #root {
    overflow-x: hidden;
  }
`;

export const View = styled.div`
	min-height: calc(100vh - ${STYLING.dimensions.nav.headerHeight});
	width: calc(100vw - ${STYLING.dimensions.nav.panelWidthClosed} - 15.75px);
	margin: ${STYLING.dimensions.nav.headerHeight} 0 0 ${STYLING.dimensions.nav.panelWidthClosed};
	padding: 20px;
	@media (max-width: ${STYLING.cutoffs.initial}) {
		width: 100%;
		margin: ${STYLING.dimensions.nav.headerHeight} 0 0 0;
	}
`;

export const RangeBar = styled.input.attrs({ type: 'range' })<{
	value: any;
	max: any;
	disabled: boolean;
	bufferProgress: number;
}>`
	border: none !important;
	padding: 0 !important;
	background: transparent !important;
	width: 100%;
	appearance: none;
	outline: none;
	scroll-behavior: smooth;
	transition: all 200ms ease;

	&:focus {
		opacity: 1;
	}

	&:hover {
		&::-webkit-slider-runnable-track {
			height: 6.5px;
		}
		&::-moz-range-track {
			height: 6.5px;
		}
		&::-ms-track {
			height: 6.5px;
		}

		&::-webkit-slider-thumb {
			background: ${(props) =>
				props.disabled
					? props.theme.colors.button.primary.disabled.background
					: props.theme.colors.container.alt6.background};
		}
		&::-moz-range-thumb {
			background: ${(props) =>
				props.disabled
					? props.theme.colors.button.primary.disabled.background
					: props.theme.colors.container.alt6.background};
		}
		&::-ms-thumb {
			background: ${(props) =>
				props.disabled
					? props.theme.colors.button.primary.disabled.background
					: props.theme.colors.container.alt6.background};
		}
	}

	&::-webkit-slider-runnable-track {
		height: 4.5px;
		background: ${(props) => {
			const watchedPercent = (props.value / props.max) * 100 + (props.value <= 0 ? 0 : 0.5);
			const bufferedPercent = props.bufferProgress;

			return `linear-gradient(
        to right,
        ${props.theme.colors.video.watched} 0%,
        ${props.theme.colors.video.watched} ${watchedPercent}%,
        ${props.theme.colors.video.buffered} ${watchedPercent}%,
        ${props.theme.colors.video.buffered} ${bufferedPercent}%,
        ${props.theme.colors.video.unbuffered} ${bufferedPercent}%,
        ${props.theme.colors.video.unbuffered} 100%
      )`;
		}};
		border-radius: ${STYLING.dimensions.radius.alt1};
		&:hover {
			cursor: pointer;
		}
	}

	&::-moz-range-track {
		height: 4.5px;
		background: ${(props) => {
			const watchedPercent = (props.value / props.max) * 100 + (props.value <= 0 ? 0 : 0.5);
			const bufferedPercent = props.bufferProgress;

			return `linear-gradient(
        to right,
        ${props.theme.colors.video.watched} 0%,
        ${props.theme.colors.video.watched} ${watchedPercent}%,
        ${props.theme.colors.video.buffered} ${watchedPercent}%,
        ${props.theme.colors.video.buffered} ${bufferedPercent}%,
        ${props.theme.colors.video.unbuffered} ${bufferedPercent}%,
        ${props.theme.colors.video.unbuffered} 100%
      )`;
		}};
		border-radius: ${STYLING.dimensions.radius.alt1};
		&:hover {
			cursor: pointer;
		}
	}

	&::-ms-track {
		height: 4.5px;
		background: ${(props) => {
			const watchedPercent = (props.value / props.max) * 100 + (props.value <= 0 ? 0 : 0.5);
			const bufferedPercent = props.bufferProgress;

			return `linear-gradient(
        to right,
        ${props.theme.colors.video.watched} 0%,
        ${props.theme.colors.video.watched} ${watchedPercent}%,
        ${props.theme.colors.video.buffered} ${watchedPercent}%,
        ${props.theme.colors.video.buffered} ${bufferedPercent}%,
        ${props.theme.colors.video.unbuffered} ${bufferedPercent}%,
        ${props.theme.colors.video.unbuffered} 100%
      )`;
		}};
		border-radius: ${STYLING.dimensions.radius.alt1};
		&:hover {
			cursor: pointer;
		}
	}

	&::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		height: 15px;
		width: 15px;
		background: ${(props) =>
			props.disabled
				? props.theme.colors.button.primary.disabled.background
				: props.theme.colors.container.alt6.background};
		border: none !important;
		border-radius: 50%;
		cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
		margin-top: -4.15px;
		transition: left 300ms ease, margin-left 300ms ease;

		background: transparent;
		transition: background 100ms ease;
	}
	&::-moz-range-thumb {
		-webkit-appearance: none;
		appearance: none;
		height: 15px;
		width: 15px;
		background: ${(props) =>
			props.disabled
				? props.theme.colors.button.primary.disabled.background
				: props.theme.colors.container.alt6.background};
		border: none !important;
		border-radius: 50%;
		cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
		margin-top: -4.15px;
		transition: left 300ms ease, margin-left 300ms ease;

		background: transparent;
		transition: background 100ms ease;
	}
	&::-ms-thumb {
		-webkit-appearance: none;
		appearance: none;
		height: 15px;
		width: 15px;
		background: ${(props) =>
			props.disabled
				? props.theme.colors.button.primary.disabled.background
				: props.theme.colors.container.alt6.background};
		border: none !important;
		border-radius: 50%;
		cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
		margin-top: -4.15px;
		transition: left 300ms ease, margin-left 300ms ease;

		background: transparent;
		transition: background 100ms ease;
	}
`;
