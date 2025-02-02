import { OpenAPIHono } from '@hono/zod-openapi';
import { apiReference } from '@scalar/hono-api-reference';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import { authRoute } from '@auth/route';
import { citiesRoute } from '@city/route';
import { placesRoute } from '@place/route';
import { usersRoute } from '@user/route';
import { menuItemsRoute } from '@menuItem/route';
import { menuItemImagesRoute } from '@menuItemImages/route';
import { searchRoute } from '@search/route';
import { reviewRoute } from '@review/route';
import { menuItemReviewsRoute } from '@menuReview/route';
import { userPlaceRoute } from '@userPlace/route';

const app = new OpenAPIHono();

app.use(logger());
app.use(
  cors({
    origin: '*',
  })
);

app.get(
  '/',
  apiReference({
    pageTitle: 'FeastFind API',
    theme: 'default',
    spec: {
      url: '/openapi.json',
    },
  })
);

app.doc('/openapi.json', {
  openapi: '3.1.0',
  info: {
    version: '0.0.1',
    title: 'FeastFind API',
    description: 'API for FeastFind.com',
  },
});

app.openAPIRegistry.registerComponent(
  'securitySchemes',
  'AuthorizationBearer',
  {
    type: 'http',
    scheme: 'bearer',
    in: 'header',
    description: 'Bearer token',
  }
);

app.route('/users', usersRoute);
app.route('/cities', citiesRoute);
app.route('/auth', authRoute);
app.route('/places', placesRoute);
app.route('/menu-items', menuItemsRoute);
app.route('/menu-item-images', menuItemImagesRoute);
app.route('/menu-items', menuItemReviewsRoute);
app.route('/search', searchRoute);
app.route('/reviews', reviewRoute);
app.route('/userPlace', userPlaceRoute);

export default app;
