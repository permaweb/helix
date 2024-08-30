import styled from 'styled-components';

import { STYLING } from 'helpers/config';

export const Wrapper = styled.div``;

export const Header = styled.div`
	display: flex;
	justify-content: space-between;
	margin: 0 0 15px 0;
	h4 {
		color: ${(props) => props.theme.colors.font.alt2} !important;
		font-size: ${(props) => props.theme.typography.size.lg} !important;
		font-weight: ${(props) => props.theme.typography.weight.bold} !important;
		line-height: 1.5 !important;
	}
`;

export const Body = styled.div`
	a {
		max-width: 85%;
		p {
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
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
	width: fit-content;
	span {
		background: ${(props) => props.theme.colors.warning};
		color: ${(props) => props.theme.colors.font.light1};
		font-size: ${(props) => props.theme.typography.size.xxSmall};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		border-radius: ${STYLING.dimensions.radius.alt2};
		text-align: right;
		display: block;
		padding: 2.5px 12.5px;
		margin: 0 0 5px 0;
	}
`;

export const TAWrapper = styled.div`
	margin: 20px 0 0 0;
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
	margin: 41.5px 0 20px 0;
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
