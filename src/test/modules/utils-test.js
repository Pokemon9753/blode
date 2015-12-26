var common = require("../common");
var expect = common.expect;
var utils = common.utils;
var config = common.config;
var postsData = common.postsData;

describe('utils', function() {

    describe('#mergeJSON()', function() {

        it('should merge two JSON objects into one', function() {

            var prop1 = 'prop1';
            var prop2 = 'prop2';

            var obj1 = {
                prop1 : prop1
            };

            var obj2 = {
                prop2 : prop2
            };

            var merged = utils.mergeJSON(obj1, obj2);

            expect(merged.prop1).to.be.equal(prop1);
            expect(merged.prop2).to.be.equal(prop2);
        });
    });

    describe('#getPosts()', function() {

        it('should find posts and return its contents', function(done) {

            var expectedPosts = postsData.posts();

            utils.getPosts(config, function(err, actualPosts) {

                expect(actualPosts.length).to.be.equal(expectedPosts.length);
                expect(JSON.stringify(actualPosts)).to.be.equal(JSON.stringify(expectedPosts));

                done();
            });
        });
    });

    describe('#extractIsoDate()', function() {

        it('should convert string dates to ISO format', function() {

            var tests = [
                  { value: 'OCT 18, 2015', expected: new Date('2015-10-18') },
                  { value: 'Nov 08, 2015', expected: new Date('2015-11-08') },
                  { value: 'Jan 8, 2014', expected: new Date('2014-01-08') },
                  { value: 'DEC 25, 2013', expected: new Date('2013-12-25') }
            ];

            tests.forEach(function(test){
                var actual = new Date(utils.extractIsoDate(test.value));
                expect(actual).to.equalDate(test.expected);
            });
        });
    });

    describe('#extractLongDate()', function() {

        it('should convert string dates to long format', function() {

            var tests = [
                  { value: 'Nov 08, 2015', expected: 'Sun, 08 Nov 2015 00:00:00 +0000' },
                  { value: 'Jan 8, 2014', expected: 'Wed, 08 Jan 2014 00:00:00 +0000' },
                  { value: 'DEC 25, 2013', expected: 'Wed, 25 Dec 2013 00:00:00 +0000' }
            ];

            tests.forEach(function(test){
                var actual = utils.extractLongDate(test.value);
                expect(actual).to.equal(test.expected);
            });
        });
    });

    describe('#renderWithJade()', function() {
        // already tested when called by testMarkdowner and others
    });

    describe('#replaceFileContent()', function() {

        it('should replace a string inside a file', function(done) {

            var fileName = common.replaceTest.getPath();
            var originals = ['test-string-before'];
            var replacements = ['test-string-after'];

            utils.replaceFileContent(fileName, originals, replacements, function(err) {

                common.readOneFile(fileName, function(err, contents) {

                    expect(contents).to.equal(replacements[0]);

                    // fix the file to its original contents
                    utils.replaceFileContent(fileName, replacements, originals, function(err) {
                        done();
                    });
                });
            });
        });
    });
});
