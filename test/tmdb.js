/* global beforeEach, context, describe, it */

const Tmdb = require('../lib');
const expect = require('chai').expect;
const nock = require('nock');

nock.disableNetConnect();

const apiMock  = nock('https://api.themoviedb.org/3');

describe('Tmdb', () => {
    const apiKey = 'XXX';

    describe('#constructor()', () => {
        context('when no api key is given', () => {

            it('throws an error', function() {
                expect(() => { new Tmdb(); })
                    .to.throw('Missing api key');
            });

        });
    });

    describe('#searchMovie()', () => {
        const tmdb = new Tmdb({ apiKey });

        beforeEach(() => {
            apiMock.get('/search/movie')
                   .query({ api_key: apiKey, query: 'foo' })
                   .reply(200, '{ "page": 1, "results": []}');
        });

        context('when no query is given', () => {
            it('throws an error', function() {
                expect(() => tmdb.searchMovie())
                    .to.throw('Missing query');
            });
        });

        it('parses the response', function() {
            return tmdb.searchMovie('foo')
                .then(response => expect(response).to.be.an('object'));
        });
    });

    describe('#discoverMovie()', () => {
        const tmdb = new Tmdb({ apiKey });

        beforeEach(() => {
            apiMock.get('/discover/movie')
                   .query({ api_key: apiKey })
                   .reply(200, '{ "page": 1, "results": []}');
        });

        it('parses the response', function() {
            return tmdb.discoverMovie()
                .then(response => expect(response).to.be.an('object'));
        });
    });

    describe('#find()', () => {
        const tmdb = new Tmdb({ apiKey });

        beforeEach(() => {
            apiMock.get('/find/42')
                   .query({ api_key: apiKey })
                   .reply(200, '{ "movie_results": [] }');
        });

        context('when no external id is given', () => {
            it('throws an error', function() {
                expect(() => tmdb.find())
                    .to.throw('Missing external id');
            });
        });

        context('when no external source is given', () => {
            it('throws an error', function() {
                expect(() => tmdb.find(42))
                    .to.throw('Missing external source');
            });
        });

        context('when an invalid external source is given', () => {
            it('throws an error', function() {
                expect(() => tmdb.find(42, 'foo_id'))
                    .to.throw('Unknown external source');
            });
        });

        it('parses the response', function() {
            return tmdb.find(42, 'imdb_id')
                .then(response => expect(response).to.be.an('object'));
        });
    });
});
