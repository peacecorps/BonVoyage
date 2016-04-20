
// Instrumentation Header
{
    var fs = require('fs');
    var __statement_GyrAEt, __expression_LrzoNg, __block_CTwJAf;
    var store = require('/Users/colin/Desktop/Projects/Project_Delta/BonVoyage/node_modules/gulp-coverage/contrib/coverage_store.js');
    
    __statement_GyrAEt = function(i) {
        var fd = store.register('/Users/colin/Desktop/Projects/Project_Delta/BonVoyage/routes/api.js');
        fs.writeSync(fd, '{"statement": {"node": ' + i + '}},\n');
    }; 
    
    __expression_LrzoNg = function(i) {
        var fd = store.register('/Users/colin/Desktop/Projects/Project_Delta/BonVoyage/routes/api.js');
        fs.writeSync(fd, '{"expression": {"node": ' + i + '}},\n');
    }; 
    
    __block_CTwJAf = function(i) {
        var fd = store.register('/Users/colin/Desktop/Projects/Project_Delta/BonVoyage/routes/api.js');
        fs.writeSync(fd, '{"block": ' + i + '},\n');
    }; 
    __intro_aDYHs0 = function(id, obj) {
        // console.log('__intro: ', id, ', obj.__instrumented_miss: ', obj.__instrumented_miss, ', obj.length: ', obj.length);
        (typeof obj === 'object' || typeof obj === 'function') &&
            Object.defineProperty && Object.defineProperty(obj, '__instrumented_miss', {enumerable: false, writable: true});
        obj.__instrumented_miss = obj.__instrumented_miss || [];
        if ('undefined' !== typeof obj && null !== obj && 'undefined' !== typeof obj.__instrumented_miss) {
            if (obj.length === 0) {
                // console.log('interim miss: ', id);
                obj.__instrumented_miss[id] = true;
            } else {
                obj.__instrumented_miss[id] = false;
            }
        }
        return obj;
    };
    function isProbablyChainable(obj, id) {
        return obj &&
            obj.__instrumented_miss[id] !== undefined &&
            'number' === typeof obj.length;
    }
    __extro_A3KSbH = function(id, obj) {
        var fd = store.register('/Users/colin/Desktop/Projects/Project_Delta/BonVoyage/routes/api.js');
        // console.log('__extro: ', id, ', obj.__instrumented_miss: ', obj.__instrumented_miss, ', obj.length: ', obj.length);
        if ('undefined' !== typeof obj && null !== obj && 'undefined' !== typeof obj.__instrumented_miss) {
            if (isProbablyChainable(obj, id) && obj.length === 0 && obj.__instrumented_miss[id]) {
                // if the call was not a "constructor" - i.e. it did not add things to the chainable
                // and it did not return anything from the chainable, it is a miss
                // console.log('miss: ', id);
            } else {
                fs.writeSync(fd, '{"chain": {"node": ' + id + '}},\n');
            }
            obj.__instrumented_miss[id] = undefined;
        } else {
            fs.writeSync(fd, '{"chain": {"node": ' + id + '}},\n');
        }
        return obj;
    };
};
////////////////////////

