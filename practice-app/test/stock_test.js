process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();

chai.use(chaiHttp);

describe('Stock Indexes api test', () => {
    const api_url = '/stock';

    it('should get /stock with function, symbol and interval paramaters', (done) => {
		const func = 'TIME_SERIES_INTRADAY';
		const symbol = 'MSFT';
		const interval = '5min';

		chai.request(server)
        	.get(api_url + `?function=${func}&symbol=${symbol}&interval=${interval}`)
        	.end((err, res) => {
            	res.should.have.status(200);
            	res.body.should.be.a('object');
            	// Check Meta Data field and its properties
            	res.body.should.have.property('Meta Data');
            	res.body['Meta Data'].should.have.property('1. Information');
            	res.body['Meta Data'].should.have.property('2. Symbol');
            	res.body['Meta Data']['2. Symbol'].should.be.equal(symbol);
            	res.body['Meta Data'].should.have.property('3. Last Refreshed');
            	const last_refreshed = res.body['Meta Data']['3. Last Refreshed']
            	res.body['Meta Data'].should.have.property('4. Interval');
            	res.body['Meta Data']['4. Interval'].should.be.equal(interval);

            	res.body.should.have.property('Time Series (5min)');
            	res.body['Time Series (5min)'][last_refreshed].should.have.property('1. open');
            	res.body['Time Series (5min)'][last_refreshed].should.have.property('2. high');
            	res.body['Time Series (5min)'][last_refreshed].should.have.property('3. low');
            	res.body['Time Series (5min)'][last_refreshed].should.have.property('4. close');
            	res.body['Time Series (5min)'][last_refreshed].should.have.property('5. volume');
            	done();
       	 	});
    });


    it('should get /stock with no function parameter fail', (done) => {
		const interval = '5min';
		const symbol = 'MSFT'

       chai.request(server)
           .get(api_url + `?symbol=${symbol}&interval=${interval}`)
           .end((err, res) => {

           	  // TODO Modify here according to error	

              done();
           });
    }); 

    it('should get /stock with no symbol parameter fail', (done) => {
       	const func = 'TIME_SERIES_INTRADAY';
		const interval = '5min';

       chai.request(server)
           .get(api_url + `?function=${func}&interval=${interval}`)
           .end((err, res) => {

           	  // TODO Modify here according to error	

              done();
           });
    });

    it('should get /stock with no interval parameter fail', (done) => {
		const func = 'TIME_SERIES_INTRADAY';
		const symbol = 'MSFT';

       chai.request(server)
           .get(api_url + `?function=${func}&symbol=${symbol}`)
           .end((err, res) => {

           	  // TODO Modify here according to error	

              done();
           });
    });

    it('should get /stock with no parameters fail', (done) => {
        chai.request(server)
            .get(api_url)
            .end((err, res) => {

            	// TODO Modify here according to error

                done();
            });
    });


    it('should get /stock with invalid function parameter fail', (done) => {
		const func = 'TIME_SERIES_INVALID';
		const symbol = 'MSFT';
		const interval = '5min';

       chai.request(server)
           .get(api_url + `?function=${func}&symbol=${symbol}&interval=${interval}`)
           .end((err, res) => {

           	  // TODO Modify here according to error	

              done();
           });
    }); 


    it('should get /stock with invalid interval parameter fail', (done) => {
		const func = 'TIME_SERIES_INTRADAY';
		const symbol = 'MSFT';
		const interval = '45min';

       chai.request(server)
           .get(api_url + `?function=${func}&symbol=${symbol}&interval=${interval}`)
           .end((err, res) => {

           	  // TODO Modify here according to error	

              done();
           });
    }); 

    it('should get /stock with invalid symbol parameter fail', (done) => {
		const func = 'TIME_SERIES_INTRADAY';
		const symbol = 'INVALID';
		const interval = '5min';

       chai.request(server)
           .get(api_url + `?function=${func}&symbol=${symbol}&interval=${interval}`)
           .end((err, res) => {

           	  // TODO Modify here according to error	

              done();
           });
    }); 
});