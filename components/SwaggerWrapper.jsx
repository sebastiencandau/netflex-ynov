// components/SwaggerWrapper.jsx

import React, { useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerWrapper = () => {
  const [jwtToken, setJwtToken] = useState('');

  const onChangeToken = (e) => {
    setJwtToken(e.target.value);
  };

  const tokenInput = (
    <div style={{ margin: '20px' }}>
      <input
        type="text"
        placeholder="Bearer Token"
        value={jwtToken}
        onChange={onChangeToken}
      />
    </div>
  );

  const CustomLayout = () => {
    return (
      <div>
        {tokenInput}
        <SwaggerUI.SidebarLayout>
          <SwaggerUI.Sidebar />
          <SwaggerUI.Content />
        </SwaggerUI.SidebarLayout>
      </div>
    );
  };

  return (
    <div>
      <SwaggerUI
        url="/api/doc"
        docExpansion="list"
        requestInterceptor={(req) => {
          if (jwtToken) {
            req.headers.Authorization = `Bearer ${jwtToken}`;
          }
          return req;
        }}
        layout="CustomLayout"
      />
    </div>
  );
};

export default SwaggerWrapper;
