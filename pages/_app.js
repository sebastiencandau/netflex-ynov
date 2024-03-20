// _app.js

import { AuthProvider } from '../contexts/auth.context';
import theme from '../theme/theme';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
