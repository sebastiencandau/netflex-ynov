// _app.js

import { AuthProvider } from '../contexts/auth.context';
import theme from '../theme/theme';

function MyApp({ Component, pageProps }) {
  return (
    <div style={{ backgroundColor: theme.palette.background.default, padding: '20px' }}>
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
    </div>
  );
}

export default MyApp;
