const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();

chai.use(chaiHttp);

describe('Exchange rate api test', () => {
    const api_url = '/api/exchangerate';

    it('should get /api/exchangerate with from and to parameters', (done) => {
        const from = 'USD';
        const to = 'EUR';

        chai.request(server)
            .get(api_url + `?from=${from}&to=${to}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('from');
                res.body.from.should.be.equal(from);
                res.body.should.have.property('to');
                res.body.to.should.have.property(to);
                done();
            });
    });

    it('should get /api/exchangerate with just to parameter', (done) => {
       const to = 'EUR';

       chai.request(server)
           .get(api_url + `?to=${to}`)
           .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('from');
              res.body.from.should.be.equal('TRY');
              res.body.should.have.property('to');
              res.body.to.should.have.property(to);
              done();
           });
    });

    it('should get /api/exchangerate with no parameters fail', (done) => {
        chai.request(server)
            .get(api_url)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('error');
                res.body.error.should.be.equal('\'to\' parameter cannot be empty!');
                done();
            });
    });

    it('should get /api/exchangerate with empty parameters fail', (done) => {
        chai.request(server)
            .get(api_url + '?from=&to=')
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('error');
                res.body.error.should.be.equal('\'to\' parameter cannot be empty!');
                done();
            });
    });

    it('should get /api/exchangerate with just from parameter fail', (done) => {
        chai.request(server)
            .get(api_url + '?from=USD')
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('error');
                res.body.error.should.be.equal('\'to\' parameter cannot be empty!');
                done();
            });
    });

    it('should get /api/exchangerate with invalid symbols fail', (done) => {
        chai.request(server)
            .get(api_url + '?from=INVA&to=LID')
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('error');
                res.body.error.should.be.equal('Base \'INVA\' is not supported.');
                done();
            });
    });
});
