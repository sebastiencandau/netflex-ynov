// _app.js

import { AuthProvider } from '../contexts/auth.context';
import theme from '../theme/theme';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider  style={{ backgroundColor: theme.palette.background.default, padding: '20px' }}>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
