<img src="logo_ynov_bdx.jpeg" width="20%" height="20%"/>  


## **YNOV BORDEAUX - Mastere 1**

# Séance 04 - Module Atelier - Développement Cloud - Tests unitaires avec Jest

| Code Module   | Durée Module | Titre Diplôme         | Spécialité      | Année Promotion      | Auteur  |
|--------------|-------------|-----------------------|-------------------------|------------------------|--------|
|       | 70h   | Mastère 1 Export Développement | Développement Web      | 2023/2024      | Julien COURAUD   |

## Liens utiles

- Documentation des méthodes disponibles: https://jestjs.io/fr/docs/29.5/api
- Implémentation directe avec Next.JS (Page Router): https://nextjs.org/docs/pages/building-your-application/testing/jest
- Utilisation de mocks dans un environnement Node.js: https://www.npmjs.com/package/node-mocks-http

## Setup Framework Jest

- Ajout des scripts de testing et des dépendances de développement.

``` json
// package.json

"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "test": "jest --watchAll",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
},

// ...

"devDependencies": {
  "@babel/preset-env": "^7.24.0",
  "@babel/preset-react": "^7.23.3",
  "@testing-library/jest-dom": "^6.4.2",
  "@testing-library/react": "^14.2.1",
  "@testing-library/user-event": "^14.5.2",
  "@types/node": "latest",
  "@types/react": "latest",
  "babel-jest": "^29.7.0",
  "jest": "^29.7.0",
  "jest-environment-jsdom": "^29.7.0",
  "node-mocks-http": "^1.14.1",
  "react-test-renderer": "^18.2.0",
  "text-encoding": "^0.7.0",
  "typescript": "4.6.3"
}
```

``` javascript
// jest.config.js

const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFiles: ['text-encoding'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jsdom",
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
```

``` javascript
// jest.setup.js

import "@testing-library/jest-dom";
import "@testing-library/react";
```

## Ecriture de tests - Partie Client (Frontend)

- Pour ce composant:

``` javascript
// pages/index.js
import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProTip from '../src/theme/mui-base-components/ProTip';
import Link from '../src/theme/mui-base-components/Link';
import Copyright from '../src/theme/mui-base-components/Copyright';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../src/contexts/auth.context';

export default function Index() {

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/ui/sign-in');
    }
  }, [user, router]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Material UI - Next.js example
        </Typography>
        <Link href="/ui/sign-in" color="secondary">
          Go to the Sign-In page
        </Link>
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
}
```

- Voici un exemple de test associé:

``` javascript
// __tests__/ui/index.ui.test.js

import { render, screen } from '@testing-library/react';
import Index from '../../pages/index';
import { useAuth } from '../../src/contexts/auth.context';

const useRouter = jest.spyOn(require('next/router'), 'useRouter');
useRouter.mockImplementation(() => ({
  pathname: '/',
  ...moreRouterData
}));
jest.mock('../../src/contexts/auth.context');

describe('Index', () => {
  beforeEach(() => {
    useRouter.mockReturnValue({
      push: jest.fn(),
    });
  });

  it('redirects to sign-in page if user is not authenticated', () => {
    useAuth.mockReturnValue({
      user: null,
    });

    render(<Index />);

    expect(useRouter().push).toHaveBeenCalledWith('/ui/sign-in');
  });

  it('does not redirect if user is authenticated', () => {
    useAuth.mockReturnValue({
      user: { /* mock user data */ },
    });

    render(<Index />);

    expect(useRouter().push).not.toHaveBeenCalled();
  });

  it('renders the title correctly', () => {
    render(<Index />);

    expect(screen.getByText('Material UI - Next.js example')).toBeInTheDocument();
  });

  it('renders the sign-in link correctly', () => {
    render(<Index />);

    expect(screen.getByText('Go to the Sign-In page')).toBeInTheDocument();
  });
});
```
## Ecriture de tests - Partie Serveur (Backend)

### Composant API - Exemple de tests liés au "fetch"

- Pour ce "handler":

``` javascript
// pages/api/discover.js

import fetch from "node-fetch";
import { ConfigService } from "../../src/services/config.service"

export default async function handler(req, res) {
  try {
    const url = ConfigService.themoviedb.urls.discover;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + ConfigService.themoviedb.keys.API_TOKEN
      }
    };

    const apiResponse = await fetch(url, options)
      .then(r => r.json());

    // Vérifier si l'API a renvoyé une réponse valide
    if (apiResponse && apiResponse.results) {
      res.status(200).json({ status: 200, data: apiResponse.results });
    } else {
      throw new Error('Invalid API response');
    }
  } catch (error) {
    res.status(500).json({ status: 500, error: 'Internal Server Error' });
  }
}
```

