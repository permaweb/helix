import styled from 'styled-components';

export const Wrapper = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	> * {
		&:first-child {
			span {
				left: 0;
			}
		}
		&:last-child {
			span {
				right: 0;
			}
		}
	}
`;

export const Step = styled.div<{ active: boolean; completed: boolean }>`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: relative;
	span {
		color: ${(props) =>
			props.active || props.completed ? props.theme.colors.indicator.active : props.theme.colors.font.alt1};
		font-size: ${(props) => props.theme.typography.size.xSmall};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		display: block;
		position: absolute;
		top: -25px;
	}
`;

export const SIndicator = styled.div<{ active: boolean; completed: boolean }>`
	height: 20px;
	width: 20px;
	background: ${(props) =>
		props.completed ? props.theme.colors.indicator.active : props.theme.colors.container.primary.background};
	border: 2.5px solid
		${(props) =>
			props.active || props.completed ? props.theme.colors.indicator.active : props.theme.colors.border.alt3};
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	svg {
		height: 10px;
		width: 10px;
		fill: ${(props) => props.theme.colors.font.alt4};
	}
`;

export const Line = styled.div<{ completed: boolean }>`
	height: 2.5px;
	width: 50%;
	border-top: 2.5px solid
		${(props) => (props.completed ? props.theme.colors.indicator.active : props.theme.colors.border.alt3)};
`;
