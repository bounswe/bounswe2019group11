process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();

chai.use(chaiHttp);

describe('Register view test', () => {
    it('should get /register', (done) => {
        chai.request(server)
            .get('/register')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.have.property('text');
                res.text.should.have.string('<form action="/register" method="post">');
                res.text.should.have.string('<input type="text" name="name">');
                res.text.should.have.string('<input type="email" name="email">');
                res.text.should.have.string('<input type="text" name="username">');
                res.text.should.have.string('<input type="password" name="password">');
                res.text.should.have.string('<input type="submit" style="width:100%; font-weight:bold" value="Register">');
                done();
            });
    });
});
