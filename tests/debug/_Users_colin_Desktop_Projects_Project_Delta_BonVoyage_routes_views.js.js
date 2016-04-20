
// Instrumentation Header
{
    var fs = require('fs');
    var __statement_ppOrpq, __expression_SFv00D, __block_kN79iS;
    var store = require('/Users/colin/Desktop/Projects/Project_Delta/BonVoyage/node_modules/gulp-coverage/contrib/coverage_store.js');
    
    __statement_ppOrpq = function(i) {
        var fd = store.register('/Users/colin/Desktop/Projects/Project_Delta/BonVoyage/routes/views.js');
        fs.writeSync(fd, '{"statement": {"node": ' + i + '}},\n');
    }; 
    
    __expression_SFv00D = function(i) {
        var fd = store.register('/Users/colin/Desktop/Projects/Project_Delta/BonVoyage/routes/views.js');
        fs.writeSync(fd, '{"expression": {"node": ' + i + '}},\n');
    }; 
    
    __block_kN79iS = function(i) {
        var fd = store.register('/Users/colin/Desktop/Projects/Project_Delta/BonVoyage/routes/views.js');
        fs.writeSync(fd, '{"block": ' + i + '},\n');
    }; 
    __intro_oDLRqi = function(id, obj) {
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
    __extro_ZSsHoR = function(id, obj) {
        var fd = store.register('/Users/colin/Desktop/Projects/Project_Delta/BonVoyage/routes/views.js');
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
    __statement_ppOrpq(0);
    'use strict';
}
{
    __statement_ppOrpq(1);
    var express = (__expression_SFv00D(2), require('express'));
}
{
    __statement_ppOrpq(3);
    var router = __extro_ZSsHoR(4, __intro_oDLRqi(4, express).Router());
}
{
    __statement_ppOrpq(5);
    var Access = (__expression_SFv00D(6), require((__expression_SFv00D(7), (__expression_SFv00D(8), __dirname) + '/../config/access')));
}
{
    __statement_ppOrpq(9);
    var helpers = (__expression_SFv00D(10), require((__expression_SFv00D(11), (__expression_SFv00D(12), __dirname) + '/helpers')));
}
{
    __statement_ppOrpq(13);
    router.index = function (req, res) {
        __block_kN79iS(0);
        {
            __statement_ppOrpq(14);
            __extro_ZSsHoR(15, __intro_oDLRqi(15, res).redirect('/login'));
        }
    };
}
{
    __statement_ppOrpq(16);
    router.renderLogin = function (req, res) {
        __block_kN79iS(1);
        {
            __statement_ppOrpq(17);
            var sub = {};
        }
        if (req.session.submission) {
            __block_kN79iS(2);
            {
                __statement_ppOrpq(18);
                sub = req.session.submission;
            }
            {
                __statement_ppOrpq(19);
                req.session.submission = null;
            }
        }
        {
            __statement_ppOrpq(20);
            __extro_ZSsHoR(21, __intro_oDLRqi(21, res).render('login.jade', {
                title: 'Login',
                messages: __extro_ZSsHoR(22, __intro_oDLRqi(22, req).flash('loginFlash')),
                links: [
                    {
                        text: 'Login',
                        href: '/login',
                        active: true
                    }
                ],
                hideLogout: true,
                submission: sub
            }));
        }
    };
}
{
    __statement_ppOrpq(23);
    router.renderRegister = function (req, res) {
        __block_kN79iS(3);
        {
            __statement_ppOrpq(24);
            var sub = {};
        }
        if (req.session.submission) {
            __block_kN79iS(4);
            {
                __statement_ppOrpq(25);
                sub = req.session.submission;
            }
            {
                __statement_ppOrpq(26);
                req.session.submission = null;
            }
        }
        {
            __statement_ppOrpq(27);
            __extro_ZSsHoR(28, __intro_oDLRqi(28, res).render('register.jade', {
                title: 'Register',
                messages: __extro_ZSsHoR(29, __intro_oDLRqi(29, req).flash('registerFlash')),
                links: [
                    {
                        text: 'Login',
                        href: '/login'
                    }
                ],
                hideLogout: true,
                submission: sub
            }));
        }
    };
}
{
    __statement_ppOrpq(30);
    router.renderReset = function (req, res) {
        __block_kN79iS(5);
        {
            __statement_ppOrpq(31);
            __extro_ZSsHoR(32, __intro_oDLRqi(32, res).render('forgot_password.jade', {
                title: 'Forgot Password',
                messages: __extro_ZSsHoR(33, __intro_oDLRqi(33, req).flash('resetFlash')),
                links: [
                    {
                        text: 'Login',
                        href: '/login'
                    }
                ],
                hideLogout: true
            }));
        }
    };
}
{
    __statement_ppOrpq(34);
    router.renderValidReset = function (req, res) {
        __block_kN79iS(6);
        {
            __statement_ppOrpq(35);
            __extro_ZSsHoR(36, __intro_oDLRqi(36, res).render('reset.jade', {
                title: 'Password Reset',
                messages: __extro_ZSsHoR(37, __intro_oDLRqi(37, req).flash('resetFlash')),
                links: [
                    {
                        text: 'Login',
                        href: '/login'
                    }
                ],
                hideLogout: true
            }));
        }
    };
}
{
    __statement_ppOrpq(38);
    router.renderSubform = function (req, res) {
        __block_kN79iS(7);
        {
            __statement_ppOrpq(39);
            var sub = {};
        }
        if (req.session.submission) {
            __block_kN79iS(8);
            {
                __statement_ppOrpq(40);
                sub = req.session.submission;
            }
            {
                __statement_ppOrpq(41);
                req.session.submission = null;
            }
        }
        {
            __statement_ppOrpq(42);
            var links = [
                    {
                        text: 'Dashboard',
                        href: '/dashboard'
                    },
                    {
                        text: 'Submit a Request',
                        href: '/dashboard/submit',
                        active: true
                    }
                ];
        }
        if (__expression_SFv00D(43), req.user.access >= Access.STAFF) {
            __block_kN79iS(9);
            {
                __statement_ppOrpq(44);
                __extro_ZSsHoR(45, __intro_oDLRqi(45, links).push({
                    text: 'Users',
                    href: '/users'
                }));
            }
            {
                __statement_ppOrpq(46);
                __extro_ZSsHoR(47, __intro_oDLRqi(47, links).push({
                    text: 'Add Users',
                    href: '/users/add'
                }));
            }
        }
        {
            __statement_ppOrpq(48);
            __extro_ZSsHoR(49, __intro_oDLRqi(49, res).render('submissionForm.jade', {
                title: 'Submission Form',
                links: links,
                messages: __extro_ZSsHoR(50, __intro_oDLRqi(50, req).flash('submissionFlash')),
                shouldSelectRequestee: (__expression_SFv00D(51), req.user.access >= Access.STAFF),
                submission: sub,
                text: {
                    submit: 'Submit All Legs'
                }
            }));
        }
    };
}
{
    __statement_ppOrpq(52);
    router.renderEditRequest = function (req, res) {
        __block_kN79iS(10);
        {
            __statement_ppOrpq(53);
            var sub = {};
        }
        if (req.session.submission) {
            __block_kN79iS(11);
            {
                __statement_ppOrpq(54);
                sub = req.session.submission;
            }
            {
                __statement_ppOrpq(55);
                req.session.submission = null;
            }
        } else if (req.request) {
            __block_kN79iS(12);
            {
                __statement_ppOrpq(56);
                var legs = [];
            }
            for (var i = 0; __expression_SFv00D(57), (__expression_SFv00D(58), i) < req.request.legs.length; __expression_SFv00D(59), i++) {
                __block_kN79iS(13);
                {
                    __statement_ppOrpq(60);
                    var leg = req.request.legs[i];
                }
                {
                    __statement_ppOrpq(61);
                    var start = (__expression_SFv00D(62), '' + leg.startDate);
                }
                {
                    __statement_ppOrpq(63);
                    var end = (__expression_SFv00D(64), '' + leg.endDate);
                }
                {
                    __statement_ppOrpq(65);
                    leg.startDate = (__expression_SFv00D(66), (__expression_SFv00D(67), (__expression_SFv00D(68), (__expression_SFv00D(69), (__expression_SFv00D(70), (__expression_SFv00D(71), parseInt(__extro_ZSsHoR(72, __intro_oDLRqi(72, start).substring(4, 6)))) + 1) + ' ') + __extro_ZSsHoR(73, __intro_oDLRqi(73, start).substring(6, 8))) + ' ') + __extro_ZSsHoR(74, __intro_oDLRqi(74, start).substring(0, 4)));
                }
                {
                    __statement_ppOrpq(75);
                    leg.endDate = (__expression_SFv00D(76), (__expression_SFv00D(77), (__expression_SFv00D(78), (__expression_SFv00D(79), (__expression_SFv00D(80), (__expression_SFv00D(81), parseInt(__extro_ZSsHoR(82, __intro_oDLRqi(82, end).substring(4, 6)))) + 1) + ' ') + __extro_ZSsHoR(83, __intro_oDLRqi(83, end).substring(6, 8))) + ' ') + __extro_ZSsHoR(84, __intro_oDLRqi(84, end).substring(0, 4)));
                }
                {
                    __statement_ppOrpq(85);
                    leg.country = leg.countryCode;
                }
                {
                    __statement_ppOrpq(86);
                    __expression_SFv00D(87), delete leg.countryCode;
                }
                {
                    __statement_ppOrpq(88);
                    __extro_ZSsHoR(89, __intro_oDLRqi(89, legs).push(leg));
                }
            }
            {
                __statement_ppOrpq(90);
                sub = {
                    volunteer: req.request.volunteer._id,
                    staff: req.request.staff._id,
                    legs: req.request.legs,
                    counterpartApproved: (__expression_SFv00D(91), '' + req.request.counterpartApproved)
                };
            }
        }
        {
            __statement_ppOrpq(92);
            var links = [
                    {
                        text: 'Dashboard',
                        href: '/dashboard'
                    },
                    {
                        text: 'Submit a Request',
                        href: '/dashboard/submit'
                    }
                ];
        }
        if (__expression_SFv00D(93), req.user.access >= Access.STAFF) {
            __block_kN79iS(14);
            {
                __statement_ppOrpq(94);
                __extro_ZSsHoR(95, __intro_oDLRqi(95, links).push({
                    text: 'Users',
                    href: '/users'
                }));
            }
            {
                __statement_ppOrpq(96);
                __extro_ZSsHoR(97, __intro_oDLRqi(97, links).push({
                    text: 'Add Users',
                    href: '/users/add'
                }));
            }
        }
        {
            __statement_ppOrpq(98);
            __extro_ZSsHoR(99, __intro_oDLRqi(99, res).render('submissionForm.jade', {
                title: 'Edit Request',
                links: links,
                messages: __extro_ZSsHoR(100, __intro_oDLRqi(100, req).flash('submissionFlash')),
                shouldSelectRequestee: (__expression_SFv00D(101), req.user.access >= Access.STAFF),
                submission: sub,
                text: {
                    submit: 'Update Leave Request'
                }
            }));
        }
    };
}
{
    __statement_ppOrpq(102);
    router.renderApproval = function (req, res) {
        __block_kN79iS(15);
        {
            __statement_ppOrpq(103);
            __extro_ZSsHoR(104, __intro_oDLRqi(104, helpers).fetchWarnings(function (err, warnings) {
                __block_kN79iS(16);
                if (__expression_SFv00D(105), !(__expression_SFv00D(106), err)) {
                    __block_kN79iS(17);
                    for (var i = 0; __expression_SFv00D(107), (__expression_SFv00D(108), i) < req.request.legs.length; __expression_SFv00D(109), i++) {
                        __block_kN79iS(18);
                        {
                            __statement_ppOrpq(110);
                            var cc = req.request.legs[i].countryCode;
                        }
                        {
                            __statement_ppOrpq(111);
                            req.request.legs[i].warnings = warnings[cc] ? (__expression_SFv00D(112), warnings[cc]) : (__expression_SFv00D(113), []);
                        }
                    }
                    if (__expression_SFv00D(114), req.request.status.isPending === false) {
                        __block_kN79iS(19);
                        {
                            __statement_ppOrpq(115);
                            var flash = {};
                        }
                        if (__expression_SFv00D(116), req.request.status.isApproved === false) {
                            __block_kN79iS(20);
                            {
                                __statement_ppOrpq(117);
                                flash = {
                                    text: 'This request has been denied.',
                                    class: 'danger'
                                };
                            }
                        } else {
                            __block_kN79iS(21);
                            {
                                __statement_ppOrpq(118);
                                flash = {
                                    text: 'This request has been approved.',
                                    class: 'success'
                                };
                            }
                        }
                        {
                            __statement_ppOrpq(119);
                            __extro_ZSsHoR(120, __intro_oDLRqi(120, req).flash('approvalFlash', flash));
                        }
                    } else {
                        __block_kN79iS(22);
                        {
                            __statement_ppOrpq(121);
                            var pendingFlash = {
                                    text: 'This request is currently pending.',
                                    class: 'warning'
                                };
                        }
                        {
                            __statement_ppOrpq(122);
                            __extro_ZSsHoR(123, __intro_oDLRqi(123, req).flash('approvalFlash', pendingFlash));
                        }
                    }
                    {
                        __statement_ppOrpq(124);
                        var links = [
                                {
                                    text: 'Dashboard',
                                    href: '/dashboard'
                                },
                                {
                                    text: 'Submit a Request',
                                    href: '/dashboard/submit'
                                }
                            ];
                    }
                    if (__expression_SFv00D(125), req.user.access >= Access.STAFF) {
                        __block_kN79iS(23);
                        {
                            __statement_ppOrpq(126);
                            __extro_ZSsHoR(127, __intro_oDLRqi(127, links).push({
                                text: 'Users',
                                href: '/users'
                            }));
                        }
                        {
                            __statement_ppOrpq(128);
                            __extro_ZSsHoR(129, __intro_oDLRqi(129, links).push({
                                text: 'Add Users',
                                href: '/users/add'
                            }));
                        }
                    }
                    {
                        __statement_ppOrpq(130);
                        __extro_ZSsHoR(131, __intro_oDLRqi(131, res).render('approval.jade', {
                            title: 'Request Approval',
                            links: links,
                            messages: __extro_ZSsHoR(132, __intro_oDLRqi(132, req).flash('approvalFlash')),
                            request: req.request
                        }));
                    }
                } else {
                    __block_kN79iS(24);
                    {
                        __statement_ppOrpq(133);
                        throw err;
                    }
                }
            }));
        }
    };
}
{
    __statement_ppOrpq(134);
    router.renderDashboard = function (req, res) {
        __block_kN79iS(25);
        if (req.session.returnTo) {
            __block_kN79iS(26);
            {
                __statement_ppOrpq(135);
                var redirectTo = req.session.returnTo;
            }
            {
                __statement_ppOrpq(136);
                __expression_SFv00D(137), delete req.session.returnTo;
            }
            {
                __statement_ppOrpq(138);
                __extro_ZSsHoR(139, __intro_oDLRqi(139, res).redirect(redirectTo));
            }
        } else {
            __block_kN79iS(27);
            {
                __statement_ppOrpq(140);
                var links = [
                        {
                            text: 'Dashboard',
                            href: '/dashboard',
                            active: true
                        },
                        {
                            text: 'Submit a Request',
                            href: '/dashboard/submit'
                        }
                    ];
            }
            if (__expression_SFv00D(141), req.user.access >= Access.STAFF) {
                __block_kN79iS(28);
                {
                    __statement_ppOrpq(142);
                    __extro_ZSsHoR(143, __intro_oDLRqi(143, links).push({
                        text: 'Users',
                        href: '/users'
                    }));
                }
                {
                    __statement_ppOrpq(144);
                    __extro_ZSsHoR(145, __intro_oDLRqi(145, links).push({
                        text: 'Add Users',
                        href: '/users/add'
                    }));
                }
            }
            {
                __statement_ppOrpq(146);
                __extro_ZSsHoR(147, __intro_oDLRqi(147, res).render('dashboard.jade', {
                    title: 'Dashboard',
                    links: links,
                    messages: __extro_ZSsHoR(148, __intro_oDLRqi(148, req).flash('dashboardFlash')),
                    staff: (__expression_SFv00D(149), req.user.access >= Access.STAFF)
                }));
            }
        }
    };
}
{
    __statement_ppOrpq(150);
    router.renderUsers = function (req, res) {
        __block_kN79iS(29);
        if (__expression_SFv00D(151), req.user.access >= Access.STAFF) {
            __block_kN79iS(30);
            {
                __statement_ppOrpq(152);
                __extro_ZSsHoR(153, __intro_oDLRqi(153, helpers).getUsers({
                    maxAccess: req.user.access
                }, function (err, users) {
                    __block_kN79iS(31);
                    if (__expression_SFv00D(154), err) {
                        __block_kN79iS(32);
                        {
                            __statement_ppOrpq(155);
                            __extro_ZSsHoR(156, __intro_oDLRqi(156, console).error(err));
                        }
                    }
                    {
                        __statement_ppOrpq(157);
                        var admins = [];
                    }
                    {
                        __statement_ppOrpq(158);
                        var staff = [];
                    }
                    {
                        __statement_ppOrpq(159);
                        var volunteers = [];
                    }
                    for (var i = 0; __expression_SFv00D(160), (__expression_SFv00D(161), i) < users.length; __expression_SFv00D(162), i++) {
                        __block_kN79iS(33);
                        {
                            __statement_ppOrpq(163);
                            var user = users[i];
                        }
                        switch (user.access) {
                        case Access.ADMIN: {
                                __block_kN79iS(34);
                                {
                                    __statement_ppOrpq(164);
                                    __extro_ZSsHoR(165, __intro_oDLRqi(165, admins).push(user));
                                }
                                break;
                            }
                        case Access.STAFF: {
                                __block_kN79iS(35);
                                {
                                    __statement_ppOrpq(166);
                                    __extro_ZSsHoR(167, __intro_oDLRqi(167, staff).push(user));
                                }
                                break;
                            }
                        case Access.VOLUNTEER: {
                                __block_kN79iS(36);
                                {
                                    __statement_ppOrpq(168);
                                    __extro_ZSsHoR(169, __intro_oDLRqi(169, volunteers).push(user));
                                }
                                break;
                            }
                        }
                    }
                    {
                        __statement_ppOrpq(170);
                        __extro_ZSsHoR(171, __intro_oDLRqi(171, res).render('users.jade', {
                            title: 'Users',
                            links: [
                                {
                                    text: 'Dashboard',
                                    href: '/dashboard'
                                },
                                {
                                    text: 'Submit a Request',
                                    href: '/dashboard/submit'
                                },
                                {
                                    text: 'Users',
                                    href: '/users',
                                    active: true
                                },
                                {
                                    text: 'Add Users',
                                    href: '/users/add'
                                }
                            ],
                            messages: __extro_ZSsHoR(172, __intro_oDLRqi(172, req).flash('usersFlash')),
                            admins: admins,
                            staff: staff,
                            volunteers: volunteers
                        }));
                    }
                }));
            }
        } else {
            __block_kN79iS(37);
            {
                __statement_ppOrpq(173);
                __extro_ZSsHoR(174, __intro_oDLRqi(174, req).flash({
                    text: 'You do not have access to this page.',
                    class: 'danger'
                }));
            }
            {
                __statement_ppOrpq(175);
                __extro_ZSsHoR(176, __intro_oDLRqi(176, res).redirect('/dashboard'));
            }
        }
    };
}
{
    __statement_ppOrpq(177);
    router.renderProfile = function (req, res) {
        __block_kN79iS(38);
        {
            __statement_ppOrpq(178);
            var userId = req.params.userId;
        }
        if (__expression_SFv00D(179), (__expression_SFv00D(180), userId) === (__expression_SFv00D(181), undefined)) {
            __block_kN79iS(39);
            {
                __statement_ppOrpq(182);
                userId = req.user._id;
            }
        }
        if (__expression_SFv00D(183), (__expression_SFv00D(184), (__expression_SFv00D(185), req.user.access == Access.VOLUNTEER) && (__expression_SFv00D(186), req.user._id == (__expression_SFv00D(187), userId))) || (__expression_SFv00D(188), req.user.access > Access.VOLUNTEER)) {
            __block_kN79iS(40);
            {
                __statement_ppOrpq(189);
                __extro_ZSsHoR(190, __intro_oDLRqi(190, helpers).getUsers({
                    user: {
                        _id: userId
                    }
                }, function (err, users) {
                    __block_kN79iS(41);
                    if (__expression_SFv00D(191), err) {
                        __block_kN79iS(42);
                        {
                            __statement_ppOrpq(192);
                            __extro_ZSsHoR(193, __intro_oDLRqi(193, console).error(err));
                        }
                    } else {
                        __block_kN79iS(43);
                        if (__expression_SFv00D(194), users.length > 0) {
                            __block_kN79iS(44);
                            {
                                __statement_ppOrpq(195);
                                var user = users[0];
                            }
                            {
                                __statement_ppOrpq(196);
                                var navLinks = [
                                        {
                                            text: 'Dashboard',
                                            href: '/dashboard'
                                        },
                                        {
                                            text: 'Submit a Request',
                                            href: '/dashboard/submit'
                                        }
                                    ];
                            }
                            if (__expression_SFv00D(197), req.user.access > Access.VOLUNTEER) {
                                __block_kN79iS(45);
                                {
                                    __statement_ppOrpq(198);
                                    __extro_ZSsHoR(199, __intro_oDLRqi(199, navLinks).push({
                                        text: 'Users',
                                        href: '/users'
                                    }));
                                }
                                {
                                    __statement_ppOrpq(200);
                                    __extro_ZSsHoR(201, __intro_oDLRqi(201, navLinks).push({
                                        text: 'Add Users',
                                        href: '/users/add'
                                    }));
                                }
                            }
                            {
                                __statement_ppOrpq(202);
                                __extro_ZSsHoR(203, __intro_oDLRqi(203, res).render('profile.jade', {
                                    title: 'Profile',
                                    links: navLinks,
                                    messages: __extro_ZSsHoR(204, __intro_oDLRqi(204, req).flash('profileFlash')),
                                    userToShow: user
                                }));
                            }
                        } else {
                            __block_kN79iS(46);
                            {
                                __statement_ppOrpq(205);
                                __extro_ZSsHoR(206, __intro_oDLRqi(206, req).flash('dashboardFlash', {
                                    text: 'The profile for the requested user could not be found.',
                                    class: 'danger'
                                }));
                            }
                            {
                                __statement_ppOrpq(207);
                                __extro_ZSsHoR(208, __intro_oDLRqi(208, res).redirect('/dashboard'));
                            }
                        }
                    }
                }));
            }
        } else {
            __block_kN79iS(47);
            {
                __statement_ppOrpq(209);
                __extro_ZSsHoR(210, __intro_oDLRqi(210, req).flash('dashboardFlash', {
                    text: 'You do not have access to view this profile.',
                    class: 'danger'
                }));
            }
            {
                __statement_ppOrpq(211);
                __extro_ZSsHoR(212, __intro_oDLRqi(212, res).redirect('/dashboard'));
            }
        }
    };
}
{
    __statement_ppOrpq(213);
    router.renderAddUsers = function (req, res) {
        __block_kN79iS(48);
        if (__expression_SFv00D(214), req.user.access >= Access.STAFF) {
            __block_kN79iS(49);
            {
                __statement_ppOrpq(215);
                var links = [
                        {
                            text: 'Dashboard',
                            href: '/dashboard'
                        },
                        {
                            text: 'Submit a Request',
                            href: '/dashboard/submit'
                        },
                        {
                            text: 'Users',
                            href: '/users'
                        },
                        {
                            text: 'Add Users',
                            href: '/users/add',
                            active: true
                        }
                    ];
            }
            {
                __statement_ppOrpq(216);
                __extro_ZSsHoR(217, __intro_oDLRqi(217, res).render('addUsers.jade', {
                    title: 'Add Users',
                    links: links,
                    messages: __extro_ZSsHoR(218, __intro_oDLRqi(218, req).flash('addUsersFlash'))
                }));
            }
        } else {
            __block_kN79iS(50);
            {
                __statement_ppOrpq(219);
                __extro_ZSsHoR(220, __intro_oDLRqi(220, req).flash({
                    text: 'You do not have access to this page.',
                    class: 'danger'
                }));
            }
            {
                __statement_ppOrpq(221);
                __extro_ZSsHoR(222, __intro_oDLRqi(222, res).redirect('/dashboard'));
            }
        }
    };
}
{
    __statement_ppOrpq(223);
    module.exports = router;
}