// Instrumented Code
{
    __statement_GyrAEt(0);
    'use strict';
}
{
    __statement_GyrAEt(1);
    var express = (__expression_LrzoNg(2), require('express'));
}
{
    __statement_GyrAEt(3);
    var router = __extro_A3KSbH(4, __intro_aDYHs0(4, express).Router());
}
{
    __statement_GyrAEt(5);
    var User = (__expression_LrzoNg(6), require((__expression_LrzoNg(7), (__expression_LrzoNg(8), __dirname) + '/../models/user')));
}
{
    __statement_GyrAEt(9);
    var Request = (__expression_LrzoNg(10), require((__expression_LrzoNg(11), (__expression_LrzoNg(12), __dirname) + '/../models/request')));
}
{
    __statement_GyrAEt(13);
    var Token = (__expression_LrzoNg(14), require((__expression_LrzoNg(15), (__expression_LrzoNg(16), __dirname) + '/../models/token')));
}
{
    __statement_GyrAEt(17);
    var Access = (__expression_LrzoNg(18), require((__expression_LrzoNg(19), (__expression_LrzoNg(20), __dirname) + '/../config/access')));
}
{
    __statement_GyrAEt(21);
    var fs = (__expression_LrzoNg(22), require('fs'));
}
{
    __statement_GyrAEt(23);
    var randtoken = (__expression_LrzoNg(24), require('rand-token'));
}
{
    __statement_GyrAEt(25);
    var countryFilePath = (__expression_LrzoNg(26), (__expression_LrzoNg(27), __dirname) + '/../public/data/countryList.json');
}
{
    __statement_GyrAEt(28);
    var countryListFile = __extro_A3KSbH(29, __intro_aDYHs0(29, fs).readFileSync(countryFilePath, 'utf8'));
}
{
    __statement_GyrAEt(30);
    var countriesDictionary = __extro_A3KSbH(31, __intro_aDYHs0(31, JSON).parse(countryListFile));
}
{
    __statement_GyrAEt(32);
    var helpers = (__expression_LrzoNg(33), require('./helpers'));
}
{
    __statement_GyrAEt(34);
    var DateOnly = (__expression_LrzoNg(35), require('dateonly'));
}
{
    __statement_GyrAEt(36);
    var Converter = (__expression_LrzoNg(37), require('csvtojson')).Converter;
}
{
    __statement_GyrAEt(38);
    router.handleRequestId = function (req, res, next) {
        __block_CTwJAf(0);
        {
            __statement_GyrAEt(39);
            var requestId = __extro_A3KSbH(40, __intro_aDYHs0(40, req).param('requestId'));
        }
        {
            __statement_GyrAEt(41);
            __extro_A3KSbH(42, __intro_aDYHs0(42, helpers).getRequests(req, res, {
                _id: requestId
            }, function (err, requests) {
                __block_CTwJAf(1);
                if (__expression_LrzoNg(43), err) {
                    __block_CTwJAf(2);
                    return __expression_LrzoNg(44), (__expression_LrzoNg(45), next(err));
                } else {
                    __block_CTwJAf(3);
                    if (__expression_LrzoNg(46), requests.length > 0) {
                        __block_CTwJAf(4);
                        {
                            __statement_GyrAEt(47);
                            req.request = requests[0];
                        }
                        return __expression_LrzoNg(48), (__expression_LrzoNg(49), next());
                    } else {
                        __block_CTwJAf(5);
                        return __expression_LrzoNg(50), (__expression_LrzoNg(51), next(new Error('Request not found.')));
                    }
                }
            }));
        }
    };
}
{
    __statement_GyrAEt(52);
    router.getRequests = function (req, res) {
        __block_CTwJAf(6);
        {
            __statement_GyrAEt(53);
            __extro_A3KSbH(54, __intro_aDYHs0(54, helpers).getRequests(req, res, undefined, function (err, requests) {
                __block_CTwJAf(7);
                if (__expression_LrzoNg(55), err) {
                    __block_CTwJAf(8);
                    {
                        __statement_GyrAEt(56);
                        __extro_A3KSbH(57, __intro_aDYHs0(57, console).error(err));
                    }
                }
                {
                    __statement_GyrAEt(58);
                    __extro_A3KSbH(59, __intro_aDYHs0(59, res).send(requests));
                }
            }));
        }
    };
}
{
    __statement_GyrAEt(60);
    router.getPendingRequests = function (req, res) {
        __block_CTwJAf(9);
        {
            __statement_GyrAEt(61);
            __extro_A3KSbH(62, __intro_aDYHs0(62, helpers).getRequests(req, res, true, function (err, requests) {
                __block_CTwJAf(10);
                if (__expression_LrzoNg(63), err) {
                    __block_CTwJAf(11);
                    {
                        __statement_GyrAEt(64);
                        __extro_A3KSbH(65, __intro_aDYHs0(65, console).error(err));
                    }
                }
                {
                    __statement_GyrAEt(66);
                    __extro_A3KSbH(67, __intro_aDYHs0(67, res).send(requests));
                }
            }));
        }
    };
}
{
    __statement_GyrAEt(68);
    router.getPastRequests = function (req, res) {
        __block_CTwJAf(12);
        {
            __statement_GyrAEt(69);
            __extro_A3KSbH(70, __intro_aDYHs0(70, helpers).getRequests(req, res, false, function (err, requests) {
                __block_CTwJAf(13);
                if (__expression_LrzoNg(71), err) {
                    __block_CTwJAf(14);
                    {
                        __statement_GyrAEt(72);
                        __extro_A3KSbH(73, __intro_aDYHs0(73, console).error(err));
                    }
                }
                {
                    __statement_GyrAEt(74);
                    __extro_A3KSbH(75, __intro_aDYHs0(75, res).send(requests));
                }
            }));
        }
    };
}
{
    __statement_GyrAEt(76);
    router.getUsers = function (req, res) {
        __block_CTwJAf(15);
        {
            __statement_GyrAEt(77);
            var maxAccess = (__expression_LrzoNg(78), parseInt(req.query.maxAccess));
        }
        if (__expression_LrzoNg(79), isNaN(maxAccess)) {
            __block_CTwJAf(16);
            {
                __statement_GyrAEt(80);
                maxAccess = Access.ADMIN;
            }
        }
        {
            __statement_GyrAEt(81);
            var minAccess = (__expression_LrzoNg(82), parseInt(req.query.minAccess));
        }
        if (__expression_LrzoNg(83), isNaN(minAccess)) {
            __block_CTwJAf(17);
            {
                __statement_GyrAEt(84);
                minAccess = Access.VOLUNTEER;
            }
        }
        {
            __statement_GyrAEt(85);
            __extro_A3KSbH(86, __intro_aDYHs0(86, helpers).getUsers({
                maxAccess: maxAccess,
                minAccess: minAccess,
                countryCode: (__expression_LrzoNg(89), req.user.access == Access.VOLUNTEER) ? (__expression_LrzoNg(87), req.user.countryCode) : (__expression_LrzoNg(88), undefined)
            }, function (err, users) {
                __block_CTwJAf(18);
                if (__expression_LrzoNg(90), err) {
                    __block_CTwJAf(19);
                    {
                        __statement_GyrAEt(91);
                        __extro_A3KSbH(92, __intro_aDYHs0(92, console).error(err));
                    }
                }
                {
                    __statement_GyrAEt(93);
                    __extro_A3KSbH(94, __intro_aDYHs0(94, res).send(users));
                }
            }));
        }
    };
}
{
    __statement_GyrAEt(95);
    router.getWarnings = function (req, res) {
        __block_CTwJAf(20);
        {
            __statement_GyrAEt(96);
            __extro_A3KSbH(97, __intro_aDYHs0(97, helpers).fetchWarnings(function (err, requests) {
                __block_CTwJAf(21);
                if (__expression_LrzoNg(98), err) {
                    __block_CTwJAf(22);
                    {
                        __statement_GyrAEt(99);
                        __extro_A3KSbH(100, __intro_aDYHs0(100, console).error(err));
                    }
                }
                {
                    __statement_GyrAEt(101);
                    __extro_A3KSbH(102, __intro_aDYHs0(102, res).send(requests));
                }
            }));
        }
    };
}
function validateRequestSubmission(req, res, failureRedirect, cb) {
    __block_CTwJAf(23);
    {
        __statement_GyrAEt(103);
        var userId = req.user._id;
    }
    if (__expression_LrzoNg(104), req.user.access >= Access.STAFF) {
        __block_CTwJAf(24);
        {
            __statement_GyrAEt(105);
            userId = req.body.volunteer;
        }
        if (__expression_LrzoNg(106), (__expression_LrzoNg(107), (__expression_LrzoNg(108), userId) === (__expression_LrzoNg(109), undefined)) || (__expression_LrzoNg(110), (__expression_LrzoNg(111), userId) === '')) {
            __block_CTwJAf(25);
            {
                __statement_GyrAEt(112);
                req.session.submission = req.body;
            }
            {
                __statement_GyrAEt(113);
                __extro_A3KSbH(114, __intro_aDYHs0(114, req).flash('submissionFlash', {
                    text: 'You must select a volunteer to submit this request for.',
                    class: 'danger'
                }));
            }
            {
                __statement_GyrAEt(115);
                __extro_A3KSbH(116, __intro_aDYHs0(116, res).end(__extro_A3KSbH(117, __intro_aDYHs0(117, JSON).stringify({
                    redirect: failureRedirect
                }))));
            }
            return __expression_LrzoNg(118), (__expression_LrzoNg(119), cb(null));
        }
    }
    {
        __statement_GyrAEt(120);
        var staffId = req.body.staff;
    }
    if (__expression_LrzoNg(121), (__expression_LrzoNg(122), (__expression_LrzoNg(123), staffId) === (__expression_LrzoNg(124), undefined)) || (__expression_LrzoNg(125), (__expression_LrzoNg(126), staffId) === '')) {
        __block_CTwJAf(26);
        {
            __statement_GyrAEt(127);
            req.session.submission = req.body;
        }
        {
            __statement_GyrAEt(128);
            __extro_A3KSbH(129, __intro_aDYHs0(129, req).flash('submissionFlash', {
                text: 'You must select a staff member to assign this leave request to.',
                class: 'danger'
            }));
        }
        {
            __statement_GyrAEt(130);
            __extro_A3KSbH(131, __intro_aDYHs0(131, res).end(__extro_A3KSbH(132, __intro_aDYHs0(132, JSON).stringify({
                redirect: failureRedirect
            }))));
        }
        return __expression_LrzoNg(133), (__expression_LrzoNg(134), cb(null));
    }
    {
        __statement_GyrAEt(135);
        __extro_A3KSbH(136, __intro_aDYHs0(136, helpers).getUsers({
            user: {
                _id: userId
            }
        }, function (err, volunteers) {
            __block_CTwJAf(27);
            if (__expression_LrzoNg(137), err) {
                __block_CTwJAf(28);
                {
                    __statement_GyrAEt(138);
                    __extro_A3KSbH(139, __intro_aDYHs0(139, console).error(err));
                }
                {
                    __statement_GyrAEt(140);
                    req.session.submission = req.body;
                }
                {
                    __statement_GyrAEt(141);
                    __extro_A3KSbH(142, __intro_aDYHs0(142, req).flash('submissionFlash', {
                        text: (__expression_LrzoNg(143), 'An error has occrured while attempting to process your request. ' + 'Please try again later.'),
                        class: 'danger'
                    }));
                }
                {
                    __statement_GyrAEt(144);
                    __extro_A3KSbH(145, __intro_aDYHs0(145, res).end(__extro_A3KSbH(146, __intro_aDYHs0(146, JSON).stringify({
                        redirect: failureRedirect
                    }))));
                }
            } else if (__expression_LrzoNg(147), volunteers.length > 0) {
                __block_CTwJAf(29);
                {
                    __statement_GyrAEt(148);
                    __extro_A3KSbH(149, __intro_aDYHs0(149, helpers).getUsers({
                        user: {
                            _id: staffId
                        }
                    }, function (err, staff) {
                        __block_CTwJAf(30);
                        if (__expression_LrzoNg(150), err) {
                            __block_CTwJAf(31);
                            {
                                __statement_GyrAEt(151);
                                __extro_A3KSbH(152, __intro_aDYHs0(152, console).error(err));
                            }
                            {
                                __statement_GyrAEt(153);
                                req.session.submission = req.body;
                            }
                            {
                                __statement_GyrAEt(154);
                                __extro_A3KSbH(155, __intro_aDYHs0(155, req).flash('submissionFlash', {
                                    text: (__expression_LrzoNg(156), 'An error has occrured while attempting to process your request. ' + 'Please try again later.'),
                                    class: 'danger'
                                }));
                            }
                            {
                                __statement_GyrAEt(157);
                                __extro_A3KSbH(158, __intro_aDYHs0(158, res).end(__extro_A3KSbH(159, __intro_aDYHs0(159, JSON).stringify({
                                    redirect: failureRedirect
                                }))));
                            }
                        } else if (__expression_LrzoNg(160), staff.length > 0) {
                            __block_CTwJAf(32);
                            {
                                __statement_GyrAEt(161);
                                var legs = [];
                            }
                            {
                                __statement_GyrAEt(162);
                                var countries = [];
                            }
                            for (var i = 0; __expression_LrzoNg(163), (__expression_LrzoNg(164), i) < req.body.legs.length; __expression_LrzoNg(165), i++) {
                                __block_CTwJAf(33);
                                {
                                    __statement_GyrAEt(166);
                                    var leg = req.body.legs[i];
                                }
                                {
                                    __statement_GyrAEt(167);
                                    var start = new DateOnly(leg.startDate);
                                }
                                {
                                    __statement_GyrAEt(168);
                                    var end = new DateOnly(leg.endDate);
                                }
                                if (__expression_LrzoNg(169), (__expression_LrzoNg(170), start) > (__expression_LrzoNg(171), end)) {
                                    __block_CTwJAf(34);
                                    {
                                        __statement_GyrAEt(172);
                                        req.session.submission = req.body;
                                    }
                                    {
                                        __statement_GyrAEt(173);
                                        __extro_A3KSbH(174, __intro_aDYHs0(174, req).flash('submissionFlash', {
                                            text: (__expression_LrzoNg(175), (__expression_LrzoNg(176), 'The start date you entered for leg #' + (__expression_LrzoNg(177), (__expression_LrzoNg(178), i) + 1)) + ' comes after the end date.'),
                                            class: 'danger'
                                        }));
                                    }
                                    {
                                        __statement_GyrAEt(179);
                                        __extro_A3KSbH(180, __intro_aDYHs0(180, res).end(__extro_A3KSbH(181, __intro_aDYHs0(181, JSON).stringify({
                                            redirect: failureRedirect
                                        }))));
                                    }
                                    return __expression_LrzoNg(182), (__expression_LrzoNg(183), cb(null));
                                } else if (__expression_LrzoNg(184), __extro_A3KSbH(185, __intro_aDYHs0(185, __extro_A3KSbH(186, __intro_aDYHs0(186, Object).keys(countriesDictionary))).indexOf(leg.country)) == (__expression_LrzoNg(187), -1)) {
                                    __block_CTwJAf(35);
                                    {
                                        __statement_GyrAEt(188);
                                        req.session.submission = req.body;
                                    }
                                    {
                                        __statement_GyrAEt(189);
                                        __extro_A3KSbH(190, __intro_aDYHs0(190, req).flash('submissionFlash', {
                                            text: (__expression_LrzoNg(191), (__expression_LrzoNg(192), 'The country that you have selected for leg #' + (__expression_LrzoNg(193), (__expression_LrzoNg(194), i) + 1)) + ' is not a valid country.'),
                                            class: 'danger'
                                        }));
                                    }
                                    {
                                        __statement_GyrAEt(195);
                                        __extro_A3KSbH(196, __intro_aDYHs0(196, res).end(__extro_A3KSbH(197, __intro_aDYHs0(197, JSON).stringify({
                                            redirect: failureRedirect
                                        }))));
                                    }
                                    return __expression_LrzoNg(198), (__expression_LrzoNg(199), cb(null));
                                } else if (__expression_LrzoNg(200), leg.city === '') {
                                    __block_CTwJAf(36);
                                    {
                                        __statement_GyrAEt(201);
                                        req.session.submission = req.body;
                                    }
                                    {
                                        __statement_GyrAEt(202);
                                        __extro_A3KSbH(203, __intro_aDYHs0(203, req).flash('submissionFlash', {
                                            text: (__expression_LrzoNg(204), (__expression_LrzoNg(205), 'The city that you entered for leg #' + (__expression_LrzoNg(206), (__expression_LrzoNg(207), i) + 1)) + ' is invalid'),
                                            class: 'danger'
                                        }));
                                    }
                                    {
                                        __statement_GyrAEt(208);
                                        __extro_A3KSbH(209, __intro_aDYHs0(209, res).end(__extro_A3KSbH(210, __intro_aDYHs0(210, JSON).stringify({
                                            redirect: failureRedirect
                                        }))));
                                    }
                                    return __expression_LrzoNg(211), (__expression_LrzoNg(212), cb(null));
                                } else {
                                    __block_CTwJAf(37);
                                    {
                                        __statement_GyrAEt(213);
                                        __extro_A3KSbH(214, __intro_aDYHs0(214, legs).push({
                                            startDate: start,
                                            endDate: end,
                                            city: leg.city,
                                            country: countriesDictionary[leg.country],
                                            countryCode: leg.country,
                                            hotel: leg.hotel,
                                            contact: leg.contact,
                                            companions: leg.companions,
                                            description: leg.description,
                                            addedLegCount: leg.addedLegCount
                                        }));
                                    }
                                    if (__expression_LrzoNg(215), __extro_A3KSbH(216, __intro_aDYHs0(216, countries).indexOf(leg.country)) == (__expression_LrzoNg(217), -1)) {
                                        __block_CTwJAf(38);
                                        {
                                            __statement_GyrAEt(218);
                                            __extro_A3KSbH(219, __intro_aDYHs0(219, countries).push(leg.country));
                                        }
                                    }
                                }
                            }
                            if (__expression_LrzoNg(220), req.body.counterpartApproved === 'false') {
                                __block_CTwJAf(39);
                                {
                                    __statement_GyrAEt(221);
                                    req.session.submission = req.body;
                                }
                                {
                                    __statement_GyrAEt(222);
                                    __extro_A3KSbH(223, __intro_aDYHs0(223, req).flash('submissionFlash', {
                                        text: (__expression_LrzoNg(224), 'You must have approval from your counterpart in order ' + 'to submit this leave request.'),
                                        class: 'danger'
                                    }));
                                }
                                {
                                    __statement_GyrAEt(225);
                                    __extro_A3KSbH(226, __intro_aDYHs0(226, res).end(__extro_A3KSbH(227, __intro_aDYHs0(227, JSON).stringify({
                                        redirect: failureRedirect
                                    }))));
                                }
                                return __expression_LrzoNg(228), (__expression_LrzoNg(229), cb(null));
                            } else if (__expression_LrzoNg(230), legs.length > 0) {
                                __block_CTwJAf(40);
                                {
                                    __statement_GyrAEt(231);
                                    __expression_LrzoNg(232), cb({
                                        requestData: {
                                            volunteer: userId,
                                            staff: staffId,
                                            status: {
                                                isPending: true,
                                                isApproved: false
                                            },
                                            legs: legs,
                                            counterpartApproved: true
                                        },
                                        countries: countries,
                                        users: volunteers,
                                        staff: staff
                                    });
                                }
                            } else {
                                __block_CTwJAf(41);
                                {
                                    __statement_GyrAEt(233);
                                    req.session.submission = req.body;
                                }
                                {
                                    __statement_GyrAEt(234);
                                    __extro_A3KSbH(235, __intro_aDYHs0(235, req).flash('submissionFlash', {
                                        text: (__expression_LrzoNg(236), 'An error has occurred while trying to save ' + 'this request. Please try again.'),
                                        class: 'danger'
                                    }));
                                }
                                {
                                    __statement_GyrAEt(237);
                                    __extro_A3KSbH(238, __intro_aDYHs0(238, res).end(__extro_A3KSbH(239, __intro_aDYHs0(239, JSON).stringify({
                                        redirect: failureRedirect
                                    }))));
                                }
                                return __expression_LrzoNg(240), (__expression_LrzoNg(241), cb(null));
                            }
                        } else {
                            __block_CTwJAf(42);
                            {
                                __statement_GyrAEt(242);
                                req.session.submission = req.body;
                            }
                            {
                                __statement_GyrAEt(243);
                                __extro_A3KSbH(244, __intro_aDYHs0(244, req).flash('submissionFlash', {
                                    text: 'The staff that you selected could not be found.',
                                    class: 'danger'
                                }));
                            }
                            {
                                __statement_GyrAEt(245);
                                __extro_A3KSbH(246, __intro_aDYHs0(246, res).end(__extro_A3KSbH(247, __intro_aDYHs0(247, JSON).stringify({
                                    redirect: failureRedirect
                                }))));
                            }
                            return __expression_LrzoNg(248), (__expression_LrzoNg(249), cb(null));
                        }
                    }));
                }
            } else {
                __block_CTwJAf(43);
                {
                    __statement_GyrAEt(250);
                    req.session.submission = req.body;
                }
                {
                    __statement_GyrAEt(251);
                    __extro_A3KSbH(252, __intro_aDYHs0(252, req).flash('submissionFlash', {
                        text: 'The volunteer that you selected could not be found.',
                        class: 'danger'
                    }));
                }
                {
                    __statement_GyrAEt(253);
                    __extro_A3KSbH(254, __intro_aDYHs0(254, res).end(__extro_A3KSbH(255, __intro_aDYHs0(255, JSON).stringify({
                        redirect: failureRedirect
                    }))));
                }
                return __expression_LrzoNg(256), (__expression_LrzoNg(257), cb(null));
            }
        }));
    }
}
{
    __statement_GyrAEt(258);
    router.postUpdatedRequest = function (req, res) {
        __block_CTwJAf(44);
        {
            __statement_GyrAEt(259);
            var failureRedirect = (__expression_LrzoNg(260), (__expression_LrzoNg(261), '/requests/' + req.request._id) + '/edit');
        }
        {
            __statement_GyrAEt(262);
            var successRedirect = (__expression_LrzoNg(263), '/requests/' + req.request._id);
        }
        {
            __statement_GyrAEt(264);
            __expression_LrzoNg(265), validateRequestSubmission(req, res, failureRedirect, function (data) {
                __block_CTwJAf(45);
                if (__expression_LrzoNg(266), (__expression_LrzoNg(267), data) !== null) {
                    __block_CTwJAf(46);
                    {
                        __statement_GyrAEt(268);
                        var changesMade = false;
                    }
                    {
                        __statement_GyrAEt(269);
                        var comment = (__expression_LrzoNg(270), req.user.name + ' updated this request with the following changes:\n');
                    }
                    {
                        __statement_GyrAEt(271);
                        var originalLegIndexesFound = [];
                    }
                    {
                        __statement_GyrAEt(272);
                        var legBefore;
                    }
                    {
                        __statement_GyrAEt(273);
                        var legAfter;
                    }
                    for (var i = 0; __expression_LrzoNg(274), (__expression_LrzoNg(275), i) < data.requestData.legs.length; __expression_LrzoNg(276), i++) {
                        __block_CTwJAf(47);
                        {
                            __statement_GyrAEt(277);
                            legAfter = data.requestData.legs[i];
                        }
                        {
                            __statement_GyrAEt(278);
                            var addedLegCount = legAfter.addedLegCount;
                        }
                        if (__expression_LrzoNg(279), (__expression_LrzoNg(280), addedLegCount) >= req.request.legs.length) {
                            __block_CTwJAf(48);
                            {
                                __statement_GyrAEt(281);
                                comment += (__expression_LrzoNg(282), (__expression_LrzoNg(283), (__expression_LrzoNg(284), (__expression_LrzoNg(285), (__expression_LrzoNg(286), (__expression_LrzoNg(287), '- Added a new trip leg to ' + legAfter.country) + ' from ') + __extro_A3KSbH(288, __intro_aDYHs0(288, helpers).formatDateOnly(legAfter.startDate))) + ' to ') + __extro_A3KSbH(289, __intro_aDYHs0(289, helpers).formatDateOnly(legAfter.endDate))) + '.\n');
                            }
                            {
                                __statement_GyrAEt(290);
                                changesMade = true;
                            }
                        } else {
                            __block_CTwJAf(49);
                            {
                                __statement_GyrAEt(291);
                                legBefore = req.request.legs[addedLegCount];
                            }
                            {
                                __statement_GyrAEt(292);
                                var didModify = false;
                            }
                            {
                                __statement_GyrAEt(293);
                                var modifiedComment = (__expression_LrzoNg(294), (__expression_LrzoNg(295), (__expression_LrzoNg(296), (__expression_LrzoNg(297), (__expression_LrzoNg(298), (__expression_LrzoNg(299), '- Modifed the trip leg to ' + legAfter.country) + ' from ') + __extro_A3KSbH(300, __intro_aDYHs0(300, helpers).formatDateOnly(legAfter.startDate))) + ' to ') + __extro_A3KSbH(301, __intro_aDYHs0(301, helpers).formatDateOnly(legAfter.endDate))) + '.\n');
                            }
                            if (__expression_LrzoNg(302), legBefore.startDate != legAfter.startDate) {
                                __block_CTwJAf(50);
                                {
                                    __statement_GyrAEt(303);
                                    modifiedComment += (__expression_LrzoNg(304), (__expression_LrzoNg(305), (__expression_LrzoNg(306), (__expression_LrzoNg(307), '\tChanged the start date from ' + __extro_A3KSbH(308, __intro_aDYHs0(308, helpers).formatDateOnly(legBefore.startDate))) + ' to ') + __extro_A3KSbH(309, __intro_aDYHs0(309, helpers).formatDateOnly(legAfter.startDate))) + '.\n');
                                }
                                {
                                    __statement_GyrAEt(310);
                                    didModify = true;
                                }
                            }
                            if (__expression_LrzoNg(311), legBefore.endDate != legAfter.endDate) {
                                __block_CTwJAf(51);
                                {
                                    __statement_GyrAEt(312);
                                    modifiedComment += (__expression_LrzoNg(313), (__expression_LrzoNg(314), (__expression_LrzoNg(315), (__expression_LrzoNg(316), '\tChanged the end date from ' + __extro_A3KSbH(317, __intro_aDYHs0(317, helpers).formatDateOnly(legBefore.endDate))) + ' to ') + __extro_A3KSbH(318, __intro_aDYHs0(318, helpers).formatDateOnly(legAfter.endDate))) + '.\n');
                                }
                                {
                                    __statement_GyrAEt(319);
                                    didModify = true;
                                }
                            }
                            if (__expression_LrzoNg(320), legBefore.city != legAfter.city) {
                                __block_CTwJAf(52);
                                {
                                    __statement_GyrAEt(321);
                                    modifiedComment += (__expression_LrzoNg(322), (__expression_LrzoNg(323), (__expression_LrzoNg(324), (__expression_LrzoNg(325), '\tChanged the city from ' + legBefore.city) + ' to ') + legAfter.city) + '.\n');
                                }
                                {
                                    __statement_GyrAEt(326);
                                    didModify = true;
                                }
                            }
                            if (__expression_LrzoNg(327), legBefore.country != legAfter.country) {
                                __block_CTwJAf(53);
                                {
                                    __statement_GyrAEt(328);
                                    modifiedComment += (__expression_LrzoNg(329), (__expression_LrzoNg(330), (__expression_LrzoNg(331), (__expression_LrzoNg(332), '\tChanged the country from ' + legBefore.country) + ' to ') + legAfter.country) + '.\n');
                                }
                                {
                                    __statement_GyrAEt(333);
                                    didModify = true;
                                }
                            }
                            if (__expression_LrzoNg(334), legBefore.hotel != legAfter.hotel) {
                                __block_CTwJAf(54);
                                {
                                    __statement_GyrAEt(335);
                                    modifiedComment += (__expression_LrzoNg(336), (__expression_LrzoNg(337), (__expression_LrzoNg(338), (__expression_LrzoNg(339), '\tChanged the hotel information from "' + legBefore.hotel) + '" to "') + legAfter.hotel) + '".\n');
                                }
                                {
                                    __statement_GyrAEt(340);
                                    didModify = true;
                                }
                            }
                            if (__expression_LrzoNg(341), legBefore.contact != legAfter.contact) {
                                __block_CTwJAf(55);
                                {
                                    __statement_GyrAEt(342);
                                    modifiedComment += (__expression_LrzoNg(343), (__expression_LrzoNg(344), (__expression_LrzoNg(345), (__expression_LrzoNg(346), '\tChanged the contact information from "' + legBefore.contact) + '" to "') + legAfter.contact) + '".\n');
                                }
                                {
                                    __statement_GyrAEt(347);
                                    didModify = true;
                                }
                            }
                            if (__expression_LrzoNg(348), legBefore.companions != legAfter.companions) {
                                __block_CTwJAf(56);
                                {
                                    __statement_GyrAEt(349);
                                    modifiedComment += (__expression_LrzoNg(350), (__expression_LrzoNg(351), (__expression_LrzoNg(352), (__expression_LrzoNg(353), '\tChanged the companions information from "' + legBefore.companions) + '" to "') + legAfter.companions) + '".\n');
                                }
                                {
                                    __statement_GyrAEt(354);
                                    didModify = true;
                                }
                            }
                            if (__expression_LrzoNg(355), legBefore.description != legAfter.description) {
                                __block_CTwJAf(57);
                                {
                                    __statement_GyrAEt(356);
                                    modifiedComment += (__expression_LrzoNg(357), (__expression_LrzoNg(358), (__expression_LrzoNg(359), (__expression_LrzoNg(360), '\tChanged the description from "' + legBefore.description) + '" to "') + legAfter.description) + '".\n');
                                }
                                {
                                    __statement_GyrAEt(361);
                                    didModify = true;
                                }
                            }
                            if (__expression_LrzoNg(362), didModify) {
                                __block_CTwJAf(58);
                                {
                                    __statement_GyrAEt(363);
                                    comment += modifiedComment;
                                }
                                {
                                    __statement_GyrAEt(364);
                                    changesMade = true;
                                }
                            }
                        }
                    }
                    for (i = 0; __expression_LrzoNg(365), (__expression_LrzoNg(366), i) < req.request.legs.length; __expression_LrzoNg(367), i++) {
                        __block_CTwJAf(59);
                        {
                            __statement_GyrAEt(368);
                            legBefore = req.request.legs[i];
                        }
                        if (__expression_LrzoNg(369), !__extro_A3KSbH(370, __intro_aDYHs0(370, originalLegIndexesFound).indexOf(i))) {
                            __block_CTwJAf(60);
                            {
                                __statement_GyrAEt(371);
                                comment += (__expression_LrzoNg(372), (__expression_LrzoNg(373), (__expression_LrzoNg(374), (__expression_LrzoNg(375), (__expression_LrzoNg(376), (__expression_LrzoNg(377), '- Removed the trip leg to ' + legBefore.country) + ' from ') + __extro_A3KSbH(378, __intro_aDYHs0(378, helpers).formatDateOnly(legBefore.startDate))) + ' to ') + __extro_A3KSbH(379, __intro_aDYHs0(379, helpers).formatDateOnly(legBefore.endDate))) + '.\n');
                            }
                            {
                                __statement_GyrAEt(380);
                                changesMade = true;
                            }
                        }
                    }
                    if (__expression_LrzoNg(381), (__expression_LrzoNg(382), data.users.length > 0) && (__expression_LrzoNg(383), !__extro_A3KSbH(384, __intro_aDYHs0(384, data.users[0]._id).equals(req.request.volunteer._id)))) {
                        __block_CTwJAf(61);
                        {
                            __statement_GyrAEt(385);
                            comment += (__expression_LrzoNg(386), (__expression_LrzoNg(387), (__expression_LrzoNg(388), (__expression_LrzoNg(389), '- Changed Peace Corps volunteer from ' + req.request.user.name) + ' to ') + data.users[0].name) + '\n');
                        }
                        {
                            __statement_GyrAEt(390);
                            changesMade = true;
                        }
                    }
                    if (__expression_LrzoNg(391), (__expression_LrzoNg(392), data.staff.length > 0) && (__expression_LrzoNg(393), !__extro_A3KSbH(394, __intro_aDYHs0(394, data.staff[0]._id).equals(req.request.staff._id)))) {
                        __block_CTwJAf(62);
                        {
                            __statement_GyrAEt(395);
                            comment += (__expression_LrzoNg(396), (__expression_LrzoNg(397), (__expression_LrzoNg(398), (__expression_LrzoNg(399), '- Changed assigned Peace Corps staff from ' + req.request.staff.name) + ' to ') + data.staff[0].name) + '\n');
                        }
                        {
                            __statement_GyrAEt(400);
                            changesMade = true;
                        }
                    }
                    if (__expression_LrzoNg(401), changesMade) {
                        __block_CTwJAf(63);
                        {
                            __statement_GyrAEt(402);
                            __extro_A3KSbH(403, __intro_aDYHs0(403, console).log(comment));
                        }
                        {
                            __statement_GyrAEt(404);
                            __extro_A3KSbH(405, __intro_aDYHs0(405, helpers).postComment(req.request._id, 'Administrator', null, comment, function (err) {
                                __block_CTwJAf(64);
                                if (__expression_LrzoNg(406), err) {
                                    __block_CTwJAf(65);
                                    {
                                        __statement_GyrAEt(407);
                                        __extro_A3KSbH(408, __intro_aDYHs0(408, console).error({
                                            error: err
                                        }));
                                    }
                                    {
                                        __statement_GyrAEt(409);
                                        __extro_A3KSbH(410, __intro_aDYHs0(410, req).flash('approvalFlash', {
                                            text: (__expression_LrzoNg(411), 'An error has occurred while trying to ' + 'update this request. Please try again.'),
                                            class: 'danger'
                                        }));
                                    }
                                    {
                                        __statement_GyrAEt(412);
                                        __extro_A3KSbH(413, __intro_aDYHs0(413, res).end(__extro_A3KSbH(414, __intro_aDYHs0(414, JSON).stringify({
                                            redirect: failureRedirect
                                        }))));
                                    }
                                } else {
                                    __block_CTwJAf(66);
                                    {
                                        __statement_GyrAEt(415);
                                        __extro_A3KSbH(416, __intro_aDYHs0(416, Request).update({
                                            _id: req.request._id
                                        }, data.requestData, function (err) {
                                            __block_CTwJAf(67);
                                            if (__expression_LrzoNg(417), err) {
                                                __block_CTwJAf(68);
                                                {
                                                    __statement_GyrAEt(418);
                                                    req.session.submission = req.body;
                                                }
                                                {
                                                    __statement_GyrAEt(419);
                                                    __extro_A3KSbH(420, __intro_aDYHs0(420, req).flash('submissionFlash', {
                                                        text: (__expression_LrzoNg(421), 'An error has occurred while trying to ' + 'update this request. Please try again.'),
                                                        class: 'danger'
                                                    }));
                                                }
                                                {
                                                    __statement_GyrAEt(422);
                                                    __extro_A3KSbH(423, __intro_aDYHs0(423, res).end(__extro_A3KSbH(424, __intro_aDYHs0(424, JSON).stringify({
                                                        redirect: failureRedirect
                                                    }))));
                                                }
                                            }
                                        }));
                                    }
                                    {
                                        __statement_GyrAEt(425);
                                        __extro_A3KSbH(426, __intro_aDYHs0(426, req).flash('approvalFlash', {
                                            text: 'This leave request has successfully been updated.',
                                            class: 'success'
                                        }));
                                    }
                                    {
                                        __statement_GyrAEt(427);
                                        __extro_A3KSbH(428, __intro_aDYHs0(428, res).end(__extro_A3KSbH(429, __intro_aDYHs0(429, JSON).stringify({
                                            redirect: successRedirect
                                        }))));
                                    }
                                }
                            }));
                        }
                    } else {
                        __block_CTwJAf(69);
                        {
                            __statement_GyrAEt(430);
                            __extro_A3KSbH(431, __intro_aDYHs0(431, res).end(__extro_A3KSbH(432, __intro_aDYHs0(432, JSON).stringify({
                                redirect: successRedirect
                            }))));
                        }
                    }
                }
            });
        }
    };
}
{
    __statement_GyrAEt(433);
    router.postRequest = function (req, res) {
        __block_CTwJAf(70);
        {
            __statement_GyrAEt(434);
            __expression_LrzoNg(435), validateRequestSubmission(req, res, '/dashboard/submit', function (data) {
                __block_CTwJAf(71);
                if (__expression_LrzoNg(436), (__expression_LrzoNg(437), data) !== null) {
                    __block_CTwJAf(72);
                    {
                        __statement_GyrAEt(438);
                        var newRequest = new Request(data.requestData);
                    }
                    {
                        __statement_GyrAEt(439);
                        __extro_A3KSbH(440, __intro_aDYHs0(440, newRequest).save(function (err, obj) {
                            __block_CTwJAf(73);
                            if (__expression_LrzoNg(441), err) {
                                __block_CTwJAf(74);
                                {
                                    __statement_GyrAEt(442);
                                    req.session.submission = req.body;
                                }
                                {
                                    __statement_GyrAEt(443);
                                    __extro_A3KSbH(444, __intro_aDYHs0(444, req).flash('submissionFlash', {
                                        text: (__expression_LrzoNg(445), 'An error has occurred while trying to ' + 'save this request. Please try again.'),
                                        class: 'danger'
                                    }));
                                }
                                {
                                    __statement_GyrAEt(446);
                                    __extro_A3KSbH(447, __intro_aDYHs0(447, res).end(__extro_A3KSbH(448, __intro_aDYHs0(448, JSON).stringify({
                                        redirect: '/dashboard/submit'
                                    }))));
                                }
                            } else {
                                __block_CTwJAf(75);
                                {
                                    __statement_GyrAEt(449);
                                    __extro_A3KSbH(450, __intro_aDYHs0(450, process).nextTick(function () {
                                        __block_CTwJAf(76);
                                        for (var i = 0; __expression_LrzoNg(451), (__expression_LrzoNg(452), i) < data.countries.length; __expression_LrzoNg(453), i++) {
                                            __block_CTwJAf(77);
                                            {
                                                __statement_GyrAEt(454);
                                                __extro_A3KSbH(455, __intro_aDYHs0(455, User).find({
                                                    access: Access.STAFF,
                                                    countryCode: data.countries[i]
                                                }, function (err, docs) {
                                                    __block_CTwJAf(78);
                                                    if (__expression_LrzoNg(456), err) {
                                                        __block_CTwJAf(79);
                                                        {
                                                            __statement_GyrAEt(457);
                                                            __extro_A3KSbH(458, __intro_aDYHs0(458, console).error(err));
                                                        }
                                                    } else {
                                                        __block_CTwJAf(80);
                                                        for (var j = 0; __expression_LrzoNg(459), (__expression_LrzoNg(460), j) < docs.length; __expression_LrzoNg(461), j++) {
                                                            __block_CTwJAf(81);
                                                            {
                                                                __statement_GyrAEt(462);
                                                                var msg = (__expression_LrzoNg(463), (__expression_LrzoNg(464), (__expression_LrzoNg(465), (__expression_LrzoNg(466), (__expression_LrzoNg(467), 'A request by ' + data.users[0].name) + ' is waiting ') + 'for your approval on BonVoyage. ') + process.env.BONVOYAGE_DOMAIN) + '/login');
                                                            }
                                                            if (docs[j].phones) {
                                                                __block_CTwJAf(82);
                                                                for (var i = 0; __expression_LrzoNg(468), (__expression_LrzoNg(469), i) < docs[j].phones.length; __expression_LrzoNg(470), i++) {
                                                                    __block_CTwJAf(83);
                                                                    {
                                                                        __statement_GyrAEt(471);
                                                                        __extro_A3KSbH(472, __intro_aDYHs0(472, helpers).sendSMS(docs[j].phones[i], msg));
                                                                    }
                                                                }
                                                            } else {
                                                                __block_CTwJAf(84);
                                                                {
                                                                    __statement_GyrAEt(473);
                                                                    __extro_A3KSbH(474, __intro_aDYHs0(474, console).log((__expression_LrzoNg(475), docs[j].name + ' does not have a phone number')));
                                                                }
                                                            }
                                                        }
                                                    }
                                                }));
                                            }
                                        }
                                    }));
                                }
                                {
                                    __statement_GyrAEt(476);
                                    __extro_A3KSbH(477, __intro_aDYHs0(477, req).flash('dashboardFlash', {
                                        text: 'Request successfully saved.',
                                        class: 'success',
                                        link: {
                                            url: (__expression_LrzoNg(478), '/requests/' + obj._id),
                                            text: 'View Request.'
                                        }
                                    }));
                                }
                                {
                                    __statement_GyrAEt(479);
                                    __extro_A3KSbH(480, __intro_aDYHs0(480, res).end(__extro_A3KSbH(481, __intro_aDYHs0(481, JSON).stringify({
                                        redirect: '/dashboard'
                                    }))));
                                }
                            }
                        }));
                    }
                }
            });
        }
    };
}
{
    __statement_GyrAEt(482);
    router.postApprove = function (req, res) {
        __block_CTwJAf(85);
        {
            __statement_GyrAEt(483);
            var id = req.params.requestId;
        }
        {
            __statement_GyrAEt(484);
            __extro_A3KSbH(485, __intro_aDYHs0(485, Request).findByIdAndUpdate(id, {
                $set: {
                    'status.isPending': false,
                    'status.isApproved': true
                }
            }, function (err, doc) {
                __block_CTwJAf(86);
                if (__expression_LrzoNg(486), err) {
                    __block_CTwJAf(87);
                    return __expression_LrzoNg(487), __extro_A3KSbH(488, __intro_aDYHs0(488, res).send(500, {
                        error: err
                    }));
                }
                {
                    __statement_GyrAEt(489);
                    __extro_A3KSbH(490, __intro_aDYHs0(490, User).findOne({
                        _id: doc.volunteer
                    }, function (err, user) {
                        __block_CTwJAf(88);
                        {
                            __statement_GyrAEt(491);
                            var sendFrom = 'Peace Corps <team@projectdelta.io>';
                        }
                        {
                            __statement_GyrAEt(492);
                            var sendTo = user.email;
                        }
                        {
                            __statement_GyrAEt(493);
                            var subject = 'Peace Corps BonVoyage Request Approved';
                        }
                        {
                            __statement_GyrAEt(494);
                            var map = {
                                    name: __extro_A3KSbH(495, __intro_aDYHs0(495, req.user.name).split(' '))[0],
                                    button: process.env.BONVOYAGE_DOMAIN
                                };
                        }
                        {
                            __statement_GyrAEt(496);
                            __extro_A3KSbH(497, __intro_aDYHs0(497, process).nextTick(function () {
                                __block_CTwJAf(89);
                                {
                                    __statement_GyrAEt(498);
                                    __extro_A3KSbH(499, __intro_aDYHs0(499, helpers).sendTemplateEmail(sendFrom, sendTo, subject, 'approve', map));
                                }
                                if (user.phones) {
                                    __block_CTwJAf(90);
                                    for (var i = 0; __expression_LrzoNg(500), (__expression_LrzoNg(501), i) < user.phones.length; __expression_LrzoNg(502), i++) {
                                        __block_CTwJAf(91);
                                        {
                                            __statement_GyrAEt(503);
                                            __extro_A3KSbH(504, __intro_aDYHs0(504, helpers).sendSMS(user.phones[i], (__expression_LrzoNg(505), 'Your BonVoyage ' + 'leave request is now approved!')));
                                        }
                                    }
                                }
                            }));
                        }
                        {
                            __statement_GyrAEt(506);
                            __extro_A3KSbH(507, __intro_aDYHs0(507, req).flash('dashboardFlash', {
                                text: 'The request has been successfully approved.',
                                class: 'success',
                                link: {
                                    url: (__expression_LrzoNg(508), '/requests/' + (__expression_LrzoNg(509), id)),
                                    text: 'View Request.'
                                }
                            }));
                        }
                        {
                            __statement_GyrAEt(510);
                            __extro_A3KSbH(511, __intro_aDYHs0(511, res).end(__extro_A3KSbH(512, __intro_aDYHs0(512, JSON).stringify({
                                redirect: '/dashboard'
                            }))));
                        }
                    }));
                }
            }));
        }
    };
}
{
    __statement_GyrAEt(513);
    router.postDeny = function (req, res) {
        __block_CTwJAf(92);
        {
            __statement_GyrAEt(514);
            var id = req.params.requestId;
        }
        {
            __statement_GyrAEt(515);
            __extro_A3KSbH(516, __intro_aDYHs0(516, Request).findByIdAndUpdate(id, {
                $set: {
                    'status.isPending': false,
                    'status.isApproved': false
                }
            }, function (err, doc) {
                __block_CTwJAf(93);
                if (__expression_LrzoNg(517), err) {
                    __block_CTwJAf(94);
                    return __expression_LrzoNg(518), __extro_A3KSbH(519, __intro_aDYHs0(519, res).send(500, {
                        error: err
                    }));
                }
                {
                    __statement_GyrAEt(520);
                    __extro_A3KSbH(521, __intro_aDYHs0(521, User).findOne({
                        _id: doc.volunteer
                    }, function (err, user) {
                        __block_CTwJAf(95);
                        {
                            __statement_GyrAEt(522);
                            var sendFrom = 'Peace Corps <team@projectdelta.io>';
                        }
                        {
                            __statement_GyrAEt(523);
                            var sendTo = user.email;
                        }
                        {
                            __statement_GyrAEt(524);
                            var subject = 'Peace Corps BonVoyage Request Denied';
                        }
                        {
                            __statement_GyrAEt(525);
                            var map = {
                                    name: __extro_A3KSbH(526, __intro_aDYHs0(526, req.user.name).split(' '))[0],
                                    button: process.env.BONVOYAGE_DOMAIN
                                };
                        }
                        {
                            __statement_GyrAEt(527);
                            __extro_A3KSbH(528, __intro_aDYHs0(528, process).nextTick(function () {
                                __block_CTwJAf(96);
                                {
                                    __statement_GyrAEt(529);
                                    __extro_A3KSbH(530, __intro_aDYHs0(530, helpers).sendTemplateEmail(sendFrom, sendTo, subject, 'deny', map));
                                }
                                if (user.phones) {
                                    __block_CTwJAf(97);
                                    for (var i = 0; __expression_LrzoNg(531), (__expression_LrzoNg(532), i) < user.phones.length; __expression_LrzoNg(533), i++) {
                                        __block_CTwJAf(98);
                                        {
                                            __statement_GyrAEt(534);
                                            __extro_A3KSbH(535, __intro_aDYHs0(535, helpers).sendSMS(user.phones[i], (__expression_LrzoNg(536), (__expression_LrzoNg(537), 'Your BonVoyage leave request was denied.' + 'Please reach out to a Peace Corps staff member ') + 'if you have any questions.')));
                                        }
                                    }
                                }
                            }));
                        }
                        {
                            __statement_GyrAEt(538);
                            __extro_A3KSbH(539, __intro_aDYHs0(539, req).flash('dashboardFlash', {
                                text: 'The request has been successfully denied.',
                                class: 'success',
                                link: {
                                    url: (__expression_LrzoNg(540), '/requests/' + (__expression_LrzoNg(541), id)),
                                    text: 'View Request.'
                                }
                            }));
                        }
                        {
                            __statement_GyrAEt(542);
                            __extro_A3KSbH(543, __intro_aDYHs0(543, res).end(__extro_A3KSbH(544, __intro_aDYHs0(544, JSON).stringify({
                                redirect: '/dashboard'
                            }))));
                        }
                    }));
                }
            }));
        }
    };
}
{
    __statement_GyrAEt(545);
    router.postComments = function (req, res) {
        __block_CTwJAf(99);
        {
            __statement_GyrAEt(546);
            var id = req.params.requestId;
        }
        {
            __statement_GyrAEt(547);
            __extro_A3KSbH(548, __intro_aDYHs0(548, helpers).postComment(id, req.user.name, req.user._id, __extro_A3KSbH(549, __intro_aDYHs0(549, req).param('content')), function (err) {
                __block_CTwJAf(100);
                if (__expression_LrzoNg(550), err) {
                    __block_CTwJAf(101);
                    return __expression_LrzoNg(551), __extro_A3KSbH(552, __intro_aDYHs0(552, res).send(500, {
                        error: err
                    }));
                }
                {
                    __statement_GyrAEt(553);
                    __extro_A3KSbH(554, __intro_aDYHs0(554, req).flash('approvalFlash', {
                        text: 'Your comment has been added.',
                        class: 'success'
                    }));
                }
                {
                    __statement_GyrAEt(555);
                    __extro_A3KSbH(556, __intro_aDYHs0(556, res).end(__extro_A3KSbH(557, __intro_aDYHs0(557, JSON).stringify({
                        redirect: (__expression_LrzoNg(558), '/requests/' + (__expression_LrzoNg(559), id))
                    }))));
                }
            }));
        }
    };
}
{
    __statement_GyrAEt(560);
    router.reset = function (req, res) {
        __block_CTwJAf(102);
        {
            __statement_GyrAEt(561);
            var email = req.body.email;
        }
        {
            __statement_GyrAEt(562);
            __extro_A3KSbH(563, __intro_aDYHs0(563, User).findOne({
                email: email
            }, function (err, user) {
                __block_CTwJAf(103);
                if (__expression_LrzoNg(564), err) {
                    __block_CTwJAf(104);
                    {
                        __statement_GyrAEt(565);
                        __extro_A3KSbH(566, __intro_aDYHs0(566, req).flash('loginFlash', {
                            text: (__expression_LrzoNg(567), 'The account you are looking for does not exist ' + 'on our record.'),
                            class: 'danger'
                        }));
                    }
                    {
                        __statement_GyrAEt(568);
                        __extro_A3KSbH(569, __intro_aDYHs0(569, res).end(__extro_A3KSbH(570, __intro_aDYHs0(570, JSON).stringify({
                            redirect: '/login'
                        }))));
                    }
                }
                if (__expression_LrzoNg(571), user) {
                    __block_CTwJAf(105);
                    {
                        __statement_GyrAEt(572);
                        __extro_A3KSbH(573, __intro_aDYHs0(573, __extro_A3KSbH(574, __intro_aDYHs0(574, Token).find({
                            email: email,
                            tokenType: false
                        }))).remove(function (err) {
                            __block_CTwJAf(106);
                            if (__expression_LrzoNg(575), err) {
                                __block_CTwJAf(107);
                                {
                                    __statement_GyrAEt(576);
                                    __extro_A3KSbH(577, __intro_aDYHs0(577, console).log(err));
                                }
                            }
                            {
                                __statement_GyrAEt(578);
                                var token = __extro_A3KSbH(579, __intro_aDYHs0(579, randtoken).generate(64));
                            }
                            {
                                __statement_GyrAEt(580);
                                __extro_A3KSbH(581, __intro_aDYHs0(581, Token).create({
                                    token: token,
                                    email: email
                                }, function (err) {
                                    __block_CTwJAf(108);
                                    if (__expression_LrzoNg(582), err) {
                                        __block_CTwJAf(109);
                                        {
                                            __statement_GyrAEt(583);
                                            __extro_A3KSbH(584, __intro_aDYHs0(584, req).flash('loginFlash', {
                                                text: 'Failed to generate an email reset token.',
                                                class: 'danger'
                                            }));
                                        }
                                        {
                                            __statement_GyrAEt(585);
                                            __extro_A3KSbH(586, __intro_aDYHs0(586, res).end(__extro_A3KSbH(587, __intro_aDYHs0(587, JSON).stringify({
                                                redirect: '/login'
                                            }))));
                                        }
                                    }
                                    {
                                        __statement_GyrAEt(588);
                                        var sendFrom = 'Peace Corps <team@projectdelta.io>';
                                    }
                                    {
                                        __statement_GyrAEt(589);
                                        var sendTo = email;
                                    }
                                    {
                                        __statement_GyrAEt(590);
                                        var subject = 'Peace Corps BonVoyage Password Reset Request';
                                    }
                                    {
                                        __statement_GyrAEt(591);
                                        var map = {
                                                name: __extro_A3KSbH(592, __intro_aDYHs0(592, user.name).split(' '))[0],
                                                button: (__expression_LrzoNg(593), (__expression_LrzoNg(594), process.env.BONVOYAGE_DOMAIN + '/reset/') + (__expression_LrzoNg(595), token))
                                            };
                                    }
                                    {
                                        __statement_GyrAEt(596);
                                        __extro_A3KSbH(597, __intro_aDYHs0(597, process).nextTick(function () {
                                            __block_CTwJAf(110);
                                            {
                                                __statement_GyrAEt(598);
                                                __extro_A3KSbH(599, __intro_aDYHs0(599, helpers).sendTemplateEmail(sendFrom, sendTo, subject, 'password', map));
                                            }
                                        }));
                                    }
                                }));
                            }
                        }));
                    }
                }
            }));
        }
        {
            __statement_GyrAEt(600);
            __extro_A3KSbH(601, __intro_aDYHs0(601, req).flash('loginFlash', {
                text: (__expression_LrzoNg(602), 'Instructions to reset your password have been ' + 'sent to your email address.'),
                class: 'success'
            }));
        }
        {
            __statement_GyrAEt(603);
            __extro_A3KSbH(604, __intro_aDYHs0(604, res).end(__extro_A3KSbH(605, __intro_aDYHs0(605, JSON).stringify({
                redirect: '/login'
            }))));
        }
    };
}
{
    __statement_GyrAEt(606);
    router.resetValidator = function (req, res) {
        __block_CTwJAf(111);
        {
            __statement_GyrAEt(607);
            var token = req.params.token;
        }
        {
            __statement_GyrAEt(608);
            var newPassword = req.body.newPassword;
        }
        {
            __statement_GyrAEt(609);
            var confirmPassword = req.body.confirmPassword;
        }
        if (__expression_LrzoNg(610), (__expression_LrzoNg(611), newPassword) == (__expression_LrzoNg(612), confirmPassword)) {
            __block_CTwJAf(112);
            {
                __statement_GyrAEt(613);
                __extro_A3KSbH(614, __intro_aDYHs0(614, Token).findOneAndRemove({
                    token: token
                }, function (err, validToken) {
                    __block_CTwJAf(113);
                    if (__expression_LrzoNg(615), err) {
                        __block_CTwJAf(114);
                        {
                            __statement_GyrAEt(616);
                            __extro_A3KSbH(617, __intro_aDYHs0(617, req).flash('loginFlash', {
                                text: (__expression_LrzoNg(618), 'Invalid token. Please request to reset ' + 'your password again.'),
                                class: 'danger'
                            }));
                        }
                        {
                            __statement_GyrAEt(619);
                            __extro_A3KSbH(620, __intro_aDYHs0(620, res).end(__extro_A3KSbH(621, __intro_aDYHs0(621, JSON).stringify({
                                redirect: '/login'
                            }))));
                        }
                    } else {
                        __block_CTwJAf(115);
                        if (__expression_LrzoNg(622), validToken) {
                            __block_CTwJAf(116);
                            {
                                __statement_GyrAEt(623);
                                var email = validToken.email;
                            }
                            {
                                __statement_GyrAEt(624);
                                __extro_A3KSbH(625, __intro_aDYHs0(625, User).findOne({
                                    email: email
                                }, function (err, account) {
                                    __block_CTwJAf(117);
                                    if (__expression_LrzoNg(626), err) {
                                        __block_CTwJAf(118);
                                        {
                                            __statement_GyrAEt(627);
                                            __extro_A3KSbH(628, __intro_aDYHs0(628, req).flash('loginFlash', {
                                                text: (__expression_LrzoNg(629), 'This account does not exist in our ' + 'records anymore.'),
                                                class: 'danger'
                                            }));
                                        }
                                        {
                                            __statement_GyrAEt(630);
                                            __extro_A3KSbH(631, __intro_aDYHs0(631, res).end(__extro_A3KSbH(632, __intro_aDYHs0(632, JSON).stringify({
                                                redirect: '/login'
                                            }))));
                                        }
                                    } else {
                                        __block_CTwJAf(119);
                                        {
                                            __statement_GyrAEt(633);
                                            account.hash = newPassword;
                                        }
                                        {
                                            __statement_GyrAEt(634);
                                            __extro_A3KSbH(635, __intro_aDYHs0(635, account).save(function (err) {
                                                __block_CTwJAf(120);
                                                if (__expression_LrzoNg(636), err) {
                                                    __block_CTwJAf(121);
                                                    {
                                                        __statement_GyrAEt(637);
                                                        __extro_A3KSbH(638, __intro_aDYHs0(638, req).flash('loginFlash', {
                                                            text: (__expression_LrzoNg(639), (__expression_LrzoNg(640), 'There has been an error ' + 'resetting your password. ') + 'Please retry.'),
                                                            class: 'danger'
                                                        }));
                                                    }
                                                    {
                                                        __statement_GyrAEt(641);
                                                        __extro_A3KSbH(642, __intro_aDYHs0(642, res).end(__extro_A3KSbH(643, __intro_aDYHs0(643, JSON).stringify({
                                                            redirect: '/login'
                                                        }))));
                                                    }
                                                }
                                                {
                                                    __statement_GyrAEt(644);
                                                    __extro_A3KSbH(645, __intro_aDYHs0(645, req).flash('loginFlash', {
                                                        text: (__expression_LrzoNg(646), 'Your password has been ' + 'successfully updated.'),
                                                        class: 'success'
                                                    }));
                                                }
                                                {
                                                    __statement_GyrAEt(647);
                                                    __extro_A3KSbH(648, __intro_aDYHs0(648, res).end(__extro_A3KSbH(649, __intro_aDYHs0(649, JSON).stringify({
                                                        redirect: '/login'
                                                    }))));
                                                }
                                            }));
                                        }
                                    }
                                }));
                            }
                        } else {
                            __block_CTwJAf(122);
                            {
                                __statement_GyrAEt(650);
                                __extro_A3KSbH(651, __intro_aDYHs0(651, req).flash('loginFlash', {
                                    text: (__expression_LrzoNg(652), 'Invalid token. Please request to reset your ' + 'password again.'),
                                    class: 'danger'
                                }));
                            }
                            {
                                __statement_GyrAEt(653);
                                __extro_A3KSbH(654, __intro_aDYHs0(654, res).end(__extro_A3KSbH(655, __intro_aDYHs0(655, JSON).stringify({
                                    redirect: '/login'
                                }))));
                            }
                        }
                    }
                }));
            }
        } else {
            __block_CTwJAf(123);
            {
                __statement_GyrAEt(656);
                __extro_A3KSbH(657, __intro_aDYHs0(657, req).flash('loginFlash', {
                    text: (__expression_LrzoNg(658), 'New Password is different from Confirm Password. ' + 'Please retry.'),
                    class: 'danger'
                }));
            }
            {
                __statement_GyrAEt(659);
                __extro_A3KSbH(660, __intro_aDYHs0(660, res).end(__extro_A3KSbH(661, __intro_aDYHs0(661, JSON).stringify({
                    redirect: '/login'
                }))));
            }
        }
    };
}
{
    __statement_GyrAEt(662);
    router.logout = function (req, res) {
        __block_CTwJAf(124);
        {
            __statement_GyrAEt(663);
            __extro_A3KSbH(664, __intro_aDYHs0(664, req).logout());
        }
        {
            __statement_GyrAEt(665);
            __extro_A3KSbH(666, __intro_aDYHs0(666, req).flash('loginFlash', {
                text: 'You have been logged out.',
                class: 'success'
            }));
        }
        {
            __statement_GyrAEt(667);
            __extro_A3KSbH(668, __intro_aDYHs0(668, res).end(__extro_A3KSbH(669, __intro_aDYHs0(669, JSON).stringify({
                redirect: '/login'
            }))));
        }
    };
}
{
    __statement_GyrAEt(670);
    router.modifyAccess = function (req, res) {
        __block_CTwJAf(125);
        {
            __statement_GyrAEt(671);
            var userId = req.body.userId;
        }
        {
            __statement_GyrAEt(672);
            var access = req.body.access;
        }
        if (__expression_LrzoNg(673), (__expression_LrzoNg(674), (__expression_LrzoNg(675), (__expression_LrzoNg(676), access) >= Access.VOLUNTEER) && (__expression_LrzoNg(677), (__expression_LrzoNg(678), access) <= Access.ADMIN)) && (__expression_LrzoNg(679), (__expression_LrzoNg(680), req.user.access == Access.ADMIN) || (__expression_LrzoNg(681), (__expression_LrzoNg(682), access) < req.user.access))) {
            __block_CTwJAf(126);
            {
                __statement_GyrAEt(683);
                __extro_A3KSbH(684, __intro_aDYHs0(684, User).update({
                    _id: userId
                }, {
                    $set: {
                        access: access
                    }
                }, function (err) {
                    __block_CTwJAf(127);
                    if (__expression_LrzoNg(685), err) {
                        __block_CTwJAf(128);
                        {
                            __statement_GyrAEt(686);
                            __extro_A3KSbH(687, __intro_aDYHs0(687, console).error(err));
                        }
                    } else {
                        __block_CTwJAf(129);
                        {
                            __statement_GyrAEt(688);
                            __extro_A3KSbH(689, __intro_aDYHs0(689, req).flash('usersFlash', {
                                text: 'The user\'s access rights have been updated.',
                                class: 'success'
                            }));
                        }
                    }
                    {
                        __statement_GyrAEt(690);
                        __extro_A3KSbH(691, __intro_aDYHs0(691, res).end(__extro_A3KSbH(692, __intro_aDYHs0(692, JSON).stringify({
                            redirect: '/users'
                        }))));
                    }
                }));
            }
        } else {
            __block_CTwJAf(130);
            {
                __statement_GyrAEt(693);
                __extro_A3KSbH(694, __intro_aDYHs0(694, res).end(__extro_A3KSbH(695, __intro_aDYHs0(695, JSON).stringify({
                    redirect: '/users'
                }))));
            }
        }
    };
}
{
    __statement_GyrAEt(696);
    router.modifyProfile = function (req, res) {
        __block_CTwJAf(131);
        {
            __statement_GyrAEt(697);
            var userId = req.params.userId;
        }
        if (__expression_LrzoNg(698), (__expression_LrzoNg(699), userId) === (__expression_LrzoNg(700), undefined)) {
            __block_CTwJAf(132);
            {
                __statement_GyrAEt(701);
                userId = req.user._id;
            }
        }
        {
            __statement_GyrAEt(702);
            __extro_A3KSbH(703, __intro_aDYHs0(703, console).log(userId));
        }
        {
            __statement_GyrAEt(704);
            __extro_A3KSbH(705, __intro_aDYHs0(705, console).log(req.body));
        }
        {
            __statement_GyrAEt(706);
            __extro_A3KSbH(707, __intro_aDYHs0(707, User).update({
                _id: userId
            }, req.body.new, function (err) {
                __block_CTwJAf(133);
                if (__expression_LrzoNg(708), err) {
                    __block_CTwJAf(134);
                    {
                        __statement_GyrAEt(709);
                        __extro_A3KSbH(710, __intro_aDYHs0(710, req).flash('profileFlash', {
                            text: (__expression_LrzoNg(711), (__expression_LrzoNg(712), 'An occurred while attempting to update ' + ((__expression_LrzoNg(715), req.user._id == (__expression_LrzoNg(716), userId)) ? (__expression_LrzoNg(713), 'your') : (__expression_LrzoNg(714), (__expression_LrzoNg(717), req.body.new.name + '\'s')))) + ' profile.')
                        }));
                    }
                    {
                        __statement_GyrAEt(718);
                        __extro_A3KSbH(719, __intro_aDYHs0(719, console).error(err));
                    }
                } else {
                    __block_CTwJAf(135);
                    {
                        __statement_GyrAEt(720);
                        __extro_A3KSbH(721, __intro_aDYHs0(721, req).flash('profileFlash', {
                            text: (__expression_LrzoNg(724), req.user._id == (__expression_LrzoNg(725), userId)) ? (__expression_LrzoNg(722), 'Your profile has been updated.') : (__expression_LrzoNg(723), (__expression_LrzoNg(726), (__expression_LrzoNg(727), req.body.new.name || req.body.old.name) + '\'s profile has been updated.')),
                            class: 'success'
                        }));
                    }
                }
                {
                    __statement_GyrAEt(728);
                    __extro_A3KSbH(729, __intro_aDYHs0(729, res).redirect('/profile'));
                }
            }));
        }
    };
}
function validateUsers(users, loggedInUser, cb) {
    __block_CTwJAf(136);
    {
        __statement_GyrAEt(730);
        __extro_A3KSbH(731, __intro_aDYHs0(731, User).find({}, 'email', function (err, results) {
            __block_CTwJAf(137);
            if (__expression_LrzoNg(732), err) {
                __block_CTwJAf(138);
                {
                    __statement_GyrAEt(733);
                    __expression_LrzoNg(734), cb(err);
                }
            } else {
                __block_CTwJAf(139);
                {
                    __statement_GyrAEt(735);
                    var emails = __extro_A3KSbH(736, __intro_aDYHs0(736, results).map(function (elem) {
                            __block_CTwJAf(140);
                            return __expression_LrzoNg(737), elem.email;
                        }));
                }
                {
                    __statement_GyrAEt(738);
                    var newUsers = [];
                }
                for (var i = 0; __expression_LrzoNg(739), (__expression_LrzoNg(740), i) < users.length; __expression_LrzoNg(741), i++) {
                    __block_CTwJAf(141);
                    {
                        __statement_GyrAEt(742);
                        var user = users[i];
                    }
                    {
                        __statement_GyrAEt(743);
                        var isNameValid = (__expression_LrzoNg(744), user.name.value && (__expression_LrzoNg(745), user.name.value !== ''));
                    }
                    {
                        __statement_GyrAEt(746);
                        var isEmailValid = (__expression_LrzoNg(747), (__expression_LrzoNg(748), user.email.value && (__expression_LrzoNg(749), user.email.value !== '')) && (__expression_LrzoNg(750), __extro_A3KSbH(751, __intro_aDYHs0(751, emails).indexOf(user.email.value)) == (__expression_LrzoNg(752), -1)));
                    }
                    {
                        __statement_GyrAEt(753);
                        var countryValue = (__expression_LrzoNg(756), user.countryCode.value && (__expression_LrzoNg(757), user.countryCode.value !== '')) ? (__expression_LrzoNg(754), user.countryCode.value) : (__expression_LrzoNg(755), loggedInUser.country);
                    }
                    {
                        __statement_GyrAEt(758);
                        var isCountryValid = (__expression_LrzoNg(759), (__expression_LrzoNg(760), (__expression_LrzoNg(761), countryValue) && (__expression_LrzoNg(762), (__expression_LrzoNg(763), countryValue) !== '')) && (__expression_LrzoNg(764), countriesDictionary[countryValue] !== (__expression_LrzoNg(765), undefined)));
                    }
                    {
                        __statement_GyrAEt(766);
                        var accessValue = (__expression_LrzoNg(769), user.access.value && (__expression_LrzoNg(770), user.access.value !== '')) ? (__expression_LrzoNg(767), user.access.value) : (__expression_LrzoNg(768), Access.VOLUNTEER);
                    }
                    {
                        __statement_GyrAEt(771);
                        var isAccessValid = (__expression_LrzoNg(772), (__expression_LrzoNg(773), (__expression_LrzoNg(774), (__expression_LrzoNg(775), accessValue) >= Access.VOLUNTEER) && (__expression_LrzoNg(776), (__expression_LrzoNg(777), accessValue) <= Access.ADMIN)) && (__expression_LrzoNg(778), (__expression_LrzoNg(779), (__expression_LrzoNg(780), accessValue) < loggedInUser.access) || (__expression_LrzoNg(781), loggedInUser.access === Access.ADMIN)));
                    }
                    {
                        __statement_GyrAEt(782);
                        __extro_A3KSbH(783, __intro_aDYHs0(783, newUsers).push({
                            name: {
                                value: user.name.value,
                                valid: isNameValid
                            },
                            email: {
                                value: user.email.value,
                                valid: isEmailValid
                            },
                            country: {
                                value: (__expression_LrzoNg(786), isCountryValid) ? (__expression_LrzoNg(784), countriesDictionary[countryValue]) : (__expression_LrzoNg(785), ''),
                                valid: isCountryValid
                            },
                            countryCode: {
                                value: countryValue,
                                valid: isCountryValid
                            },
                            access: {
                                value: accessValue,
                                valid: isAccessValid
                            },
                            valid: (__expression_LrzoNg(787), (__expression_LrzoNg(788), (__expression_LrzoNg(789), (__expression_LrzoNg(790), isNameValid) && (__expression_LrzoNg(791), isEmailValid)) && (__expression_LrzoNg(792), isCountryValid)) && (__expression_LrzoNg(793), isAccessValid))
                        }));
                    }
                    {
                        __statement_GyrAEt(794);
                        __extro_A3KSbH(795, __intro_aDYHs0(795, emails).push(user.email.value));
                    }
                }
                {
                    __statement_GyrAEt(796);
                    __expression_LrzoNg(797), cb(null, newUsers);
                }
            }
        }));
    }
}
{
    __statement_GyrAEt(798);
    router.postUsers = function (req, res) {
        __block_CTwJAf(142);
        {
            __statement_GyrAEt(799);
            __expression_LrzoNg(800), validateUsers(req.body, req.user, function (err, validatedUsers) {
                __block_CTwJAf(143);
                if (__expression_LrzoNg(801), err) {
                    __block_CTwJAf(144);
                    {
                        __statement_GyrAEt(802);
                        throw err;
                    }
                }
                {
                    __statement_GyrAEt(803);
                    var allValid = __extro_A3KSbH(804, __intro_aDYHs0(804, validatedUsers).every(function (user) {
                            __block_CTwJAf(145);
                            return __expression_LrzoNg(805), (__expression_LrzoNg(806), (__expression_LrzoNg(807), user) && user.valid);
                        }));
                }
                if (__expression_LrzoNg(808), allValid) {
                    __block_CTwJAf(146);
                    {
                        __statement_GyrAEt(809);
                        __extro_A3KSbH(810, __intro_aDYHs0(810, validatedUsers).map(function (user) {
                            __block_CTwJAf(147);
                            {
                                __statement_GyrAEt(811);
                                var token = __extro_A3KSbH(812, __intro_aDYHs0(812, randtoken).generate(64));
                            }
                            {
                                __statement_GyrAEt(813);
                                __extro_A3KSbH(814, __intro_aDYHs0(814, Token).create({
                                    token: token,
                                    name: user.name.value,
                                    email: __extro_A3KSbH(815, __intro_aDYHs0(815, user.email.value).toLowerCase()),
                                    country: user.countryCode.value,
                                    tokenType: true
                                }, function (err) {
                                    __block_CTwJAf(148);
                                    if (__expression_LrzoNg(816), err) {
                                        __block_CTwJAf(149);
                                        {
                                            __statement_GyrAEt(817);
                                            __extro_A3KSbH(818, __intro_aDYHs0(818, req).flash('addUsersFlash', {
                                                text: (__expression_LrzoNg(819), 'Some of the uploaded users are invalid. ' + 'Please fix the issues in the table below before creating any users.'),
                                                class: 'danger'
                                            }));
                                        }
                                        {
                                            __statement_GyrAEt(820);
                                            __extro_A3KSbH(821, __intro_aDYHs0(821, res).end(__extro_A3KSbH(822, __intro_aDYHs0(822, JSON).stringify({
                                                redirect: '/users/add'
                                            }))));
                                        }
                                    }
                                    {
                                        __statement_GyrAEt(823);
                                        var sendFrom = 'Peace Corps <team@projectdelta.io>';
                                    }
                                    {
                                        __statement_GyrAEt(824);
                                        var sendTo = __extro_A3KSbH(825, __intro_aDYHs0(825, user.email.value).toLowerCase());
                                    }
                                    {
                                        __statement_GyrAEt(826);
                                        var subject = 'Peace Corps BonVoyage Registration';
                                    }
                                    {
                                        __statement_GyrAEt(827);
                                        var map = {
                                                name: __extro_A3KSbH(828, __intro_aDYHs0(828, user.name.value).split(' '))[0],
                                                button: (__expression_LrzoNg(829), (__expression_LrzoNg(830), process.env.BONVOYAGE_DOMAIN + '/register/') + (__expression_LrzoNg(831), token))
                                            };
                                    }
                                    {
                                        __statement_GyrAEt(832);
                                        __extro_A3KSbH(833, __intro_aDYHs0(833, process).nextTick(function () {
                                            __block_CTwJAf(150);
                                            {
                                                __statement_GyrAEt(834);
                                                __extro_A3KSbH(835, __intro_aDYHs0(835, helpers).sendTemplateEmail(sendFrom, sendTo, subject, 'register', map));
                                            }
                                        }));
                                    }
                                }));
                            }
                        }));
                    }
                    {
                        __statement_GyrAEt(836);
                        __extro_A3KSbH(837, __intro_aDYHs0(837, req).flash('usersFlash', {
                            text: (__expression_LrzoNg(838), (__expression_LrzoNg(839), 'Registration invitation(s) have been sent to ' + validatedUsers.length) + ' user(s).'),
                            class: 'success'
                        }));
                    }
                    {
                        __statement_GyrAEt(840);
                        __extro_A3KSbH(841, __intro_aDYHs0(841, res).end(__extro_A3KSbH(842, __intro_aDYHs0(842, JSON).stringify({
                            redirect: '/users'
                        }))));
                    }
                } else {
                    __block_CTwJAf(151);
                    {
                        __statement_GyrAEt(843);
                        __extro_A3KSbH(844, __intro_aDYHs0(844, req).flash('addUsersFlash', {
                            text: (__expression_LrzoNg(845), 'Some of the uploaded users are invalid. ' + 'Please fix the issues in the table below before creating any users.'),
                            class: 'danger'
                        }));
                    }
                    {
                        __statement_GyrAEt(846);
                        __extro_A3KSbH(847, __intro_aDYHs0(847, res).end(__extro_A3KSbH(848, __intro_aDYHs0(848, JSON).stringify({
                            redirect: '/users/add'
                        }))));
                    }
                }
            });
        }
    };
}
{
    __statement_GyrAEt(849);
    router.validateUsers = function (req, res) {
        __block_CTwJAf(152);
        {
            __statement_GyrAEt(850);
            var file = req.file;
        }
        if (__expression_LrzoNg(851), (__expression_LrzoNg(852), (__expression_LrzoNg(853), file) !== (__expression_LrzoNg(854), undefined)) && file.path) {
            __block_CTwJAf(153);
            {
                __statement_GyrAEt(855);
                __extro_A3KSbH(856, __intro_aDYHs0(856, console).log(file));
            }
            {
                __statement_GyrAEt(857);
                var converter = new Converter({
                        noheader: true
                    });
            }
            {
                __statement_GyrAEt(858);
                __extro_A3KSbH(859, __intro_aDYHs0(859, converter).fromFile(file.path, function (err, json) {
                    __block_CTwJAf(154);
                    if (__expression_LrzoNg(860), err) {
                        __block_CTwJAf(155);
                        {
                            __statement_GyrAEt(861);
                            throw err;
                        }
                    } else {
                        __block_CTwJAf(156);
                        {
                            __statement_GyrAEt(862);
                            __extro_A3KSbH(863, __intro_aDYHs0(863, console).log(json));
                        }
                        {
                            __statement_GyrAEt(864);
                            var formattedJSON = [];
                        }
                        for (var i = 0; __expression_LrzoNg(865), (__expression_LrzoNg(866), i) < json.length; __expression_LrzoNg(867), i++) {
                            __block_CTwJAf(157);
                            {
                                __statement_GyrAEt(868);
                                __extro_A3KSbH(869, __intro_aDYHs0(869, formattedJSON).push({
                                    name: {
                                        value: json[i].field1
                                    },
                                    email: {
                                        value: json[i].field2
                                    },
                                    countryCode: {
                                        value: json[i].field3
                                    },
                                    access: {
                                        value: json[i].field4
                                    }
                                }));
                            }
                        }
                        {
                            __statement_GyrAEt(870);
                            __expression_LrzoNg(871), validateUsers(formattedJSON, req.user, function (err, newUsers) {
                                __block_CTwJAf(158);
                                if (__expression_LrzoNg(872), err) {
                                    __block_CTwJAf(159);
                                    {
                                        __statement_GyrAEt(873);
                                        throw err;
                                    }
                                }
                                {
                                    __statement_GyrAEt(874);
                                    __extro_A3KSbH(875, __intro_aDYHs0(875, res).end(__extro_A3KSbH(876, __intro_aDYHs0(876, JSON).stringify(newUsers))));
                                }
                            });
                        }
                    }
                }));
            }
        } else {
            __block_CTwJAf(160);
            {
                __statement_GyrAEt(877);
                __extro_A3KSbH(878, __intro_aDYHs0(878, res).end(__extro_A3KSbH(879, __intro_aDYHs0(879, JSON).stringify(null))));
            }
        }
    };
}
{
    __statement_GyrAEt(880);
    router.deleteUser = function (req, res) {
        __block_CTwJAf(161);
        {
            __statement_GyrAEt(881);
            var userId = req.body.userId;
        }
        if (__expression_LrzoNg(882), (__expression_LrzoNg(883), (__expression_LrzoNg(884), userId) == req.user._id) || (__expression_LrzoNg(885), req.user.access == Access.ADMIN)) {
            __block_CTwJAf(162);
            {
                __statement_GyrAEt(886);
                __extro_A3KSbH(887, __intro_aDYHs0(887, __extro_A3KSbH(888, __intro_aDYHs0(888, Request).find({
                    volunteer: userId
                }))).remove(function (err) {
                    __block_CTwJAf(163);
                    if (__expression_LrzoNg(889), err) {
                        __block_CTwJAf(164);
                        {
                            __statement_GyrAEt(890);
                            __extro_A3KSbH(891, __intro_aDYHs0(891, console).error(err));
                        }
                        {
                            __statement_GyrAEt(892);
                            __extro_A3KSbH(893, __intro_aDYHs0(893, req).flash('usersFlash', {
                                text: 'An error has occurred while attempting to delete the user.',
                                class: 'danger'
                            }));
                        }
                        {
                            __statement_GyrAEt(894);
                            __extro_A3KSbH(895, __intro_aDYHs0(895, res).end(__extro_A3KSbH(896, __intro_aDYHs0(896, JSON).stringify({
                                redirect: '/users'
                            }))));
                        }
                    } else {
                        __block_CTwJAf(165);
                        {
                            __statement_GyrAEt(897);
                            __extro_A3KSbH(898, __intro_aDYHs0(898, __extro_A3KSbH(899, __intro_aDYHs0(899, User).find({
                                _id: userId
                            }))).remove(function (err) {
                                __block_CTwJAf(166);
                                if (__expression_LrzoNg(900), err) {
                                    __block_CTwJAf(167);
                                    {
                                        __statement_GyrAEt(901);
                                        __extro_A3KSbH(902, __intro_aDYHs0(902, console).error(err));
                                    }
                                    {
                                        __statement_GyrAEt(903);
                                        __extro_A3KSbH(904, __intro_aDYHs0(904, req).flash('usersFlash', {
                                            text: 'An error has occurred while attempting to delete the user.',
                                            class: 'danger'
                                        }));
                                    }
                                } else {
                                    __block_CTwJAf(168);
                                    {
                                        __statement_GyrAEt(905);
                                        __extro_A3KSbH(906, __intro_aDYHs0(906, req).flash('usersFlash', {
                                            text: 'The user has been deleted.',
                                            class: 'success'
                                        }));
                                    }
                                }
                                {
                                    __statement_GyrAEt(907);
                                    __extro_A3KSbH(908, __intro_aDYHs0(908, res).end(__extro_A3KSbH(909, __intro_aDYHs0(909, JSON).stringify({
                                        redirect: '/users'
                                    }))));
                                }
                            }));
                        }
                    }
                }));
            }
        } else {
            __block_CTwJAf(169);
            {
                __statement_GyrAEt(910);
                __extro_A3KSbH(911, __intro_aDYHs0(911, __extro_A3KSbH(912, __intro_aDYHs0(912, res).status(401))).send('Unauthorized'));
            }
        }
    };
}
{
    __statement_GyrAEt(913);
    router.deleteRequest = function (req, res) {
        __block_CTwJAf(170);
        {
            __statement_GyrAEt(914);
            var id = req.params.requestId;
        }
        {
            __statement_GyrAEt(915);
            var q = {
                    _id: id
                };
        }
        if (__expression_LrzoNg(916), req.user.access != Access.ADMIN) {
            __block_CTwJAf(171);
            {
                __statement_GyrAEt(917);
                q.volunteer = req.user._id;
            }
        }
        {
            __statement_GyrAEt(918);
            __extro_A3KSbH(919, __intro_aDYHs0(919, Request).findOneAndRemove(q, function (err) {
                __block_CTwJAf(172);
                if (__expression_LrzoNg(920), err) {
                    __block_CTwJAf(173);
                    return __expression_LrzoNg(921), __extro_A3KSbH(922, __intro_aDYHs0(922, res).send(500, {
                        error: err
                    }));
                }
                {
                    __statement_GyrAEt(923);
                    __extro_A3KSbH(924, __intro_aDYHs0(924, req).flash('dashboardFlash', {
                        text: 'The request has been successfully deleted.',
                        class: 'success'
                    }));
                }
                {
                    __statement_GyrAEt(925);
                    __extro_A3KSbH(926, __intro_aDYHs0(926, res).end(__extro_A3KSbH(927, __intro_aDYHs0(927, JSON).stringify({
                        redirect: '/dashboard'
                    }))));
                }
            }));
        }
    };
}
{
    __statement_GyrAEt(928);
    module.exports = router;
}