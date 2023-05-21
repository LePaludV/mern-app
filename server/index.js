import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cros from 'cors';
import dotenv from 'dotenv';
import multer from 'multer'; // permet d'upload des fichers
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

/* CONFIGURATION */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cros());
app.use('/assets', express.static(path.join(__dirname, 'public/assets'))); // Set le Dir d'où on garde les assets (les img ..)

/*FILE STORAGE  */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage }); // On utilisera cette variable pour sauvegarder les fichiers qu'on reçoit

/*MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port ${PORT}`));
  })
  .catch((err) => console.log(`${err} did not conenct`));