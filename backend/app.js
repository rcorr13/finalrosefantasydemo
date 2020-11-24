const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const router = express.Router();
const validateRegisterInput = require('./validation/register');
const validateLoginInput = require('./validation/login');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ContestantBackendSchema = require('./models/ContestantBackend');
const UserSchema = require('./models/User');
const LogisticsSchema = require('./models/Logistics');
const path = require('path');

function makeNewConnection(uri) {
    const db = mongoose.createConnection(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    db.on('error', function (error) {
        console.log(`MongoDB :: connection ${this.name} ${JSON.stringify(error)}`);
        db.close().catch(() => console.log(`MongoDB :: failed to close connection ${this.name}`));
    });

    db.on('connected', function () {
        mongoose.set('debug', function (col, method, query, doc) {
            console.log(`MongoDB :: ${this.conn.name} ${col}.${method}(${JSON.stringify(query)},${JSON.stringify(doc)})`);
        });
        console.log(`MongoDB :: connected ${this.name}`);
    });

    db.on('disconnected', function () {
        console.log(`MongoDB :: disconnected ${this.name}`);
    });

    return db;
}

// connects to MongoDB cluster and gets collections
const uri = "mongodb+srv://rlcorr:m4I7RnsHNdkHqSGj@finalrosefantasydemo.zqsrj.mongodb.net/finalrosedemo?retryWrites=true&w=majority"
const mongooseConnection = makeNewConnection(uri);

const User = mongooseConnection.model('users', UserSchema);
const Contestants = mongooseConnection.model('contestants', ContestantBackendSchema);
const Logistics = mongooseConnection.model('logistics', LogisticsSchema);



// authentication design based on code from
// https://www.designmycodes.com/react/reactjs-redux-nodejs-mongodb-jwt-authentication-tutorial.html
const app = express();
app.use(cors());
app.use(passport.initialize());
require('./passport')(passport);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


router.post('/register', function(req, res) {

    const { errors, isValid } = validateRegisterInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({
        email: req.body.email
    }).then(user => {
        if(user) {
            return res.status(400).json({
                email: 'Email already exists'
            });
        }
        else {
            const newUser = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password,
            });

            bcrypt.genSalt(10, (err, salt) => {
                if(err) console.error('There was an error', err);
                else {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) console.error('There was an error', err);
                        else {
                            newUser.password = hash;
                            newUser
                                .save()
                                .then(user => {
                                    res.json(user)
                                });
                        }
                    });
                }
            });
        }
    });
});

router.post('/login', (req, res) => {

    const { errors, isValid } = validateLoginInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
        .then(user => {
            if(!user) {
                errors.email = 'User not found'
                return res.status(404).json(errors);
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch) {
                        const payload = {
                            id: user.id,
                            firstname: user.firstname,
                            lastname: user.lastname,
                            contestants: user.contestants,
                            picks: user.picks,
                        }
                        jwt.sign(payload, 'secret', {
                            expiresIn: 3600
                        }, (err, token) => {
                            if(err) console.error('There is some error in token', err);
                            else {
                                res.json({
                                    success: true,
                                    token: `Bearer ${token}`
                                });
                            }
                        });
                    }
                    else {
                        errors.password = 'Incorrect Password';
                        return res.status(400).json(errors);
                    }
                });
        });
});

router.put('/updatepassword', (req, res) => {
    console.log(req.body)

    const { errors, isValid } = validateChangePasswordInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({
        email: req.body.email
    }, (err, user) => {
        if (err) {
            return res.send(err);
        }


        let newPassword = req.body.newPassword;
        bcrypt.genSalt(10, (err, salt) => {
            if (err) console.error('There was an error', err);
            else {
                bcrypt.hash(newPassword, salt, (err, hash) => {
                    if (err) console.error('There was an error', err);
                    else {
                        user.password = hash;
                        user
                            .save()
                            .then(user => {
                                console.log(user)
                                res.json(user)
                            });
                    }
                });
            }


        });
    })});

app.use('/api', router);

app.get('/users', async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

app.get('/contestants', async (req, res) => {
    const contestants = await Contestants.find({});
    res.json(contestants);
});

app.post('/addcontestant', async (req, res) => {
    console.log(req.body);
    let contestantInfo = new Contestants(req.body);
    contestantInfo.save()
        .then(contestantInfo => {
            res.status(200).json({'contestantInfo': 'contestantInfo added successfully'});
        })
        .catch(err => {
            res.status(400).send(contestantInfo);
        });
});

app.get('/logistics', async (req, res) => {
    const logistics = await Logistics.find({});
    res.json(logistics);
});

app.put('/updatelogistics', (req, res) => {
    Logistics.findOneAndReplace({"_id": req.body.updatedLogistics._id}, req.body.updatedLogistics, {returnOriginal: false})
        .then((err, result) => {
            if (err) {
                res.send(err);
            } else {
                return res.json(result);
            };
        })})

app.put('/updateuser/:_id', (req, res) => {
    User.findOneAndReplace({_id: req.params._id}, req.body.updatedUser, {returnOriginal: false})
        .then((err, result) => {
            if (err) {
                res.send(err);
            } else {
                return res.json(result);
            };
        })})

app.put('/updatecontestant/:nameLink', (req, res) => {
    Contestants.findOneAndReplace({nameLink: req.params.nameLink}, req.body.updatedContestant, {returnOriginal: false})
        .then((err, result) => {
            if (err) {
                res.send(err);
            } else {
                return res.json(result);
            };
        })})

app.delete('/delete/:nameLink', (req, res) => {
    Contestants.findOneAndDelete({nameLink: req.params.nameLink})
        .then((err, result) => {
            if (err) {
                res.send(err);
            } else {
                return res.json(result);
            }
        })
    })


app.put('/setCurrentWeek/:currentWeek', (req, res) => {
    Logistics.findOneAndUpdate({_id: req.params._id}, {currentWeek: req.body.currentWeek}, {returnOriginal: false, new: true})
        .then((err, result) => {
            if (err) {
                res.send(err);
            } else {
                return res.json(result);
            };
        })
});

if (process.env.NODE_ENV === "production") {
    app.use(express.static("../build"));
}

app.get('*', (req, res) => res.sendFile(path.resolve('../build', 'index.html')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
