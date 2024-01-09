import React from 'react';
import { TwitterShareButton } from 'react-share';
import { ReactSVG } from 'react-svg';

import { Button } from 'components/atoms/Button';
import { ASSETS } from 'helpers/config';
import { useLanguageProvider } from 'providers/LanguageProvider';
import { CloseHandler } from 'wrappers/CloseHandler';

import * as S from './styles';
import { IProps } from './types';

export default function AddressShare(props: IProps) {
	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	const [showShareDropdown, setShowShareDropdown] = React.useState<boolean>(false);
	const [urlCopied, setUrlCopied] = React.useState<boolean>(false);

	const copyText = React.useCallback(async (text: string) => {
		if (text) {
			if (text.length > 0) {
				await navigator.clipboard.writeText(text);
				setUrlCopied(true);
				setTimeout(() => setUrlCopied(false), 2000);
			}
		}
	}, []);

	return props.address ? (
		<S.ShareWrapper>
			<CloseHandler
				callback={() => setShowShareDropdown(!showShareDropdown)}
				active={showShareDropdown}
				disabled={false}
			>
				<Button
					type={props.type}
					label={language.share}
					handlePress={() => setShowShareDropdown(!showShareDropdown)}
					disabled={false}
					icon={ASSETS.share}
					noMinWidth
				/>
				{showShareDropdown && (
					<S.ShareDropdown className={'border-wrapper-primary'}>
						<li onClick={() => copyText(window.location.href)}>
							{urlCopied ? `${language.copied}!` : language.copyURL}
						</li>
						<S.Share>
							<TwitterShareButton title={''} url={window.location.href}>
								{language.shareOn}
								<ReactSVG src={ASSETS.x} />
							</TwitterShareButton>
						</S.Share>
					</S.ShareDropdown>
				)}
			</CloseHandler>
		</S.ShareWrapper>
	) : null;
}
