
// Instrumentation Header
{
    var fs = require('fs');
    var __statement_dU2CCv, __expression_plfVih, __block_EdcLh3;
    var store = require('/Users/colin/Desktop/Projects/Project_Delta/BonVoyage/node_modules/gulp-coverage/contrib/coverage_store.js');
    
    __statement_dU2CCv = function(i) {
        var fd = store.register('/Users/colin/Desktop/Projects/Project_Delta/BonVoyage/routes/helpers.js');
        fs.writeSync(fd, '{"statement": {"node": ' + i + '}},\n');
    }; 
    
    __expression_plfVih = function(i) {
        var fd = store.register('/Users/colin/Desktop/Projects/Project_Delta/BonVoyage/routes/helpers.js');
        fs.writeSync(fd, '{"expression": {"node": ' + i + '}},\n');
    }; 
    
    __block_EdcLh3 = function(i) {
        var fd = store.register('/Users/colin/Desktop/Projects/Project_Delta/BonVoyage/routes/helpers.js');
        fs.writeSync(fd, '{"block": ' + i + '},\n');
    }; 
    __intro_JunacJ = function(id, obj) {
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
    __extro_rNNW8H = function(id, obj) {
        var fd = store.register('/Users/colin/Desktop/Projects/Project_Delta/BonVoyage/routes/helpers.js');
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
    __statement_dU2CCv(0);
    'use strict';
}
{
    __statement_dU2CCv(1);
    var User = (__expression_plfVih(2), require((__expression_plfVih(3), (__expression_plfVih(4), __dirname) + '/../models/user')));
}
{
    __statement_dU2CCv(5);
    var Request = (__expression_plfVih(6), require((__expression_plfVih(7), (__expression_plfVih(8), __dirname) + '/../models/request')));
}
{
    __statement_dU2CCv(9);
    var Warning = (__expression_plfVih(10), require((__expression_plfVih(11), (__expression_plfVih(12), __dirname) + '/../models/warning')));
}
{
    __statement_dU2CCv(13);
    var Access = (__expression_plfVih(14), require((__expression_plfVih(15), (__expression_plfVih(16), __dirname) + '/../config/access')));
}
{
    __statement_dU2CCv(17);
    var DateOnly = (__expression_plfVih(18), require('dateonly'));
}
{
    __statement_dU2CCv(19);
    var moment = (__expression_plfVih(20), require('moment'));
}
{
    __statement_dU2CCv(21);
    var jade = (__expression_plfVih(22), require('jade'));
}
{
    __statement_dU2CCv(23);
    var path = (__expression_plfVih(24), require('path'));
}
{
    __statement_dU2CCv(25);
    var fs = (__expression_plfVih(26), require('fs'));
}
{
    __statement_dU2CCv(27);
    var twilio = (__expression_plfVih(28), require('twilio'));
}
{
    __statement_dU2CCv(29);
    var mailgun = (__expression_plfVih(30), require('mailgun-js'));
}
{
    __statement_dU2CCv(31);
    var mailcomposer = (__expression_plfVih(32), require('mailcomposer'));
}
{
    __statement_dU2CCv(33);
    var mongoose = (__expression_plfVih(34), require('mongoose'));
}
{
    __statement_dU2CCv(35);
    var countryFilePath = (__expression_plfVih(36), (__expression_plfVih(37), __dirname) + '/../public/data/countryList.json');
}
{
    __statement_dU2CCv(38);
    var countryListFile = __extro_rNNW8H(39, __intro_JunacJ(39, fs).readFileSync(countryFilePath, 'utf8'));
}
{
    __statement_dU2CCv(40);
    var countriesDictionary = __extro_rNNW8H(41, __intro_JunacJ(41, JSON).parse(countryListFile));
}
{
    __statement_dU2CCv(42);
    var dropEmail = true;
}
{
    __statement_dU2CCv(43);
    var dropSMS = true;
}
if (__expression_plfVih(44), (__expression_plfVih(45), process.env.MAILGUN_KEY !== (__expression_plfVih(46), undefined)) && (__expression_plfVih(47), process.env.BONVOYAGE_DOMAIN !== (__expression_plfVih(48), undefined))) {
    __block_EdcLh3(0);
    {
        __statement_dU2CCv(49);
        var mailgun = (__expression_plfVih(50), mailgun({
                apiKey: process.env.MAILGUN_KEY,
                domain: process.env.DOMAIN
            }));
    }
    {
        __statement_dU2CCv(51);
        dropEmail = false;
    }
}
if (__expression_plfVih(52), (__expression_plfVih(53), process.env.TWILIO_SID !== (__expression_plfVih(54), undefined)) && (__expression_plfVih(55), process.env.TWILIO_AUTH !== (__expression_plfVih(56), undefined))) {
    __block_EdcLh3(1);
    {
        __statement_dU2CCv(57);
        var twilioClient = new twilio.RestClient(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
    }
    {
        __statement_dU2CCv(58);
        dropSMS = false;
    }
}
{
    __statement_dU2CCv(59);
    module.exports.getStartDate = function (request) {
        __block_EdcLh3(2);
        if (__expression_plfVih(60), request.legs.length > 0) {
            __block_EdcLh3(3);
            {
                __statement_dU2CCv(61);
                var startDate = new DateOnly(request.legs[0].startDate);
            }
            for (var i = 1; __expression_plfVih(62), (__expression_plfVih(63), i) < request.legs.length; __expression_plfVih(64), i++) {
                __block_EdcLh3(4);
                {
                    __statement_dU2CCv(65);
                    var d = new DateOnly(request.legs[i].startDate);
                }
                if (__expression_plfVih(66), (__expression_plfVih(67), d) < (__expression_plfVih(68), startDate)) {
                    __block_EdcLh3(5);
                    {
                        __statement_dU2CCv(69);
                        startDate = d;
                    }
                }
            }
            return __expression_plfVih(70), startDate;
        } else {
            __block_EdcLh3(6);
            return __expression_plfVih(71), undefined;
        }
    };
}
{
    __statement_dU2CCv(72);
    module.exports.getEndDate = function (request) {
        __block_EdcLh3(7);
        if (__expression_plfVih(73), request.legs.length > 0) {
            __block_EdcLh3(8);
            {
                __statement_dU2CCv(74);
                var endDate = new DateOnly(request.legs[0].endDate);
            }
            for (var i = 1; __expression_plfVih(75), (__expression_plfVih(76), i) < request.legs.length; __expression_plfVih(77), i++) {
                __block_EdcLh3(9);
                {
                    __statement_dU2CCv(78);
                    var d = new DateOnly(request.legs[i].endDate);
                }
                if (__expression_plfVih(79), (__expression_plfVih(80), d) > (__expression_plfVih(81), endDate)) {
                    __block_EdcLh3(10);
                    {
                        __statement_dU2CCv(82);
                        endDate = d;
                    }
                }
            }
            return __expression_plfVih(83), endDate;
        } else {
            __block_EdcLh3(11);
            return __expression_plfVih(84), undefined;
        }
    };
}
{
    __statement_dU2CCv(85);
    module.exports.getRequests = function (req, res, options, cb) {
        __block_EdcLh3(12);
        if (req.user) {
            __block_EdcLh3(13);
            {
                __statement_dU2CCv(86);
                var matchUsers = {};
            }
            if (__expression_plfVih(87), (__expression_plfVih(88), options) && options._id) {
                __block_EdcLh3(14);
                {
                    __statement_dU2CCv(89);
                    matchUsers._id = __extro_rNNW8H(90, __intro_JunacJ(90, mongoose.Types).ObjectId(options._id));
                }
                {
                    __statement_dU2CCv(91);
                    __extro_rNNW8H(92, __intro_JunacJ(92, console).log((__expression_plfVih(93), 'Looking for request with id: ' + matchUsers._id)));
                }
            }
            if (__expression_plfVih(94), req.user.access < Access.STAFF) {
                __block_EdcLh3(15);
                {
                    __statement_dU2CCv(95);
                    matchUsers.volunteer = req.user._id;
                }
            }
            if (__expression_plfVih(96), (__expression_plfVih(97), options) && options.staffId) {
                __block_EdcLh3(16);
                {
                    __statement_dU2CCv(98);
                    matchUsers.staff = req.staffId;
                }
            }
            if (__expression_plfVih(99), (__expression_plfVih(100), options) && options.userId) {
                __block_EdcLh3(17);
                {
                    __statement_dU2CCv(101);
                    matchUsers.volunteer = req.userId;
                }
            }
            {
                __statement_dU2CCv(102);
                var matchCountry = {};
            }
            if (__expression_plfVih(103), req.user.access == Access.STAFF) {
                __block_EdcLh3(18);
                {
                    __statement_dU2CCv(104);
                    matchCountry['volunteer.countryCode'] = req.user.countryCode;
                }
            }
            {
                __statement_dU2CCv(105);
                __extro_rNNW8H(106, __intro_JunacJ(106, __extro_rNNW8H(107, __intro_JunacJ(107, __extro_rNNW8H(108, __intro_JunacJ(108, __extro_rNNW8H(109, __intro_JunacJ(109, __extro_rNNW8H(110, __intro_JunacJ(110, Request).find(matchUsers))).populate({
                    path: 'staff comments.user',
                    select: '-hash'
                }))).populate({
                    path: 'volunteer',
                    match: matchCountry,
                    select: '-hash'
                }))).lean())).exec(function (err, requests) {
                    __block_EdcLh3(19);
                    if (__expression_plfVih(111), err) {
                        __block_EdcLh3(20);
                        return __expression_plfVih(112), (__expression_plfVih(113), cb(err));
                    } else {
                        __block_EdcLh3(21);
                        for (var i = 0; __expression_plfVih(114), (__expression_plfVih(115), i) < requests.length; __expression_plfVih(116), i++) {
                            __block_EdcLh3(22);
                            {
                                __statement_dU2CCv(117);
                                requests[i].startDate = __extro_rNNW8H(118, __intro_JunacJ(118, module.exports).getStartDate(requests[i]));
                            }
                            {
                                __statement_dU2CCv(119);
                                requests[i].endDate = __extro_rNNW8H(120, __intro_JunacJ(120, module.exports).getEndDate(requests[i]));
                            }
                        }
                        {
                            __statement_dU2CCv(121);
                            __expression_plfVih(122), cb(null, requests);
                        }
                    }
                }));
            }
        } else {
            __block_EdcLh3(23);
            {
                __statement_dU2CCv(123);
                __expression_plfVih(124), cb(new Error('User not logged in!'));
            }
        }
    };
}
{
    __statement_dU2CCv(125);
    module.exports.getUsers = function (options, cb) {
        __block_EdcLh3(24);
        {
            __statement_dU2CCv(126);
            var q = (__expression_plfVih(129), options.user !== (__expression_plfVih(130), undefined)) ? (__expression_plfVih(127), options.user) : (__expression_plfVih(128), {});
        }
        if (__expression_plfVih(131), options.maxAccess !== (__expression_plfVih(132), undefined)) {
            __block_EdcLh3(25);
            if (__expression_plfVih(133), q.access === (__expression_plfVih(134), undefined)) {
                __block_EdcLh3(26);
                {
                    __statement_dU2CCv(135);
                    q.access = {};
                }
            }
            {
                __statement_dU2CCv(136);
                q.access.$lte = options.maxAccess;
            }
        }
        if (__expression_plfVih(137), options.minAccess !== (__expression_plfVih(138), undefined)) {
            __block_EdcLh3(27);
            if (__expression_plfVih(139), q.access === (__expression_plfVih(140), undefined)) {
                __block_EdcLh3(28);
                {
                    __statement_dU2CCv(141);
                    q.access = {};
                }
            }
            {
                __statement_dU2CCv(142);
                q.access.$gte = options.minAccess;
            }
        }
        if (__expression_plfVih(143), options.countryCode !== (__expression_plfVih(144), undefined)) {
            __block_EdcLh3(29);
            {
                __statement_dU2CCv(145);
                q.countryCode = options.countryCode;
            }
        }
        {
            __statement_dU2CCv(146);
            __extro_rNNW8H(147, __intro_JunacJ(147, console).log(q));
        }
        {
            __statement_dU2CCv(148);
            __extro_rNNW8H(149, __intro_JunacJ(149, __extro_rNNW8H(150, __intro_JunacJ(150, __extro_rNNW8H(151, __intro_JunacJ(151, User).find(q, 'access name email phones _id countryCode'))).lean())).exec(function (err, users) {
                __block_EdcLh3(30);
                if (__expression_plfVih(152), err) {
                    __block_EdcLh3(31);
                    {
                        __statement_dU2CCv(153);
                        __expression_plfVih(154), cb(err);
                    }
                } else {
                    __block_EdcLh3(32);
                    for (var i = 0; __expression_plfVih(155), (__expression_plfVih(156), i) < users.length; __expression_plfVih(157), i++) {
                        __block_EdcLh3(33);
                        {
                            __statement_dU2CCv(158);
                            users[i].country = countriesDictionary[users[i].countryCode];
                        }
                    }
                    {
                        __statement_dU2CCv(159);
                        __expression_plfVih(160), cb(null, users);
                    }
                }
            }));
        }
    };
}
{
    __statement_dU2CCv(161);
    module.exports.sendEmail = function (sendFrom, sendTo, subject, text, callback) {
        __block_EdcLh3(34);
        {
            __statement_dU2CCv(162);
            var data = {
                    from: sendFrom,
                    to: sendTo,
                    subject: subject,
                    text: text
                };
        }
        if (__expression_plfVih(163), dropEmail) {
            __block_EdcLh3(35);
            {
                __statement_dU2CCv(164);
                __extro_rNNW8H(165, __intro_JunacJ(165, console).error('Email dropped. Email data:'));
            }
            {
                __statement_dU2CCv(166);
                __extro_rNNW8H(167, __intro_JunacJ(167, console).error(data));
            }
            if (__expression_plfVih(168), callback) {
                __block_EdcLh3(36);
                {
                    __statement_dU2CCv(169);
                    __expression_plfVih(170), callback();
                }
            }
        } else {
            __block_EdcLh3(37);
            {
                __statement_dU2CCv(171);
                __extro_rNNW8H(172, __intro_JunacJ(172, __extro_rNNW8H(173, __intro_JunacJ(173, mailgun).messages())).send(data, function (err, body) {
                    __block_EdcLh3(38);
                    {
                        __statement_dU2CCv(174);
                        __extro_rNNW8H(175, __intro_JunacJ(175, console).log(body));
                    }
                    if (__expression_plfVih(176), callback) {
                        __block_EdcLh3(39);
                        {
                            __statement_dU2CCv(177);
                            __expression_plfVih(178), callback();
                        }
                    }
                }));
            }
        }
    };
}
{
    __statement_dU2CCv(179);
    module.exports.sendTemplateEmail = function (sendFrom, sendTo, subject, template, map, callback) {
        __block_EdcLh3(40);
        {
            __statement_dU2CCv(180);
            var html = __extro_rNNW8H(181, __intro_JunacJ(181, jade).renderFile(__extro_rNNW8H(182, __intro_JunacJ(182, path).join(__dirname, '../email', (__expression_plfVih(183), (__expression_plfVih(184), template) + '.jade'))), map));
        }
        {
            __statement_dU2CCv(185);
            var data = {
                    from: sendFrom,
                    to: sendTo,
                    subject: subject,
                    html: html
                };
        }
        if (__expression_plfVih(186), dropEmail) {
            __block_EdcLh3(41);
            {
                __statement_dU2CCv(187);
                __extro_rNNW8H(188, __intro_JunacJ(188, console).error('Email dropped. Email data:'));
            }
            {
                __statement_dU2CCv(189);
                __extro_rNNW8H(190, __intro_JunacJ(190, console).error(data));
            }
            if (__expression_plfVih(191), callback) {
                __block_EdcLh3(42);
                {
                    __statement_dU2CCv(192);
                    __expression_plfVih(193), callback();
                }
            }
        } else {
            __block_EdcLh3(43);
            {
                __statement_dU2CCv(194);
                var mail = (__expression_plfVih(195), mailcomposer(data));
            }
            {
                __statement_dU2CCv(196);
                __extro_rNNW8H(197, __intro_JunacJ(197, mail).build(function (buildError, message) {
                    __block_EdcLh3(44);
                    if (__expression_plfVih(198), buildError) {
                        __block_EdcLh3(45);
                        {
                            __statement_dU2CCv(199);
                            __extro_rNNW8H(200, __intro_JunacJ(200, console).log(buildError));
                        }
                    }
                    {
                        __statement_dU2CCv(201);
                        var dataToSend = {
                                to: sendTo,
                                message: __extro_rNNW8H(202, __intro_JunacJ(202, message).toString('ascii'))
                            };
                    }
                    {
                        __statement_dU2CCv(203);
                        __extro_rNNW8H(204, __intro_JunacJ(204, __extro_rNNW8H(205, __intro_JunacJ(205, mailgun).messages())).sendMime(dataToSend, function (sendError, body) {
                            __block_EdcLh3(46);
                            if (__expression_plfVih(206), sendError) {
                                __block_EdcLh3(47);
                                {
                                    __statement_dU2CCv(207);
                                    __extro_rNNW8H(208, __intro_JunacJ(208, console).log(sendError));
                                }
                            }
                            if (__expression_plfVih(209), body) {
                                __block_EdcLh3(48);
                                {
                                    __statement_dU2CCv(210);
                                    __extro_rNNW8H(211, __intro_JunacJ(211, console).log((__expression_plfVih(212), 'Email data:' + (__expression_plfVih(213), body))));
                                }
                            }
                            if (__expression_plfVih(214), callback) {
                                __block_EdcLh3(49);
                                {
                                    __statement_dU2CCv(215);
                                    __expression_plfVih(216), callback();
                                }
                            }
                        }));
                    }
                }));
            }
        }
    };
}
{
    __statement_dU2CCv(217);
    module.exports.postComment = function (requestId, name, userId, commentMessage, cb) {
        __block_EdcLh3(50);
        {
            __statement_dU2CCv(218);
            __extro_rNNW8H(219, __intro_JunacJ(219, Request).findByIdAndUpdate(requestId, {
                $push: {
                    comments: {
                        $each: [
                            {
                                name: name,
                                user: userId,
                                content: commentMessage
                            }
                        ]
                    }
                }
            }, function (err) {
                __block_EdcLh3(51);
                {
                    __statement_dU2CCv(220);
                    __expression_plfVih(221), cb(err);
                }
            }));
        }
    };
}
{
    __statement_dU2CCv(222);
    module.exports.formatDateOnly = function (date) {
        __block_EdcLh3(52);
        {
            __statement_dU2CCv(223);
            var dateonly = new DateOnly((__expression_plfVih(224), parseInt((__expression_plfVih(225), (__expression_plfVih(226), date) + ''))));
        }
        {
            __statement_dU2CCv(227);
            var formatteddate = __extro_rNNW8H(228, __intro_JunacJ(228, (__expression_plfVih(229), moment(__extro_rNNW8H(230, __intro_JunacJ(230, dateonly).toDate())))).format('MMM DD, YYYY'));
        }
        {
            __statement_dU2CCv(231);
            __extro_rNNW8H(232, __intro_JunacJ(232, console).log(formatteddate));
        }
        return __expression_plfVih(233), formatteddate;
    };
}
{
    __statement_dU2CCv(234);
    module.exports.sendSMS = function (sendTo, body, callback) {
        __block_EdcLh3(53);
        {
            __statement_dU2CCv(235);
            var data = {
                    to: sendTo,
                    from: process.env.BONVOYAGE_NUMBER,
                    body: body
                };
        }
        if (__expression_plfVih(236), dropSMS) {
            __block_EdcLh3(54);
            {
                __statement_dU2CCv(237);
                __extro_rNNW8H(238, __intro_JunacJ(238, console).error('SMS dropped. SMS data:'));
            }
            {
                __statement_dU2CCv(239);
                __extro_rNNW8H(240, __intro_JunacJ(240, console).error(data));
            }
            if (__expression_plfVih(241), callback) {
                __block_EdcLh3(55);
                {
                    __statement_dU2CCv(242);
                    __expression_plfVih(243), callback();
                }
            }
        } else {
            __block_EdcLh3(56);
            {
                __statement_dU2CCv(244);
                __extro_rNNW8H(245, __intro_JunacJ(245, twilioClient.messages).create(data, function (err, message) {
                    __block_EdcLh3(57);
                    if (__expression_plfVih(246), err) {
                        __block_EdcLh3(58);
                        {
                            __statement_dU2CCv(247);
                            __extro_rNNW8H(248, __intro_JunacJ(248, console).log('Unable to send SMS'));
                        }
                    } else {
                        __block_EdcLh3(59);
                        {
                            __statement_dU2CCv(249);
                            __extro_rNNW8H(250, __intro_JunacJ(250, console).log('Successfully sent SMS. SID is: '));
                        }
                        {
                            __statement_dU2CCv(251);
                            __extro_rNNW8H(252, __intro_JunacJ(252, console).log(message.sid));
                        }
                        {
                            __statement_dU2CCv(253);
                            __extro_rNNW8H(254, __intro_JunacJ(254, console).log('Sent on: '));
                        }
                        {
                            __statement_dU2CCv(255);
                            __extro_rNNW8H(256, __intro_JunacJ(256, console).log(message.dateCreated));
                        }
                    }
                    if (__expression_plfVih(257), callback) {
                        __block_EdcLh3(60);
                        {
                            __statement_dU2CCv(258);
                            __expression_plfVih(259), callback();
                        }
                    }
                }));
            }
        }
    };
}
{
    __statement_dU2CCv(260);
    module.exports.fetchWarnings = function (callback) {
        __block_EdcLh3(61);
        {
            __statement_dU2CCv(261);
            __extro_rNNW8H(262, __intro_JunacJ(262, Warning).find({}, function (err, warnings) {
                __block_EdcLh3(62);
                if (__expression_plfVih(263), err) {
                    __block_EdcLh3(63);
                    {
                        __statement_dU2CCv(264);
                        __extro_rNNW8H(265, __intro_JunacJ(265, console).error('An error occurred while fetching warnings:'));
                    }
                    {
                        __statement_dU2CCv(266);
                        __extro_rNNW8H(267, __intro_JunacJ(267, console).error(err));
                    }
                    return __expression_plfVih(268), (__expression_plfVih(269), callback(err));
                } else {
                    __block_EdcLh3(64);
                    {
                        __statement_dU2CCv(270);
                        var countryToWarnings = {};
                    }
                    for (var i = 0; __expression_plfVih(271), (__expression_plfVih(272), i) < warnings.length; __expression_plfVih(273), i++) {
                        __block_EdcLh3(65);
                        {
                            __statement_dU2CCv(274);
                            var today = new DateOnly();
                        }
                        if (__expression_plfVih(275), !(__expression_plfVih(276), (__expression_plfVih(277), warnings[i].startDate && (__expression_plfVih(278), (__expression_plfVih(279), today) < warnings[i].startDate)) || (__expression_plfVih(280), warnings[i].endDate && (__expression_plfVih(281), (__expression_plfVih(282), today) > warnings[i].endDate)))) {
                            __block_EdcLh3(66);
                            if (__expression_plfVih(283), countryToWarnings[warnings[i].countryCode] === (__expression_plfVih(284), undefined)) {
                                __block_EdcLh3(67);
                                {
                                    __statement_dU2CCv(285);
                                    countryToWarnings[warnings[i].countryCode] = [];
                                }
                            }
                            {
                                __statement_dU2CCv(286);
                                __extro_rNNW8H(287, __intro_JunacJ(287, countryToWarnings[warnings[i].countryCode]).push(warnings[i]));
                            }
                        }
                    }
                    return __expression_plfVih(288), (__expression_plfVih(289), callback(null, countryToWarnings));
                }
            }));
        }
    };
}