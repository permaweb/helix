import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from 'components/atoms/Button';

import * as S from './styles';
import { ICProps, ITProps, IUProps } from './types';

function Tab(props: ITProps) {
	function handlePress(e: any) {
		e.preventDefault();
		props.handlePress(props.url);
	}

	return (
		<S.Tab active={props.active}>
			<Button
				type={'primary'}
				label={props.label}
				handlePress={handlePress}
				active={props.active}
				disabled={props.disabled}
				noMinWidth
			/>
		</S.Tab>
	);
}

function TabContent(props: ICProps) {
	const { id, active } = useParams() as { id: string; active: string };
	let TabView: React.ComponentType = null;
	for (let i = 0; i < props.tabs.length; i++) {
		const url = typeof props.tabs[i].url === 'function' ? props.tabs[i].url(id) : props.tabs[i].url;
		if (url.includes(active)) {
			TabView = props.tabs[i].view;
		}
	}
	return (
		<S.View>
			<TabView />
		</S.View>
	);
}
export default function URLTabs(props: IUProps) {
	const navigate = useNavigate();
	const { id, active } = useParams() as { id: string; active: string };

	React.useEffect(() => {
		if (!active) {
			navigate(props.activeUrl);
		}
	}, [active, navigate, props.activeUrl]);

	const handleRedirect = (url: string) => {
		if (active !== url) {
			navigate(url);
		}
	};

	return (
		<S.Wrapper>
			<S.ListHeader>
				<S.List>
					{props.tabs.map((elem, index) => {
						const url = typeof elem.url === 'function' ? elem.url(id) : elem.url;
						return (
							<Tab
								key={index}
								url={url}
								label={elem.label}
								disabled={elem.disabled}
								active={url.includes(active)}
								handlePress={() => handleRedirect(url)}
							/>
						);
					})}
				</S.List>
			</S.ListHeader>
			<S.Content>
				<TabContent tabs={props.tabs} />
			</S.Content>
		</S.Wrapper>
	);
}
