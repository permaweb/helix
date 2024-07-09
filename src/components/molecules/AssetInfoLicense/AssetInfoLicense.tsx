import { ReactSVG } from 'react-svg';

import { Button } from 'components/atoms/Button';
import { TxAddress } from 'components/atoms/TxAddress';
import { ASSETS, REDIRECTS } from 'helpers/config';
import { checkAddress, getDisplayValue, splitLicenseTag } from 'helpers/utils';
import { useLanguageProvider } from 'providers/LanguageProvider';

import * as S from './styles';
import { IProps } from './types';

export default function AssetDetailLicenses(props: IProps) {
	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	function getLicenseText(value: string) {
		if (value.includes('Disallowed')) {
			return 'Disallowed';
		} else if (value.includes('None')) {
			return 'None';
		} else {
			return splitLicenseTag(value);
		}
	}

	function getValue(element: string) {
		if (!props.asset || !props.asset.license || !props.asset.license[element]) return null;
		if (typeof props.asset.license[element] === 'object') {
			return (
				<S.LFlex>
					<p>{getLicenseText(props.asset.license[element].value)}</p>
					{props.asset.license[element].icon &&
						!props.asset.license[element].value.includes('None') &&
						!props.asset.license[element].value.includes('Disallowed') && (
							<S.LFlexValue>
								<ReactSVG src={props.asset.license[element].icon} />
							</S.LFlexValue>
						)}
					{props.asset.license[element].endText && (
						<S.LFlexValue>
							<p>{props.asset.license[element].endText}</p>
						</S.LFlexValue>
					)}
				</S.LFlex>
			);
		} else {
			if (checkAddress(props.asset.license[element])) {
				return (
					<TxAddress
						address={props.asset.license[element]}
						wrap={false}
						view={element !== 'paymentAddress'}
						viewIcon={ASSETS.details}
					/>
				);
			} else {
				return <p>{props.asset.license[element]}</p>;
			}
		}
	}

	return props.asset && props.asset.license ? (
		<S.Wrapper>
			<S.Header>
				<span>{language.assetRights}</span>
			</S.Header>
			<S.Body className={'border-wrapper-alt1'}>
				<S.BodyHeader>
					<p>{language.udl}</p>
					{props.asset.license.license && (
						<Button
							type={'alt2'}
							label={language.viewLicense}
							handlePress={() => window.open(REDIRECTS.udl, '_blank')}
							disabled={false}
							noMinWidth
						/>
					)}
				</S.BodyHeader>
				{Object.keys(props.asset.license).map((element: string, index: number) => {
					return props.asset.license[element] ? (
						<S.LLine key={index}>
							<span>{getDisplayValue(element)}</span>
							{getValue(element)}
						</S.LLine>
					) : null;
				})}
			</S.Body>
		</S.Wrapper>
	) : null;
}
