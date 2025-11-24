"use strict";
const request = require('supertest');
const app = require('../src/index');

describe('App endpoints', () => {
  it('GET / should return 200 and greeting', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toMatch(/DevOps Sample App/);
  });

  it('GET /health should return status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });
});