- Voici un exemple de test associé:

``` javascript
// __tests__/api/discover.api.test.js

import handler from '../../pages/api/discover';
import fetch from 'node-fetch';
import { ConfigService } from '../../src/services/config.service';

jest.mock('node-fetch');

describe('API Handler for Discover', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return data from the discover API when successful', async () => {
    const mockData = {
      results: [
        { id: 1, title: 'Movie 1' },
        { id: 2, title: 'Movie 2' }
      ]
    };

    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockData)
    });

    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 200, data: mockData.results });
  });

  it('should handle network errors', async () => {
    fetch.mockRejectedValueOnce(new Error('Network Error'));

    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ status: 500, error: 'Internal Server Error' });
  });

  it('should handle errors in configuration', async () => {
    jest.replaceProperty(ConfigService.themoviedb.keys, 'API_TOKEN', jest.fn().mockReturnValue('MY_API_TOKEN_VALUE'));

    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ status: 500, error: 'Internal Server Error' });
  });
});
```

### Composant API - Exemple de tests liés au mock de la base MongoDB

- Pour ce "handler":

``` javascript
// pages/api/movies/[idMovie]/likes.js

import clientPromise from "../../../../lib/mongodb";

export default async function handler(req, res) {

  const idMovie = parseInt(req.query.idMovie, 10);

  const client = await clientPromise;
  const db = client.db("ynov-cloud");

  switch (req.method) {

    case "PATCH":

      const like = await db.collection("likes").findOne({idTMDB: idMovie});
      let resMongo, data;

      if (like) {
         resMongo = await db.collection("likes").updateOne(
           {idTMDB: idMovie},
           { $inc: { likeCounter : 1 } }
         )
         data = {
           action: 'likeCounter updated',
           idMovie: idMovie,
           matchedCount: resMongo.matchedCount,
           modifiedCount: resMongo.modifiedCount
         }
         res.status(201).json({ status: 201, data: data });
      } else {
        resMongo = await db.collection("likes").insertOne(
          {idTMDB: idMovie, likeCounter: 0}
        )
        data = {
          action: 'likeCounter updated',
          idMovie: idMovie,
          insertedId: resMongo.insertedId
        }
        res.status(201).json({ status: 201, data: data });
      }

      break;

    case "GET":

      const likes = await db.collection("likes").findOne({idTMDB: idMovie});
      res.json({ status: 200, data: { likes: likes } });
      break;

    default:
      res.status(405).json({ status: 405, error: "Method Not Allowed" });
  }
}
```

- Voici un exemple de test associé:

``` javascript
// __tests__/api/likes.api.test.js

import handler from "../../pages/api/movies/[idMovie]/likes";
import { createMocks } from "node-mocks-http";

jest.mock("../../lib/mongodb", () => ({
    __esModule: true,
    default: {
        db: jest.fn(() => ({
            collection: jest.fn(() => ({
                findOne: jest.fn(async () => ({ idTMDB: 123, likeCounter: 5 })),
                updateOne: jest.fn(async () => ({ matchedCount: 0, modifiedCount: 0 })),
                insertOne: jest.fn(async (data) => ({ insertedId: data.idTMDB })),
            })),
        })),
    },
}));

describe("/api/likes API", () => {
    it("should increment like counter for an existing movie", async () => {
        const { req, res } = createMocks({
            method: "PATCH",
            query: { idMovie: 123 },
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(201);
        expect(res._getJSONData().data.action).toBe("likeCounter updated");
    });

    it("should create like counter for a new movie", async () => {
        const { req, res } = createMocks({
            method: "PATCH",
            query: { idMovie: 456 },
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(201);
        expect(res._getJSONData().data.action).toBe("likeCounter updated");
    });

    it("should get like counter for a movie", async () => {
        const { req, res } = createMocks({
            method: "GET",
            query: { idMovie: 123 },
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(200);
        expect(res._getJSONData().data.likes).toBeDefined();
    });

    it("should return 405 if method is not allowed", async () => {
        const { req, res } = createMocks({
            method: "PUT",
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(405);
    });
});
```

## Couverture de code

``` bash
npm run test:coverage
```

- Information directement sur le terminal
- Page HTML disponible dans ```coverage/lcov-report/index.html```
