import styled from 'styled-components';

import { STYLING } from 'helpers/config';

export const Wrapper = styled.div``;

export const Header = styled.div`
	display: flex;
	justify-content: space-between;
	h4 {
		color: ${(props) => props.theme.colors.font.alt2} !important;
		font-size: ${(props) => props.theme.typography.size.lg} !important;
		font-weight: ${(props) => props.theme.typography.weight.bold} !important;
		line-height: 1.5 !important;
	}
`;

export const Body = styled.div`
	p {
		max-width: 500px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
`;

export const CWrapper = styled.div`
	margin: auto;
`;

export const TMessage = styled.div`
	margin: 5px 0 0 0;
	span {
		color: ${(props) => props.theme.colors.font.alt1};
		font-size: ${(props) => props.theme.typography.size.xxSmall};
		font-weight: ${(props) => props.theme.typography.weight.bold};
	}
`;

export const MWrapper = styled.div`
	span {
		color: ${(props) => props.theme.colors.warning};
		font-size: ${(props) => props.theme.typography.size.xSmall};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		display: block;
		margin: 0 0 5px 0;
	}
`;

export const DWrapper = styled.div`
	height: fit-content;
	width: fit-content;
	position: relative;
	margin: 5px auto 0 auto;
`;

export const DDropdown = styled.ul<{ open: boolean }>`
	width: 225px;
	padding: 10px 0;
	display: ${(props) => (props.open ? 'block' : 'none')};
	position: absolute;
	top: 26.5px;
	right: 15%;
	z-index: 1;
`;

export const LI = styled.li<{ disabled: boolean }>`
	pointer-events: ${(props) => (props.disabled ? 'none' : 'default')};
	text-align: center;
	height: 32.5px;
	display: flex;
	align-items: center;
	cursor: pointer;
	color: ${(props) => props.theme.colors.font.primary};
	font-size: ${(props) => props.theme.typography.size.xSmall};
	font-weight: ${(props) => props.theme.typography.weight.bold};
	background: ${(props) => (props.disabled ? props.theme.colors.button.primary.disabled.background : 'transparent')};
	padding: 0 15px;
	&:hover {
		background: ${(props) =>
			props.disabled
				? props.theme.colors.button.primary.disabled.background
				: props.theme.colors.container.primary.active};
	}
`;

export const MCWrapper = styled.div`
	padding: 0 20px 20px 20px;
`;

export const MBody = styled.div``;

export const MHeader = styled.div`
	margin: 0 0 20px 0;
	p {
		color: ${(props) => props.theme.colors.font.primary};
		font-size: ${(props) => props.theme.typography.size.small};
		font-weight: ${(props) => props.theme.typography.weight.bold};
	}
`;

export const MMessage = styled.div`
	margin: 0 0 30px 0;
	padding: 10px 12.5px;
	display: flex;
	flex-direction: column;
	pre {
		color: ${(props) => props.theme.colors.font.alt1};
		font-size: ${(props) => props.theme.typography.size.xSmall};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		font-family: ${(props) => props.theme.typography.family.alt1};
		line-height: 1.65;
	}
`;

export const MFooter = styled.div`
	margin: 20px 0 0 0;
	display: flex;
	align-items: flex-end;
`;

export const MActions = styled.div`
	width: fit-content;
	display: flex;
	margin: 0 0 0 auto;
	> * {
		&:not(:last-child) {
			margin: 0 15px 0 0;
		}
		&:last-child {
			margin: 0;
		}
	}
`;

export const MFetchWrapper = styled.div`
	span {
		color: ${(props) => props.theme.colors.font.alt1};
		font-size: ${(props) => props.theme.typography.size.xSmall};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		font-family: ${(props) => props.theme.typography.family.alt1};
	}
`;

export const EmptyContainer = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 25px;
	padding: 30px 20px;
	margin: 0 0 20px 0;
	p {
		color: ${(props) => props.theme.colors.font.primary};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		text-align: center;
	}
	@media (max-width: ${STYLING.cutoffs.initial}) {
		justify-content: flex-start;
		p {
			text-align: left;
		}
	}
`;

export const EmptyLogo = styled.div`
	height: 100px;
	width: 100px;
	background: ${(props) => props.theme.colors.container.primary.background};
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	svg {
		height: 55px;
		width: 55px;
		padding: 5px 0 0 0;
		fill: ${(props) => props.theme.colors.font.alt1};
		color: ${(props) => props.theme.colors.font.alt1};
	}
	img {
		height: 100%;
		width: 100%;
		object-fit: cover;
		border-radius: 50%;
	}
`;
