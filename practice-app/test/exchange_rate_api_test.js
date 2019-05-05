process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const Currency = require('../models/currency').Currency;
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

describe('Exchange rate api cache test', () => {
    const api_url = '/api/exchangerate';
    beforeEach(() => {
        return Currency.deleteMany({});
    });

    it('should get /api/exchangerate cache the results', (done) => {
        const from = 'USD';
        const to = 'EUR';
        const criteria = {'from': from, 'to': to};
        Currency.find(criteria).then((result) => {
            result.should.be.a('array');
            result.length.should.be.equal(0);

            chai.request(server)
                .get(api_url + `?from=${from}&to=${to}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('to');
                    res.body.to.should.have.property(to);
                    const rate = res.body.to[to];

                    Currency.find(criteria).then((result2) => {
                        result2.should.be.a('array');
                        result2.length.should.be.equal(1);
                        result2[0].should.be.a('object');
                        result2[0].should.have.property('from');
                        result2[0]['from'].should.be.equal(from);
                        result2[0].should.have.property('to');
                        result2[0]['to'].should.be.equal(to);
                        result2[0].should.have.property('rate');
                        result2[0]['rate'].should.be.equal(rate);
                        done();
                    }).catch((err) => {
                        done(err);
                    });
                });
        });
    });
});


describe('Average Exchange rate api test', () => {
    const api_url = '/api/exchangerate/avg';

    it('should get /api/exchangerate/avg with from, to, start_date,end_date and format parameters', (done) => {
        const from = 'USD';
        const to = 'TRY';
        const start_date = '2019-04-28';
        const end_date = '2019-05-05'
        const format = 'json'

        chai.request(server)
            .get(api_url + `?from=${from}&to=${to}&start_date=${start_date}&end_date=${end_date}&format=${format}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('from');
                res.body.from.should.be.equal(from);
                res.body.should.have.property('to');
                res.body.to.should.be.equal(to);
                res.body.should.have.property('start_date');
                res.body.start_date.should.be.equal(start_date);
                res.body.should.have.property('end_date');
                res.body.end_date.should.be.equal(end_date);
                done();
            });
    });

    it('should get /api/exchangerate/avg with no parameters fail', (done) => {
        chai.request(server)
            .get(api_url)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('error');
                res.body.error.should.be.equal('\'to\' parameter cannot be empty!');
                done();
            });
    });

    it('should get /api/exchangerate/avg with start_date greater than end_date fail', (done) => {
        const from = 'USD';
        const to = 'EUR';
        const  end_date = '2019-04-28';
        const start_date = '2019-05-05'
        const format = 'json'
        chai.request(server)
            .get(api_url + `?from=${from}&to=${to}&start_date=${start_date}&end_date=${end_date}&format=${format}`)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('error');
                res.body.error.should.be.equal('start_date cannot be greater than end_date');
                done();
            });
    });

});