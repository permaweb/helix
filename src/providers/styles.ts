import styled from 'styled-components';

export const WalletListContainer = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	padding: 10px 0 0 0;
	flex-direction: column;
`;

export const WalletListItem = styled.button`
	height: 55px;
	width: 100%;
	text-align: left;
	padding: 0 20px;
	margin: 0 0 20px 0;
	display: flex;
	align-items: center;
	&:hover {
		background: ${(props) => props.theme.colors.container.primary.active};
	}
	img {
		width: 30px;
		margin: 0 15px 0 0;
	}
	span {
		color: ${(props) => props.theme.colors.font.alt1};
		font-size: ${(props) => props.theme.typography.size.base};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		font-family: ${(props) => props.theme.typography.family.alt1};
	}
`;

export const WalletLink = styled.div`
	margin: 0 0 20px 0;
	padding: 0 20px;
	a,
	span {
		font-size: ${(props) => props.theme.typography.size.small};
		font-weight: ${(props) => props.theme.typography.weight.medium};
	}
	span {
		color: ${(props) => props.theme.colors.font.alt1};
	}
`;
