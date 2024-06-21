import styled from 'styled-components';

import { fadeIn2, open } from 'helpers/animations';
import { STYLING } from 'helpers/config';
import { AlignType } from 'helpers/types';

export const Wrapper = styled.div`
	width: 100%;
	animation: ${open} ${fadeIn2};
	scroll-margin-top: 100px;
	@media (max-width: ${STYLING.cutoffs.secondary}) {
		height: auto;
		scroll-margin-top: 20px;
	}
`;

export const Header = styled.div`
	width: 100%;
	margin: 0 0 15px 0;
	display: flex;
	flex-direction: column;
	@media (max-width: ${STYLING.cutoffs.tablet}) {
		height: auto;
		margin: 0 0 15px 0;
	}
`;

export const HeaderFlex = styled.div`
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 20px;
	p {
		font-family: ${(props) => props.theme.typography.family.alt1};
		font-size: ${(props) => props.theme.typography.size.lg};
		font-weight: ${(props) => props.theme.typography.weight.bold};
	}
`;
export const Body = styled.div`
	width: 100%;
	margin: 0 0 20px 0;
	display: flex;
	flex-direction: column;
	overflow: visible;
	animation: ${open} ${fadeIn2};
	scrollbar-width: none;
	::-webkit-scrollbar {
		width: 0px;
	}
	@media (max-width: ${STYLING.cutoffs.initial}) {
		overflow: auto;
	}
`;

export const Table = styled.div`
	height: 100%;
	width: 100%;
	border-radius: ${STYLING.dimensions.radius.primary};
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	> * {
		&:last-child {
			border-bottom: none;
			border-bottom-left-radius: 8.5px;
			border-bottom-right-radius: 8.5px;
		}
	}
	@media (max-width: ${STYLING.cutoffs.initial}) {
		width: ${STYLING.cutoffs.initial};
	}
`;

export const TableHeader = styled.div`
	height: 40px;
	display: flex;
	align-items: center;
	border-bottom: 1px solid ${(props) => props.theme.colors.border.primary};
	border-top-left-radius: 8.5px;
	border-top-right-radius: 8.5px;
	background: ${(props) => props.theme.colors.container.alt3.background};
	overflow: hidden;
`;

function getRowStyle(theme: any, active: boolean, viewed: boolean) {
	if (active) {
		return `
			background: ${theme.colors.table.row.active.background};
		`;
	} else {
		if (viewed) {
			return `
				background: ${theme.colors.row.hover.background};
			`;
		} else {
			return `
				background: ${theme.colors.container.primary.background};
			`;
		}
	}
}

export const Row = styled.div<{ active: boolean; viewed: boolean }>`
	height: 40px;
	display: flex;
	align-items: center;
	${(props) => getRowStyle(props.theme, props.active, props.viewed)};
	border-bottom: 1px solid ${(props) => props.theme.colors.border.primary};
	transition: all 75ms;
	&:hover {
		background: ${(props) =>
			props.active ? props.theme.colors.table.row.active.background : props.theme.colors.row.hover.background};
	}
`;

export const RowData = styled.div`
	height: 100%;
	display: flex;
	padding: 0 10px;
	background: ${(props) => props.theme.colors.container.alt3.background};
	align-items: center;
	p {
		font-family: ${(props) => props.theme.typography.family.primary};
		font-size: ${(props) => props.theme.typography.size.xSmall};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		color: ${(props) => props.theme.colors.font.primary};
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		height: 20px;
	}
`;

export const THeader = styled(RowData)<{
	even: boolean;
	width: string;
	align: AlignType;
}>`
	width: ${(props) => props.width};
	min-width: 60px;
	display: flex;
	justify-content: ${(props) => props.align};
	p {
		color: ${(props) => props.theme.colors.font.primary.alt4};
	}
`;

export const TData = styled(RowData)<{
	even: boolean;
	width: string;
	active: boolean;
}>`
	width: ${(props) => props.width};
	min-width: 60px;
	background: none;
	p {
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		font-size: ${(props) => props.theme.typography.size.xSxmall};
	}
`;

export const NoAssetsContainer = styled.div`
	height: 100%;
	width: 100%;
	p {
		color: ${(props) => props.theme.colors.warning};
	}
`;
