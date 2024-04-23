import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import uiRoute from './ui/ui.route';
import pageRoute from './page/page.route';
import assetRoute from './assets/assets.route';
import projectRoute from './project/project.route';
import renderHtml from './render/render.controller';
import uploadRoute from './uploads/upload.route';

// Initialize App
const app = express();
app.use(express.json());
const corsOptions = {
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true,
};
app.use(cors(corsOptions));

// HTML and Static file
app.use('/resources', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

const mongoUri = 'mongodb+srv://dariuschew1050:e0Lw6qNiRBs5wYqF@webpagebuilder.kvkmygy.mongodb.net/?retryWrites=true&w=majority&appName=webpagebuilder';
mongoose.connect(
  mongoUri,
  {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.error('Failed to connect to MongoDB', err);
      throw err;
    }
    console.log('Connected to MongoDB');
  },
);

// Routes with added console logs
app.use('/api/projects', (req, res, next) => {
  console.log('Accessing /api/projects');
  next();
}, projectRoute);

app.use('/api/pages', (req, res, next) => {
  console.log('Accessing /api/pages');
  next();
}, pageRoute);

app.use('/api/assets', (req, res, next) => {
  console.log('Accessing /api/assets');
  next();
}, assetRoute);

app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

app.use('/api/uploads', (req, res, next) => {
  console.log('Accessing /api/uploads');
  next();
}, uploadRoute);

app.use('/api/', (req, res, next) => {
  console.log('Accessing /api/');
  next();
}, uiRoute);

app.get('/:pageId?', (req, res, next) => {
  console.log('Accessing /:pageId?', req.params);
  next();
}, renderHtml);

const PORT = process.env.APP_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
