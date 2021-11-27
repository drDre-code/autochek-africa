import express from 'express';
import {
  lastTwentyFive,
  lastWeek,
  last600Stories,
} from '../controller/indexController';

const router = express.Router();

/* GET home page. */
router.get('/', (_req, res) => {
  res.json({ title: 'Express' });
});

router.get('/t10-last-25', lastTwentyFive);
router.get('/t10-last-weeks', lastWeek);
router.get('/t10-last-600stories', last600Stories);

export = router;
