import React from 'react';
import { Link } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { search } from 'gql';

import { IconButton } from 'components/atoms/IconButton';
import { Loader } from 'components/atoms/Loader';
import { Portal } from 'components/atoms/Portal';
import { ASSETS, DOM, STYLING, URLS } from 'helpers/config';
import { getTxEndpoint } from 'helpers/endpoints';
import { AssetType } from 'helpers/types';
import { formatTime, getCreatorLabel, getRelativeDate } from 'helpers/utils';
import { checkWindowCutoff, checkWindowResize } from 'helpers/window';
import { useLanguageProvider } from 'providers/LanguageProvider';
import { CloseHandler } from 'wrappers/CloseHandler';

import * as S from './styles';

export default function Search() {
	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	const isCancelled = React.useRef<boolean>(false);

	const [value, setValue] = React.useState<string>('');
	const [loading, setLoading] = React.useState<boolean>(false);
	const [desktop, setDesktop] = React.useState(checkWindowCutoff(parseInt(STYLING.cutoffs.initial)));
	const [timer, setTimer] = React.useState<any>(null);
	const [results, setResults] = React.useState<AssetType[] | null>(null);
	const [showResults, setShowResults] = React.useState<boolean>(true);
	const [searchOpen, setSearchOpen] = React.useState<boolean>(false);

	function handleWindowResize() {
		if (checkWindowCutoff(parseInt(STYLING.cutoffs.initial))) {
			setDesktop(true);
		} else {
			setDesktop(false);
		}
	}

	checkWindowResize(handleWindowResize);

	React.useEffect(() => {
		setTimer(
			setTimeout(() => {
				if (value) {
					handleSearch('timer');
				} else {
					handleClear();
				}
			}, 500)
		);

		return () => clearTimeout(timer);
	}, [value]);

	async function handleSearch(e: any) {
		isCancelled.current = false;
		if ((e.type === 'keydown' && e.key === 'Enter') || e.type === 'click' || e === 'timer') {
			if (value) {
				try {
					setLoading(true);
					const searchResults = await search({ term: value, cursor: null });
					if (!isCancelled.current) {
						setResults(searchResults.data);
						setLoading(false);
					}
				} catch (e: any) {
					console.error(e);
				}
			}
		}
	}

	function handleChange(value: string) {
		clearTimeout(timer);
		setValue(value);
	}

	function handleClear() {
		isCancelled.current = true;
		setValue('');
		setResults(null);
		setLoading(false);
		setSearchOpen(false);
	}

	function getResults() {
		if (loading) {
			return (
				<S.DLWrapper>
					<span>{`${language.loading}...`}</span>
				</S.DLWrapper>
			);
		}
		if (results !== null) {
			if (!results.length) {
				return (
					<S.DLWrapper>
						<span>{language.noResults}</span>
					</S.DLWrapper>
				);
			} else {
				return (
					<S.DRWrapper>
						{results.map((asset: AssetType, index: number) => {
							return <Asset key={index} asset={asset} handleClear={handleClear} />;
						})}
					</S.DRWrapper>
				);
			}
		} else return null;
	}

	function getSearch(useDesktop: boolean) {
		let InputWrapper: any;
		let SearchWrapper: any;
		let ResultsWrapper: any;
		let RelativeWrapper: any;
		if (useDesktop) {
			InputWrapper = S.DInput;
			SearchWrapper = S.DSearchWrapper;
			ResultsWrapper = S.DResultsWrapper;
			RelativeWrapper = S.RWrapper;
		} else {
			InputWrapper = S.MInput;
			SearchWrapper = S.MSearchWrapper;
			ResultsWrapper = S.MResultsWrapper;
			RelativeWrapper = S.MRWrapper;
		}

		return (
			<S.DWrapper>
				<CloseHandler active={loading || results !== null} disabled={false} callback={() => setShowResults(false)}>
					<SearchWrapper>
						{!useDesktop && (
							<S.MCloseWrapper>
								<IconButton
									type={'primary'}
									src={ASSETS.arrow}
									handlePress={() => setSearchOpen(false)}
									dimensions={{ wrapper: 27.5, icon: 12.5 }}
								/>
							</S.MCloseWrapper>
						)}
						<RelativeWrapper>
							<S.DSearchIcon disabled={false}>
								<ReactSVG src={ASSETS.search} />
							</S.DSearchIcon>
							<InputWrapper
								disabled={false}
								invalid={false}
								value={value}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
								onClick={() => setShowResults(true)}
								placeholder={language.search}
								hasData={loading || results !== null}
							/>
							<S.DClearWrapper>
								<IconButton
									src={ASSETS.close}
									type={'primary'}
									handlePress={handleClear}
									disabled={!value}
									warning
									dimensions={{ wrapper: 30, icon: 12.5 }}
									tooltip={language.clear}
									useBottomToolTip
								/>
							</S.DClearWrapper>
						</RelativeWrapper>
					</SearchWrapper>
					{(loading || results !== null) && showResults && <ResultsWrapper>{getResults()}</ResultsWrapper>}
				</CloseHandler>
			</S.DWrapper>
		);
	}

	return desktop ? (
		getSearch(true)
	) : (
		<>
			<S.MWrapper>
				<S.MIconWrapper>
					<IconButton
						src={ASSETS.search}
						type={'primary'}
						handlePress={() => setSearchOpen(true)}
						disabled={false}
						dimensions={{ wrapper: 32.5, icon: 16.5 }}
						tooltip={language.search}
						useBottomToolTip
					/>
				</S.MIconWrapper>
			</S.MWrapper>
			{searchOpen && (
				<Portal node={DOM.overlay}>
					<S.MSWrapper>{getSearch(false)}</S.MSWrapper>
				</Portal>
			)}
		</>
	);
}

function Asset(props: { asset: AssetType | null; handleClear: () => void }) {
	const assetRedirect = props.asset ? `${URLS.asset}${props.asset.id}` : null;
	const profileRedirect = props.asset ? URLS.profileChannel(props.asset.creator.walletAddress) : null;

	return (
		<S.AWrapper>
			{props.asset && (
				<S.AContentLink>
					<Link to={assetRedirect} onClick={props.handleClear} />
				</S.AContentLink>
			)}
			<S.AContent>
				{props.asset ? (
					<>
						<img src={getTxEndpoint(props.asset.thumbnail)} />
						{props.asset.contentLength && (
							<S.VLength className={'info-text'}>
								<span>{formatTime(props.asset.contentLength)}</span>
							</S.VLength>
						)}
					</>
				) : (
					<Loader placeholder />
				)}
			</S.AContent>
			<S.AInfo>
				<S.AInfo1>
					{props.asset ? (
						<Link to={assetRedirect} onClick={props.handleClear}>
							<p>{props.asset.title}</p>
						</Link>
					) : (
						<S.ATLoader>
							<Loader placeholder />
						</S.ATLoader>
					)}
					<S.AInfoFlex>
						{props.asset ? (
							<>
								<Link to={profileRedirect} onClick={props.handleClear}>
									{getCreatorLabel(props.asset.creator)}
								</Link>
								<span>{` · ${getRelativeDate(props.asset.dateCreated)}`}</span>
							</>
						) : (
							<S.AILoader>
								<Loader placeholder />
							</S.AILoader>
						)}
					</S.AInfoFlex>
				</S.AInfo1>
			</S.AInfo>
		</S.AWrapper>
	);
}
