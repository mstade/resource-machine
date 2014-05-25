'use strict';

// var crypto = require('crypto');
var supertest = require('supertest');
var bunyan = require('bunyan');

var machine = require('../../lib');
// var error = require('../../lib/errors');
var ResourceHelper = require('../resource_helper');

var port;
function url(path) {
	return 'http://localhost:' + port + (path || '');
}

var request, resource, server = null;


describe('Server default resource', function () {

	before(function (done) {
		var log = bunyan.createLogger({name: 'testing', level: 'fatal'});
		server = machine.createServer({log: log});
		resource = new ResourceHelper(server);
		server.listen(0, function () {
			port = server.server.address().port;
			request = supertest(url());
			done();
		});
	});

	after(function (done) {
		server.close(done);
	});

	beforeEach(function () {
		resource.reset();
	});

	describe('GET requests', function () {

		it('should respond normally', function (done) {
			request.get('/')
				.expect(200, done);
		});

		it('should respond with application/json and {}', function (done) {
			resource.set('toJSON', null, '{}');
			request.get('/')
				.expect('Content-Type', /json/)
				.expect(200, '{}', done);
		});

		it('should error when requested text/xml', function (done) {
			request.get('/')
				.set('Accept', 'text/xml')
				.expect('Content-Type', 'application/json')
				.expect(406, done);
		});

	});



});
