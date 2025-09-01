// --- RailLocate (Node 22, no Mongo, sessions on express-session + memorystore) ---

require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');

const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const axios = require('axios');
const helmet = require('helmet');

// Sessions (express-session + memorystore)
const session = require('express-session');
const MemoryStore = require('memorystore')(session);

// --- App config ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const PORT = Number(process.env.PORT) || 3004;
app.set('port', PORT);

// Security (modern helmet usage)
app.use(
  helmet({
    contentSecurityPolicy: false, // relax CSP for now; tighten later if desired
  })
);

// Static + parsing
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser(process.env.COOKIE_SECRET || 'fallback-cookie-secret'));

// Sessions (no external DB; memorystore avoids the default MemoryStore warning)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'OiOiSavaloyGiesASwatch',
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
      checkPeriod: 24 * 60 * 60 * 1000, // prune expired entries every 24h
    }),
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // Cloudflare/NGINX terminate TLS; Node sees HTTP
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    },
  })
);

app.use(flash());

// Template locals
app.use((req, res, next) => {
  res.locals.currentUser = req.user; // you don't auth here, but keep for consistency
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  res.locals.confirm = req.flash('confirm');
  next();
});

// --- Routes ---

// Landing
app.get('/', (req, res) => {
  res.render('landing');
});

// Trains form
app.get('/trains', (req, res) => {
  res.render('trains');
});

// Trains search
app.post('/trains', async (req, res) => {
  try {
    const { departing, destination } = req.body;

    const token =
      process.env.HUXLEY_TOKEN;

    const url = `https://huxley2.azurewebsites.net/departures/${encodeURIComponent(
      departing
    )}/to/${encodeURIComponent(destination)}/?accessToken=${encodeURIComponent(
      token
    )}&expand=true`;

    const response = await axios.get(url);
    const trainResults = response.data;

    if (trainResults && trainResults.trainServices) {
      req.flash('success', 'We have found matching results for your journey.');
      return res.render('trainResults', {
        success: req.flash('success'),
        trainResults,
      });
    } else {
      req.flash(
        'error',
        'I’m sorry, there are currently no direct services between these two stations.'
      );
      return res.redirect('back');
    }
  } catch (err) {
    console.error(err?.response?.data || err.message || err);
    req.flash('error', 'Search criteria returned zero results');
    return res.redirect('back');
  }
});

// --- Boot ---
app.listen(app.get('port'), () => {
  console.log(`🚀 RailLocate running on port ${app.get('port')}`);
});

