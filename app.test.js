'use strict';

const request = require('supertest');
const app = require('./app');
var token;
var savedProduct;
var addedCartItem;
var placedOrder;
describe('Testing All APIs', () => {

// User APIs Test Cases //

    test('POST /api/users/signup succeeds', (done) =>{
        const body = {
            "f_name": "Imad",
            "l_name": "Al Refai",
            "email":"imadalrefai100@gmail.com",
            "username":"imad100",
            "phone":506969471,
            "password":"12345",
            "address":"street 27a"
        };
        return request(app)
        .post('/api/users/signup')
        .send(body)
        .set('Accept', 'application/json')
        .expect(201).end((err,res)=>{
            if (err) return done(err);
            return done();    
        })
    });

    test('POST /api/users/signin succeeds', (done) =>{
        const body = {'username':'imad100', 'password':'12345'};
        return request(app)
        .post('/api/users/signin')
        .send(body)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200).end((err,res)=>{
            if (err) return done(err);
            token = res.body.accessToken;
            return done();    
        })
    });


    test('POST /api/users/changePW',(done)=>{
        const body = {'newPW':'123456', 'oldPW':'12345'};
        return request(app)
        .post('/api/users/changePW')
        .send(body)
        .set('Accept', 'application/json')
        .set('x-access-token',token)
        .expect(204).end((err,res)=>{
            if (err) return done(err);
            return done();    
        })
    })

    test('GET /api/users/forgetPW/:email',(done)=>{
        return request(app)
        .get('/api/users/forgetPW/imadalrefai100@gmail.com')
        .expect(204).end((err,res)=>{
            if (err) return done(err);
            return done();    
        })
    })


    // Product APIs Test Cases //

    test('GET /api/products/getActiveProducts succeeds', (done) => {
        return request(app)
            .get('/api/products/getActiveProducts')
            .expect('Content-Type', /json/)
            .expect(200).end((err, res) => {
                if (err) return done(err);
                return done();
            });
    });

    test('POST /api/users/signin succeeds', (done) => {
        const body = { 'username': 'admin', 'password': 'admin' };
        return request(app)
            .post('/api/users/signin')
            .send(body)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200).end((err, res) => {
                if (err) return done(err);
                token = res.body.accessToken;
                return done();
            })
    });

    test('GET /api/products/getAllProducts succeeds', (done) => {
        return request(app)
            .get('/api/products/getAllProducts')
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
            .expect(200).end((err, res) => {
                if (err) return done(err);
                return done();
            });
    });

    test('POST /api/products/createProduct succeeds', (done) => {
        const body = {
            "name": "Apple",
            "category": "Vegetables",
            "quantity": 1,
            "units": "kg",
            "price": 2,
            "image": "data:image/jpeg;base64,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"
        };
        return request(app)
            .post('/api/products/createProduct')
            .send(body)
            .set('Accept', 'application/json')
            .set('x-access-token', token)
            .expect(201).end((err, res) => {
                if (err) return done(err);
                savedProduct = res.body.data
                return done();
            })
    });


    test('PUT /api/products/updateProduct succeeds', (done) => {
        const body = {
            "price": 20,
            "id":savedProduct.id
        };
        return request(app)
            .put('/api/products/updateProduct')
            .send(body)
            .set('Accept', 'application/json')
            .set('x-access-token', token)
            .expect(204).end((err, res) => {
                if (err) return done(err);
                return done();
            })
    });

    test('DELETE /api/products/deleteProduct succeeds', (done) => {
        return request(app)
            .delete('/api/products/deleteProduct/'+savedProduct.id)
            .set('x-access-token', token)
            .expect(204).end((err, res) => {
                if (err) return done(err);
                return done();
            })
    });

        // Cart APIs Test Cases //

    test('POST /api/users/signin succeeds', (done) => {
        const body = { 'username': 'emad', 'password': '12345' };
        return request(app)
            .post('/api/users/signin')
            .send(body)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200).end((err, res) => {
                if (err) return done(err);
                token = res.body.accessToken;
                return done();
            })
    });


    test('POST /api/cart/addMultipleCartItems succeeds', (done) => {
        const body = [
            {
                "productId": "a01e6364-f4bf-499b-a848-dc27e4f82922",
                "quantity": 3
            },
            {
                "productId": "87154922-48af-4941-a59b-4f32ca409223",
                "quantity": 2
            },
            {
                "productId": "b10f5aee-15ed-4e1e-9f2d-4d60fb6b314e",
                "quantity": 4
            }
        ];
        return request(app)
            .post('/api/cart/addMultipleCartItems')
            .send(body)
            .set('Accept', 'application/json')
            .set('x-access-token', token)
            .expect(201).end((err, res) => {
                if (err) return done(err);
                return done();
            })
    });


    test('POST /api/cart/addCartItem succeeds', (done) => {
        const body = {
            "productId": "720a64c8-a5c5-4038-9854-68ca88992093",
            "quantity": 3
        }
        return request(app)
            .post('/api/cart/addCartItem')
            .send(body)
            .set('Accept', 'application/json')
            .set('x-access-token', token)
            .expect(201).end((err, res) => {
                if (err) return done(err);
                addedCartItem = res.body.data;
                return done();
            })
    });


    test('PUT /api/cart/updateCartItemCount/:cid/:action succeeds', (done) => {
        return request(app)
            .put('/api/cart/updateCartItemCount/' + addedCartItem.id + '/inc')
            .set('x-access-token', token)
            .expect(204).end((err, res) => {
                if (err) return done(err);
                return done();
            })
    });


    test('DELETE /api/cart/deleteCartItem succeeds', (done) => {
        return request(app)
            .delete('/api/cart/deleteCartItem?cid='+addedCartItem.id)
            .set('x-access-token', token)
            .expect(204).end((err, res) => {
                if (err) return done(err);
                return done();
            })
    });

    test('GET /api/cart/getCartItemsByUid succeeds', (done) => {
        return request(app)
            .get('/api/cart/getCartItemsByUid')
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
            .expect(200).end((err, res) => {
                if (err) return done(err);
                return done();
            });
    });


    // Orders APIs Test Cases //


    test('POST /api/users/signin succeeds', (done) => {
        const body = { 'username': 'admin', 'password': 'admin' };
        return request(app)
            .post('/api/users/signin')
            .send(body)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200).end((err, res) => {
                if (err) return done(err);
                token = res.body.accessToken;
                return done();
            })
    });


     test('GET /api/orders/getAllOrders succeeds', (done) => {
        return request(app)
            .get('/api/orders/getAllOrders')
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
            .expect(200).end((err, res) => {
                if (err) return done(err);
                return done();
            });
    });


    test('POST /api/users/signin succeeds', (done) => {
        const body = { 'username': 'emad', 'password': '12345' };
        return request(app)
            .post('/api/users/signin')
            .send(body)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200).end((err, res) => {
                if (err) return done(err);
                token = res.body.accessToken;
                return done();
            })
    });


     test('POST /api/orders/placeNewOrder succeeds', (done) => {
        return request(app)
            .post('/api/orders/placeNewOrder')
            .set('x-access-token', token)
            .expect(201).end((err, res) => {
                if (err) return done(err);
                placedOrder = res.body.data;
                return done();
            })
    });

    test('GET /api/orders/getOrdersByUid succeeds', (done) => {
        return request(app)
            .get('/api/orders/getOrdersByUid')
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
            .expect(200).end((err, res) => {
                if (err) return done(err);
                return done();
            });
    });


    test('GET /api/orders/getOrderById/:oid succeeds', (done) => {
        return request(app)
            .get('/api/orders/getOrderById/'+placedOrder.id)
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
            .expect(200).end((err, res) => {
                if (err) return done(err);
                return done();
            });
    });

    test('PUT /api/orders/updateOrderStatus succeeds', (done) => {
        const body = {
            "status": 'cancelled',
            "id":placedOrder.id
        };
        return request(app)
            .put('/api/orders/updateOrderStatus')
            .send(body)
            .set('Accept', 'application/json')
            .set('x-access-token', token)
            .expect(204).end((err, res) => {
                if (err) return done(err);
                return done();
            })
    });


});




