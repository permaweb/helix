import { DefaultTheme } from 'styled-components';

const DEFAULT = {
	accent1: '#9297C4',
	accent2: '#7A81B8',
	negative1: '#DF4657',
	negative2: '#EF6C82',
	neutral1: '#12151a',
	neutral2: '#3A3A3A',
	neutral3: '#606060',
	neutral4: '#5C5C5C',
	neutral5: '#A4A4A4',
	neutral6: '#A9A9A9',
	neutral7: '#CCCCCC',
	neutralA1: '#FFFFFF',
	neutralA2: '#F1F1F1',
	neutralA3: '#E0E0E0',
	neutralA4: '#D6D6D6',
	neutralA5: '#F7F7F7',
	neutralA6: '#FAFAFA',
	overlay1: 'rgba(255, 255, 255, 0.5)',
	primary1: '#5BC29E',
	primary2: '#42B38B',
	semiTransparent1: 'rgba(0, 0, 0, 0.575)',
	semiTransparent2: 'rgba(255, 255, 255, 0.45)',
	semiTransparent3: 'rgba(255, 255, 255, 0.65)',
	semiTransparent4: '#AEAEAE45',
	semiTransparent5: 'rgba(0, 0, 0, 0.5)',
};

export const defaultTheme: DefaultTheme = {
	scheme: 'dark',
	colors: {
		border: {
			primary: DEFAULT.neutral4,
			alt1: DEFAULT.primary1,
			alt2: DEFAULT.neutralA6,
			alt3: DEFAULT.neutral5,
		},
		button: {
			primary: {
				background: DEFAULT.neutral2,
				border: DEFAULT.neutral2,
				color: DEFAULT.neutralA1,
				active: {
					background: DEFAULT.neutral4,
					border: DEFAULT.neutral4,
					color: DEFAULT.neutralA1,
				},
				disabled: {
					background: DEFAULT.neutral3,
					border: DEFAULT.neutral3,
					color: DEFAULT.neutralA2,
				},
			},
			alt1: {
				background: DEFAULT.primary1,
				border: DEFAULT.primary1,
				color: DEFAULT.neutralA1,
				active: {
					background: DEFAULT.primary2,
					border: DEFAULT.primary2,
					color: DEFAULT.neutralA1,
				},
				disabled: {
					background: DEFAULT.neutral3,
					border: DEFAULT.neutral3,
					color: DEFAULT.neutralA2,
				},
			},
			alt2: {
				background: DEFAULT.primary1,
				border: DEFAULT.primary1,
				color: DEFAULT.primary1,
				active: {
					background: DEFAULT.primary2,
					border: DEFAULT.primary2,
					color: DEFAULT.primary2,
				},
				disabled: {
					background: DEFAULT.neutral3,
					border: DEFAULT.neutral3,
					color: DEFAULT.neutralA2,
				},
			},
		},
		checkbox: {
			active: {
				background: DEFAULT.primary1,
			},
			background: DEFAULT.neutral1,
			hover: DEFAULT.neutral2,
			disabled: DEFAULT.neutral5,
		},
		container: {
			primary: {
				background: DEFAULT.neutral1,
				active: DEFAULT.neutral2,
			},
			alt1: {
				background: DEFAULT.neutral3,
			},
			alt2: {
				background: DEFAULT.neutral2,
			},
			alt3: {
				background: DEFAULT.neutralA1,
			},
			alt4: {
				background: DEFAULT.neutral2,
			},
			alt5: {
				background: DEFAULT.neutralA4,
			},
			alt6: {
				background: DEFAULT.primary1,
			},
			alt7: {
				background: DEFAULT.neutralA3,
			},
		},
		font: {
			primary: DEFAULT.neutralA1,
			alt1: DEFAULT.neutralA4,
			alt2: DEFAULT.neutral1,
			alt3: DEFAULT.neutral5,
		},
		form: {
			background: DEFAULT.neutral1,
			border: DEFAULT.neutral4,
			invalid: {
				outline: DEFAULT.negative1,
				shadow: DEFAULT.negative2,
			},
			valid: {
				outline: DEFAULT.neutralA4,
				shadow: DEFAULT.neutral3,
			},
			disabled: {
				background: DEFAULT.neutral2,
				border: DEFAULT.neutral5,
				label: DEFAULT.neutralA2,
			},
		},
		gradient: {
			start: DEFAULT.primary1,
			middle: DEFAULT.accent1,
			end: DEFAULT.accent2,
		},
		icon: {
			primary: {
				fill: DEFAULT.neutralA1,
				active: DEFAULT.neutral4,
				disabled: DEFAULT.neutralA3,
			},
			alt1: {
				fill: DEFAULT.neutral1,
				active: DEFAULT.semiTransparent4,
				disabled: DEFAULT.neutral3,
			},
			alt2: {
				fill: DEFAULT.neutral1,
				active: DEFAULT.neutralA1,
				disabled: DEFAULT.neutral3,
			},
			alt3: {
				fill: DEFAULT.neutralA2,
				active: DEFAULT.neutral1,
				disabled: DEFAULT.neutral3,
			},
		},
		indicator: {
			active: DEFAULT.primary1,
		},
		link: {
			color: DEFAULT.primary2,
			active: DEFAULT.primary1,
		},
		loader: {
			primary: DEFAULT.primary1,
		},
		overlay: {
			primary: DEFAULT.overlay1,
			alt1: DEFAULT.semiTransparent2,
			alt2: DEFAULT.semiTransparent3,
			alt3: DEFAULT.semiTransparent1,
		},
		scrollbar: {
			thumb: DEFAULT.neutralA2,
		},
		shadow: {
			primary: DEFAULT.semiTransparent5,
			alt1: DEFAULT.neutralA1,
		},
		view: {
			background: DEFAULT.neutral1,
		},
		video: {
			buffered: DEFAULT.neutral4,
			unbuffered: DEFAULT.semiTransparent4,
			watched: DEFAULT.primary1,
		},
		warning: DEFAULT.negative1,
	},
	typography: {
		family: {
			primary: `'Inter', sans-serif`,
		},
		size: {
			xxxSmall: '12px',
			xxSmall: '13px',
			xSmall: '14px',
			small: '15px',
			base: '16px',
			lg: '18px',
		},
		weight: {
			medium: '500',
			bold: '600',
			xBold: '700',
			xxBold: '800',
		},
	},
};
