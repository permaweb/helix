import styled from 'styled-components';

export const Wrapper = styled.div<{
	dimensions: { wrapper: number; icon: number };
	hasCallback: boolean;
	hasOwner: boolean;
}>`
	min-height: ${(props) => `${props.dimensions.wrapper.toString()}px`};
	min-width: ${(props) => `${props.dimensions.wrapper.toString()}px`};
	height: ${(props) => `${props.dimensions.wrapper.toString()}px`};
	width: ${(props) => `${props.dimensions.wrapper.toString()}px`};
	background: ${(props) =>
		props.hasOwner ? props.theme.colors.icon.alt2.active : props.theme.colors.container.alt1.background};
	border-radius: 50%;
	overflow: hidden;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	img {
		height: 100%;
		width: 100%;
		object-fit: cover;
	}
	svg {
		min-height: ${(props) => `${props.dimensions.icon.toString()}px`};
		min-width: ${(props) => `${props.dimensions.icon.toString()}px`};
		height: ${(props) => `${props.dimensions.icon.toString()}px`};
		width: ${(props) => `${props.dimensions.icon.toString()}px`};
		padding: 3.5px 0 0 0px;
		margin: 0 0 2.5px 0;
		stroke: ${(props) => (props.hasOwner ? props.theme.colors.icon.alt2.fill : props.theme.colors.icon.alt3.fill)};
	}

	pointer-events: none;
	&:hover {
		cursor: default;
	}
	&:focus {
		opacity: 1;
	}

	${(props) =>
		props.hasCallback
			? `
        pointer-events: all;
        ::after {
            content: "";
            position: absolute;
            height: 100%;
            width: 100%;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: ${props.theme.colors.overlay.alt1};
            opacity: 0;
            transition: all 75ms;
        }
        &:hover::after {
            opacity: 1;
        }
        &:focus::after {
            opacity: 1;
        }
        &:hover {
            cursor: pointer;
            border: none;
        }
    `
			: ''}
`;
