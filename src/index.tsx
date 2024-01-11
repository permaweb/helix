import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from 'styled-components';

import { App } from 'app';
import { GlobalStyle } from 'app/styles';
import { Loader } from 'components/atoms/Loader';
import { darkTheme, lightTheme, theme } from 'helpers/themes';
import { ArweaveProvider } from 'providers/ArweaveProvider';
import { LanguageProvider } from 'providers/LanguageProvider';
import { persistor, store } from 'store';

const selectedTheme =
	window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? darkTheme : lightTheme;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<Provider store={store}>
		<PersistGate loading={<Loader />} persistor={persistor}>
			<ThemeProvider theme={theme(selectedTheme)}>
				<LanguageProvider>
					<ArweaveProvider>
						<HashRouter>
							<GlobalStyle />
							<App />
						</HashRouter>
					</ArweaveProvider>
				</LanguageProvider>
			</ThemeProvider>
		</PersistGate>
	</Provider>
);
