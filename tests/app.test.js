const request = require('supertest');
const app = require('../src/app');

describe('Node App Tests', () => {

    // Test 1 - Home route
    test('GET / should return hello message', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Hello from Node.js App!');
        expect(res.body.status).toBe('running');
    });

    // Test 2 - Health check
    test('GET /health should return ok', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toBe(200);
        expect(res.body.health).toBe('ok');
    });

    // Test 3 - Add endpoint
    test('GET /add?a=2&b=3 should return 5', async () => {
        const res = await request(app).get('/add?a=2&b=3');
        expect(res.statusCode).toBe(200);
        expect(res.body.result).toBe(5);
    });

});