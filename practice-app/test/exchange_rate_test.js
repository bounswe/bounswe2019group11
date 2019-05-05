process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();

chai.use(chaiHttp);

describe('Exchange rate view test', () => {
    it('should get /exchangerate', (done) => {
        chai.request(server)
            .get('/exchangerate')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.have.property('text');
                res.text.should.have.string('<option value="TRY">Turkey Lira</option>');
                done();
            });
    });
});
