import supertest from 'supertest';
import app from '../src/app';

describe('Testing all routes to ensure the response code is 200 and the body is json', () => {
  test('First Route', async () => {
    await supertest(app)
      .get('/t10-last-25')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    jest.setTimeout(10 * 1000);
  }, 10000);

  test('Second Route', async () => {
    await supertest(app)
      .get('/t10-last-weeks')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    jest.setTimeout(10 * 1000);
  }, 10000);

  test('Third Route', async () => {
    await supertest(app)
      .get('/t10-last-600stories')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    jest.setTimeout(40 * 1000);
  }, 40000);
});

describe('The Body Object should not contain more than 10 keys ', () => {
  test('First Route', async () => {
    const res = await supertest(app).get('/t10-last-25');
    const { body } = res;
    const responselength = Object.keys(body).length;
    expect(responselength).toBeLessThanOrEqual(10);
    jest.setTimeout(10 * 1000);
  }, 10000);

  test('Second Route', async () => {
    const res = await supertest(app).get('/t10-last-weeks');
    const { body } = res;
    const responselength = Object.keys(body).length;
    expect(responselength).toBeLessThanOrEqual(10);
    jest.setTimeout(10 * 1000);
  }, 10000);

  test('Third Route', async () => {
    const res = await supertest(app).get('/t10-last-600stories');
    const { body } = res;
    const responselength = Object.keys(body).length;
    expect(responselength).toBeLessThanOrEqual(10);
    jest.setTimeout(40 * 1000);
  }, 40000);
});
